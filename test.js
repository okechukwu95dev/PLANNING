#!/usr/bin/env python
"""
gen.py - Styled draft.py model parser for clean ER diagrams
Parses DraftEntity classes from draft.py and generates GraphViz dot and PNG with types, PK highlight, and FK relationships.
Skips Version and Audit classes; retains all timestamp fields and id fields; skips only the version field.
Usage: python gen.py
Outputs: models.dot, models.png
"""
import os
import sys
import re
import subprocess

def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# locate draft.py in project
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
    debug(f"Read {len(content)} bytes from draft.py")

# regex for DraftEntity classes
model_iter = re.finditer(
    r'^class\s+(\w+)\s*\(\s*DraftEntity\s*\):(.*?)(?=^class\s+\w+\s*\(|\Z)',
    content,
    re.MULTILINE | re.DOTALL
)

models = {}
for m in model_iter:
    name, body = m.group(1), m.group(2)
    if re.search(r'(Audit|Version)$', name):
        debug(f"Skipping class {name}")
        continue
    debug(f"Processing model {name}")
    fields = []
    for fld in re.finditer(r'^\s*(\w+)\s*=\s*models\.(\w+)Field\(([^)]*)\)', body, re.MULTILINE):
        field_name, ftype, params = fld.group(1), fld.group(2), fld.group(3)
        if field_name == 'version':
            continue
        debug(f"Found field {field_name}: {ftype}")
        is_pk = 'primary_key=True' in params or ftype in ('AutoField','BigAutoField')
        is_fk = 'ForeignKey' in fld.group(0)
        target = None
        if is_fk:
            tgt = re.search(r"ForeignKey\(\s*['\"]?([\w\.]+)['\"]?", fld.group(0))
            if tgt:
                target = tgt.group(1).split('.')[-1]
        fields.append((field_name, ftype, is_pk, is_fk, target))
    if fields:
        models[name] = fields

if not models:
    debug("No DraftEntity models found. Exiting.")
    sys.exit(1)

# build dot
dot = []
dot.append('digraph ERD {')
dot.append('  rankdir=LR;')
dot.append('  splines=ortho;')
dot.append('  node [shape=record, fontname="Arial", fontsize=10];')
dot.append('  edge [fontname="Arial", fontsize=9, dir=back, arrowtail=empty];')

# nodes
for m, flds in models.items():
    debug(f"Adding node {m}")
    lines = []
    for fname, ftype, pk, fk, tgt in flds:
        lbl = f"{fname}: {ftype}" + (" [PK]" if pk else "") + (" [FK]" if fk else "")
        lines.append(lbl)
    record = '{' + m + '|' + '\\l'.join(lines) + '\\l}'
    dot.append(f'  {m} [label="{record}", style=filled, fillcolor="#E8F7FE", color="#4B83C3"];')

# edges
dot.append('')
dot.append('  // relationships')
for m, flds in models.items():
    for fname, ftype, pk, fk, tgt in flds:
        if fk and tgt in models:
            dot.append(f'  {m}:{fname} -> {tgt}:{fname} [color="#4B83C3"];')

dot.append('}')

# write dot
with open('models.dot', 'w') as f:
    f.write('\n'.join(dot))
    debug("Wrote models.dot")

# render png
try:
    subprocess.run(['dot','-Tpng','models.dot','-o','models.png'], check=True)
    debug("Generated models.png")
except Exception as e:
    debug(f"Failed to generate PNG: {e}\nRun: dot -Tpng models.dot -o models.png")

print("Done: models.dot, models.png")
