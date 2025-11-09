console.log("[DEBUG] Page loaded (scripts.js)");

// --- Ensure all required variables are defined ---
let tabs = [];
let appRoot = document.getElementById("app-root") || document.body;
let config = { appName: "ChoristerCorner" };
let selectedTabIdx = 0;

// --- Load all utility modules first ---
function loadUtilityModules() {
  const modules = [
    'js/lyrics-utils.js',
    'js/meta-tags.js',
    'js/shared-player.js',
    'js/home.js',
    'js/songs.js',
    'js/hymns.js',
    'js/metronome.js',
    'js/drummer.js',
    'js/about.js',
    'js/contact.js',
    'js/playlist-updater.js',
    'js/extras.js'
  ];
  
  return Promise.all(modules.map(module => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = module;
      script.onload = () => {
        console.log(`[DEBUG] Loaded module: ${module}`);
        resolve();
      };
      script.onerror = () => {
        console.warn(`[DEBUG] Failed to load module: ${module}`);
        resolve(); // Don't reject, continue with other modules
      };
      document.head.appendChild(script);
    });
  }));
}

// --- DYNAMIC RENDERING: Always use tabs from app.json ---
fetch("json/app.json")
  .then((response) => response.json())
  .then(async (appData) => {
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
    
    // Load utility modules
    console.log("[DEBUG] Loading utility modules...");
    await loadUtilityModules();
    
    // Wait a bit for modules to initialize
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
async function initializeApp() {
  console.log("[DEBUG] Initializing ChoristerCorner app");
  
  // Check for URL parameters first (for deep linking)
  const hasUrlParams = handleURLParameters();
  
  if (!hasUrlParams) {
    // No URL params, restore last selected tab if valid, else default to 0 (Home)
    let idx = parseInt(localStorage.getItem("selectedTabIdx"), 10);
    if (isNaN(idx) || idx < 0 || idx >= tabs.length) {
      idx = 0;
    }
    selectedTabIdx = idx;
    window.selectedTabIdx = idx;
    localStorage.setItem("selectedTabIdx", selectedTabIdx);
    
    await renderAppUI();
  }
  
  setupEventListeners();
  setupBrowserNavigation();
  setupServiceWorker();
}

/**
 * Check URL parameters and navigate to specific content
 */
function handleURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for song parameter
  const songId = urlParams.get('song');
  if (songId) {
    console.log('[DEBUG] URL contains song parameter:', songId);
    
    // Switch to Songs tab
    selectedTabIdx = 1; // Songs tab index
    window.selectedTabIdx = 1;
    
    // Wait for songs data to load, then navigate to song
    const checkSongsLoaded = setInterval(() => {
      if (window.songsData && window.songsData.allSongs && window.songsData.allSongs.length > 0) {
        clearInterval(checkSongsLoaded);
        
        renderAppUI().then(() => {
          // Wait for tab to render, then view song details
          setTimeout(() => {
            if (window.viewSongLyrics) {
              console.log('[DEBUG] Navigating to song:', songId);
              window.viewSongLyrics(parseInt(songId));
            } else {
              console.error('[DEBUG] viewSongLyrics function not available');
            }
          }, 500);
        });
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkSongsLoaded), 10000);
    return true;
  }
  
  // Check for hymn parameter
  const hymnId = urlParams.get('hymn');
  if (hymnId) {
    console.log('[DEBUG] URL contains hymn parameter:', hymnId);
    
    // Switch to Hymns tab
    selectedTabIdx = 2; // Hymns tab index
    window.selectedTabIdx = 2;
    
    // Wait for hymns data to load, then navigate to hymn
    const checkHymnsLoaded = setInterval(() => {
      if (window.hymnsData && window.hymnsData.allHymns && window.hymnsData.allHymns.length > 0) {
        clearInterval(checkHymnsLoaded);
        
        renderAppUI().then(() => {
          // Wait for tab to render, then view hymn details
          setTimeout(() => {
            if (window.viewHymnDetails) {
              console.log('[DEBUG] Navigating to hymn:', hymnId);
              window.viewHymnDetails(parseInt(hymnId));
            } else {
              console.error('[DEBUG] viewHymnDetails function not available');
            }
          }, 500);
        });
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkHymnsLoaded), 10000);
    return true;
  }
  
  return false;
}

/**
 * Setup browser navigation (back/forward buttons)
 */
function setupBrowserNavigation() {
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    console.log('[DEBUG] Browser navigation detected', event.state);
    
    if (event.state && event.state.song) {
      // Navigate to song
      selectedTabIdx = 1;
      window.selectedTabIdx = 1;
      renderAppUI().then(() => {
        setTimeout(() => {
          if (window.viewSongLyrics) {
            window.viewSongLyrics(event.state.song);
          }
        }, 300);
      });
    } else if (event.state && event.state.hymn) {
      // Navigate to hymn
      selectedTabIdx = 2;
      window.selectedTabIdx = 2;
      renderAppUI().then(() => {
        setTimeout(() => {
          if (window.viewHymnDetails) {
            window.viewHymnDetails(event.state.hymn);
          }
        }, 300);
      });
    } else {
      // Navigate to home or check URL params
      const hasParams = handleURLParameters();
      if (!hasParams) {
        renderAppUI();
      }
    }
  });
}

/**
 * Setup Service Worker for PWA
 */
function setupServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[DEBUG] Service Workers not supported');
    return;
  }

  let refreshing = false;
  
  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log('[PWA] Service worker updated to:', event.data.version);
    }
  });
  
  // Handle page refresh when service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('[PWA] Reloading page for service worker update');
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] SW registered: ', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[PWA] New service worker installing');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] New content available');
                showUpdateAvailableNotification(registration);
              } else {
                console.log('[PWA] Content cached for offline use');
                showOfflineReadyNotification();
              }
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log('[PWA] SW registration failed: ', registrationError);
      });
  });

  // Handle online/offline status
  window.addEventListener('online', showOnlineStatus);
  window.addEventListener('offline', showOfflineStatus);
}

// Show update available notification
function showUpdateAvailableNotification(registration) {
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <i class="bi bi-arrow-clockwise text-xl mt-1"></i>
      <div class="flex-1">
        <h3 class="font-semibold mb-1">Update Available!</h3>
        <p class="text-sm opacity-90 mb-3">A new version of ChoristerCorner is ready.</p>
        <div class="flex gap-2">
          <button id="update-now" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
            Update Now
          </button>
          <button id="update-later" class="text-white text-sm underline hover:no-underline">
            Later
          </button>
        </div>
      </div>
      <button id="close-update" class="text-white hover:text-gray-200">
        <i class="bi bi-x text-xl"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  document.getElementById('update-now').onclick = () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    notification.remove();
  };
  
  document.getElementById('update-later').onclick = () => notification.remove();
  document.getElementById('close-update').onclick = () => notification.remove();
  
  setTimeout(() => notification.parentNode && notification.remove(), 30000);
}

function showOfflineReadyNotification() {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="bi bi-wifi-off text-xl"></i>
      <div class="flex-1">
        <h3 class="font-semibold mb-1">Ready for Offline!</h3>
        <p class="text-sm opacity-90">ChoristerCorner is now available offline.</p>
      </div>
      <button onclick="this.parentNode.parentNode.remove()" class="text-white hover:text-gray-200">
        <i class="bi bi-x text-xl"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.parentNode && notification.remove(), 5000);
}

function showOnlineStatus() {
  const offlineIndicator = document.getElementById('offline-indicator');
  if (offlineIndicator) offlineIndicator.remove();
}

function showOfflineStatus() {
  if (!document.body) {
    setTimeout(showOfflineStatus, 100);
    return;
  }
  
  let offlineIndicator = document.getElementById('offline-indicator');
  if (!offlineIndicator) {
    offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50';
    offlineIndicator.innerHTML = '<i class="bi bi-wifi-off mr-2"></i>You are offline - Some features may be limited';
    document.body.appendChild(offlineIndicator);
  }
}

// Initialize the application
async function initializeApp() {
  console.log("[DEBUG] Initializing ChoristerCorner app");
  
  // Check for URL parameters first (for deep linking)
  const hasUrlParams = handleURLParameters();
  
  if (!hasUrlParams) {
    // No URL params, restore last selected tab if valid, else default to 0 (Home)
    let idx = parseInt(localStorage.getItem("selectedTabIdx"), 10);
    if (isNaN(idx) || idx < 0 || idx >= tabs.length) {
      idx = 0;
    }
    selectedTabIdx = idx;
    window.selectedTabIdx = idx;
    localStorage.setItem("selectedTabIdx", selectedTabIdx);
    
    await renderAppUI();
  }
  
  setupEventListeners();
  setupBrowserNavigation();
}

// Check URL parameters and navigate to specific content
function handleURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for song parameter
  const songId = urlParams.get('song');
  if (songId) {
    console.log('[DEBUG] URL contains song parameter:', songId);
    
    // Switch to Songs tab
    selectedTabIdx = 1; // Songs tab index
    window.selectedTabIdx = 1;
    
    // Wait for songs data to load, then navigate to song
    const checkSongsLoaded = setInterval(() => {
      if (window.songsData && window.songsData.allSongs && window.songsData.allSongs.length > 0) {
        clearInterval(checkSongsLoaded);
        
        renderAppUI().then(() => {
          // Wait for tab to render, then view song details
          setTimeout(() => {
            if (window.viewSongLyrics) {
              console.log('[DEBUG] Navigating to song:', songId);
              window.viewSongLyrics(parseInt(songId));
            } else {
              console.error('[DEBUG] viewSongLyrics function not available');
            }
          }, 500);
        });
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkSongsLoaded), 10000);
    return true;
  }
  
  // Check for hymn parameter
  const hymnId = urlParams.get('hymn');
  if (hymnId) {
    console.log('[DEBUG] URL contains hymn parameter:', hymnId);
    
    // Switch to Hymns tab
    selectedTabIdx = 2; // Hymns tab index
    window.selectedTabIdx = 2;
    
    // Wait for hymns data to load, then navigate to hymn
    const checkHymnsLoaded = setInterval(() => {
      if (window.hymnsData && window.hymnsData.allHymns && window.hymnsData.allHymns.length > 0) {
        clearInterval(checkHymnsLoaded);
        
        renderAppUI().then(() => {
          // Wait for tab to render, then view hymn details
          setTimeout(() => {
            if (window.viewHymnDetails) {
              console.log('[DEBUG] Navigating to hymn:', hymnId);
              window.viewHymnDetails(parseInt(hymnId));
            } else {
              console.error('[DEBUG] viewHymnDetails function not available');
            }
          }, 500);
        });
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkHymnsLoaded), 10000);
    return true;
  }
  
  return false;
}

/**
 * Setup browser navigation (back/forward buttons)
 */
function setupBrowserNavigation() {
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    console.log('[DEBUG] Browser navigation detected', event.state);
    
    if (event.state && event.state.song) {
      // Navigate to song
      selectedTabIdx = 1;
      window.selectedTabIdx = 1;
      renderAppUI().then(() => {
        setTimeout(() => {
          if (window.viewSongLyrics) {
            window.viewSongLyrics(event.state.song);
          }
        }, 300);
      });
    } else if (event.state && event.state.hymn) {
      // Navigate to hymn
      selectedTabIdx = 2;
      window.selectedTabIdx = 2;
      renderAppUI().then(() => {
        setTimeout(() => {
          if (window.viewHymnDetails) {
            window.viewHymnDetails(event.state.hymn);
          }
        }, 300);
      });
    } else {
      // Navigate to home or check URL params
      const hasParams = handleURLParameters();
      if (!hasParams) {
        renderAppUI();
      }
    }
  });
}

// Main UI rendering function
async function renderAppUI() {
  // Always prioritize global selectedTabIdx if it exists and is different
  if (window.selectedTabIdx !== undefined) {
    if (window.selectedTabIdx !== selectedTabIdx) {
      console.log('[DEBUG] Syncing selectedTabIdx from global:', window.selectedTabIdx);
      selectedTabIdx = window.selectedTabIdx;
      localStorage.setItem("selectedTabIdx", selectedTabIdx.toString());
    }
  }
  
  console.log(`[DEBUG] renderAppUI`, { selectedTabIdx, tabsCount: tabs.length });
  
  if (!config || !config.appName) {
    throw new Error("config must be initialized with appName before calling renderAppUI()");
  }

  // Await tab content rendering
  const tabContent = await renderCurrentTabContent();

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
          ${tabContent}
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
async function renderCurrentTabContent() {
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
  if (currentTab.name === "Extras" && window.renderExtrasTab) {
    const result = await window.renderExtrasTab(currentTab);
    return result;
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
  
  // Add tab navigation event listeners
  const navTabs = document.querySelectorAll('.nav-tab, .mobile-nav-tab');
  navTabs.forEach((button) => {
    const tabIdx = parseInt(button.dataset.tabIdx);
    const tabName = button.textContent.trim();
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log(`Clicked ${tabName} (switching to index ${tabIdx})`);
      
      // Update selected tab
      updateSelectedTab(tabIdx);
      
      // Render the app
      renderAppUI();
    });
  });
  
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
async function handleTabClick(event) {
  const button = event.target.closest("[data-tab-idx]");
  if (!button) return;
  const idx = parseInt(button.getAttribute("data-tab-idx"), 10);
  if (isNaN(idx) || idx < 0 || idx >= tabs.length) return;
  
  updateSelectedTab(idx);
  await renderAppUI();           // ✅ Now it waits for rendering to complete
  setupEventListeners();        // ✅ This runs after UI is fully rendered
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
  console.log("[DEBUG] Initializing features for tab:", tab.name);
  
  // Initialize specific tab features
  switch (tab.name) {
    case 'About':
      if (typeof window.initializeAboutTab === 'function') {
        window.initializeAboutTab();
      }
      break;
    case 'Extras':
      if (typeof window.initializeExtrasTab === 'function') {
        window.initializeExtrasTab();
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
    updateSelectedTab(tabIndex);
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

// Update selected tab index and sync with global
function updateSelectedTab(newIdx) {
  selectedTabIdx = newIdx;
  window.selectedTabIdx = newIdx;
  localStorage.setItem("selectedTabIdx", newIdx.toString());
  console.log('[DEBUG] Updated selectedTabIdx to:', newIdx, 'for tab:', tabs[newIdx]?.name);
}

// Add this function to scipts.js
function applyExtrasTabStyling() {
  // Force apply CSS to extras buttons after tab switch
  const extrasButtons = document.querySelectorAll('.extras-card a[href]');
  
  if (extrasButtons.length > 0) {
    console.log('[DEBUG] Applying extras button styling to', extrasButtons.length, 'buttons');
    
    extrasButtons.forEach(button => {
      // Force CSS classes to be recognized
      button.classList.add('extras-tool-btn');
      
      // Ensure the button is properly styled
      const computedStyle = window.getComputedStyle(button);
      if (computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || 
          computedStyle.backgroundColor === 'transparent') {
        console.log('[DEBUG] Forcing button styling');
        // Apply inline styles as backup
        Object.assign(button.style, {
          backgroundColor: '#7c3aed',
          color: '#ffffff',
          border: 'none',
          opacity: '1'
        });
      }
    });
  }
}

// Update your setupEventListeners function
function setupEventListeners() {
  console.log("[DEBUG] Setting up event listeners");
  
  // Add tab navigation event listeners
  const navTabs = document.querySelectorAll('.nav-tab, .mobile-nav-tab');
  navTabs.forEach((button) => {
    const tabIdx = parseInt(button.dataset.tabIdx);
    const tabName = button.textContent.trim();
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log(`Clicked ${tabName} (switching to index ${tabIdx})`);
      
      // Update selected tab
      updateSelectedTab(tabIdx);
      
      // Render the app
      renderAppUI();
    });
  });
  
  // Mobile menu toggle
  setupMobileMenuToggle();
  
  // Tab click handlers
  setupTabClickHandlers();
  
  // Window resize handler for mobile menu
  window.addEventListener("resize", handleWindowResize);

  // Apply extras styling after DOM update
  setTimeout(applyExtrasTabStyling, 100);
}

console.log("[DEBUG] Scripts.js initialization complete");