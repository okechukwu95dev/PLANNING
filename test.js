#!/usr/bin/env python
"""
generate_erd_mermaid.py - Fixed version handling export conflicts
"""
import os
import sys
import re

def debug(msg): 
    sys.stderr.write(f"DEBUG: {msg}\n")

# Add project src to path
dir_path = os.path.dirname(os.path.abspath(__file__))
project_src = os.path.join(dir_path, 'src', 'main')
sys.path.insert(0, project_src)
debug(f"sys.path inserted: {project_src}")

# Configure Django
env = 'config.settings_local'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', env)

# Create a fake ExportRequest to prevent conflicts
import types
export_mod = types.ModuleType('blueprints.models.export')
export_mod.ExportRequest = type('ExportRequest', (), {})
sys.modules['blueprints.models.export'] = export_mod
debug("Created fake ExportRequest to handle conflicts")

import django
from django.conf import settings
django.setup()
debug(f"Django setup complete")

# Import DraftEntity
try:
    from src.main.blueprints.models.abstract import DraftEntity
    debug("DraftEntity imported successfully")
except ImportError:
    try:
        from blueprints.models.abstract import DraftEntity
        debug("DraftEntity imported from alternative path")
    except ImportError as e:
        debug(f"Failed to import DraftEntity: {e}")
        sys.exit(1)

# Field filters
EXCLUDE_FIELD = {
    'id','version',
    'create_timestamp','update_timestamp',
    'effective_timestamp','termination_timestamp',
    'export'
}

# Collect models - try both app labels
from django.apps import apps
debug(f"App configs: {[app.label for app in apps.get_app_configs()]}")

# Try both app labels
app_config = None
for app_label in ['blueprints', 'src.main.blueprints']:
    try:
        app_config = apps.get_app_config(app_label)
        debug(f"Found app config: {app_label}")
        break
    except LookupError:
        continue

if not app_config:
    debug("Blueprint app not found")
    sys.exit(1)

all_models = app_config.get_models()
debug(f"Total models: {len(all_models)}")

models = []
for m in all_models:
    module = m.__module__
    debug(f"Checking model {m.__name__} from {module}")
    
    # Include only draft models
    if not ('draft' in module.lower()):
        debug(f"Skipping {m.__name__}: not in draft module")
        continue
    
    # Skip Audit/Version models
    if 'Audit' in m.__name__ or 'Version' in m.__name__:
        debug(f"Skipping {m.__name__}: audit/version model")
        continue
        
    # Check DraftEntity subclass (with fallback)
    try:
        if not issubclass(m, DraftEntity):
            debug(f"Skipping {m.__name__}: not a DraftEntity subclass")
            continue
    except TypeError:
        # If comparison fails, check name convention
        if not m.__name__.endswith(('Entity')):
            debug(f"Skipping {m.__name__}: name doesn't suggest a DraftEntity")
            continue
        
    models.append(m)
    debug(f"Added model: {m.__name__}")

debug(f"Included models: {[m.__name__ for m in models]}")

if not models:
    debug("No models found! Check paths and filters.")
    sys.exit(1)

# Output Mermaid
w = sys.stdout.write
w('```mermaid\n')
w('classDiagram\n')

# Emit classes
for m in models:
    w(f"\nclass {m.__name__} {{\n")
    for f in m._meta.fields:
        if f.name in EXCLUDE_FIELD: continue
        fk = ' <<FK>>' if getattr(f, 'many_to_one', False) else ''
        w(f"  {f.name}{fk}\n")
    w('}\n')

# Emit relationships
w('\n')
for m in models:
    for f in m._meta.fields:
        if getattr(f, 'many_to_one', False):
            tgt = f.related_model
            if tgt in models:
                w(f"{tgt.__name__} <-- {m.__name__}: {f.name}\n")

w('```\n')
