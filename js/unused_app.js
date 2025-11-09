/**
 * Main Application Entry Point for ChoristerCorner
 * This file loads the core scripts and initializes the application
 */

console.log("[DEBUG] App.js entry point loaded");

// Load all the tab-specific modules
function loadTabModules() {
  const modules = [
    'js/lyrics-utils.js',
    'js/meta-tags.js',          // Add this line
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
  
  modules.forEach(module => {
    const script = document.createElement('script');
    script.src = module;
    script.onload = () => console.log(`[DEBUG] Loaded module: ${module}`);
    script.onerror = () => console.warn(`[DEBUG] Failed to load module: ${module}`);
    document.head.appendChild(script);
  });
}

// Load the main scripts
function loadMainScript() {
  const script = document.createElement('script');
  script.src = 'js/scipts.js';
  script.onload = () => console.log("[DEBUG] Main scripts loaded");
  script.onerror = () => console.error("[DEBUG] Failed to load main scripts");
  document.head.appendChild(script);
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
    
    // Wait for songs data to load, then navigate to song
    const checkSongsLoaded = setInterval(() => {
      if (window.songsData && window.songsData.allSongs && window.songsData.allSongs.length > 0) {
        clearInterval(checkSongsLoaded);
        
        // Switch to Songs tab
        window.selectedTabIdx = 1; // Songs tab index
        renderAppUI();
        
        // Wait for tab to render, then view song details
        setTimeout(() => {
          if (window.viewSongDetails) {
            console.log('[DEBUG] Navigating to song:', songId);
            window.viewSongDetails(parseInt(songId));
          } else {
            console.error('[DEBUG] viewSongDetails function not available');
          }
        }, 500);
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
    
    // Wait for hymns data to load, then navigate to hymn
    const checkHymnsLoaded = setInterval(() => {
      if (window.hymnsData && window.hymnsData.allHymns && window.hymnsData.allHymns.length > 0) {
        clearInterval(checkHymnsLoaded);
        
        // Switch to Hymns tab
        window.selectedTabIdx = 2; // Hymns tab index
        renderAppUI();
        
        // Wait for tab to render, then view hymn details
        setTimeout(() => {
          if (window.viewHymnDetails) {
            console.log('[DEBUG] Navigating to hymn:', hymnId);
            window.viewHymnDetails(parseInt(hymnId));
          } else {
            console.error('[DEBUG] viewHymnDetails function not available');
          }
        }, 500);
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkHymnsLoaded), 10000);
    return true;
  }
  
  return false;
}

/**
 * Initialize the application
 */
async function initializeApp() {
  console.log("[DEBUG] Initializing ChoristerCorner app...");

  try {
    // Check if we're in a service worker context
    if (!('serviceWorker' in navigator)) {
      console.warn("[DEBUG] Service Workers not supported");
    }

    // Load all tab modules
    console.log("[DEBUG] Loading tab modules...");
    loadTabModules();

    // Wait for modules to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if URL has parameters for direct navigation
    const hasUrlParams = handleURLParameters();
    
    if (!hasUrlParams) {
      // No URL params, render normally
      console.log("[DEBUG] Rendering main app UI...");
      renderAppUI();
    }

    // Set up event listeners
    console.log("[DEBUG] Setting up event listeners...");
    setupEventListeners();

    console.log("[DEBUG] App initialization complete");
  } catch (error) {
    console.error("[DEBUG] Error during app initialization:", error);
    document.getElementById("app-root").innerHTML = `
      <div class="flex items-center justify-center min-h-screen bg-red-50">
        <div class="text-center p-8">
          <i class="bi bi-exclamation-triangle text-6xl text-red-600 mb-4"></i>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Application Error</h1>
          <p class="text-gray-700 mb-4">Failed to initialize the application. Please try refreshing the page.</p>
          <button onclick="location.reload()" class="btn btn-primary">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  let refreshing = false;
  
  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log('[PWA] Service worker updated to:', event.data.version);
      showUpdateNotification();
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
  
  // Handle button clicks
  document.getElementById('update-now').onclick = () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    notification.remove();
  };
  
  document.getElementById('update-later').onclick = () => {
    notification.remove();
  };
  
  document.getElementById('close-update').onclick = () => {
    notification.remove();
  };
  
  // Auto-hide after 30 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 30000);
}

// Show when app is ready for offline use
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
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('[PWA] App is online');
  showOnlineStatus();
});

window.addEventListener('offline', () => {
  console.log('[PWA] App is offline');
  showOfflineStatus();
});

function showOnlineStatus() {
  // Remove offline indicator if present
  const offlineIndicator = document.getElementById('offline-indicator');
  if (offlineIndicator) {
    offlineIndicator.remove();
  }
}

function showOfflineStatus() {
  // Ensure document.body exists
  if (!document.body) {
    setTimeout(showOfflineStatus, 100);
    return;
  }
  
  // Show offline indicator
  let offlineIndicator = document.getElementById('offline-indicator');
  if (!offlineIndicator) {
    offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50';
    offlineIndicator.innerHTML = '<i class="bi bi-wifi-off mr-2"></i>You are offline - Some features may be limited';
    
    try {
      document.body.appendChild(offlineIndicator);
    } catch (error) {
      console.error('[PWA] Failed to add offline indicator:', error);
    }
  }
}
