#!/usr/bin/env python
"""
scripts/generate_erd_mermaid.py
Usage: python scripts/generate_erd_mermaid.py > erd.mmd
Outputs Mermaid classDiagram by introspecting only models in draft.py, avoiding export/audit/version modules.
Include module filter to prevent ImportError due to conflicting models.
"""
import os, sys, re
# Setup project path
from importlib import import_module

def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Add src/main to path
dir_path = os.path.dirname(os.path.abspath(__file__))
project_src = os.path.join(dir_path, 'src', 'main')
sys.path.insert(0, project_src)
debug(f"sys.path inserted: {project_src}")

# Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_local')
import django
from django.conf import settings
django.setup()
debug(f"INSTALLED_APPS: {settings.INSTALLED_APPS}")

# Import DraftEntity
try:
    from blueprints.models.abstract import DraftEntity
    debug("Imported DraftEntity")
except ImportError as e:
    debug(f"DraftEntity import failed: {e}")
    sys.exit(1)

# Patterns and filters
EXCLUDE_FIELD = {
    'id','version',
    'create_timestamp','update_timestamp',
    'effective_timestamp','termination_timestamp',
    'export'
}
module_prefix = 'blueprints.models.draft'

# Collect only draft.py models
from django.apps import apps
models = []
for m in apps.get_app_config('blueprints').get_models():
    # only include classes defined in draft.py
    if not m.__module__.startswith(module_prefix):
        continue
    # only include DraftEntity subclasses
    if not issubclass(m, DraftEntity):
        continue
    models.append(m)
debug(f"Models introspected: {[m.__name__ for m in models]}")

# Emit Mermaid
w = sys.stdout.write
w('classDiagram\n')

# class definitions
for m in models:
    w(f"\nclass {m.__name__} {{\n")
    for f in m._meta.fields:
        if f.name in EXCLUDE_FIELD: continue
        fk = ' <<FK>>' if getattr(f, 'many_to_one', False) else ''
        w(f"  {f.name}{fk}\n")
    w('}\n')

# relationships
w('\n')
for m in models:
    for f in m._meta.fields:
        if getattr(f, 'many_to_one', False):
            tgt = f.related_model
            # only link if both in models list
            if tgt in models:
                w(f"{tgt.__name__} <|-- {m.__name__}\n")
