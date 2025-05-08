<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platform Data Homepage</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; font-family: 'Open Sans', Arial, sans-serif; font-weight: 400; background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 50%, #d1c4e9 100%); min-height: 100vh; display: flex; flex-direction: column; }
    .chase-color { background-color: #155c93; color: white; }
    header { background-color: #155c93; color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; }
    .logo-container { display: flex; align-items: center; }
    main { flex: 1; padding: 0; max-width: 1200px; margin: 0 auto; width: 100%; }
    h1 { text-align: center; margin-bottom: 40px; font-size: 2.5rem; color: #333; position: relative; }
    h1::after { content: ""; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(90deg, #155c93, #155c93); border-radius: 2px; }
    .content-container { position: relative; z-index: 1; padding: 60px 20px; }
    .cards-container { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 40px; }
    .card { background-color: white; border-radius: 12px; width: 280px; height: 300px; padding: 20px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.08); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
    .card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.12); }
    .card::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #0078FF, #155c93); }
    .card-icon { margin: 0 auto 15px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background-color: #f5f5f5; }
    .blueprints-icon { background-color: #e3f2fd; }
    .service-codes-icon { background-color: #e8f5e9; }
    .card h3 { margin: 0 0 15px; color: #333; }
    .card p { margin: 0 0 20px; color: #666; flex-grow: 1; font-size: 0.95rem; line-height: 1.5; }
    .card-button { background-color: #155c93; color: white; border: none; border-radius: 5px; padding: 20px; font-size: 1rem; cursor: pointer; transition: background-color 0.2s; font-weight: 600; margin-top: auto; text-align: center; }
    .card-button:hover { background-color: #0e4878; }
    .platform-info { text-align: center; max-width: 650px; margin: 0 auto 60px; color: #333; line-height: 1.6; position: relative; z-index: 1; }
    footer { background-color: #f5f5f5; padding: 20px; text-align: center; color: #555; margin-top: auto; font-size: 0.85rem; border-top: 1px solid #e0e0e0; }
    .link-button { margin-bottom: 5px; }
    /* SVG icons */
    .icon-blueprints { fill: none; stroke: #0078FF; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .icon-service { fill: none; stroke: #0a86b6; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    @media (max-width: 768px) { .cards-container { flex-direction: column; align-items: center; } .card { width: 100%; max-width: 320px; } }
    @media (min-width: 1200px) { .cards-container { justify-content: space-around; } }
    
    /* ONLY ADDED THIS FOR HEADER WIDTH FIX */
    single-spa-router { width: 100%; display: block; }
    header { width: 100%; }
    .content-container { max-width: 1200px; margin: 0 auto; width: 100%; }
  </style>
</head>
<body>
<single-spa-router>
  <main>
    <route default>
      <header>
        <div class="logo-container">
          <img src="logo.png" alt="Site Icon" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 10px;">
          <h3>JPMorgan Chase</h3>
        </div>
      </header>
      <div class="content-container">
        <h1>Platform Data Homepage</h1>
        
        <div class="platform-info">
          <p>Platform Data provides centralized non-merchant data management for acquiring and payment platforms. It ensures accurate merchant qualification, pricing rules, and transaction charging by unifying data configuration, storage, and distribution through reusable APIs and services.</p>
        </div>
        
        <div class="cards-container">
          <div class="card">
            <div class="card-icon blueprints-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" class="icon-blueprints">
                <path d="M3 3h14M8z"></path>
                <path d="M17 3h4v18H3V3h4"></path>
                <path d="M3 9h14"></path>
                <path d="M3 15h14"></path>
              </svg>
            </div>
            <h3>Blueprints</h3>
            <p>Blueprints manages the sourcing, storage, and distribution of non-merchant data to the Modern Merchant Acquiring and Payment Processing platforms.</p>
            <a href="blueprints" class="card-button chase-color link-button">Blueprints</a>
          </div>
          
          <div class="card">
            <div class="card-icon service-codes-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" class="icon-service">
                <path d="M16 18l6-6-6-6"></path>
                <path d="M8 6l-6 6 6 6"></path>
                <path d="M1 12h22"></path>
              </svg>
            </div>
            <h3>Service Codes</h3>
            <p>Service Codes contain information necessary to qualify, price, and charge a merchant for a payment action within the Modern Merchant Acquiring Payments Platform.</p>
            <a href="service-codes" class="card-button chase-color link-button">Service Codes</a>
          </div>
        </div>
      </div>
    </route>
    
    <route path="service-codes">
      <application name="@platformdata/service-codes-ui" props="auth"></application>
    </route>
    
    <route path="blueprints">
      <application name="@platformdata/blueprints-ui" props="auth"></application>
    </route>
  </main>
</single-spa-router>
<footer>
  © 2025 JPMorgan Chase & Co. All rights reserved.
</footer>
</body>
</html>
