python manage.py graph_models blueprints --pydot --group-models --inheritance --exclude-models "Audit*,Version*,*Audit,*Version" --output-file-format png --theme django2018 --layout dot --arrow-shape normal --disable-abstract-fields --rankdir TB --hide-edge-labels --color-code-deletions --font-name "Arial" --font-size 10 --node-size 1.3 --edge-colors "#e00000" --node-shape box --node-style "rounded,filled,bold" --dot-file erd.dot --output erd.png --settings src.main.config.settings_local && python -c "import os; os.system('type erd.dot | findstr /i \"label=\"');"
python manage.py shell -c "from django.apps import apps; models = [m for m in apps.get_models() if m.__module__.startswith('blueprints') and not any(x in m.__name__ for x in ['Audit', 'Version'])]; print('\n'.join([f'{m.__name__}: FKs→ {[f.name for f in m._meta.fields if f.is_relation]}' for m in models]))"

-----------------------------------------------------



    
#!/usr/bin/env python
"""
scripts/generate_erd_mermaid.py
Usage: python scripts/generate_erd_mermaid.py > erd.mmd
Outputs pure Mermaid classDiagram without code fences for direct copy/paste into mermaid editor.
"""
import os, django, re, sys
from django.apps import apps
from blueprints.abstract import DraftEntity

# Setup Django
env = 'src.main.config.settings_local'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', env)
django.setup()

# Exclusion/filter patterns
EXCLUDE_PATTERN = re.compile(r"^(Audit.*|.*Version|ExportRequest|ExportArtifact)$")
FIELD_FILTER = {'id','version','create_timestamp','update_timestamp','effective_timestamp','termination_timestamp'}

# Gather DraftEntity models
all_models = apps.get_app_config('blueprints').get_models()
models = [m for m in all_models if issubclass(m, DraftEntity) and not EXCLUDE_PATTERN.match(m.__name__)]

# Emit Mermaid diagram
w = sys.stdout.write
w('classDiagram\n')

# Emit classes with fields
for m in models:
    w(f'    class {m.__name__} {{\n')
    for f in m._meta.fields:
        if f.name in FIELD_FILTER: continue
        fk = ' FK' if f.is_relation and f.many_to_one else ''
        w(f'        {f.name}{fk}\n')
    w('    }\n\n')

# Emit relationships
for m in models:
    for f in m._meta.fields:
        if f.is_relation and f.many_to_one:
            tgt = f.related_model
            if tgt in models:
                w(f'    {tgt.__name__} <|-- {m.__name__}\n')


-----------------------------------------------------

python manage.py graph_models blueprints --pydot --group-models --inheritance --exclude-models "Audit*,Version*" -o erd.dot --settings src.main.config.settings_local

python manage.py graph_models blueprints --dot --inheritance --exclude-models "Audit*,Version*" > erd.dot --settings src.main.config.settings_local


# render PNG
dot -Tpng erd.dot -o erd.png


import sqlite3, sys

db = sys.argv[1] if len(sys.argv)>1 else "test.sqlite"
conn = sqlite3.connect(db)
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = [r[0] for r in cur.fetchall()]

for tbl in tables:
    print(f"TABLE: {tbl}")
    # columns + PK flags
    cur.execute(f"PRAGMA table_info('{tbl}');")
    for cid,name,ctype,notnull,dflt,pk in cur.fetchall():
        flags = []
        if notnull: flags.append("NOT NULL")
        if pk:     flags.append("PK")
        if dflt is not None: flags.append(f"DEFAULT={dflt}")
        print(f"  - {name} ({ctype}){' ['+' | '.join(flags)+']' if flags else ''}")
    # foreign keys
    cur.execute(f"PRAGMA foreign_key_list('{tbl}');")
    for fk in cur.fetchall():
        # fk tuple: (id,seq,table,from,to,on_update,on_delete,match)
        _,_,ref_table,src_col,ref_col,_,_,_ = fk
        print(f"    → FK: {src_col} → {ref_table}({ref_col})")
    print()



<!DOCTYPE html>
<html lang="en" data-brand="cpp">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platform Data Portal</title>
  <meta name="importmap-type" content="systemjs-importmap" />
  <link rel="preload" href="/lib/single-spa@5.9.4/lib/system/single-spa.min.js" as="script" />
  
  <meta http-equiv="cache-control" content="max-age=0" />
  <meta http-equiv="cache-control" content="no-cache" />
  <meta http-equiv="expires" content="0" />
  <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
  <meta http-equiv="pragma" content="no-cache" />
  
  <script src="/lib/regenerator-runtime@0.13.11/runtime.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
  <script type="systemjs-importmap">
  {
    "imports": {
      "single-spa": "/lib/single-spa@5.9.4/lib/system/single-spa.min.js",
      "react": "/lib/react@18.2.0/umd/react.production.min.js",
      "react-dom": "/lib/react-dom@18.2.0/umd/react-dom.production.min.js"
    }
  }
  </script>
  
  <script>
    const im = document.createElement('script');
    im.type="systemjs-importmap";
    const hostName = window.location.host;
    let srcUrl = "//" + hostName;
    
    if (hostName.indexOf("platformdataportal-dev.aws.jpachase.net") !== -1) {
      srcUrl += "/import-map/importmap-dev.json";
    }
    else if (hostName.indexOf("platformdataportal-test.aws.jpachase.net") !== -1) {
      srcUrl += "/import-map/importmap-test.json";
    }
    else if (hostName.indexOf("platformdataportal-int-test.aws.jpachase.net") !== -1) {
      srcUrl += "/import-map/importmap-testing.json";
    }
    else if (hostName.indexOf("platformdataportal-perf.prod.aws.jpachase.net") !== -1) {
      srcUrl += "/import-map/importmap-perf.json";
    }
    else if (hostName.indexOf("platformdataportal.prod.aws.jpachase.net") !== -1) {
      srcUrl += "/import-map/importmap-prod.json";
    }
    else {
      srcUrl += "/import-map/importmap-local.json";
    }
    
    im.setAttribute("src", srcUrl);
    document.currentScript.after(im);
  </script>
  
  <!-- Conditional Default Route Styles -->
  <script>
    (function() {
      // Function that manages the default route styles
      function manageDefaultStyles() {
        const isDefaultRoute = location.pathname === '/' || location.pathname === '';
        const styleId = 'default-route-css';
        const existingStyle = document.getElementById(styleId);
        
        // Add styles if on default route and styles don't exist yet
        if (isDefaultRoute && !existingStyle) {
          const styleElement = document.createElement('style');
          styleElement.id = styleId;
          styleElement.textContent = 
            'body{margin:0}' +
            '.platform-data-default-route{margin:0;font-family:\'Open Sans\',Arial,sans-serif;font-weight:400;background:linear-gradient(135deg,#e0f7fa 0%,#bbdefb 50%,#90caf9 100%);display:flex;flex-direction:column;min-height:100vh}' +
            '.platform-data-default-route header{background-color:#155c93;padding:16px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 10px rgba(0,0,0,.1)}' +
            '.platform-data-default-route .logo-container{display:flex;align-items:center}' +
            '.platform-data-default-route .content-container{flex:1;z-index:1;padding:60px 20px}' +
            '.platform-data-default-route h1{text-align:center;margin-bottom:40px;font-size:2.5rem;color:#333;position:relative}' +
            '.platform-data-default-route h1::after{content:"";position:absolute;bottom:-15px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:linear-gradient(90deg,#155C93,#155c93);border-radius:2px}' +
            '.platform-data-default-route .platform-info{text-align:center;max-width:650px;margin:0 auto 60px;color:#333;line-height:1.6;position:relative;z-index:1}' +
            '.platform-data-default-route .cards-container{display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin-top:40px}' +
            '.platform-data-default-route .card{background-color:#fff;border-radius:12px;width:280px;padding:20px;display:grid;grid-template-rows:auto 1fr auto;row-gap:20px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,.08);position:relative;overflow:hidden}' +
            '.platform-data-default-route .card::before{content:"";position:absolute;top:0;left:0;width:100%;height:6px;background:linear-gradient(90deg,#0078FF,#155c93)}' +
            '.platform-data-default-route .card-icon{margin:0 auto;width:60px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:50%;background-color:#f5f5f5}' +
            '.platform-data-default-route .card h3{margin:0;color:#333}' +
            '.platform-data-default-route .card p{margin:0;color:#666;font-size:.95rem;line-height:1.5}' +
            '.platform-data-default-route .card-button{background-color:#155c93;color:#fff;border:none;border-radius:5px;padding:.75em 1.5em;font-size:1rem;cursor:pointer;transition:background-color .2s;font-weight:600;justify-self:center}' +
            '.platform-data-default-route .card-button:hover{background-color:#0e4783}' +
            '.platform-data-default-route footer{background-color:#f5f5f5;padding:20px;text-align:center;color:#555;font-size:.85rem;border-top:1px solid #e0e0e0}' +
            '.platform-data-default-route .icon-blueprints{fill:none;stroke:#0078FF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
            '.platform-data-default-route .icon-service{fill:none;stroke:#0a8b66;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
            '@media(max-width:768px){.platform-data-default-route .card{width:100%;max-width:320px}}';
            
          document.head.appendChild(styleElement);
        } 
        // Remove styles if we navigate away from default route
        else if (!isDefaultRoute && existingStyle) {
          existingStyle.remove();
        }
      }
      
      // Initial call
      manageDefaultStyles();
      
      // Re-evaluate when route changes in SPA
      window.addEventListener('single-spa:routing-event', manageDefaultStyles);
    })();
  </script>
  
  <script src="/lib/zone.js@0.13.0/dist/zone.min.js"></script>
  <script src="/lib/systemjs@6.14.1/dist/system.min.js"></script>
  <script src="/lib/systemjs@6.14.1/dist/extras/amd.min.js"></script>
</head>
<body>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  
  <!-- this is to stop styles spilling over to other elements(sc/bp etc) in spa -->
  <script>
    function loadDefaultStyles() {
      const isDefault = location.pathname === '/' || location.pathname === '';
      
      if (isDefault && !document.getElementById('default-route-css')) {
        const link = document.createElement('link');
        link.id = 'default-route-css';
        link.rel = 'stylesheet';
        link.href = '/static/microfrontend-layout.css';
        document.head.appendChild(link);
      }
      
      if (!isDefault) {
        const existing = document.getElementById('default-route-css');
        existing && existing.remove();
      }
    }
    
    // This function is now replaced by the script in the head
    // Keeping this empty for compatibility if it's referenced elsewhere
    
    // load default after every SPA nav - will use the stuff we have on SC and BP internally
    window.addEventListener('single-spa:routing-event', function() {
      // Empty function - implementation moved to head script
    });
  </script>
  
  <script>
    System.import('@platformdata/root-config');
  </script>
  <script>
    System.import('@platformdata/root-config');
  </script>
  <import-map-overrides-full show-when-local-storage="devtools" dev-libs></import-map-overrides-full>
</body>
</html>
