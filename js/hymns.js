// Hymns tab functionality
// This file handles the hymns library management, search, filters, and display

// Hymns data structure
const hymnsData = {
  allHymns: [],
  filteredHymns: [],
  isLoaded: false,
  showLyrics: false,
  selectedHymn: null,
  searchTerm: '',
  categoryFilter: 'all',
  timePeriodFilter: 'all',
  meterFilter: 'all',
  sortBy: 'title', // 'title', 'author', 'year', 'category'
  sortOrder: 'asc',
  currentPlayingHymn: null,
  isAudioPlayerVisible: false,
  isPlayerCollapsed: false,
  urlParametersProcessed: false,
  lastProcessedUrl: ''
};

// Load hymns data from JSON file
async function loadHymnsData() {
  try {
    console.log("[DEBUG] Loading hymns data...");
    const response = await fetch('json/hymns.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("[DEBUG] Hymns data loaded:", data.length, "hymns");
    
    hymnsData.allHymns = data;
    hymnsData.filteredHymns = [...data];
    hymnsData.isLoaded = true;
    
    // Update the hymns display
    updateHymnsDisplay();
    
    // Check for pending hymn URL parameters after data is loaded
    setTimeout(() => {
      checkPendingHymnUrlParameters();
    }, 100);
    
  } catch (error) {
    console.error("[ERROR] Failed to load hymns data:", error);
    
    // Show error message to user
    const container = document.getElementById('hymns-container');
    if (container) {
      container.innerHTML = `
        <div class="card">
          <div class="card-body text-center py-12">
            <i class="bi bi-exclamation-triangle text-6xl text-red-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Failed to load hymns</h3>
            <p class="text-gray-600 mb-4">There was an error loading the hymns library.</p>
            <button onclick="loadHymnsData()" class="btn btn-primary">
              <i class="bi bi-arrow-clockwise mr-2"></i>
              Try Again
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Handle URL parameters for direct hymn links
function handleHymnUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const hymnId = urlParams.get('hymn');
  
  // Only process if there's a hymn ID in the URL and we haven't processed this specific URL yet
  if (!hymnId) {
    console.log("[DEBUG] No hymn ID in URL, skipping URL parameter processing");
    return;
  }
  
  // Prevent processing the same URL parameters multiple times
  const currentUrl = window.location.href;
  if (hymnsData.urlParametersProcessed && hymnsData.lastProcessedUrl === currentUrl) {
    console.log("[DEBUG] URL parameters already processed for this URL, skipping");
    return;
  }
  
  console.log("[DEBUG] Direct hymn link detected:", hymnId);
  hymnsData.urlParametersProcessed = true; // Mark as processed
  hymnsData.lastProcessedUrl = currentUrl; // Store the processed URL
    
  const hymn = hymnsData.allHymns.find(h => h.id === parseInt(hymnId) || h.number === parseInt(hymnId));
  
  if (hymn) {
    // Store the hymn ID for later use if app isn't fully loaded yet
    sessionStorage.setItem('pendingHymnId', hymnId);
    
    // Switch to Hymns tab if not already there
    if (typeof window.switchToTab === 'function') {
      window.switchToTab('Hymns');
    }
    
    // Show the hymn lyrics with multiple retry attempts for mobile
    let retryCount = 0;
    const maxRetries = 50; // Maximum 5 seconds of retries
    const showHymn = () => {
      console.log("[DEBUG] Attempting to show hymn:", hymn.title, `(attempt ${retryCount + 1}/${maxRetries})`);
      
      // Check if the app UI is ready
      if ((document.getElementById('app-root') || document.getElementById('app')) && typeof viewHymnLyrics === 'function') {
        viewHymnLyrics(hymn.id || hymn.number);
        updatePageTitle(hymn);
        // Clear the pending hymn ID since we successfully showed it
        sessionStorage.removeItem('pendingHymnId');
        console.log("[DEBUG] Successfully showed hymn:", hymn.title);
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.log("[DEBUG] App not ready yet, retrying in 100ms");
        setTimeout(showHymn, 100);
      } else {
        console.error("[DEBUG] Failed to show hymn after maximum retries:", hymn.title);
        sessionStorage.removeItem('pendingHymnId');
      }
    };
    
    // Start showing the hymn with a small delay to ensure everything is loaded
    setTimeout(showHymn, 300);
  } else {
    console.warn("[DEBUG] Hymn not found for ID:", hymnId);
    // Clear any pending hymn ID if hymn doesn't exist
    sessionStorage.removeItem('pendingHymnId');
  }
}

// Check for pending hymn URL parameters (for mobile reliability)
function checkPendingHymnUrlParameters() {
  // Don't process if we already handled URL parameters
  if (hymnsData.urlParametersProcessed) {
    console.log("[DEBUG] URL parameters already processed, skipping pending check");
    return;
  }
  
  const pendingHymnId = sessionStorage.getItem('pendingHymnId');
  const urlParams = new URLSearchParams(window.location.search);
  const urlHymnId = urlParams.get('hymn');
  
  // If there's a pending hymn ID or URL parameter, try to process it
  if (pendingHymnId || urlHymnId) {
    console.log("[DEBUG] Found pending hymn ID:", pendingHymnId || urlHymnId);
    
    if (!hymnsData.isLoaded) {
      console.log("[DEBUG] Hymns not loaded yet, will retry after loading");
      return;
    }
    
    handleHymnUrlParameters();
  }
}

// Render the Hymns tab content
window.renderHymnsTab = function(tab) {
  console.log("[DEBUG] Rendering Hymns tab");
  
  if (!hymnsData.isLoaded) {
    loadHymnsData();
  } else {
    // Only check for pending hymn parameters on first load or if there are actual URL parameters
    // Don't re-process if we're just switching tabs
    const urlParams = new URLSearchParams(window.location.search);
    const hymnId = urlParams.get('hymn');
    
    if (hymnId && !hymnsData.urlParametersProcessed) {
      setTimeout(() => {
        checkPendingHymnUrlParameters();
      }, 100);
    }
  }
  
  if (hymnsData.showLyrics && hymnsData.selectedHymn) {
    return renderHymnLyricsView();
  }
  
  return `
    <div class="fade-in">
      <!-- Hymns Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <i class="bi bi-book text-purple-600 mr-3"></i>
            Hymns Library
          </h1>
          <p class="text-gray-600" id="hymn-count-display">
            ${hymnsData.filteredHymns.length} of ${hymnsData.allHymns.length} hymns
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <!-- View Toggle -->
          <div class="btn-group">
            <button onclick="toggleHymnsView('grid')" class="btn btn-outline btn-sm" id="grid-view-btn">
              <i class="bi bi-grid-3x3-gap mr-1"></i>
              Grid
            </button>
            <button onclick="toggleHymnsView('list')" class="btn btn-outline btn-sm" id="list-view-btn">
              <i class="bi bi-list-ul mr-1"></i>
              List
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-6">
        <div class="card-body p-4">
          <!-- Search Bar -->
          <div class="relative mb-4">
            <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              id="hymn-search" 
              placeholder="Search hymns, authors, categories, or lyrics..."
              class="input input-bordered w-full pl-10"
              value="${hymnsData.searchTerm}"
              oninput="searchHymns(this.value)"
            >
          </div>
          
          <!-- Filters Row -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <!-- Category Filter -->
            <select id="category-filter" class="select select-bordered w-full" onchange="filterByCategory(this.value)">
              <option value="all">All Categories</option>
              <!-- Categories will be populated dynamically -->
            </select>
            
            <!-- Time Period Filter -->
            <select id="time-period-filter" class="select select-bordered w-full" onchange="filterByTimePeriod(this.value)">
              <option value="all">All Time Periods</option>
              <!-- Time periods will be populated dynamically -->
            </select>
            
            <!-- Meter Filter -->
            <select id="meter-filter" class="select select-bordered w-full" onchange="filterByMeter(this.value)">
              <option value="all">All Meters</option>
              <!-- Meters will be populated dynamically -->
            </select>
            
            <!-- Sort Options -->
            <select id="sort-options" class="select select-bordered w-full" onchange="sortHymns(this.value)">
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="author-asc">Author A-Z</option>
              <option value="author-desc">Author Z-A</option>
              <option value="year-asc">Year (Oldest)</option>
              <option value="year-desc">Year (Newest)</option>
              <option value="category-asc">Category A-Z</option>
            </select>
          </div>
          
          <!-- Clear Filters -->
          <div class="flex justify-end mt-3">
            <button onclick="clearAllFilters()" class="btn btn-ghost btn-sm">
              <i class="bi bi-x-circle mr-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Hymns Grid/List -->
      <div id="hymns-container">
        ${renderHymnsContainer()}
      </div>

      <!-- Embedded Audio Player with Lyrics (only render if not already present) -->
      ${document.getElementById('audio-player-section') ? '' : renderEmbeddedAudioPlayer()}
    </div>
  `;
};

// TODO: Implement remaining functions
// - renderHymnsContainer()
// - renderHymnLyricsView()
// - renderEmbeddedAudioPlayer()
// - Search and filter functions
// - Audio player functions
// - View hymn lyrics function
// - Update functions
