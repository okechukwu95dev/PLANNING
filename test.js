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
      /* Gradient background similar to diagram but simplified */
      background: linear-gradient(135deg, #e0f7fa 0%, #bbdefb 50%, #d1c4e9 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    header {
      background-color: #0078FF;
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
      width: 32px;
      height: 32px;
      margin-right: 12px;
      background-color: white;
      border-radius: 4px;
    }
    
    main {
      flex: 1;
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 40px;
      font-size: 2.5rem;
      color: #333;
      position: relative;
    }
    
    h1::after {
      content: "";
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, #0078FF, #155c93);
      border-radius: 2px;
    }
    
    .content-container {
      position: relative;
      z-index: 1;
    }
    
    .cards-container {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
      margin-top: 40px;
    }
    
    .card {
      background-color: white;
      border-radius: 12px;
      width: 280px;
      height: 220px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.12);
    }
    
    .card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, #0078FF, #155c93);
    }
    
    .card-icon {
      margin: 0 auto 15px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #f5f5f5;
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
    }
    
    .card p {
      margin: 0 0 20px;
      color: #666;
      flex-grow: 1;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .card-button {
      background-color: #0078FF;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 25px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
      font-weight: 600;
      margin-top: auto;
    }
    
    .card-button:hover {
      background-color: #0056b3;
    }
    
    .background-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }
    
    .shape {
      position: absolute;
      opacity: 0.06;
      border-radius: 50%;
    }
    
    .shape-1 {
      width: 300px;
      height: 300px;
      background-color: #0078FF;
      top: -100px;
      left: -100px;
    }
    
    .shape-2 {
      width: 400px;
      height: 400px;
      background-color: #155c93;
      bottom: -200px;
      right: -150px;
    }
    
    .shape-3 {
      width: 200px;
      height: 200px;
      background-color: #0078FF;
      bottom: 100px;
      left: 15%;
    }
    
    .platform-info {
      text-align: center;
      max-width: 650px;
      margin: 0 auto 60px;
      color: #333;
      line-height: 1.6;
      position: relative;
      z-index: 1;
    }
    
    footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      color: #555;
      margin-top: auto;
      font-size: 0.85rem;
      border-top: 1px solid #e0e0e0;
    }
    
    /* SVG icons */
    .icon-blueprints {
      fill: none;
      stroke: #0078FF;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    
    .icon-service {
      fill: none;
      stroke: #00a86b;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
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
  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
  
  <header>
    <div class="logo-container">
      <div class="logo"></div>
      <h3>JPMorgan Chase</h3>
    </div>
  </header>
  
  <main>
    <div class="content-container">
      <h1>Platform Data Homepage</h1>
      
      <div class="platform-info">
        <p>Access and manage enterprise data products through our centralized platform. Navigate between blueprints and service codes to configure your data solutions.</p>
      </div>
      
      <div class="cards-container">
        <div class="card">
          <div class="card-icon blueprints-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" class="icon-blueprints">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path>
              <path d="M10 4v4h10"></path>
              <path d="M10 12h10"></path>
              <path d="M10 18h10"></path>
              <path d="M4 9h2"></path>
              <path d="M4 14h2"></path>
              <path d="M4 19h2"></path>
            </svg>
          </div>
          <h3>Blueprints</h3>
          <p>Access and manage data architectural templates, models, and implementation frameworks.</p>
          <button class="card-button">View Blueprints</button>
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
          <p>Browse and implement standardized service codes for integrating data services across platforms.</p>
          <button class="card-button">View Service Codes</button>
        </div>
      </div>
    </div>
  </main>
  
  <footer>
    © 2025 JPMorgan Chase & Co. All rights reserved.
  </footer>
</body>
</html>
