#!/usr/bin/env python
"""
gen.py - Styled draft.py model parser for clean ER diagrams
"""
import os
import sys
import re

# Output Mermaid
def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Find draft.py
draft_py_path = os.path.join('src', 'main', 'blueprints', 'models', 'draft.py')
if not os.path.exists(draft_py_path):
    draft_py_path = os.path.join('blueprints-api', 'src', 'main', 'blueprints', 'models', 'draft.py')
    if not os.path.exists(draft_py_path):
        debug(f"Could not find draft.py at expected paths")
        sys.exit(1)

# Read the file
with open(draft_py_path, 'r') as f:
    content = f.read()
    debug(f"Read {len(content)} bytes from {draft_py_path}")

# Parse class definitions
class_pattern = r'class\s+(\w+)\(DraftEntity\):(.*?)(?=class\s+\w+\(|$)'
models = {}

for match in re.finditer(class_pattern, content, re.DOTALL):
    class_name = match.group(1)
    class_body = match.group(2)
    
    # Skip Audit and Version classes
    if 'Audit' in class_name or 'Version' in class_name:
        continue
    
    debug(f"Processing model: {class_name}")
    models[class_name] = {
        'fields': [],
        'foreign_keys': []
    }
    
    # Extract fields
    field_pattern = r'(\w+)\s*=\s*models\.(\w+)Field\('
    for field_match in re.finditer(field_pattern, class_body):
        field_name = field_match.group(1)
        
        # Skip standard fields that should be excluded
        if field_name in ['id', 'version', 'create_timestamp', 'update_timestamp', 
                         'effective_timestamp', 'termination_timestamp']:
            continue
            
        models[class_name]['fields'].append(field_name)
    
    # Extract foreign keys 
    fk_pattern = r'(\w+)\s*=\s*models\.ForeignKey\(\s*([^),\s]+)'
    for fk_match in re.finditer(fk_pattern, class_body):
        field_name = fk_match.group(1)
        target_raw = fk_match.group(2)
        
        # Clean up target (remove quotes, get class name)
        target = target_raw.strip("'\"")
        if '.' in target:
            target = target.split('.')[-1]
            
        models[class_name]['foreign_keys'].append((field_name, target))

# Generate dot file for GraphViz
dot_output = 'digraph model_graph {\n'
dot_output += '  rankdir="TB";\n'
dot_output += '  splines="ortho";\n'
dot_output += '  node [shape=record, fontname="Arial", fontsize=10, margin="0.25,0.1"];\n'
dot_output += '  edge [fontname="Arial", fontsize=9, dir=back, arrowtail=empty];\n\n'

# Define nodes
for model_name, data in models.items():
    debug(f"Adding node for: {model_name}")
    
    # Create field list
    field_strings = []
    
    # Add standard fields
    field_strings.append('<id> id')
    field_strings.append('<version> version')
    
    # Add regular fields
    for field in data['fields']:
        # Skip if it's a foreign key
        if field in [fk[0] for fk in data['foreign_keys']]:
            continue
        field_strings.append(f'<{field}> {field}')
    
    # Add foreign key fields
    for fk_name, _ in data['foreign_keys']:
        field_strings.append(f'<{fk_name}> {fk_name}')
        
    # Add timestamp fields at the end
    field_strings.append('<effective_timestamp> effective_timestamp')
    field_strings.append('<termination_timestamp> termination_timestamp')
    field_strings.append('<create_timestamp> create_timestamp')
    field_strings.append('<update_timestamp> update_timestamp')
    
    # Format node with table label
    label = '{{<table> ' + model_name + '|{' + '|'.join(field_strings) + '}}}'
    
    # Add node definition
    dot_output += f'  {model_name} [label="{label}", style="filled", fillcolor="#E8F7FE", color="#4B83C3"];\n'

# Add relationships
dot_output += '\n  // Relationships\n'
for source, data in models.items():
    for field_name, target in data['foreign_keys']:
        if target in models:
            dot_output += f'  {target}:table -> {source}:{field_name} [color="#4B83C3"];\n'

dot_output += '}\n'

# Write dot file
with open('models.dot', 'w') as f:
    f.write(dot_output)
    debug(f"Wrote DOT file to models.dot")

# Try to generate PNG
try:
    import subprocess
    result = subprocess.run(['dot', '-Tpng', '-o', 'models.png', 'models.dot'])
    if result.returncode == 0:
        debug(f"Generated PNG successfully: models.png")
    else:
        debug(f"Failed to generate PNG. Please run manually: dot -Tpng -o models.png models.dot")
except Exception as e:
    debug(f"Error generating PNG: {e}")
    debug(f"Please manually run: dot -Tpng -o models.png models.dot")

print("ER Diagram generation complete! Check models.dot and models.png")
