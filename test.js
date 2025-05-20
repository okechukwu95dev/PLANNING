#!/usr/bin/env python
"""
gen.py - Enhanced draft.py parser for complete ER diagrams
Parses DraftEntity classes from draft.py; generates GraphViz dot+PNG with types, PKs [PK], FKs [FK], includes all fields.
Skips Version/Audit classes; retains timestamps and id; excludes only 'version' field explicitly.
Usage: python gen.py
Outputs: models.dot, models.png
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
    debug(f"Read {len(content)} bytes")

# find DraftEntity classes
pattern = r'^class\s+(\w+)\s*\(\s*DraftEntity\s*\):(.*?)(?=^class\s+\w+\s*\(|\Z)'
model_iter = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
models = {}
for m in model_iter:
    name, body = m.group(1), m.group(2)
    if re.search(r'(Audit|Version)$', name):
        debug(f"Skipping {name}")
        continue
    debug(f"Processing {name}")
    fields = []
    # match both Field and ForeignKey
    fld_pattern = r'^\s*(\w+)\s*=\s*models\.(\w+)(Field|Key)\(([^)]*)\)'
    for fld in re.finditer(fld_pattern, body, re.MULTILINE):
        fname, base, suffix, params = fld.group(1), fld.group(2), fld.group(3), fld.group(4)
        ftype = base + suffix
        if fname == 'version':
            continue
        debug(f"Found field {fname}: {ftype}")
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

if not models:
    debug("No models parsed"); sys.exit(1)

# build dot
dot = [
    'digraph ERD {',
    '  rankdir=LR;',
    '  splines=ortho;',
    '  node [shape=record, fontname="Arial", fontsize=10];',
    '  edge [fontname="Arial", fontsize=9, dir=back, arrowtail=empty];',
]
# nodes
for m, flds in models.items():
    debug(f"Node {m}")
    lines = []
    for fname, ftype, pk, fk, tgt in flds:
        lbl = f"{fname}: {ftype}" + (" [PK]" if pk else "") + (" [FK]" if fk else "")
        lines.append(lbl)
    record = '{' + m + '|' + '\\l'.join(lines) + '\\l}'
    dot.append(f'  {m} [label="{record}",style=filled,fillcolor="#E8F7FE",color="#4B83C3"];')
# edges
dot.append('')
dot.append('  // relationships')
for m, flds in models.items():
    for fname, ftype, pk, fk, tgt in flds:
        if fk and tgt in models:
            dot.append(f'  {m}:{fname} -> {tgt} [color="#4B83C3"];')

dot.append('}')
# write dot
with open('models.dot','w') as f: f.write('\n'.join(dot))
debug("Wrote models.dot")
# render png
try:
    subprocess.run(['dot','-Tpng','models.dot','-o','models.png'], check=True)
    debug("Generated models.png")
except Exception as e:
    debug(f"PNG fail: {e}\nRun: dot -Tpng models.dot -o models.png")
print("Done: models.dot, models.png")
