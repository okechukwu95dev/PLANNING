body { margin: 0; }
.platform-data-default-route { margin: 0; font-family: 'Open Sans', Arial, sans-serif; font-weight: 400; background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 50%, #90caf9 100%); display: flex; flex-direction: column; min-height: 100vh; }
.platform-data-default-route header { background-color: #155c93; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.platform-data-default-route .logo-container { display: flex; align-items: center; }
.platform-data-default-route .content-container { flex: 1; z-index: 1; padding: 60px 20px; }
.platform-data-default-route h1 { text-align: center; margin-bottom: 40px; font-size: 2.5rem; color: #333; position: relative; }
.platform-data-default-route h1::after { content: ""; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(90deg, #155C93, #155c93); border-radius: 2px; }
.platform-data-default-route .platform-info { text-align: center; max-width: 650px; margin: 0 auto 60px; color: #333; line-height: 1.6; position: relative; z-index: 1; }
.platform-data-default-route .cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; justify-items: center; margin-top: 40px; }
.platform-data-default-route .card { background-color: white; border-radius: 12px; width: 280px; padding: 20px; display: grid; grid-template-rows: auto 1fr auto; row-gap: 20px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
.platform-data-default-route .card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); }
.platform-data-default-route .card::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #0078FF, #155c93); }
.platform-data-default-route .card-icon { margin: 0 auto; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: #f5f5f5; }
.platform-data-default-route .card h3 { margin: 0; color: #333; }
.platform-data-default-route .card p { margin: 0; color: #666; font-size: 0.95rem; line-height: 1.5; }
.platform-data-default-route .card-button { background-color: #155c93; color: white; border: none; border-radius: 5px; padding: 0.75em 1.5em; font-size: 1rem; cursor: pointer; transition: background-color 0.2s; font-weight: 600; justify-self: center; }
.platform-data-default-route .card-button:hover { background-color: #0e4783; }
.platform-data-default-route footer { background-color: #f5f5f5; padding: 20px; text-align: center; color: #555; font-size: 0.85rem; border-top: 1px solid #e0e0e0; }
.platform-data-default-route .icon-blueprints { fill: none; stroke: #0078FF; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.platform-data-default-route .icon-service { fill: none; stroke: #0a8b66; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
@media (max-width: 768px) { .platform-data-default-route .cards-container { grid-template-columns: 1fr; } .platform-data-default-route .card { width: 100%; max-width: 320px; } }
@media (min-width: 1200px) { .platform-data-default-route .cards-container { gap: 60px; } }
