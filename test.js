#!/usr/bin/env python
"""
generate_erd.py - Direct Draft.py Parser for ER Diagram Generation
"""
import os
import sys
import re
import json

# Setup paths
script_dir = os.path.dirname(os.path.abspath(__file__))
draft_py_path = os.path.join(script_dir, 'src', 'main', 'blueprints', 'models', 'draft.py')

def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

def extract_models_from_file(file_path):
    """Extract model definitions directly from draft.py file without importing"""
    debug(f"Reading file: {file_path}")
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
    except Exception as e:
        debug(f"Error reading file: {e}")
        return {}
    
    # Extract class definitions for DraftEntity models
    class_pattern = r'class\s+(\w+)\(DraftEntity\):([^c]*?)(?=\n\s*class\s+|$)'
    classes = re.findall(class_pattern, content, re.DOTALL)
    
    models = {}
    for class_name, class_body in classes:
        # Skip Audit and Version classes
        if class_name.endswith(('Audit', 'Version')):
            continue
        
        debug(f"Found model: {class_name}")
        
        # Extract fields
        field_pattern = r'(\w+)\s*=\s*models\.(\w+)Field\(([^)]*)\)'
        fields = re.findall(field_pattern, class_body)
        
        # Extract foreign keys specifically
        fk_pattern = r'(\w+)\s*=\s*models\.ForeignKey\((\w+)'
        foreign_keys = re.findall(fk_pattern, class_body)
        
        models[class_name] = {
            'fields': [{'name': name, 'type': field_type} for name, field_type, _ in fields],
            'foreign_keys': [{'name': name, 'target': target} for name, target in foreign_keys]
        }
    
    return models

def generate_mermaid(models):
    """Generate mermaid diagram from extracted models"""
    lines = ['```mermaid', 'classDiagram', '']
    
    # Class definitions
    for model_name, model_data in models.items():
        lines.append(f'class {model_name} {{')
        
        # Standard fields (excluding common ones)
        exclude_fields = {'id', 'version', 'create_timestamp', 'update_timestamp',
                          'effective_timestamp', 'termination_timestamp', 'export'}
        
        for field in model_data['fields']:
            if field['name'] not in exclude_fields:
                lines.append(f'  +{field["type"]} {field["name"]}')
        
        # Foreign keys
        for fk in model_data['foreign_keys']:
            if fk['name'] not in exclude_fields:
                lines.append(f'  +ForeignKey {fk["name"]} <<FK>>')
        
        lines.append('}')
        lines.append('')
    
    # Relationships
    for model_name, model_data in models.items():
        for fk in model_data['foreign_keys']:
            target = fk['target']
            if target in models:
                lines.append(f'{target} <-- {model_name} : {fk["name"]}')
    
    lines.append('```')
    return '\n'.join(lines)

def main():
    # Extract models from draft.py
    models = extract_models_from_file(draft_py_path)
    
    if not models:
        debug("No models found!")
        return 1
    
    # Generate and print mermaid diagram
    diagram = generate_mermaid(models)
    print(diagram)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
