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
      background: linear-gradient(to bottom, #e0f7fa 0%, #bbdefb 100%);
      min-height: 100vh;
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
      padding: 40px 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      color: #333;
      font-size: 2.2rem;
      margin-bottom: 30px;
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
      position: relative;
    }
    
    .card-top-border {
      height: 6px;
      background: #155c93;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    
    .card-content {
      padding: 25px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .icon-container {
      width: 70px;
      height: 70px;
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
      color: #555;
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
      transition: background-color 0.2s;
      font-weight: 600;
      text-align: center;
      width: 100%;
      display: block;
      text-decoration: none;
      text-align: center;
    }
    
    .card-button:hover {
      background-color: #0e4878;
    }
    
    .wave-decoration {
      width: 100%;
      height: 30px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="%23FFFF00" opacity="0.25"></path><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="%2300CC66" opacity="0.5"></path><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="%2300CC66" opacity="0.3"></path></svg>');
      position: absolute;
      bottom: 0;
      left: 0;
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
    
    /* Icon SVGs */
    .icon-blueprints {
      color: #155c93;
      font-size: 32px;
    }
    
    .icon-service {
      color: #00a86b;
      font-size: 32px;
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
  
  <main>
    <h1>Platform Data Homepage</h1>
    
    <div class="platform-info">
      <p>Access and manage enterprise data products through our centralized platform. Configure merchant services and transaction capabilities across regions using blueprints and service codes.</p>
    </div>
    
    <div class="cards-container">
      <div class="card">
        <div class="card-top-border"></div>
        <div class="card-content">
          <div class="icon-container blueprints-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#155c93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <p>Manage data architecture templates for product configuration and transaction setup, defining merchant service availability based on JPMC Legal Entities and regions.</p>
        </div>
        <a href="/blueprints" class="card-button">Blueprints</a>
      </div>
      
      <div class="card">
        <div class="card-top-border"></div>
        <div class="card-content">
          <div class="icon-container service-codes-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00a86b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
          </div>
          <h3>Service Codes</h3>
          <p>Define qualification criteria for merchant transactions across different regions. Configure service availability based on JPMC Legal Entity, country codes, and relevant methods of payment.</p>
        </div>
        <a href="/service-codes" class="card-button">Service Codes</a>
      </div>
    </div>
  </main>
</body>
</html>
