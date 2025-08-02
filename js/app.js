/**
 * Main Application Entry Point for ChoristerCorner
 * This file loads the core scripts and initializes the application
 */

console.log("[DEBUG] App.js entry point loaded");

// Load all the tab-specific modules
function loadTabModules() {
  const modules = [
    'js/home.js',
    'js/songs.js', 
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
