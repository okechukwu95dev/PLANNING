#!/usr/bin/env python
"""
scripts/generate_erd_mermaid.py
Usage: python scripts/generate_erd_mermaid.py > erd.mmd
Outputs Mermaid classDiagram focusing only on draft models.
"""
import os, sys, re

# Setup debug
def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Add project path, prioritizing src/main
dir_path = os.path.dirname(os.path.abspath(__file__))
project_src = os.path.join(dir_path, 'src', 'main')
sys.path.insert(0, project_src)
debug(f"sys.path inserted: {project_src}")

# Explicitly block problematic modules
sys.modules['blueprints.models.export'] = None
debug("Blocked blueprints.models.export module to prevent conflicts")

# Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_local')
import django
from django.conf import settings
django.setup()

# Import only the abstract model
from blueprints.models.abstract import DraftEntity
debug("Imported DraftEntity successfully")

# Patterns and filters
EXCLUDE_FIELD = {
    'id', 'version',
    'create_timestamp', 'update_timestamp',
    'effective_timestamp', 'termination_timestamp',
    'export'
}

# Focus only on draft module
module_prefix = 'src.main.blueprints.models.draft'

# Collect only draft models
from django.apps import apps
models = []
for m in apps.get_app_config('blueprints').get_models():
    debug(f"Checking model: {m.__name__} from {m.__module__}")
    # Only include classes from draft.py
    if not m.__module__.startswith(module_prefix):
        continue
    # Filter out audit/version models
    if 'Audit' in m.__name__ or 'Version' in m.__name__:
        continue
    # Only include DraftEntity subclasses
    if not issubclass(m, DraftEntity):
        continue
    models.append(m)

debug(f"Models found: {[m.__name__ for m in models]}")
if not models:
    debug("WARNING: No models found! Check path and filters.")
    sys.exit(1)

# Generate Mermaid diagram
w = sys.stdout.write
w('```mermaid\n')
w('classDiagram\n')

# Class definitions
for m in models:
    w(f"class {m.__name__} {\n")
    for f in m._meta.fields:
        if f.name in EXCLUDE_FIELD: 
            continue
        fk = ' <<FK>>' if getattr(f, 'many_to_one', False) else ''
        w(f"  {f.name}{fk}\n")
    w('}\n\n')

# Relationships
for m in models:
    for f in m._meta.fields:
        if getattr(f, 'many_to_one', False):
            tgt = f.related_model
            if tgt in models:
                w(f"{tgt.__name__} <-- {m.__name__}\n")

w('```\n')
