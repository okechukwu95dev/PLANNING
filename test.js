#!/usr/bin/env python
"""
gen.py - Direct file parser for draft.py models
"""
import os
import sys
import re

# Output Mermaid
w = sys.stdout.write
w("```mermaid\n")
w("classDiagram\n")

# Exclude field names
EXCLUDE_FIELD = {
    'id', 'version',
    'create_timestamp', 'update_timestamp',
    'effective_timestamp', 'termination_timestamp',
    'export'
}

# Find models directly from file
draft_py_path = os.path.join('src', 'main', 'blueprints', 'models', 'draft.py')

# Read the file
try:
    with open(draft_py_path, 'r') as f:
        content = f.read()
except FileNotFoundError:
    draft_py_path = os.path.join('blueprints-api', 'src', 'main', 'blueprints', 'models', 'draft.py')
    with open(draft_py_path, 'r') as f:
        content = f.read()

# Parse class definitions
class_pattern = r'class\s+(\w+)\(DraftEntity\):(.*?)(?=class\s+\w+\(|$)'
models = {}

for match in re.finditer(class_pattern, content, re.DOTALL):
    class_name = match.group(1)
    class_body = match.group(2)
    
    # Skip Audit and Version classes
    if 'Audit' in class_name or 'Version' in class_name:
        continue
    
    # Extract fields
    models[class_name] = {
        'fields': [],
        'fks': []
    }
    
    # Regular fields
    field_pattern = r'(\w+)\s*=\s*models\.(\w+)Field\('
    for field_match in re.finditer(field_pattern, class_body):
        field_name = field_match.group(1)
        field_type = field_match.group(2)
        
        if field_name not in EXCLUDE_FIELD:
            models[class_name]['fields'].append((field_name, field_type))
    
    # Foreign keys
    fk_pattern = r'(\w+)\s*=\s*models\.ForeignKey\((\w+)'
    for fk_match in re.finditer(fk_pattern, class_body):
        field_name = fk_match.group(1)
        target_model = fk_match.group(2)
        
        if field_name not in EXCLUDE_FIELD:
            models[class_name]['fks'].append((field_name, target_model))

# Emit classes
for class_name, data in models.items():
    w(f"\nclass {class_name} {{\n")
    
    # Regular fields
    for field_name, field_type in data['fields']:
        w(f"  +{field_type} {field_name}\n")
    
    # Foreign keys
    for field_name, _ in data['fks']:
        w(f"  +ForeignKey {field_name} <<FK>>\n")
    
    w("}\n")

# Emit relationships
w("\n")
for class_name, data in models.items():
    for field_name, target_model in data['fks']:
        if target_model in models:
            w(f"{target_model} <-- {class_name} : {field_name}\n")

w("```\n")
