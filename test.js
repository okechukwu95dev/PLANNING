#!/usr/bin/env python
"""
generate_erd.py - Debug-enhanced Draft.py Parser
"""
import os
import sys
import re

# Debug function
def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Find draft.py (try multiple possible locations)
script_dir = os.path.dirname(os.path.abspath(__file__))
possible_paths = [
    os.path.join(script_dir, 'src', 'main', 'blueprints', 'models', 'draft.py'),
    os.path.join(script_dir, 'blueprints', 'models', 'draft.py'),
    os.path.join(script_dir, 'main', 'blueprints', 'models', 'draft.py'),
    os.path.join(script_dir, 'blueprints-api', 'src', 'main', 'blueprints', 'models', 'draft.py')
]

draft_py_path = None
for path in possible_paths:
    if os.path.exists(path):
        draft_py_path = path
        break

if not draft_py_path:
    debug("Cannot find draft.py file! Please provide the correct path.")
    sys.exit(1)

debug(f"Found draft.py at: {draft_py_path}")

# Read file content and show diagnostic info
try:
    with open(draft_py_path, 'r') as f:
        content = f.read()
        debug(f"Successfully read file ({len(content)} bytes)")
        
        # Show first 500 chars to verify content
        debug(f"File preview (first 500 chars):\n{content[:500]}...")
        
        # Look for class definitions with simple string search
        simple_classes = re.findall(r'class\s+(\w+)', content)
        debug(f"Simple class name search found: {simple_classes[:10]}...")
        
        # Look for DraftEntity mentions
        draft_entity_count = content.count('DraftEntity')
        debug(f"Found {draft_entity_count} mentions of 'DraftEntity'")
        
        # Try to detect class pattern with a basic search
        basic_pattern = r'class\s+(\w+)\s*\('
        basic_matches = re.findall(basic_pattern, content)
        debug(f"Basic class pattern found {len(basic_matches)} matches")
        debug(f"Sample classes: {basic_matches[:5]}...")
        
        # Find class inheritance patterns
        inheritance_pattern = r'class\s+(\w+)\s*\(\s*(\w+)\s*\):'
        inheritance_matches = re.findall(inheritance_pattern, content)
        debug(f"Found {len(inheritance_matches)} classes with inheritance")
        debug(f"Sample inheritance: {inheritance_matches[:5]}...")
except Exception as e:
    debug(f"Error analyzing file: {e}")
    sys.exit(1)

def extract_models_from_file(file_path):
    """Extract model definitions with multiple pattern matching strategies"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    models = {}
    
    # Try multiple strategies to find model classes
    
    # Strategy 1: Look for exact DraftEntity inheritance
    pattern1 = r'class\s+(\w+)\s*\(\s*DraftEntity\s*\):'
    matches1 = re.findall(pattern1, content)
    debug(f"Strategy 1 found {len(matches1)} matches: {matches1[:5]}...")
    
    # Strategy 2: More flexible inheritance pattern
    pattern2 = r'class\s+(\w+)\s*\(\s*\w+\s*\):'
    matches2 = re.findall(pattern2, content)
    debug(f"Strategy 2 found {len(matches2)} matches: {matches2[:5]}...")
    
    # Strategy 3: Get class blocks and analyze
    pattern3 = r'class\s+(\w+)(?:\([^)]*\))?:(.*?)(?=\s+class\s+|\Z)'
    matches3 = re.findall(pattern3, content, re.DOTALL)
    debug(f"Strategy 3 found {len(matches3)} class blocks")
    
    # Process class blocks from Strategy 3
    for class_name, class_body in matches3:
        # Skip Audit and Version classes
        if 'Audit' in class_name or 'Version' in class_name:
            continue
        
        debug(f"Processing class: {class_name}")
        
        # Extract fields using a very permissive pattern
        field_pattern = r'(\w+)\s*=\s*models\.\w+'
        fields = set(re.findall(field_pattern, class_body))
        
        # Extract foreign keys specifically
        fk_pattern = r'(\w+)\s*=\s*models\.ForeignKey\s*\(\s*([^),\s]+)'
        foreign_keys = re.findall(fk_pattern, class_body)
        
        # Only include classes that have model fields
        if fields:
            debug(f"  Class {class_name} has {len(fields)} fields, {len(foreign_keys)} FKs")
            models[class_name] = {
                'fields': [{'name': f, 'type': 'Field'} for f in fields],
                'foreign_keys': [{'name': name, 'target': target.strip("'\"").split('.')[-1]} 
                                 for name, target in foreign_keys]
            }
    
    debug(f"Total models extracted: {len(models)}")
    return models

def generate_mermaid(models):
    """Generate mermaid diagram from extracted models"""
    lines = ['```mermaid', 'classDiagram', '']
    
    # Class definitions
    for model_name, model_data in sorted(models.items()):
        lines.append(f'class {model_name} {{')
        
        # Common fields to exclude
        exclude_fields = {'id', 'version', 'create_timestamp', 'update_timestamp',
                         'effective_timestamp', 'termination_timestamp', 'export'}
        
        # Standard fields
        for field in model_data['fields']:
            if field['name'] not in exclude_fields:
                lines.append(f'  +{field["type"]} {field["name"]}')
        
        lines.append('}')
        lines.append('')
    
    # Relationships
    for model_name, model_data in sorted(models.items()):
        for fk in model_data['foreign_keys']:
            target = fk['target']
            if target in models:
                lines.append(f'{target} <-- {model_name} : {fk["name"]}')
    
    lines.append('```')
    return '\n'.join(lines)

# Main execution
models = extract_models_from_file(draft_py_path)

if not models:
    debug("No models found! The pattern matching might need adjustment.")
    sys.exit(1)

print(generate_mermaid(models))
