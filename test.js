#!/usr/bin/env python
"""
gen.py - Clean ER diagram generator for draft.py
"""
import os
import sys
import re

def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Find draft.py
draft_py_path = os.path.join('src', 'main', 'blueprints', 'models', 'draft.py')
if not os.path.exists(draft_py_path):
    draft_py_path = os.path.join('blueprints-api', 'src', 'main', 'blueprints', 'models', 'draft.py')

# Standard fields to exclude
EXCLUDE_FIELDS = {
    'id', 'version', 'create_timestamp', 'update_timestamp',
    'effective_timestamp', 'termination_timestamp', 'export'
}

# Read the file
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
    
    models[class_name] = {
        'fields': [],
        'foreign_keys': [],
        'primary_key': None
    }
    
    # Check for primary key
    pk_pattern = r'(\w+)\s*=\s*models\.\w+Field\([^)]*primary_key\s*=\s*True'
    pk_match = re.search(pk_pattern, class_body)
    if pk_match:
        models[class_name]['primary_key'] = pk_match.group(1)
    
    # Extract regular fields
    field_pattern = r'(\w+)\s*=\s*models\.(\w+)Field\('
    for field_match in re.finditer(field_pattern, class_body):
        field_name = field_match.group(1)
        field_type = field_match.group(2)
        
        # Skip standard fields and foreign keys
        if field_name in EXCLUDE_FIELDS or 'ForeignKey' in field_type:
            continue
            
        models[class_name]['fields'].append((field_name, field_type))
    
    # Extract foreign keys
    fk_pattern = r'(\w+)\s*=\s*models\.ForeignKey\(\s*([^),\s]+)'
    for fk_match in re.finditer(fk_pattern, class_body):
        field_name = fk_match.group(1)
        target_raw = fk_match.group(2)
        
        if field_name in EXCLUDE_FIELDS:
            continue
            
        # Clean up target
        target = target_raw.strip("'\"")
        if '.' in target:
            target = target.split('.')[-1]
            
        models[class_name]['foreign_keys'].append((field_name, target))

# Generate dot file
dot_output = 'digraph model_graph {\n'
dot_output += '  rankdir="TB";\n'
dot_output += '  nodesep=0.5;\n'
dot_output += '  ranksep=1.5;\n'
dot_output += '  splines="ortho";\n'
dot_output += '  concentrate=true;\n'
dot_output += '  node [shape=none, margin=0, fontname="Arial", fontsize=10];\n'
dot_output += '  edge [fontname="Arial", fontsize=9, arrowhead=normal, color="#4B6BEF"];\n\n'

# Define nodes
for model_name, data in models.items():
    # Create field HTML table
    table = '<<table border="0" cellborder="1" cellspacing="0" cellpadding="4" bgcolor="#E6F3FF">\n'
    table += f'  <tr><td bgcolor="#C3DDFF" colspan="2"><b>{model_name}</b></td></tr>\n'
    
    # Add fields
    for field_name, field_type in data['fields']:
        # Highlight primary key
        bg_color = '#FFDFBF' if field_name == data['primary_key'] else ''
        table += f'  <tr><td port="{field_name}" align="left" bgcolor="{bg_color}">{field_name}</td></tr>\n'
    
    # Add foreign keys
    for field_name, target in data['foreign_keys']:
        table += f'  <tr><td port="{field_name}" align="left">{field_name}</td></tr>\n'
    
    table += '</table>>'
    
    # Add node
    dot_output += f'  {model_name} [label={table}];\n'

# Add relationships with cleaner arrows
dot_output += '\n  // Relationships\n'
for source, data in models.items():
    for field_name, target in data['foreign_keys']:
        if target in models:
            dot_output += f'  {source}:{field_name} -> {target} [dir=back, arrowtail=crow];\n'

dot_output += '}\n'

# Write dot file
with open('models.dot', 'w') as f:
    f.write(dot_output)
    debug(f"Wrote DOT file to models.dot")

# Try to generate PNG with better layout settings
try:
    import subprocess
    result = subprocess.run(['dot', '-Tpng', '-Gsize=24,36!', '-o', 'models.png', 'models.dot'])
    if result.returncode == 0:
        debug(f"Generated PNG successfully: models.png")
    else:
        debug(f"Failed to generate PNG.")
except Exception as e:
    debug(f"Error generating PNG: {e}")

print("ER Diagram generation complete! View models.png")
