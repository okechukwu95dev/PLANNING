#!/usr/bin/env python
"""
scripts/generate_erd_mermaid.py
Usage: python scripts/generate_erd_mermaid.py > erd.mmd
Outputs clean Mermaid classDiagram for DraftEntity models in "blueprints" app,
with debug prints for troubleshooting settings and imports.
"""
import os, sys, re
from importlib import import_module

def debug(msg):
    sys.stderr.write(f"DEBUG: {msg}\n")

# Setup sys.path to include project
dir_path = os.path.dirname(os.path.abspath(__file__))
project_src = os.path.join(dir_path, 'src', 'main')
sys.path.insert(0, project_src)
debug(f"sys.path inserted: {project_src}")
debug(f"Current PYTHONPATH: {sys.path[:3]}")

# Ensure correct settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_local')
debug(f"DJANGO_SETTINGS_MODULE={os.environ.get('DJANGO_SETTINGS_MODULE')}")

# Import Django and configure
try:
    import django
    django.setup()
    debug("django.setup() succeeded")
except Exception as e:
    debug(f"django.setup() failed: {e}")
    sys.exit(1)

# Verify INSTALLED_APPS
from django.conf import settings
debug(f"INSTALLED_APPS: {settings.INSTALLED_APPS}")

# Import DraftEntity
try:
    from blueprints.models.abstract import DraftEntity
    debug("Imported DraftEntity successfully")
except ImportError as e:
    debug(f"Failed to import DraftEntity: {e}")
    sys.exit(1)

# Exclusion and filter
EXCLUDE_MODEL = re.compile(r"^(Audit.*|.*Version|ExportRequest|ExportArtifact)$")
EXCLUDE_FIELD = {
    'id', 'version', 'create_timestamp','update_timestamp',
    'effective_timestamp','termination_timestamp','export'
}

# Collect models
from django.apps import apps
all_models = apps.get_app_config('blueprints').get_models()
models = []
for m in all_models:
    if not issubclass(m, DraftEntity): continue
    if EXCLUDE_MODEL.match(m.__name__): continue
    models.append(m)
debug(f"Models to include: {[m.__name__ for m in models]}")

# Emit Mermaid diagram to stdout
w = sys.stdout.write
w('classDiagram\n')

# Classes
for m in models:
    w(f"\nclass {m.__name__} {{\n")
    for f in m._meta.fields:
        if f.name in EXCLUDE_FIELD: continue
        fk = ' <<FK>>' if getattr(f, 'many_to_one', False) else ''
        w(f"  {f.name}{fk}\n")
    w('}\n')

# Relationships
w('\n')
for m in models:
    for f in m._meta.fields:
        if getattr(f, 'many_to_one', False):
            tgt = f.related_model
            if tgt in models:
                w(f"{tgt.__name__} <|-- {m.__name__}\n")
