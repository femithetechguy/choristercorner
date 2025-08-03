// Hymns tab functionality
// This file handles the hymns library management, search, filters, and display

// Hymns data structure
const hymnsData = {
  allHymns: [],
  filteredHymns: [],
  isLoaded: false,
  showLyrics: false,
  selectedHymn: null,
  currentView: 'grid', // 'grid' or 'list'
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
    
    // Validate and clean the data
    const validatedData = data.map((hymn, index) => {
      // Ensure required fields exist
      if (!hymn.serial_number) {
        console.warn("[DEBUG] Hymn missing serial_number, assigning:", index + 1);
        hymn.serial_number = index + 1;
      }
      
      // Ensure lyrics is an array
      if (!Array.isArray(hymn.lyrics)) {
        hymn.lyrics = [];
      }
      
      return hymn;
    });
    
    hymnsData.allHymns = validatedData;
    hymnsData.filteredHymns = [...validatedData];
    hymnsData.isLoaded = true;
    
    // Update the hymns display
    updateHymnsDisplay();
    
    // Populate filter dropdowns
    populateFilterDropdowns();
    
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
    
  const hymn = hymnsData.allHymns.find(h => h.serial_number === parseInt(hymnId));
  
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
        viewHymnLyrics(hymn.serial_number);
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
          <!-- Debug buttons (for troubleshooting) -->
          <div class="btn-group">
            <button onclick="window.forceRefreshHymns()" class="btn btn-ghost btn-sm" title="Force refresh hymns">
              <i class="bi bi-arrow-clockwise mr-1"></i>
              Refresh
            </button>
            <button onclick="window.debugHymns()" class="btn btn-ghost btn-sm" title="Debug hymns state">
              <i class="bi bi-bug mr-1"></i>
              Debug
            </button>
          </div>
          <!-- View Toggle -->
          <div class="flex rounded-md border border-gray-300">
            <button 
              onclick="toggleHymnsView('grid')" 
              class="flex-1 py-2 px-3 text-sm ${hymnsData.currentView === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-50'} rounded-l-md border-r border-gray-300"
            >
              <i class="bi bi-grid"></i> Grid
            </button>
            <button 
              onclick="toggleHymnsView('list')" 
              class="flex-1 py-2 px-3 text-sm ${hymnsData.currentView === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-50'} rounded-r-md"
            >
              <i class="bi bi-list"></i> List
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

// Render hymns container based on current view
function renderHymnsContainer() {
  if (!hymnsData.filteredHymns.length) {
    return `
      <div class="card">
        <div class="card-body text-center py-12">
          <i class="bi bi-book text-6xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No hymns found</h3>
          <p class="text-gray-600">Try adjusting your search or filters</p>
        </div>
      </div>
    `;
  }

  try {
    if (hymnsData.currentView === 'grid') {
      return `
        <div class="hymns-grid">
          ${hymnsData.filteredHymns.map(hymn => renderHymnCard(hymn)).join('')}
        </div>
      `;
    } else {
      return `
        <div class="card">
          <div class="card-body p-0">
            <div class="divide-y divide-gray-200">
              ${hymnsData.filteredHymns.map(hymn => renderHymnListItem(hymn)).join('')}
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("[ERROR] Failed to render hymns container:", error);
    return `
      <div class="card">
        <div class="card-body text-center py-12">
          <i class="bi bi-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Rendering Error</h3>
          <p class="text-gray-600 mb-4">There was an error displaying the hymns.</p>
          <button onclick="updateHymnsDisplay()" class="btn btn-primary">
            <i class="bi bi-arrow-clockwise mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
    `;
  }
}

// Render individual hymn card
function renderHymnCard(hymn) {
  try {
    // Ensure we have required fields
    const safeHymn = {
      serial_number: hymn.serial_number || 0,
      title: hymn.title || 'Untitled',
      author: hymn.author || 'Unknown Author',
      year: hymn.year || null,
      meter: hymn.meter || '',
      category: hymn.category || '',
      channel: hymn.channel || 'Unknown Artist',
      duration: hymn.duration || 'N/A',
      url: hymn.url || '',
      lyrics: hymn.lyrics || []
    };

    // Safe string escaping function
    const escapeString = (str) => {
      if (!str) return '';
      return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
    };

    return `
      <div class="hymn-card">
        <div class="hymn-card-header">
          <div class="hymn-number">#${safeHymn.serial_number}</div>
          <h3 class="hymn-title">${safeHymn.title}</h3>
          <p class="hymn-author">by ${safeHymn.author}</p>
          <p class="hymn-details">
            <span class="hymn-year">${safeHymn.year || 'Year Unknown'}</span>
            ${safeHymn.meter ? ` • ${safeHymn.meter}` : ''}
            ${safeHymn.category ? ` • ${safeHymn.category}` : ''}
          </p>
          <p class="hymn-channel">${safeHymn.channel} • ${safeHymn.duration}</p>
        </div>
        <div class="hymn-card-body">
          <div class="hymn-lyrics-preview">
            ${safeHymn.lyrics.length > 0 ? safeHymn.lyrics[0].substring(0, 100) + '...' : 'Lyrics available when you select this hymn.'}
          </div>
        </div>
        <div class="hymn-card-actions">
          <button onclick="playHymnEmbedded({
            serial_number: ${safeHymn.serial_number},
            title: '${escapeString(safeHymn.title)}',
            author: '${escapeString(safeHymn.author)}',
            meter: '${escapeString(safeHymn.meter)}',
            category: '${escapeString(safeHymn.category)}',
            year: ${safeHymn.year || 'null'},
            channel: '${escapeString(safeHymn.channel)}',
            duration: '${escapeString(safeHymn.duration)}',
            url: '${escapeString(safeHymn.url)}',
            lyrics: ${JSON.stringify(safeHymn.lyrics)}
          })" class="btn btn-primary btn-sm" ${!safeHymn.url ? 'disabled' : ''}>
            <i class="bi bi-play-fill mr-1"></i>
            Play
          </button>
          <button onclick="viewHymnLyrics(${safeHymn.serial_number})" class="btn btn-outline btn-sm">
            <i class="bi bi-file-text mr-1"></i>
            Lyrics
          </button>
          <button onclick="copyHymnLinkBySerial(${safeHymn.serial_number})" class="btn btn-ghost btn-sm" title="Copy hymn link">
            <i class="bi bi-link-45deg"></i>
          </button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("[ERROR] Failed to render hymn card:", error, hymn);
    return `
      <div class="hymn-card">
        <div class="hymn-card-header">
          <div class="hymn-number">#${hymn.serial_number || '?'}</div>
          <h3 class="hymn-title">Error loading hymn</h3>
          <p class="hymn-author">Data error</p>
        </div>
        <div class="hymn-card-body">
          <div class="hymn-lyrics-preview text-red-500">
            Unable to load hymn data. Please refresh the page.
          </div>
        </div>
        <div class="hymn-card-actions">
          <button class="btn btn-outline btn-sm" disabled>
            <i class="bi bi-exclamation-triangle mr-1"></i>
            Error
          </button>
        </div>
      </div>
    `;
  }
}

// Render individual hymn list item (list view)
function renderHymnListItem(hymn) {
  try {
    // Ensure we have required fields
    const safeHymn = {
      serial_number: hymn.serial_number || 0,
      title: hymn.title || 'Untitled',
      author: hymn.author || 'Unknown Author',
      year: hymn.year || null,
      meter: hymn.meter || '',
      category: hymn.category || '',
      channel: hymn.channel || 'Unknown Artist',
      duration: hymn.duration || 'N/A',
      url: hymn.url || '',
      lyrics: hymn.lyrics || []
    };

    // Safe string escaping function
    const escapeString = (str) => {
      if (!str) return '';
      return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
    };

    return `
      <div class="p-4 hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3">
              <span class="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">#${safeHymn.serial_number}</span>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">${safeHymn.title}</h3>
                <p class="text-sm text-gray-600 flex items-center">
                  <i class="bi bi-person-circle mr-1"></i>
                  ${safeHymn.author}
                  <span class="mx-2">•</span>
                  <i class="bi bi-calendar mr-1"></i>
                  ${safeHymn.year || 'Year Unknown'}
                  ${safeHymn.meter ? ` • ${safeHymn.meter}` : ''}
                  ${safeHymn.category ? ` • ${safeHymn.category}` : ''}
                </p>
                <p class="text-xs text-gray-500">
                  ${safeHymn.channel} • ${safeHymn.duration}
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <button onclick="playHymnEmbedded({
              serial_number: ${safeHymn.serial_number},
              title: '${escapeString(safeHymn.title)}',
              author: '${escapeString(safeHymn.author)}',
              meter: '${escapeString(safeHymn.meter)}',
              category: '${escapeString(safeHymn.category)}',
              year: ${safeHymn.year || 'null'},
              channel: '${escapeString(safeHymn.channel)}',
              duration: '${escapeString(safeHymn.duration)}',
              url: '${escapeString(safeHymn.url)}',
              lyrics: ${JSON.stringify(safeHymn.lyrics)}
            })" class="btn btn-primary btn-sm" ${!safeHymn.url ? 'disabled' : ''} title="Play hymn">
              <i class="bi bi-play-fill"></i>
            </button>
            <button onclick="viewHymnLyrics(${safeHymn.serial_number})" class="btn btn-outline btn-sm" title="View lyrics">
              <i class="bi bi-file-text"></i>
            </button>
            <button onclick="copyHymnLinkBySerial(${safeHymn.serial_number})" class="btn btn-ghost btn-sm" title="Copy hymn link">
              <i class="bi bi-link-45deg"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("[ERROR] Failed to render hymn list item:", error, hymn);
    return `
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-red-600">Error loading hymn #${hymn.serial_number || '?'}</h3>
            <p class="text-sm text-gray-500">Unable to render hymn data</p>
          </div>
          <button class="btn btn-outline btn-sm" disabled>
            <i class="bi bi-exclamation-triangle"></i>
          </button>
        </div>
      </div>
    `;
  }
}

// Play hymn in embedded player
function playHymnEmbedded(hymn) {
  console.log("[DEBUG] Playing hymn in shared player:", hymn.title);
  
  // Use the shared player instead of hymn-specific player
  showSharedPlayer(hymn, 'hymn');
}

// Close audio player (legacy function - now uses shared player)
function closeAudioPlayer() {
  console.log("[DEBUG] Closing audio player (using shared player)");
  closeSharedPlayer();
}

// Extract YouTube video ID from URL (moved to shared-player.js)
function extractYouTubeVideoId(url) {
  return extractVideoId(url);
}

// Render embedded audio player (now using shared player system)
function renderEmbeddedAudioPlayer() {
  // Return empty string since we now use the shared player system
  return '';
}

// Toggle player collapse (legacy function - now uses shared player)
function togglePlayerCollapse() {
  toggleSharedPlayerCollapse();
}

// View hymn lyrics in full screen
function viewHymnLyrics(serialNumber) {
  console.log("[DEBUG] Viewing lyrics for hymn:", serialNumber);
  
  const hymn = hymnsData.allHymns.find(h => h.serial_number === serialNumber);
  if (!hymn) {
    console.error("[DEBUG] Hymn not found:", serialNumber);
    return;
  }
  
  hymnsData.selectedHymn = hymn;
  hymnsData.showLyrics = true;
  
  // Update URL with hymn parameter
  const url = new URL(window.location);
  url.searchParams.set('hymn', serialNumber);
  window.history.pushState({}, '', url);
  
  // Update page title
  updatePageTitle(hymn);
  
  // Re-render the hymns tab
  updateHymnsDisplay();
}

// Render hymn lyrics view
function renderHymnLyricsView() {
  const hymn = hymnsData.selectedHymn;
  
  if (!hymn) {
    return renderHymnsTab();
  }
  
  return `
    <div class="fade-in hymn-lyrics-container">
      <!-- Back Button -->
      <div class="mb-6">
        <button onclick="backToHymnsList()" class="btn btn-ghost">
          <i class="bi bi-arrow-left mr-2"></i>
          Back to Hymns
        </button>
      </div>
      
      <!-- Hymn Header -->
      <div class="hymn-lyrics-header bg-white">
        <div class="hymn-lyrics-number">#${hymn.serial_number}</div>
        <h1 class="hymn-lyrics-title">${hymn.title}</h1>
        <p class="hymn-lyrics-author">by ${hymn.author || 'Unknown Author'}</p>
        <div class="hymn-lyrics-details">
          <span class="hymn-lyrics-year">${hymn.year || 'Year Unknown'}</span>
          ${hymn.meter ? ` • ${hymn.meter}` : ''}
          ${hymn.category ? ` • ${hymn.category}` : ''}
        </div>
        <p class="hymn-lyrics-channel">${hymn.channel} • ${hymn.duration}</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 justify-center mb-6">
        <button onclick="playHymnEmbedded({
          serial_number: ${hymn.serial_number},
          title: '${hymn.title?.replace(/'/g, "\\'")}',
          author: '${hymn.author?.replace(/'/g, "\\'")}',
          meter: '${hymn.meter?.replace(/'/g, "\\'")}',
          category: '${hymn.category?.replace(/'/g, "\\'")}',
          year: ${hymn.year || 'null'},
          channel: '${hymn.channel?.replace(/'/g, "\\'")}',
          duration: '${hymn.duration}',
          url: '${hymn.url}',
          lyrics: ${JSON.stringify(hymn.lyrics || []).replace(/'/g, "\\'")}
        })" class="btn btn-primary" ${!hymn.url ? 'disabled' : ''}>
          <i class="bi bi-play-fill mr-2"></i>
          Play Hymn
        </button>
        <button onclick="copyHymnLinkBySerial(${hymn.serial_number})" class="btn btn-outline">
          <i class="bi bi-link-45deg mr-2"></i>
          Copy Link
        </button>
        <button onclick="printHymnLyrics()" class="btn btn-outline">
          <i class="bi bi-printer mr-2"></i>
          Print
        </button>
      </div>
      
      <!-- Lyrics Content -->
      <div class="lyrics-container">
        ${hymn.lyrics && hymn.lyrics.length > 0 ? 
          hymn.lyrics.map((verse, index) => {
            // Check if the verse starts with a manual label (e.g., "Verse 1:", "Chorus:", "Refrain:")
            const lines = verse.split('\n').filter(line => line.trim());
            let sectionLabel = 'Verse ' + (index + 1);
            let content = verse;
            
            if (lines.length > 0) {
              const firstLine = lines[0].trim();
              // Check if first line ends with a colon (manual label)
              if (firstLine.includes(':') && firstLine.length < 20) {
                sectionLabel = firstLine.replace(':', '');
                // Remove the label line from content
                content = lines.slice(1).join('\n');
              }
            }
            
            return `
              <div class="lyrics-verse">
                <div class="verse-number">${sectionLabel}</div>
                <div class="verse-content">
                  ${content.split('\n').filter(line => line.trim()).map(line => '<p>' + line.trim() + '</p>').join('')}
                </div>
              </div>
            `;
          }).join('') : `
          <div class="text-center text-gray-500 py-12">
            <i class="bi bi-file-text text-6xl mb-4"></i>
            <h3 class="text-xl font-semibold mb-2">Lyrics Not Available</h3>
            <p>Lyrics for this hymn are not yet available in our database.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// Back to hymns list
function backToHymnsList() {
  console.log("[DEBUG] Returning to hymns list");
  
  hymnsData.showLyrics = false;
  hymnsData.selectedHymn = null;
  
  // Clear URL parameters
  const url = new URL(window.location);
  url.searchParams.delete('hymn');
  window.history.pushState({}, '', url);
  
  // Reset page title
  document.title = 'ChoristerCorner - Worship Songs, Chords & Resources for Church Musicians';
  
  // Re-render hymns tab
  updateHymnsDisplay();
}

// Search hymns
function searchHymns(searchTerm) {
  console.log("[DEBUG] Searching hymns for:", searchTerm);
  
  hymnsData.searchTerm = searchTerm.toLowerCase();
  filterHymns();
}

// Filter hymns
function filterHymns() {
  let filtered = hymnsData.allHymns;
  
  // Apply search filter
  if (hymnsData.searchTerm) {
    filtered = filtered.filter(hymn => {
      const searchableText = `
        ${hymn.title || ''} 
        ${hymn.author || ''}
        ${hymn.channel || ''} 
        ${hymn.category || ''}
        ${hymn.meter || ''}
        ${hymn.year || ''}
        ${hymn.lyrics ? hymn.lyrics.join(' ') : ''}
      `.toLowerCase();
      
      return searchableText.includes(hymnsData.searchTerm);
    });
  }
  
  // Apply category filter
  if (hymnsData.categoryFilter && hymnsData.categoryFilter !== 'all') {
    filtered = filtered.filter(hymn => hymn.category === hymnsData.categoryFilter);
  }
  
  // Apply time period filter
  if (hymnsData.timePeriodFilter && hymnsData.timePeriodFilter !== 'all') {
    filtered = filtered.filter(hymn => {
      const year = hymn.year || 0;
      switch (hymnsData.timePeriodFilter) {
        case '1500-1700': return year >= 1500 && year <= 1700;
        case '1701-1800': return year >= 1701 && year <= 1800;
        case '1801-1900': return year >= 1801 && year <= 1900;
        case '1901-2000': return year >= 1901 && year <= 2000;
        case '2001-present': return year >= 2001;
        default: return true;
      }
    });
  }
  
  // Apply meter filter
  if (hymnsData.meterFilter && hymnsData.meterFilter !== 'all') {
    filtered = filtered.filter(hymn => {
      if (!hymn.meter) return false;
      
      // Extract base meter pattern (e.g., "CM" from "CM (8.6.8.6)")
      const baseMeter = hymn.meter.split(' ')[0];
      return baseMeter === hymnsData.meterFilter || hymn.meter.includes(hymnsData.meterFilter);
    });
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let aValue, bValue;
    
    switch (hymnsData.sortBy) {
      case 'title':
        aValue = (a.title || '').toLowerCase();
        bValue = (b.title || '').toLowerCase();
        break;
      case 'author':
        aValue = (a.author || '').toLowerCase();
        bValue = (b.author || '').toLowerCase();
        break;
      case 'year':
        aValue = a.year || 0;
        bValue = b.year || 0;
        break;
      case 'category':
        aValue = (a.category || '').toLowerCase();
        bValue = (b.category || '').toLowerCase();
        break;
      case 'duration':
        aValue = parseDuration(a.duration);
        bValue = parseDuration(b.duration);
        break;
      default:
        aValue = a.serial_number;
        bValue = b.serial_number;
    }
    
    if (hymnsData.sortOrder === 'desc') {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });
  
  hymnsData.filteredHymns = filtered;
  updateHymnsListOnly();
}

// Parse duration for sorting
function parseDuration(duration) {
  if (!duration) return 0;
  
  const minutes = duration.match(/(\d+)\s*minutes?/);
  const seconds = duration.match(/(\d+)\s*seconds?/);
  
  let totalSeconds = 0;
  if (minutes) totalSeconds += parseInt(minutes[1]) * 60;
  if (seconds) totalSeconds += parseInt(seconds[1]);
  
  return totalSeconds;
}

// Filter by category
function filterByCategory(category) {
  hymnsData.categoryFilter = category;
  filterHymns();
}

// Filter by time period
function filterByTimePeriod(timePeriod) {
  hymnsData.timePeriodFilter = timePeriod;
  filterHymns();
}

// Filter by meter
function filterByMeter(meter) {
  hymnsData.meterFilter = meter;
  filterHymns();
}

// Sort hymns
function sortHymns(sortValue) {
  const [sortBy, sortOrder] = sortValue.split('-');
  hymnsData.sortBy = sortBy;
  hymnsData.sortOrder = sortOrder;
  filterHymns();
}

// Clear all filters
function clearAllFilters() {
  hymnsData.searchTerm = '';
  hymnsData.categoryFilter = 'all';
  hymnsData.timePeriodFilter = 'all';
  hymnsData.meterFilter = 'all';
  hymnsData.sortBy = 'title';
  hymnsData.sortOrder = 'asc';
  
  // Reset UI
  document.getElementById('hymn-search').value = '';
  document.getElementById('category-filter').value = 'all';
  document.getElementById('time-period-filter').value = 'all';
  document.getElementById('meter-filter').value = 'all';
  document.getElementById('sort-options').value = 'title-asc';
  
  filterHymns();
}

// Copy hymn link
function copyHymnLinkBySerial(serialNumber) {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('hymn', serialNumber);
  
  navigator.clipboard.writeText(url.toString()).then(() => {
    // Show success message
    showToast('Hymn link copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy link:', err);
    showToast('Failed to copy link');
  });
}

// Show toast notification
function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transform translate-y-full transition-transform duration-300';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.remove('translate-y-full');
  }, 100);
  
  // Hide and remove toast
  setTimeout(() => {
    toast.classList.add('translate-y-full');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Print hymn lyrics
function printHymnLyrics() {
  const hymn = hymnsData.selectedHymn;
  if (!hymn) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Generate print-friendly HTML
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${hymn.title} - Lyrics</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 40px;
          color: #000;
        }
        .hymn-header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .hymn-number {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        .hymn-title {
          font-size: 28px;
          font-weight: bold;
          margin: 0 0 10px 0;
        }
        .hymn-author {
          font-size: 18px;
          font-style: italic;
          margin: 0 0 10px 0;
        }
        .hymn-details {
          font-size: 14px;
          color: #666;
          margin: 0 0 5px 0;
        }
        .hymn-source {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
        .hymn-verse {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .verse-number {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 8px;
          color: #333;
        }
        .verse-text {
          margin-left: 20px;
          line-height: 1.8;
        }
        .verse-text p {
          margin: 0 0 5px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ccc;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        @media print {
          body { margin: 20px; }
          .hymn-header { page-break-after: avoid; }
          .hymn-verse { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="hymn-header">
        <div class="hymn-number">Hymn #${hymn.serial_number}</div>
        <h1 class="hymn-title">${hymn.title}</h1>
        <p class="hymn-author">by ${hymn.author || 'Unknown Author'}</p>
        <div class="hymn-details">
          ${hymn.year || 'Year Unknown'}
          ${hymn.meter ? ` • ${hymn.meter}` : ''}
          ${hymn.category ? ` • ${hymn.category}` : ''}
        </div>
        <p class="hymn-source">${hymn.channel} • ${hymn.duration}</p>
      </div>
      
      <div class="hymn-content">
        ${hymn.lyrics && hymn.lyrics.length > 0 ? 
          hymn.lyrics.map((verse, index) => {
            // Check if the verse starts with a manual label (e.g., "Verse 1:", "Chorus:", "Refrain:")
            const lines = verse.split('\n').filter(line => line.trim());
            let sectionLabel = 'Verse ' + (index + 1);
            let content = verse;
            
            if (lines.length > 0) {
              const firstLine = lines[0].trim();
              // Check if first line ends with a colon (manual label)
              if (firstLine.includes(':') && firstLine.length < 20) {
                sectionLabel = firstLine.replace(':', '');
                // Remove the label line from content
                content = lines.slice(1).join('\n');
              }
            }
            
            return `
              <div class="hymn-verse">
                <div class="verse-number">${sectionLabel}</div>
                <div class="verse-text">
                  ${content.split('\n').filter(line => line.trim()).map(line => '<p>' + line.trim() + '</p>').join('')}
                </div>
              </div>
            `;
          }).join('') : `
          <div class="hymn-verse">
            <div class="verse-text">
              <p><em>Lyrics not available for this hymn.</em></p>
            </div>
          </div>
        `}
      </div>
      
      <div class="footer">
        <p>Printed from ChoristerCorner.com</p>
      </div>
    </body>
    </html>
  `;
  
  // Write content to the print window
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = function() {
    printWindow.print();
    // Close the window after printing (optional)
    printWindow.onafterprint = function() {
      printWindow.close();
    };
  };
}

// Update page title
function updatePageTitle(hymn) {
  if (hymn) {
    document.title = `${hymn.title} - ChoristerCorner`;
  } else {
    document.title = 'ChoristerCorner - Worship Songs, Chords & Resources for Church Musicians';
  }
}

// Update hymns display
function updateHymnsDisplay() {
  console.log("[DEBUG] Updating hymns display");
  console.log("[DEBUG] Current hymnsData state:", {
    isLoaded: hymnsData.isLoaded,
    allHymnsCount: hymnsData.allHymns.length,
    filteredHymnsCount: hymnsData.filteredHymns.length,
    showLyrics: hymnsData.showLyrics,
    selectedHymn: hymnsData.selectedHymn?.title
  });
  
  // Ensure we have data before trying to update
  if (!hymnsData.isLoaded) {
    console.log("[DEBUG] Hymns not loaded yet, skipping display update");
    return;
  }
  
  // If we're showing lyrics, we need to re-render the entire tab
  if (hymnsData.showLyrics && hymnsData.selectedHymn) {
    console.log("[DEBUG] Rendering lyrics view for:", hymnsData.selectedHymn.title);
    const possibleContainers = ['app-content', 'tab-content', 'app-root', 'app'];
    let appContainer = null;
    
    for (const containerId of possibleContainers) {
      appContainer = document.getElementById(containerId);
      if (appContainer) {
        console.log("[DEBUG] Found container for lyrics view:", containerId);
        break;
      }
    }
    
    if (appContainer) {
      appContainer.innerHTML = window.renderHymnsTab();
    }
  } else {
    // Only update the hymns list when not in lyrics view
    updateHymnsListOnly();
  }
  
  // Update audio player if it's visible
  updateAudioPlayerDisplay();
}

// Update only the hymns list without affecting audio player
function updateHymnsListOnly() {
  console.log("[DEBUG] Updating hymns list only");
  
  // Update only the hymns container, not the entire tab
  const hymnsContainer = document.getElementById('hymns-container');
  if (hymnsContainer) {
    console.log("[DEBUG] Found hymns-container, updating content");
    hymnsContainer.innerHTML = renderHymnsContainer();
  } else {
    console.warn("[DEBUG] hymns-container not found, falling back to full re-render");
    // Fallback: try to find any container with hymns content
    const possibleContainers = ['app-content', 'tab-content', 'app-root', 'app'];
    let appContainer = null;
    
    for (const containerId of possibleContainers) {
      appContainer = document.getElementById(containerId);
      if (appContainer) {
        console.log("[DEBUG] Found container:", containerId);
        break;
      }
    }
    
    if (appContainer) {
      appContainer.innerHTML = window.renderHymnsTab();
    }
  }
  
  // Update the hymn count display in the header
  setTimeout(() => {
    updateHymnCountDisplay();
  }, 50);
}

// Update hymn count in the header
function updateHymnCountDisplay() {
  const countElement = document.getElementById('hymn-count-display');
  if (countElement) {
    countElement.textContent = `${hymnsData.filteredHymns.length} of ${hymnsData.allHymns.length} hymns`;
  }
}

// Update audio player display (now uses shared player system)
function updateAudioPlayerDisplay() {
  // No longer needed since shared player handles its own display
  console.log("[DEBUG] Audio player display managed by shared player system");
}

// Populate filter dropdowns with unique values from hymn data
function populateFilterDropdowns() {
  console.log("[DEBUG] Populating filter dropdowns");
  
  // Get unique categories
  const categories = [...new Set(hymnsData.allHymns.map(h => h.category).filter(Boolean))].sort();
  const categorySelect = document.getElementById('category-filter');
  if (categorySelect) {
    // Clear existing options except "All Categories"
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
    });
    categorySelect.value = hymnsData.categoryFilter;
  }
  
  // Populate time period filter
  const timePeriodSelect = document.getElementById('time-period-filter');
  if (timePeriodSelect) {
    timePeriodSelect.innerHTML = `
      <option value="all">All Time Periods</option>
      <option value="1500-1700">1500-1700 (Reformation Era)</option>
      <option value="1701-1800">1701-1800 (18th Century)</option>
      <option value="1801-1900">1801-1900 (19th Century)</option>
      <option value="1901-2000">1901-2000 (20th Century)</option>
      <option value="2001-present">2001-Present (Modern)</option>
    `;
    timePeriodSelect.value = hymnsData.timePeriodFilter;
  }
  
  // Get unique meters
  const meters = [...new Set(hymnsData.allHymns.map(h => {
    if (!h.meter) return null;
    // Extract base meter pattern (e.g., "CM" from "CM (8.6.8.6)")
    return h.meter.split(' ')[0];
  }).filter(Boolean))].sort();
  
  const meterSelect = document.getElementById('meter-filter');
  if (meterSelect) {
    // Clear existing options except "All Meters"
    meterSelect.innerHTML = '<option value="all">All Meters</option>';
    meters.forEach(meter => {
      const meterName = getMeterDisplayName(meter);
      meterSelect.innerHTML += `<option value="${meter}">${meterName}</option>`;
    });
    meterSelect.value = hymnsData.meterFilter;
  }
}

// Get display name for meter
function getMeterDisplayName(meter) {
  const meterNames = {
    'CM': 'Common Meter (CM)',
    'LM': 'Long Meter (LM)',
    'SM': 'Short Meter (SM)',
    'LMD': 'Long Meter Doubled (LMD)',
    'CMD': 'Common Meter Doubled (CMD)',
    'SMD': 'Short Meter Doubled (SMD)',
    'Irregular': 'Irregular Meter'
  };
  
  return meterNames[meter] || meter;
}

// Force refresh hymns display - useful for debugging
window.forceRefreshHymns = function() {
  console.log("[DEBUG] Force refreshing hymns...");
  
  // Reset state
  hymnsData.isLoaded = false;
  hymnsData.urlParametersProcessed = false;
  
  // Clear any existing content
  const containers = ['app-content', 'tab-content', 'hymns-container'];
  containers.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = '<div class="text-center p-8">Loading hymns...</div>';
    }
  });
  
  // Reload data
  loadHymnsData();
};

// Debug function to check hymns state
window.debugHymns = function() {
  console.log("[DEBUG] Hymns Debug Info:", {
    isLoaded: hymnsData.isLoaded,
    allHymns: hymnsData.allHymns.length,
    filteredHymns: hymnsData.filteredHymns.length,
    showLyrics: hymnsData.showLyrics,
    selectedHymn: hymnsData.selectedHymn,
    currentPlayingHymn: hymnsData.currentPlayingHymn,
    searchTerm: hymnsData.searchTerm,
    categoryFilter: hymnsData.categoryFilter,
    timePeriodFilter: hymnsData.timePeriodFilter,
    meterFilter: hymnsData.meterFilter,
    urlParametersProcessed: hymnsData.urlParametersProcessed
  });
  
  // Check if containers exist
  const containers = ['app-content', 'tab-content', 'hymns-container'];
  containers.forEach(id => {
    const container = document.getElementById(id);
    console.log(`Container ${id}:`, container ? 'EXISTS' : 'NOT FOUND');
  });
  
  return hymnsData;
};

// Toggle view between grid and list
function toggleHymnsView(view) {
  console.log("[DEBUG] Toggling hymns view to:", view);
  hymnsData.currentView = view;
  updateHymnsDisplay();
}
