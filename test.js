/* Default route specific styles */
.platform-data-default-route { margin: 0; font-family: 'Open Sans', Arial, sans-serif; font-weight: 400; background-color: #e6f2ff; min-height: 100vh; display: flex; flex-direction: column; }

/* Header styling */
.platform-data-default-route header { background-color: #0a3d8f; color: white; padding: 16px; display: flex; align-items: center; }
.platform-data-default-route .logo-container { display: flex; align-items: center; }
.platform-data-default-route h3 { margin: 0; font-size: 18px; }

/* Main content */
.platform-data-default-route h1 { text-align: center; margin: 40px 0 20px; font-size: 2.5rem; color: #333; position: relative; }
.platform-data-default-route h1:after { content: ""; display: block; width: 80px; height: 4px; background: #0a3d8f; margin: 20px auto 0; }
.platform-data-default-route .platform-info { text-align: center; max-width: 800px; margin: 0 auto 50px; padding: 0 20px; color: #555; line-height: 1.6; }

/* Card layout - fixed to match screenshot exactly */
.platform-data-default-route .cards-container { display: flex; flex-direction: column; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.platform-data-default-route .card { background-color: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 30px; display: flex; flex-direction: column; width: 100%; max-width: 600px; margin-bottom: 30px; }
.platform-data-default-route .card h3 { color: #333; margin: 15px 0; text-align: center; font-size: 22px; }
.platform-data-default-route .card p { color: #666; line-height: 1.5; text-align: center; margin-bottom: 25px; }

/* Card top border - matches screenshot */
.platform-data-default-route .card { border-top: 4px solid #0066cc; }

/* Icons */
.platform-data-default-route .card-icon { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background-color: #e6f4ff; margin: 0 auto 15px; }
.platform-data-default-route .blueprints-icon { background-color: #e6f4ff; }
.platform-data-default-route .icon-blueprints { fill: none; stroke: #0066cc; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.platform-data-default-route .service-codes-icon { background-color: #e6f9f3; }
.platform-data-default-route .icon-service { fill: none; stroke: #009986; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Buttons */
.platform-data-default-route a.card-button { display: block; text-align: center; padding: 12px 20px; background-color: #0a3d8f; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; margin-top: auto; transition: background-color 0.2s; }
.platform-data-default-route a.card-button:hover { background-color: #072d69; }

/* Footer */
.platform-data-default-route footer { background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; margin-top: auto; font-size: 0.9rem; }

/* Media queries - exact behavior based on screenshot */
@media (min-width: 992px) {
  .platform-data-default-route .cards-container { 
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .platform-data-default-route .card { 
    width: 100%;
    max-width: 600px;
  }
}
