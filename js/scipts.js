console.log("[DEBUG] Page loaded (scripts.js)");

// --- Ensure all required variables are defined ---
let tabs = [];
let appRoot = document.getElementById("app-root") || document.body;
let config = { appName: "ChoristerCorner" };
let selectedTabIdx = 0;

// --- DYNAMIC RENDERING: Always use tabs from app.json ---
fetch("json/app.json")
  .then((response) => response.json())
  .then((appData) => {
    config.appName = appData.appName || "ChoristerCorner";
    config.description = appData.description || "A comprehensive platform for choristers and worship leaders";
    config.version = appData.version || "1.0.0";
    
    // Get tabs from the Main App page
    const mainAppPage = (appData.pages || []).find(
      (p) => p.name === "Main App"
    );
    if (mainAppPage && Array.isArray(mainAppPage.tabs)) {
      tabs = mainAppPage.tabs;
      window.tabs = tabs; // Ensure global reference is always up to date
    }
    console.log("[DEBUG] Tabs loaded:", tabs);
    window.renderAppUI = renderAppUI; // Ensure global reference is always up to date
    
    // Initialize the app
    initializeApp();
  })
  .catch((err) => {
    console.error("Failed to load app.json:", err);
    // Show error message in the UI
    document.body.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <i class="bi bi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Failed to Load App</h1>
          <p class="text-gray-600">Could not load app configuration. Please try refreshing the page.</p>
        </div>
      </div>
    `;
  });

// Initialize the application
function initializeApp() {
  console.log("[DEBUG] Initializing ChoristerCorner app");
  
  // Restore last selected tab if valid, else default to 0 (Home)
  let idx = parseInt(localStorage.getItem("selectedTabIdx"), 10);
  if (isNaN(idx) || idx < 0 || idx >= tabs.length) {
    idx = 0;
  }
  selectedTabIdx = idx;
  localStorage.setItem("selectedTabIdx", selectedTabIdx);
  
  renderAppUI();
  setupEventListeners();
}

// Main UI rendering function
function renderAppUI() {
  console.log("[DEBUG] renderAppUI", { selectedTabIdx, tabsCount: tabs.length });
  
  if (!config || !config.appName) {
    throw new Error("config must be initialized with appName before calling renderAppUI()");
  }

  // Main app structure
  appRoot.innerHTML = `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <!-- Navigation Header -->
      <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            
            <!-- Logo and App Name -->
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <i class="bi bi-music-note-beamed text-3xl text-purple-600"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">${config.appName}</h1>
                <p class="text-xs text-gray-500 hidden sm:block">${config.version}</p>
              </div>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4" id="desktop-tabs">
                ${tabs.map((tab, idx) => renderDesktopTabBtn(tab, idx)).join("")}
              </div>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100">
                <i class="bi bi-list text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div id="mobile-menu" class="md:hidden hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50" id="mobile-tabs">
            ${tabs.map((tab, idx) => renderMobileTabBtn(tab, idx)).join("")}
          </div>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div class="px-4 py-6 sm:px-0" id="tab-content">
          ${renderCurrentTabContent()}
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center space-x-2 mb-4 md:mb-0">
              <i class="bi bi-music-note-beamed text-purple-600"></i>
              <span class="text-gray-600">© 2025 ${config.appName}. Built for worship.</span>
            </div>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-purple-600">
                <i class="bi bi-github text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-purple-600">
                <i class="bi bi-twitter text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-purple-600">
                <i class="bi bi-envelope text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

// Render desktop tab button
function renderDesktopTabBtn(tab, idx) {
  const isActive = idx === selectedTabIdx;
  const activeClass = isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100";
  const icon = tab.biIcon ? `<i class="bi ${tab.biIcon}"></i>` : "";
  
  return `
    <button id="tab-${idx}" class="nav-tab ${activeClass} px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors" data-tab-idx="${idx}">
      ${icon}
      <span>${tab.name}</span>
    </button>
  `;
}

// Render mobile tab button
function renderMobileTabBtn(tab, idx) {
  const isActive = idx === selectedTabIdx;
  const activeClass = isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100";
  const icon = tab.biIcon ? `<i class="bi ${tab.biIcon}"></i>` : "";
  
  return `
    <button id="mobile-tab-${idx}" class="mobile-nav-tab ${activeClass} block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center space-x-2 transition-colors" data-tab-idx="${idx}">
      ${icon}
      <span>${tab.name}</span>
    </button>
  `;
}

// Render current tab content
function renderCurrentTabContent() {
  const currentTab = tabs[selectedTabIdx];
  if (!currentTab) return "<div>No tab selected</div>";

  console.log("[DEBUG] Rendering content for tab:", currentTab.name);

  // Check for custom tab renderers first
  if (currentTab.name === "Home" && window.renderHomeTab) {
    return window.renderHomeTab(currentTab);
  }
  if (currentTab.name === "Songs" && window.renderSongsTab) {
    return window.renderSongsTab(currentTab);
  }
  if (currentTab.name === "Hymns" && window.renderHymnsTab) {
    return window.renderHymnsTab(currentTab);
  }
  if (currentTab.name === "Metronome" && window.renderMetronomeTab) {
    return window.renderMetronomeTab(currentTab);
  }
  if (currentTab.name === "Drummer" && window.renderDrummerTab) {    // ADD THIS
    return window.renderDrummerTab(currentTab);                       // ADD THIS
  }                                                                    // ADD THIS
  if (currentTab.name === "About" && window.renderAboutTab) {
    return window.renderAboutTab(currentTab);
  }
  if (currentTab.name === "Contact" && window.renderContactTab) {
    return window.renderContactTab(currentTab);
  }

  // Default tab content based on tab configuration
  return renderDefaultTabContent(currentTab);
}

// Render default tab content when no custom renderer exists
function renderDefaultTabContent(tab) {
  const content = Array.isArray(tab.content) ? tab.content : ["Content coming soon..."];
  
  return `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <i class="bi ${tab.biIcon || 'bi-circle'} text-6xl text-purple-600 mb-4"></i>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">${tab.name}</h1>
        <div class="max-w-2xl mx-auto">
          ${content.map(item => `<p class="text-gray-600 mb-2">${item}</p>`).join('')}
        </div>
      </div>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <i class="bi bi-info-circle text-yellow-600 mr-2"></i>
        <span class="text-yellow-800">This tab is ready for custom implementation!</span>
        <br>
        <small class="text-yellow-600">Create a custom renderer function: <code>window.render${tab.name}Tab</code></small>
      </div>
    </div>
  `;
}

// Set up event listeners
function setupEventListeners() {
  console.log("[DEBUG] Setting up event listeners");
  
  // Mobile menu toggle
  setupMobileMenuToggle();
  
  // Tab click handlers
  setupTabClickHandlers();
  
  // Window resize handler for mobile menu
  window.addEventListener("resize", handleWindowResize);
}

// Mobile menu toggle functionality
function setupMobileMenuToggle() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden");
      if (isHidden) {
        mobileMenu.classList.remove("hidden");
        mobileMenuButton.innerHTML = '<i class="bi bi-x text-xl"></i>';
      } else {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.innerHTML = '<i class="bi bi-list text-xl"></i>';
      }
    });
  }
}

// Tab click handlers
function setupTabClickHandlers() {
  // Desktop tabs
  const desktopTabs = document.getElementById("desktop-tabs");
  if (desktopTabs) {
    desktopTabs.addEventListener("click", handleTabClick);
  }
  
  // Mobile tabs
  const mobileTabs = document.getElementById("mobile-tabs");
  if (mobileTabs) {
    mobileTabs.addEventListener("click", handleTabClick);
  }
}

// Handle tab click events
function handleTabClick(event) {
  const button = event.target.closest("[data-tab-idx]");
  if (!button) return;
  
  const idx = parseInt(button.getAttribute("data-tab-idx"), 10);
  if (isNaN(idx) || idx < 0 || idx >= tabs.length) return;
  
  console.log("[DEBUG] Tab clicked:", tabs[idx].name, "index:", idx);
  
  // Update selected tab
  selectedTabIdx = idx;
  localStorage.setItem("selectedTabIdx", selectedTabIdx);
  
  // Hide mobile menu if open
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.add("hidden");
    if (mobileMenuButton) {
      mobileMenuButton.innerHTML = '<i class="bi bi-list text-xl"></i>';
    }
  }
  
  // Re-render the app with new tab
  renderAppUI();
  setupEventListeners();
  
  // Load tab-specific scripts if needed
  loadTabSpecificAssets(tabs[idx]);
  
  // Initialize tab-specific functionality
  initializeTabSpecificFeatures(tabs[idx]);
}

// Load tab-specific CSS and JS files
function loadTabSpecificAssets(tab) {
  if (!tab) return;
  
  // Load tab-specific CSS
  if (tab.cssFile) {
    loadCSS(tab.cssFile);
  }
  
  // Load tab-specific JS
  if (tab.jsFile) {
    loadJS(tab.jsFile);
  }
}

// Initialize tab-specific features
function initializeTabSpecificFeatures(tab) {
  if (!tab) return;
  
  console.log("[DEBUG] Initializing features for tab:", tab.name);
  
  // Initialize specific tab features
  switch (tab.name) {
    case 'About':
      if (typeof window.initializeAboutTab === 'function') {
        window.initializeAboutTab();
      }
      break;
    // Add other tab initializations as needed
  }
}

// Utility function to load CSS files
function loadCSS(href) {
  const existingLink = document.querySelector(`link[href="${href}"]`);
  if (existingLink) return; // Already loaded
  
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// Utility function to load JS files
function loadJS(src) {
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) return; // Already loaded
  
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => console.log(`[DEBUG] Loaded script: ${src}`);
  script.onerror = () => console.warn(`[DEBUG] Failed to load script: ${src}`);
  document.head.appendChild(script);
}

// Handle window resize for mobile menu
function handleWindowResize() {
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  
  if (window.innerWidth >= 768) { // md breakpoint
    if (mobileMenu) mobileMenu.classList.add("hidden");
    if (mobileMenuButton) {
      mobileMenuButton.innerHTML = '<i class="bi bi-list text-xl"></i>';
    }
  }
}

// Make functions globally accessible for cross-script calls
window.renderAppUI = renderAppUI;
window.tabs = tabs;
window.selectedTabIdx = selectedTabIdx;

// Function to programmatically switch tabs
window.switchToTab = function(tabName) {
  const tabIndex = tabs.findIndex(tab => 
    tab.name.toLowerCase() === tabName.toLowerCase()
  );
  
  if (tabIndex !== -1) {
    selectedTabIdx = tabIndex;
    localStorage.setItem("selectedTabIdx", selectedTabIdx);
    renderAppUI();
    setupEventListeners();
    return true;
  }
  
  console.warn(`[DEBUG] Tab '${tabName}' not found`);
  return false;
};

// Function to get current tab information
window.getCurrentTab = function() {
  return tabs[selectedTabIdx] || null;
};

// Function to add new tabs dynamically (for future extensibility)
window.addTab = function(newTab) {
  if (!newTab || !newTab.name) {
    console.error("[DEBUG] Invalid tab object");
    return false;
  }
  
  tabs.push(newTab);
  window.tabs = tabs;
  console.log("[DEBUG] Added new tab:", newTab.name);
  return true;
};

console.log("[DEBUG] Scripts.js initialization complete");