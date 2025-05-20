#!/usr/bin/env python
"""
gen.py - Styled draft.py model parser for clean ER diagrams
Parses only DraftEntity classes from draft.py and generates GraphViz dot file and PNG with types, PK highlight, and FK relationships.
Usage: python gen.py
Output: models.dot, models.png
"""
import os, sys, re, subprocess

def debug(msg): sys.stderr.write(f"DEBUG: {msg}\n")

# locate draft.py
paths = [
    os.path.join('src','main','blueprints','models','draft.py'),
    os.path.join('blueprints-api','src','main','blueprints','models','draft.py')
]
draft = next((p for p in paths if os.path.exists(p)), None)
if not draft:
    debug(f"Could not find draft.py in expected locations: {paths}")
    sys.exit(1)
debug(f"Using draft.py at {draft}")

# read content
with open(draft,'r') as f:
    content = f.read()
    debug(f"Read {len(content)} bytes from draft.py")

# regex to find DraftEntity classes
def find_models(src):
    pattern = r'class\s+(\w+)\s*\(\s*DraftEntity\s*\):([\s\S]*?)(?=^class\s+\w+\s*\(|\Z)'
    return re.finditer(pattern, src, re.MULTILINE)

models = {}
for m in find_models(content):
    name, body = m.group(1), m.group(2)
    # skip audit/version
    if re.search(r'Audit$|Version$', name):
        debug(f"Skipping class {name}")
        continue
    debug(f"Processing {name}")
    fields = []
    # find field definitions
    for fld in re.finditer(r"^(\s*)(\w+)\s*=\s*models\.(\w+)Field\(([^)]*)\)", body, re.MULTILINE):
        field_name, ftype, args = fld.group(2), fld.group(3), fld.group(4)
        # skip audit fields only
        if field_name.endswith('Audit'):
            continue
        # detect pk
        is_pk = 'primary_key=True' in args or ftype in ('AutoField','BigAutoField')
        # detect fk
        fk_match = re.match(r"ForeignKey\(\s*([^,]+)", fld.group(0))
        is_fk = False
        target = None
        if 'ForeignKey' in fld.group(0):
            is_fk = True
            tgt = re.search(r"ForeignKey\(\s*([\w\.']+)", fld.group(0))
            if tgt:
                target = tgt.group(1).strip("'\"")
                if '.' in target:
                    target = target.split('.')[-1]
        fields.append((field_name, ftype, is_pk, is_fk, target))
    if fields:
        models[name] = fields

if not models:
    debug("No models parsed. Exiting.")
    sys.exit(1)

dot = []
dot.append('digraph ERD {')
dot.append('  rankdir=LR;')
dot.append('  node [shape=record, fontname="Arial", fontsize=10];')
dot.append('  edge [fontname="Arial", fontsize=9, arrowhead=open];')

# nodes
for m, flds in models.items():
    debug(f"Adding node {m}")
    parts = []
    for name, ftype, pk, fk, tgt in flds:
        label = f"{name}: {ftype}" + (" [PK]" if pk else "")
        parts.append(label)
    label = "{" + f"{m}|" + "\\l".join(parts) + "\\l}"  # record with left-justified lines
    dot.append(f'  {m} [label="{label}"];')

# edges
dot.append('')
dot.append('  // relationships')
for m, flds in models.items():
    for name, ftype, pk, fk, tgt in flds:
        if fk and tgt in models:
            dot.append(f'  {m}:{name} -> {tgt}:{name} [color="#4B83C3"];')

dot.append('}')

# write dot
with open('models.dot','w') as f:
    f.write('\n'.join(dot))
    debug("Wrote models.dot")

# render PNG
try:
    subprocess.run(['dot','-Tpng','models.dot','-o','models.png'], check=True)
    debug("Generated models.png")
except Exception as e:
    debug(f"PNG generation failed: {e}\nRun: dot -Tpng models.dot -o models.png")

print("Done: models.dot, models.png")
