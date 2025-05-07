<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platform Data Homepage</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      font-weight: 400;
      background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 50%, #d1c4e9 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .chase-color {
      background-color: #155c93;
      color: white;
    }
    
    header {
      background-color: #155c93;
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .logo-container {
      display: flex;
      align-items: center;
    }
    
    .logo {
      width: 24px;
      height: 24px;
      margin-right: 10px;
      background-color: white;
      border-radius: 4px;
    }
    
    main {
      flex: 1;
      padding: 40px 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 40px;
      font-size: 2.2rem;
      color: #333;
      position: relative;
    }
    
    h1::after {
      content: "";
      display: block;
      width: 120px;
      height: 4px;
      background-color: #155c93;
      margin: 20px auto 0;
    }
    
    .platform-info {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 40px;
      color: #333;
      line-height: 1.6;
    }
    
    .cards-container {
      display: flex;
      justify-content: center;
      gap: 30px;
      flex-wrap: wrap;
    }
    
    .card {
      background-color: white;
      border-radius: 8px;
      width: 300px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }
    
    .card-top-border {
      height: 6px;
      background: #155c93;
    }
    
    .card-content {
      padding: 25px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .icon-container {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .blueprints-icon {
      background-color: #e3f2fd;
    }
    
    .service-codes-icon {
      background-color: #e8f5e9;
    }
    
    .card h3 {
      margin: 0 0 15px;
      color: #333;
      text-align: center;
    }
    
    .card p {
      margin: 0 0 25px;
      color: #666;
      text-align: center;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .card-button {
      background-color: #155c93;
      color: white;
      border: none;
      border-radius: 0;
      padding: 15px;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 600;
      text-align: center;
      width: 100%;
      display: block;
      text-decoration: none;
    }
    
    .card-button:hover {
      background-color: #0e4878;
    }
    
    footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      color: #555;
      font-size: 0.85rem;
      border-top: 1px solid #e0e0e0;
      margin-top: auto;
    }
    
    @media (max-width: 768px) {
      .cards-container {
        flex-direction: column;
        align-items: center;
      }
      
      .card {
        width: 100%;
        max-width: 320px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="logo-container">
      <div class="logo"></div>
      <h3>JPMorgan Chase</h3>
    </div>
  </header>
  
  <single-spa-router>
    <main>
      <route default>
        <div class="content-container">
          <h1>Platform Data Homepage</h1>
          
          <div class="platform-info">
            <p>Platform Data efficiently manages the sourcing, storage, and distribution of non-merchant data for Modern Merchant Acquiring and Payment Processing platforms. By consolidating essential information, it supports the qualification, pricing, and charging of merchants for payment actions, ensuring streamlined operations and consistent data usage across current and future applications.</p>
          </div>
          
          <div class="cards-container">
            <div class="card">
              <div class="card-top-border"></div>
              <div class="card-content">
                <div class="icon-container blueprints-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155c93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-blueprints">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="14" y1="8" x2="21" y2="8"></line>
                    <line x1="14" y1="12" x2="21" y2="12"></line>
                    <line x1="14" y1="16" x2="21" y2="16"></line>
                    <line x1="4" y1="8" x2="8" y2="8"></line>
                    <line x1="4" y1="12" x2="8" y2="12"></line>
                    <line x1="4" y1="16" x2="8" y2="16"></line>
                  </svg>
                </div>
                <h3>Blueprints</h3>
                <p>Blueprints manages the sourcing, storage, and distribution of non-merchant data to the Modern Merchant Acquiring and Payment Processing platforms.</p>
              </div>
              <a href="/blueprints" class="card-button chase-color">Blueprints</a>
            </div>
            
            <div class="card">
              <div class="card-top-border"></div>
              <div class="card-content">
                <div class="icon-container service-codes-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00a86b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-service">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                </div>
                <h3>Service Codes</h3>
                <p>Service Codes contain information necessary to qualify, price, and charge a merchant for a payment action within the Modern Merchant Acquiring Payments Platform.</p>
              </div>
              <a href="/service-codes" class="card-button chase-color">Service Codes</a>
            </div>
          </div>
        </div>
      </route>
      
      <route path="blueprints">
        <application name="@platformdata/blueprints-ui" props="auth"></application>
      </route>
      
      <route path="service-codes">
        <application name="@platformdata/service-codes-ui" props="auth"></application>
      </route>
    </main>
  </single-spa-router>
  
  <footer>
    © 2025 JPMorgan Chase & Co. All rights reserved.
  </footer>
</body>
</html>
