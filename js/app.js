/**
 * Main Application Entry Point for ChoristerCorner
 * This file loads the core scripts and initializes the application
 */

console.log("[DEBUG] App.js entry point loaded");

// Load all the tab-specific modules
function loadTabModules() {
  const modules = [
    'js/shared-player.js',
    'js/home.js',
    'js/songs.js',
    'js/hymns.js',
    'js/metronome.js',
    'js/drummer.js',          // ADD THIS LINE
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

// Initialize the application
function initializeApp() {
  console.log("[DEBUG] Initializing ChoristerCorner application");
  
  // Load tab modules first
  loadTabModules();
  
  // Then load main script after a short delay to ensure modules are loaded
  setTimeout(() => {
    loadMainScript();
  }, 100);
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
