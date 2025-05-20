#!/usr/bin/env python
"""
generate_erd_mermaid.py - Fixed version handling export conflicts
Usage: python generate_erd_mermaid.py > erd.mmd
Generates Mermaid classDiagram for DraftEntity models in blueprints without export conflicts.
"""
import os
import sys
import re
import types

# Debug helper
def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Setup project path
base_dir = os.path.dirname(os.path.abspath(__file__))
project_src = os.path.join(base_dir, 'src', 'main')
sys.path.insert(0, project_src)
debug(f"sys.path inserted: {project_src}")

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_local')

debug("Creating fake export module to avoid import conflicts")
# Fake export module
fake_export = types.ModuleType('blueprints.models.export')
fake_export.ExportRequest = type('ExportRequest', (), {})
fake_export.ExportArtifact = type('ExportArtifact', (), {})
sys.modules['blueprints.models.export'] = fake_export

# Initialize Django
import django
from django.conf import settings
django.setup()
debug(f"Django INSTALLED_APPS: {settings.INSTALLED_APPS}")

# Import DraftEntity
try:
    from blueprints.models.abstract import DraftEntity
    debug("DraftEntity imported")
except ImportError as e:
    debug(f"Failed to import DraftEntity: {e}")
    sys.exit(1)

# Field exclusions
EXCLUDE_FIELD = {
    'id', 'version',
    'create_timestamp', 'update_timestamp',
    'effective_timestamp', 'termination_timestamp',
    'export'
}

# Collect draft models
from django.apps import apps
app_label = 'blueprints'
app_config = apps.get_app_config(app_label)
all_models = app_config.get_models()

models = []
for m in all_models:
    module = m.__module__
    # Only classes from draft.py
    if not module.endswith('.draft'):
        debug(f"Skipping {m.__name__}: module {module}")
        continue
    # Only DraftEntity subclasses
    if not issubclass(m, DraftEntity):
        debug(f"Skipping {m.__name__}: not subclass of DraftEntity")
        continue
    # Exclude Audit/Version
    if re.search(r'(Audit|Version)$', m.__name__):
        debug(f"Skipping {m.__name__}: audit/version model")
        continue
    models.append(m)
    debug(f"Including model: {m.__name__}")

if not models:
    debug("No draft models found. Exiting.")
    sys.exit(1)

# Output Mermaid diagram
stdout = sys.stdout.write
stdout('```mermaid\n')
stdout('classDiagram\n')

# Emit classes
for m in models:
    stdout(f"\nclass {m.__name__} {{\n")
    for f in m._meta.fields:
        if f.name in EXCLUDE_FIELD:
            continue
        fk = ' <<FK>>' if getattr(f, 'many_to_one', False) else ''
        stdout(f"  {f.name}{fk}\n")
    stdout('}\n')

# Emit relationships
stdout('\n')
for m in models:
    for f in m._meta.fields:
        if getattr(f, 'many_to_one', False):
            tgt = f.related_model
            if tgt in models:
                stdout(f"{tgt.__name__} <-- {m.__name__}: {f.name}\n")

stdout('```\n')
