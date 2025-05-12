/* Reset */
html, body {
  margin: 0;
  padding: 0;
}

/* Default route container */
.platform-data-default-route {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Open Sans', Arial, sans-serif;
  font-weight: 400;
  color: #333;
  background: linear-gradient(135deg, #e6f9ff 0%, #cce6ff 100%);
}

/* Header */
.platform-data-default-route header {
  background-color: #0a3d8f;
  color: #fff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
}

/* Page title */
.platform-data-default-route h1 {
  margin: 2.5rem 0 0.5rem;
  font-size: 2.25rem;
  text-align: center;
  position: relative;
}
.platform-data-default-route h1::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  background-color: #0a3d8f;
  margin: 0.5rem auto 0;
}

/* Description text */
.platform-data-default-route .platform-info {
  max-width: 700px;
  margin: 0.5rem auto 2rem;
  padding: 0 1rem;
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

/* Cards container */
.platform-data-default-route .cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 0 auto 2rem;
  padding: 0 1rem;
  width: 100%;
  max-width: 1200px;
}

/* Individual card */
.platform-data-default-route .card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-top: 4px solid #0066cc;
  padding: 2.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
}

/* Icon wrapper */
.platform-data-default-route .card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.platform-data-default-route .blueprints-icon {
  background-color: #e6f4ff;
}
.platform-data-default-route .service-codes-icon {
  background-color: #e6f9f3;
}
.platform-data-default-route .card-icon svg {
  width: 32px;
  height: 32px;
}

/* Card title and text */
.platform-data-default-route .card h3 {
  font-size: 1.25rem;
  text-align: center;
  margin: 0 0 1rem;
}
.platform-data-default-route .card p {
  font-size: 0.95rem;
  text-align: center;
  color: #666;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

/* Card button */
.platform-data-default-route a.card-button {
  margin-top: auto;
  display: block;
  width: 100%;
  padding: 0.75rem 0;
  background-color: #0a3d8f;
  color: #fff;
  text-decoration: none;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.platform-data-default-route a.card-button:hover {
  background-color: #072d69;
}

/* Footer */
.platform-data-default-route footer {
  margin-top: auto;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

/* Desktop layout: two columns */
@media (min-width: 992px) {
  .platform-data-default-route .cards-container {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
  }
  .platform-data-default-route .card {
    margin: 0;
  }
}
