<single-spa-router>
  <main>
    <route default>
      <div class="platform-data-default-route">
        <header>
          <div class="logo-container">
            <img src="logo.png" alt="Site Icon" style="vertical-align: middle; width: 24px; height: 24px; margin-right: 10px;">
            <h3>JPMorgan Chase</h3>
          </div>
        </header>
        <div class="content-container">
          <h1>Platform Data Homepage</h1>
          <div class="platform-info">
            <p>Platform Data provides centralized non-merchant data management for acquiring and payment platforms.
            It ensures accurate merchant qualification, pricing rules, and transaction charging by unifying data configuration,
            storage, and distribution through reusable APIs and services.</p>
          </div>
          <div class="cards-container">
            <div class="card">
              <div class="card-icon blueprints-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" class="icon-blueprints">
                  <path d="M3 3h4v18h3-2" />
                  <path d="M17 3h4v18h-4" />
                  <path d="M3 9h14" />
                  <path d="M3 15h14" />
                </svg>
              </div>
              <h3>Blueprints</h3>
              <p>Blueprints manages the sourcing, storage, and distribution of non-merchant data to the
              Modern Merchant Acquiring and Payment Processing platforms.</p>
              <a href="/blueprints" class="card-button chase-color link-button">Blueprints</a>
            </div>
            <div class="card">
              <div class="card-icon service-codes-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" class="icon-service">
                  <path d="M16 18l6-6-6-6"/>
                  <path d="M8 6l-6 6 6 6"/>
                  <path d="M12 22v-20"/>
                </svg>
              </div>
              <h3>Service Codes</h3>
              <p>Service Codes contain information necessary to qualify, price, and charge a merchant for a
              payment action within the Modern Merchant Acquiring Payments Platform.</p>
              <a href="/service-codes" class="card-button chase-color link-button">Service Codes</a>
            </div>
          </div>
        </div>
        <footer>
          &copy; 2025 JPMorgan Chase &amp; Co. All rights reserved.
        </footer>
      </div>
    </route>
    <route path="/service-codes">
      <application name="@platformdata/service-codes-ui" props="auth"></application>
    </route>
    <route path="/blueprints">
      <application name="@platformdata/blueprints-ui" props="auth"></application>
    </route>
  </main>
</single-spa-router>
