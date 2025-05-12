/* Global styles */
body { margin: 0; font-family: 'Open Sans', Arial, sans-serif; font-weight: 400; }

/* Default route specific styles */
.platform-data-default-route { background: linear-gradient(135deg, #007ff0 0%, #00bdf0 100%); min-height: 100vh; display: flex; flex-direction: column; }
.platform-data-default-route .chase-color { background-color: #1565c0; color: white; }
.platform-data-default-route header { background-color: #1565c0; color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.platform-data-default-route .logo-container { padding: 0; max-width: 180px; content: ""; }
.platform-data-default-route .logo { fill: #ffffff; padding: 0; max-width: 180px; content: ""; }
.platform-data-default-route h1 { text-align: center; margin-bottom: 40px; font-size: 2.5rem; color: #fff; position: relative; }
.platform-data-default-route h1:after { content: ""; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(90deg, #15c639, #15c531, #15c933); border-radius: 2px; }
.platform-data-default-route .content-container { position: relative; z-index: 1; padding: 60px 20px; }
.platform-data-default-route .cards-container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-top: 40px; }
.platform-data-default-route .card { background-color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.08); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
.platform-data-default-route .card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); }
.platform-data-default-route .card-icon { margin: 0 auto 15px; width: 60px; height: 60px; display: flex; align-item: center; justify-content: center; border-radius: 50%; background-color: #f5f5f5; }
.platform-data-default-route .card-buttonhover { background-color: #0047b7; }
.platform-data-default-route .blueprints-icon { background-color: #e3f7fd; }
.platform-data-default-route .service-codes-icon { background-color: #e5f5e5; }
.platform-data-default-route .card-p { margin: 0 0 20px; color: #666; flex-grow: 1; font-size: 0.95rem; line-height: 1.5; }
.platform-data-default-route .card-button { font-size: 1rem; color: #555; margin-top: auto; font-size: 0.95rem; border-top: 1px solid #e0e0e0; }
.platform-data-default-route .link-button { margin-bottom: 5px; }
.platform-data-default-route .icon-blueprints { fill: none; stroke: #0078ff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.platform-data-default-route .icon-service { fill: none; stroke: #00b06d; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.platform-data-default-route footer { background-color: #f5f5f5; padding: 20px; text-align: center; color: #555; margin-top: auto; font-size: 0.95rem; border-top: 1px solid #e0e0e0; }
.platform-data-default-route .link-button { margin-bottom: 5px; }
@media (max-width: 768px) { .platform-data-default-route .cards-container { flex-direction: column; align-items: center; } .platform-data-default-route .card { width: 100%; max-width: 320px; } }
@media (min-width: 1200px) { .platform-data-default-route .cards-container { justify-content: center; end: 80px; } }
