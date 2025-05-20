#!/usr/bin/env python
"""
gen.py - Draft.py parser that generates diagrams in your preferred style
"""
import os
import sys
import re
import subprocess

def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# locate draft.py
paths = [
    os.path.join('src','main','blueprints','models','draft.py'),
    os.path.join('blueprints-api','src','main','blueprints','models','draft.py')
]
draft_path = next((p for p in paths if os.path.exists(p)), None)
if not draft_path:
    debug(f"Could not find draft.py in: {paths}")
    sys.exit(1)
debug(f"Using draft.py at {draft_path}")

# read content
with open(draft_path, 'r') as f:
    content = f.read()

# find DraftEntity classes
pattern = r'^class\s+(\w+)\s*\(\s*DraftEntity\s*\):(.*?)(?=^class\s+\w+\s*\(|\Z)'
model_iter = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
models = {}

for m in model_iter:
    name, body = m.group(1), m.group(2)
    if re.search(r'(Audit|Version)$', name):
        continue
    
    fields = []
    
    # Find fields
    fld_pattern = r'^\s*(\w+)\s*=\s*models\.(\w+)(Field|Key)\(([^)]*)\)'
    for fld in re.finditer(fld_pattern, body, re.MULTILINE):
        fname, base, suffix, params = fld.group(1), fld.group(2), fld.group(3), fld.group(4)
        ftype = base + suffix
        if fname == 'version':
            continue
            
        is_pk = 'primary_key=True' in params or base in ('Auto', 'BigAuto')
        is_fk = suffix == 'Key'
        target = None
        
        if is_fk:
            tgt = re.search(r"ForeignKey\(\s*['\"]?([\w\.]+)['\"]?", fld.group(0))
            if tgt:
                target = tgt.group(1).split('.')[-1]
                
        fields.append((fname, ftype, is_pk, is_fk, target))
        
    if fields:
        models[name] = fields

# Generate DOT file
dot = [
    'digraph ER {',
    '  graph [rankdir=TB, overlap=false, splines=true, concentrate=true];',
    '  node [fontsize=10, fontname="Arial", shape=none];',
    '  edge [fontsize=9, fontname="Arial", color="#336699", arrowsize=0.8];',
    ''
]

# Generate HTML tables for nodes
for model_name, fields in models.items():
    # Create table header
    table = f'<<table border="0" cellborder="1" cellspacing="0" cellpadding="3">'
    table += f'<tr><td bgcolor="#336699" colspan="2"><font color="white"><b>{model_name}</b></font></td></tr>'
    
    # Add fields
    for field_name, field_type, is_pk, is_fk, target in fields:
        pk_tag = "[PK]" if is_pk else ""
        fk_tag = "[FK]" if is_fk else ""
        
        # Format name with tags
        display_name = f"{field_name} {pk_tag}{fk_tag}".strip()
        port_attr = f'port="{field_name}"' if is_fk else ""
        bgcolor = "#e6f2ff" if is_pk else ""
        
        table += f'<tr bgcolor="{bgcolor}"><td {port_attr} align="left">{display_name}</td><td align="left">{field_type}</td></tr>'
    
    table += '</table>>'
    
    # Add node with HTML label
    dot.append(f'  "{model_name}" [label={table}, fillcolor="#f5faff", style="filled"];')

# Add blank line before edges
dot.append('')

# Add edges for relationships
for source, fields in models.items():
    for field_name, field_type, is_pk, is_fk, target in fields:
        if is_fk and target in models:
            dot.append(f'  "{source}":"{field_name}" -> "{target}" [dir=both, arrowtail=none, arrowhead=normal];')

# Close graph
dot.append('}')

# Write dot file
with open('models.dot', 'w') as f:
    f.write('\n'.join(dot))

# Generate PNG
try:
    subprocess.run(['dot', '-Tpng', '-Gdpi=150', '-o', 'models.png', 'models.dot'], check=True)
    debug("Generated models.png")
    
    # Also try to generate SVG for better quality
    subprocess.run(['dot', '-Tsvg', '-o', 'models.svg', 'models.dot'], check=True)
    debug("Generated models.svg")
except Exception as e:
    debug(f"Error generating image: {e}")

print("Done! Generated models.dot and models.png")
