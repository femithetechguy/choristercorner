/**
 * Drummer Tab Module for ChoristerCorner
 * Handles drum machine functionality and rendering
 */

console.log('[DEBUG] Loading drummer.js at', new Date().toISOString());

// Module state
const drummerState = {
  isLoaded: false,
  embedUrl: 'https://4four.io/drummer'
};

// Main render function
window.renderDrummerTab = function(tab) {
  console.log('[DEBUG] renderDrummerTab called with:', tab);
  
  return `
    <div class="drummer-wrapper">
      <!-- Header Section -->
      <div class="drummer-header">
        <h1>
          <i class="bi bi-disc header-icon"></i>
          Drum Machine
        </h1>
        <p>
          Practice with professional drum patterns and rhythms. 
          Perfect for worship teams, choir practice, and personal rhythm training.
        </p>
      </div>

      <!-- Drummer Embed -->
      <div class="drummer-embed-container">
        <div class="drummer-iframe-wrapper">
          <div class="drummer-loading">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <iframe 
            id="drummer-iframe"
            src="${drummerState.embedUrl}"
            allow="autoplay"
            loading="lazy"
            title="Professional Drum Machine"
            onload="window.onDrummerLoad && window.onDrummerLoad()"
            onerror="window.onDrummerError && window.onDrummerError()"
          ></iframe>
        </div>
      </div>

      <!-- Instructions -->
      <div class="drummer-instructions">
        <h2>
          <i class="bi bi-info-circle"></i>
          How to Use
        </h2>
        <ul>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Select from various drum patterns and styles</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Adjust tempo to match your worship songs</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Mix different drum sounds for custom patterns</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Use for rhythm practice and timing exercises</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Great for choir warm-ups and practice sessions</span>
          </li>
        </ul>
      </div>

      <!-- Features Grid -->
      <div class="drummer-features">
        <div class="feature-card">
          <i class="bi bi-music-note-beamed"></i>
          <h3>Multiple Patterns</h3>
          <p>Various drum patterns for different worship styles</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-sliders"></i>
          <h3>Customizable</h3>
          <p>Adjust tempo, volume, and pattern complexity</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-layers"></i>
          <h3>Layer Sounds</h3>
          <p>Combine different drum elements for rich rhythms</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-collection-play"></i>
          <h3>Style Library</h3>
          <p>Pre-set patterns for worship, gospel, and contemporary</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-arrow-repeat"></i>
          <h3>Loop Control</h3>
          <p>Seamless looping for continuous practice</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-phone"></i>
          <h3>Mobile Ready</h3>
          <p>Practice anywhere on any device</p>
        </div>
      </div>

      <!-- Common Patterns -->
      <div class="drummer-instructions">
        <h2>
          <i class="bi bi-list-ul"></i>
          Common Worship Drum Patterns
        </h2>
        <ul>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>4/4 Basic:</strong> Standard worship pattern</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>6/8 Ballad:</strong> For slower, emotional songs</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>Gospel Shuffle:</strong> Traditional gospel rhythm</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>Contemporary Rock:</strong> Modern worship style</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>Latin Groove:</strong> For celebration songs</span>
          </li>
        </ul>
      </div>
    </div>
  `;
};

// Handle drummer iframe load
window.onDrummerLoad = function() {
  console.log('[DEBUG] Drummer iframe loaded successfully');
  drummerState.isLoaded = true;
  
  // Hide loading indicator
  const loadingEl = document.querySelector('.drummer-loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
};

// Handle drummer iframe error
window.onDrummerError = function() {
  console.error('[DEBUG] Failed to load drummer iframe');
  
  const iframeWrapper = document.querySelector('.drummer-iframe-wrapper');
  if (iframeWrapper) {
    iframeWrapper.innerHTML = `
      <div class="drummer-loading">
        <div class="text-center">
          <i class="bi bi-exclamation-circle text-3xl text-red-500 mb-3"></i>
          <p class="text-gray-600">Unable to load drum machine. Please check your connection.</p>
          <button class="btn btn-primary mt-4" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise"></i> Retry
          </button>
        </div>
      </div>
    `;
  }
};

console.log('[DEBUG] Drummer module loaded, renderDrummerTab available:', typeof window.renderDrummerTab);