/**
 * Metronome Tab Module for ChoristerCorner
 * Handles metronome functionality and rendering
 */

console.log('[DEBUG] Loading metronome.js at', new Date().toISOString());

// Module state
const metronomeState = {
  isLoaded: false,
  embedUrl: 'https://4four.io/embed/metronome/1AvEsAX8AAgUAAA'
};

// Main render function - MUST be in global scope for scipts.js
window.renderMetronomeTab = function(tab) {
  console.log('[DEBUG] renderMetronomeTab called with:', tab);
  
  return `
    <div class="metronome-wrapper">
      <!-- Header Section -->
      <div class="metronome-header">
        <h1>
          <i class="bi bi-clock header-icon"></i>
          Metronome
        </h1>
        <p>
          Keep perfect time with our professional metronome. 
          Ideal for worship practice, choir rehearsals, and personal practice sessions.
        </p>
      </div>

      <!-- Metronome Embed -->
      <div class="metronome-embed-container">
        <div class="metronome-iframe-wrapper">
          <div class="metronome-loading">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <iframe 
            id="metronome-iframe"
            src="${metronomeState.embedUrl}"
            allow="autoplay"
            loading="lazy"
            title="Professional Metronome"
            onload="window.onMetronomeLoad && window.onMetronomeLoad()"
            onerror="window.onMetronomeError && window.onMetronomeError()"
          ></iframe>
        </div>
      </div>

      <!-- Instructions -->
      <div class="metronome-instructions">
        <h2>
          <i class="bi bi-info-circle"></i>
          How to Use
        </h2>
        <ul>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Click the play button to start the metronome</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Adjust the BPM (beats per minute) using the slider or input field</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Choose different time signatures for various worship styles</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Use the tap tempo feature to find the BPM of any song</span>
          </li>
          <li>
            <i class="bi bi-check-circle"></i>
            <span>Adjust volume and accent beats as needed</span>
          </li>
        </ul>
      </div>

      <!-- Features Grid -->
      <div class="metronome-features">
        <div class="feature-card">
          <i class="bi bi-speedometer2"></i>
          <h3>Wide BPM Range</h3>
          <p>From 40 to 300 BPM, perfect for any worship song tempo</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-music-note-list"></i>
          <h3>Time Signatures</h3>
          <p>Support for common time signatures including 4/4, 3/4, 6/8, and more</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-hand-index-thumb"></i>
          <h3>Tap Tempo</h3>
          <p>Tap along to find the tempo of any song instantly</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-volume-up"></i>
          <h3>Accent Beats</h3>
          <p>Emphasize downbeats with customizable accent patterns</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-palette"></i>
          <h3>Visual Feedback</h3>
          <p>Clear visual indicators help you stay on beat</p>
        </div>
        
        <div class="feature-card">
          <i class="bi bi-phone"></i>
          <h3>Mobile Friendly</h3>
          <p>Works perfectly on all devices for practice anywhere</p>
        </div>
      </div>

      <!-- Common Tempos -->
      <div class="metronome-instructions">
        <h2>
          <i class="bi bi-list-ul"></i>
          Common Worship Tempos
        </h2>
        <ul>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>60-70 BPM:</strong> Slow worship, prayer songs</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>70-90 BPM:</strong> Traditional hymns, reflective worship</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>90-110 BPM:</strong> Contemporary worship, moderate tempo</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>110-130 BPM:</strong> Upbeat worship, celebration songs</span>
          </li>
          <li>
            <i class="bi bi-music-note"></i>
            <span><strong>130+ BPM:</strong> Fast praise, energetic worship</span>
          </li>
        </ul>
      </div>
    </div>
  `;
};

// Handle metronome iframe load
window.onMetronomeLoad = function() {
  console.log('[DEBUG] Metronome iframe loaded successfully');
  metronomeState.isLoaded = true;
  
  // Hide loading indicator
  const loadingEl = document.querySelector('.metronome-loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
};

// Handle metronome iframe error
window.onMetronomeError = function() {
  console.error('[DEBUG] Failed to load metronome iframe');
  
  const iframeWrapper = document.querySelector('.metronome-iframe-wrapper');
  if (iframeWrapper) {
    iframeWrapper.innerHTML = `
      <div class="metronome-loading">
        <div class="text-center">
          <i class="bi bi-exclamation-circle text-3xl text-red-500 mb-3"></i>
          <p class="text-gray-600">Unable to load metronome. Please check your connection.</p>
          <button class="btn btn-primary mt-4" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise"></i> Retry
          </button>
        </div>
      </div>
    `;
  }
};

console.log('[DEBUG] Metronome module loaded, renderMetronomeTab available:', typeof window.renderMetronomeTab);

// Is metronome.js loaded?
console.log('renderMetronomeTab exists?', typeof window.renderMetronomeTab);

// Check if the script tag exists
document.querySelector('script[src*="metronome.js"]');