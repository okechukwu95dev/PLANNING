#!/usr/bin/env python
"""
django_erd_generator.py - Generates ER diagram from Django models
"""
import os
import sys
import importlib.util

# Setup paths
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(script_dir, 'src', 'main'))

# Block conflicting modules (this is the key fix)
sys.modules['blueprints.models.export'] = None

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_local')

# Initialize Django
import django
django.setup()

# Import DraftEntity
from blueprints.models.abstract import DraftEntity

# Get models
models = []
for model in django.apps.apps.get_app_config('blueprints').get_models():
    if not model.__module__.startswith('src.main.blueprints.models.draft'):
        continue
    if 'Audit' in model.__name__ or 'Version' in model.__name__:
        continue
    if not issubclass(model, DraftEntity):
        continue
    models.append(model)

print("Found models:", [m.__name__ for m in models])

# Generate Mermaid
print('```mermaid')
print('classDiagram')

# Add classes
for model in models:
    print(f'class {model.__name__} {{')
    for field in model._meta.fields:
        if field.name in ('id', 'version', 'create_timestamp', 'update_timestamp', 
                          'effective_timestamp', 'termination_timestamp', 'export'):
            continue
        fk = ' <<FK>>' if field.is_relation else ''
        print(f'  +{field.name}{fk}')
    print('}')
    print()

# Add relationships
for model in models:
    for field in model._meta.fields:
        if field.is_relation and hasattr(field, 'related_model'):
            target = field.related_model
            if target in models:
                print(f'{target.__name__} <-- {model.__name__} : {field.name}')

print('```')
