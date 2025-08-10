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
    'js/playlist-updater.js'
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
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.log('[PWA] Service Worker registration failed:', error);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Wait for DOM to be ready before showing install button
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    showInstallButton();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      showInstallButton();
    });
  }
});

function showInstallButton() {
  // Ensure document.body exists
  if (!document.body) {
    console.warn('[PWA] Document body not ready, retrying...');
    setTimeout(showInstallButton, 100);
    return;
  }
  
  console.log('[PWA] App can be installed');
  
  let installBtn = document.getElementById('pwa-install-btn');
  if (!installBtn) {
    installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'btn btn-primary btn-sm fixed bottom-4 right-4 z-50';
    installBtn.innerHTML = '<i class="bi bi-download mr-2"></i>Install App';
    installBtn.onclick = installApp;
    
    // Safely append to body
    try {
      document.body.appendChild(installBtn);
      console.log('[PWA] Install button added successfully');
    } catch (error) {
      console.error('[PWA] Failed to add install button:', error);
      return;
    }
  }
  installBtn.style.display = 'block';
}

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredPrompt = null;
      hideInstallButton();
    });
  }
}

function hideInstallButton() {
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
}

// Handle successful app installation
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App was installed successfully');
  deferredPrompt = null;
  hideInstallButton();
});

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
