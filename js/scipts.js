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
    'js/card-actions.js',
    'js/view-toggle.js',
    'js/content-renderer.js',  // Add this
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
      window.tabs = tabs;
    }
    console.log("[DEBUG] Tabs loaded:", tabs);
    
    // Load utility modules
    console.log("[DEBUG] Loading utility modules...");
    await loadUtilityModules();
    
    // Wait a bit for modules to initialize
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // **CHECK AND MANUALLY INITIALIZE MODULES**
    console.log("[DEBUG] Checking loaded modules:");
    console.log("  - songsData exists:", !!window.songsData);
    console.log("  - hymnsData exists:", !!window.hymnsData);
    console.log("  - initSongsTab exists:", typeof window.initSongsTab);
    console.log("  - initHymnsTab exists:", typeof window.initHymnsTab);
    
    // **FORCE INITIALIZATION if init functions exist**
    if (typeof window.initSongsTab === 'function') {
      console.log("[DEBUG] Manually calling initSongsTab()");
      window.initSongsTab();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (typeof window.initHymnsTab === 'function') {
      console.log("[DEBUG] Manually calling initHymnsTab()");
      window.initHymnsTab();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // **CHECK DATA AFTER INITIALIZATION**
    console.log("[DEBUG] After initialization:");
    console.log("  - songsData.isLoaded:", window.songsData?.isLoaded);
    console.log("  - songsData.allSongs.length:", window.songsData?.allSongs?.length);
    console.log("  - hymnsData.isLoaded:", window.hymnsData?.isLoaded);
    console.log("  - hymnsData.allHymns.length:", window.hymnsData?.allHymns?.length);
    
    window.renderAppUI = renderAppUI;
    
    // Initialize the app
    initializeApp();
  })
  .catch((err) => {
    console.error("Failed to load app.json:", err);
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
    
    selectedTabIdx = 1;
    window.selectedTabIdx = 1;
    
    const checkSongsLoaded = setInterval(() => {
      if (window.songsData && window.songsData.allSongs && window.songsData.allSongs.length > 0) {
        clearInterval(checkSongsLoaded);
        
        renderAppUI().then(() => {
          setTimeout(() => {
            if (window.viewSongLyrics) {
              console.log('[DEBUG] Navigating to song:', songId);
              window.viewSongLyrics(parseInt(songId));
            }
          }, 500);
        });
      }
    }, 100);
    
    setTimeout(() => clearInterval(checkSongsLoaded), 10000);
    return true;
  }
  
  // Check for hymn parameter
  const hymnId = urlParams.get('hymn');
  if (hymnId) {
    console.log('[DEBUG] URL contains hymn parameter:', hymnId);
    
    selectedTabIdx = 2;
    window.selectedTabIdx = 2;
    
    const checkHymnsLoaded = setInterval(() => {
      if (window.hymnsData && window.hymnsData.allHymns && window.hymnsData.allHymns.length > 0) {
        clearInterval(checkHymnsLoaded);
        
        renderAppUI().then(() => {
          setTimeout(() => {
            if (window.viewHymnDetails) {
              console.log('[DEBUG] Navigating to hymn:', hymnId);
              window.viewHymnDetails(parseInt(hymnId));
            }
          }, 500);
        });
      }
    }, 100);
    
    setTimeout(() => clearInterval(checkHymnsLoaded), 10000);
    return true;
  }
  
  return false;
}

/**
 * Setup browser navigation (back/forward buttons)
 */
function setupBrowserNavigation() {
  window.addEventListener('popstate', (event) => {
    console.log('[DEBUG] Browser navigation detected', event.state);
    
    if (event.state && event.state.song) {
      if (window.viewSongLyrics) {
        window.selectedTabIdx = 1;
        selectedTabIdx = 1;
        renderAppUI().then(() => {
          setTimeout(() => window.viewSongLyrics(event.state.song), 300);
        });
      }
    } else if (event.state && event.state.hymn) {
      if (window.viewHymnDetails) {
        window.selectedTabIdx = 2;
        selectedTabIdx = 2;
        renderAppUI().then(() => {
          setTimeout(() => window.viewHymnDetails(event.state.hymn), 300);
        });
      }
    } else {
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
  
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log('[PWA] Service worker updated to:', event.data.version);
    }
  });
  
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
        
        setInterval(() => registration.update(), 60000);
        
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

// Desktop tab button rendering
function renderDesktopTabBtn(tab, idx) {
  const isActive = idx === selectedTabIdx;
  
  return `
    <button
      class="nav-tab px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-purple-100 text-purple-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
      }"
      onclick="handleTabClick(${idx}); return false;"
      data-tab-idx="${idx}"
      aria-current="${isActive ? 'page' : 'false'}"
    >
      <i class="bi ${tab.icon} mr-1"></i>
      ${tab.name}
    </button>
  `;
}

// Mobile tab button rendering  
function renderMobileTabBtn(tab, idx) {
  const isActive = idx === selectedTabIdx;
  
  return `
    <button
      class="mobile-nav-tab block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? "bg-purple-100 text-purple-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
      }"
      onclick="handleTabClick(${idx}); return false;"
      data-tab-idx="${idx}"
      aria-current="${isActive ? 'page' : 'false'}"
    >
      <i class="bi ${tab.icon} mr-2"></i>
      ${tab.name}
    </button>
  `;
}

/**
 * Handle tab click - single entry point for tab switching
 */
function handleTabClick(idx) {
  console.log(`Clicked ${tabs[idx]?.name} (switching to index ${idx})`);
  
  updateSelectedTab(idx);
  
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
  
  renderAppUI();
}

window.handleTabClick = handleTabClick;

/**
 * Update selected tab
 */
function updateSelectedTab(idx) {
  if (idx < 0 || idx >= tabs.length) {
    console.warn(`[DEBUG] Invalid tab index: ${idx}`);
    return;
  }
  
  const tab = tabs[idx];
  console.log(`[DEBUG] Updated selectedTabIdx to: ${idx} for tab: ${tab.name}`);
  
  selectedTabIdx = idx;
  window.selectedTabIdx = idx;
  localStorage.setItem("selectedTabIdx", idx.toString());
}

/**
 * Navigate to home page
 */
function goToHome() {
  console.log('[DEBUG] Navigating to home');
  
  if (window.closeSharedPlayer) {
    window.closeSharedPlayer();
  }
  
  if (window.songsData) {
    window.songsData.showLyrics = false;
    window.songsData.selectedSong = null;
  }
  if (window.hymnsData) {
    window.hymnsData.showLyrics = false;
    window.hymnsData.selectedHymn = null;
  }
  
  if (window.resetMetaTags) {
    window.resetMetaTags();
  }
  
  const newUrl = window.location.pathname;
  window.history.pushState({}, '', newUrl);
  
  selectedTabIdx = 0;
  window.selectedTabIdx = 0;
  localStorage.setItem("selectedTabIdx", "0");
  
  renderAppUI();
}

window.goToHome = goToHome;

// Main UI rendering function
async function renderAppUI() {
  if (window.selectedTabIdx !== undefined && window.selectedTabIdx !== selectedTabIdx) {
    console.log('[DEBUG] Syncing selectedTabIdx from global:', window.selectedTabIdx);
    selectedTabIdx = window.selectedTabIdx;
    localStorage.setItem("selectedTabIdx", selectedTabIdx.toString());
  }
  
  console.log(`[DEBUG] renderAppUI`, { selectedTabIdx, tabsCount: tabs.length });
  
  if (!config || !config.appName) {
    throw new Error("config must be initialized with appName before calling renderAppUI()");
  }

  const tabContent = await renderCurrentTabContent();

  appRoot.innerHTML = `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            
            <div class="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onclick="goToHome()">
              <div class="flex-shrink-0">
                <i class="bi bi-music-note-beamed text-3xl text-purple-600"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">${config.appName}</h1>
                <p class="text-xs text-gray-500 hidden sm:block">${config.version}</p>
              </div>
            </div>

            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4" id="desktop-tabs">
                ${tabs.map((tab, idx) => renderDesktopTabBtn(tab, idx)).join("")}
              </div>
            </div>

            <div class="md:hidden">
              <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100">
                <i class="bi bi-list text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <div id="mobile-menu" class="md:hidden hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50" id="mobile-tabs">
            ${tabs.map((tab, idx) => renderMobileTabBtn(tab, idx)).join("")}
          </div>
        </div>
      </nav>

      <main class="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div class="px-4 py-6 sm:px-0" id="tab-content">
          ${tabContent}
        </div>
      </main>

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
  
  setupMobileMenu();
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  if (mobileMenuButton) {
    mobileMenuButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
      }
    };
  }
}

// Render current tab content
async function renderCurrentTabContent() {
  const currentTab = tabs[selectedTabIdx];
  if (!currentTab) return "<div>No tab selected</div>";

  console.log("[DEBUG] Rendering content for tab:", currentTab.name);

  if (currentTab.name === "Home" && window.renderHomeTab) return window.renderHomeTab(currentTab);
  if (currentTab.name === "Songs" && window.renderSongsTab) return window.renderSongsTab(currentTab);
  if (currentTab.name === "Hymns" && window.renderHymnsTab) return window.renderHymnsTab(currentTab);
  if (currentTab.name === "Metronome" && window.renderMetronomeTab) return window.renderMetronomeTab(currentTab);
  if (currentTab.name === "Drummer" && window.renderDrummerTab) return window.renderDrummerTab(currentTab);
  if (currentTab.name === "About" && window.renderAboutTab) return window.renderAboutTab(currentTab);
  if (currentTab.name === "Contact" && window.renderContactTab) return window.renderContactTab(currentTab);
  if (currentTab.name === "Extras" && window.renderExtrasTab) return await window.renderExtrasTab(currentTab);

  return renderDefaultTabContent(currentTab);
}

// Render default tab content
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
      </div>
    </div>
  `;
}

console.log("[DEBUG] Scripts.js initialization complete");