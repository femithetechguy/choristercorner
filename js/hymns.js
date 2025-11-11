console.log("[DEBUG] hymns.js loading...");

// Hymns data store
let hymnsData = {
  allHymns: [],
  filteredHymns: [],
  showLyrics: false,
  selectedHymn: null,
  isLoaded: false,
  allHymnsCount: 0,
  filteredHymnsCount: 0,
  viewMode: 'grid' // Will be updated in init
};

// Fetch and process hymns data
async function loadHymnsData() {
  console.log("[DEBUG] Loading hymns data from JSON...");
  
  try {
    const response = await fetch("json/hymns.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("[DEBUG] Hymns data loaded:", data.length, "hymns");
    
    // Store all hymns
    hymnsData.allHymns = data;
    hymnsData.filteredHymns = data;
    hymnsData.allHymnsCount = data.length;
    hymnsData.filteredHymnsCount = data.length;
    hymnsData.isLoaded = true;
    
    // Export to window for global access
    window.hymnsData = hymnsData;
    
    console.log("[DEBUG] hymnsData exported to window:", window.hymnsData);
    
    // Update display if on hymns tab
    if (window.selectedTabIdx === 2) {
      updateHymnsDisplay();
    }
    
    return data;
  } catch (error) {
    console.error("[DEBUG] Error loading hymns data:", error);
    if (window.showToast) {
      showToast("Failed to load hymns data", "error");
    }
    hymnsData.isLoaded = false;
    window.hymnsData = hymnsData;
    return [];
  }
}

// Get unique categories for filter dropdown
function getUniqueCategories() {
  if (!hymnsData.allHymns || hymnsData.allHymns.length === 0) return [];
  
  const categories = hymnsData.allHymns
    .map(hymn => hymn.category)
    .filter(category => category && category.trim() !== '');
  
  return [...new Set(categories)].sort();
}

// Get unique authors for filter dropdown
function getUniqueAuthors() {
  if (!hymnsData.allHymns || hymnsData.allHymns.length === 0) return [];
  
  const authors = hymnsData.allHymns
    .map(hymn => hymn.author)
    .filter(author => author && author.trim() !== '');
  
  return [...new Set(authors)].sort();
}

// Search hymns
function searchHymns(query) {
  console.log("[DEBUG] Searching hymns with query:", query);
  
  if (!query || query.trim() === '') {
    hymnsData.filteredHymns = hymnsData.allHymns;
  } else {
    const searchTerm = query.toLowerCase().trim();
    hymnsData.filteredHymns = hymnsData.allHymns.filter(hymn => {
      return (
        hymn.title?.toLowerCase().includes(searchTerm) ||
        hymn.author?.toLowerCase().includes(searchTerm) ||
        hymn.category?.toLowerCase().includes(searchTerm)
      );
    });
  }
  
  hymnsData.filteredHymnsCount = hymnsData.filteredHymns.length;
  updateHymnsDisplay();
}

// Filter hymns by category
function filterHymnsByCategory(category) {
  console.log("[DEBUG] Filtering hymns by category:", category);
  
  if (!category || category === '') {
    hymnsData.filteredHymns = hymnsData.allHymns;
  } else {
    hymnsData.filteredHymns = hymnsData.allHymns.filter(hymn => 
      hymn.category === category
    );
  }
  
  hymnsData.filteredHymnsCount = hymnsData.filteredHymns.length;
  updateHymnsDisplay();
}

// Filter hymns by author
function filterHymnsByAuthor(author) {
  console.log("[DEBUG] Filtering hymns by author:", author);
  
  if (!author || author === '') {
    hymnsData.filteredHymns = hymnsData.allHymns;
  } else {
    hymnsData.filteredHymns = hymnsData.allHymns.filter(hymn => 
      hymn.author === author
    );
  }
  
  hymnsData.filteredHymnsCount = hymnsData.filteredHymns.length;
  updateHymnsDisplay();
}

// Sort hymns
function sortHymns(sortBy) {
  console.log("[DEBUG] Sorting hymns by:", sortBy);
  
  hymnsData.filteredHymns = [...hymnsData.filteredHymns].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '');
      case 'author-asc':
        return (a.author || '').localeCompare(b.author || '');
      case 'author-desc':
        return (b.author || '').localeCompare(a.author || '');
      case 'serial-asc':
        return a.serial_number - b.serial_number;
      case 'serial-desc':
        return b.serial_number - a.serial_number;
      default:
        return 0;
    }
  });
  
  updateHymnsDisplay();
}

// Extract video ID from YouTube URL
function extractVideoId(url) {
  if (!url) return null;
  console.log('[DEBUG] Extracting video ID from URL:', url);
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log('[DEBUG] Extracted video ID:', match[1]);
      return match[1];
    }
  }
  
  console.warn('[DEBUG] Could not extract video ID from:', url);
  return null;
}

// Render hymn card
function renderHymnCard(hymn) {
  return `
    <div class="hymn-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <!-- Thumbnail -->
      <div class="hymn-thumbnail" onclick="playHymnEmbedded({
        serial_number: ${hymn.serial_number},
        title: '${hymn.title?.replace(/'/g, "\\'")}',
        author: '${hymn.author?.replace(/'/g, "\\'")}',
        category: '${hymn.category?.replace(/'/g, "\\'")}',
        url: '${hymn.url}',
        lyrics: ${JSON.stringify(hymn.lyrics || []).replace(/'/g, "\\'")}
      })">
        ${hymn.url ? `
          <img 
            src="https://img.youtube.com/vi/${extractVideoId(hymn.url)}/mqdefault.jpg" 
            alt="${hymn.title}" 
            class="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            loading="lazy"
          />
          <div class="play-overlay">
            <i class="bi bi-play-circle-fill text-6xl text-white opacity-90"></i>
          </div>
        ` : `
          <div class="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <i class="bi bi-book text-6xl text-white opacity-50"></i>
          </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
            #${hymn.serial_number}
          </span>
          ${hymn.category ? `
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              ${hymn.category}
            </span>
          ` : ''}
        </div>
        
        <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-2" title="${hymn.title}">
          ${hymn.title || 'Untitled Hymn'}
        </h3>
        
        <p class="text-sm text-gray-600 mb-4 line-clamp-1" title="${hymn.author}">
          ${hymn.author || 'Unknown Author'}
        </p>
        
        <!-- Action Buttons -->
        <div class="card-actions">
          ${window.generateCardActions ? window.generateCardActions(hymn, 'hymn') : ''}
        </div>
      </div>
    </div>
  `;
}

// Render hymn row for list view (NEW FUNCTION)
function renderHymnRow(hymn) {
  const videoId = extractVideoId(hymn.url);
  
  return `
    <div class="hymn-row bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div class="flex items-center p-4 gap-4">
        <!-- Thumbnail -->
        <div class="flex-shrink-0 cursor-pointer" onclick="playHymnEmbedded({
          serial_number: ${hymn.serial_number},
          title: '${hymn.title?.replace(/'/g, "\\'")}',
          author: '${hymn.author?.replace(/'/g, "\\'")}',
          category: '${hymn.category?.replace(/'/g, "\\'")}',
          url: '${hymn.url}',
          lyrics: ${JSON.stringify(hymn.lyrics || []).replace(/'/g, "\\'")}
        })">
          ${hymn.url ? `
            <div class="relative group">
              <img 
                src="https://img.youtube.com/vi/${videoId}/default.jpg" 
                alt="${hymn.title}"
                class="w-20 h-14 object-cover rounded"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                <i class="bi bi-play-circle-fill text-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          ` : `
            <div class="w-20 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
              <i class="bi bi-book text-2xl text-white opacity-50"></i>
            </div>
          `}
        </div>
        
        <!-- Hymn Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
              #${hymn.serial_number}
            </span>
            <h3 class="font-semibold text-gray-900 truncate" title="${hymn.title}">
              ${hymn.title || 'Untitled Hymn'}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="truncate" title="${hymn.author}">
              <i class="bi bi-person-circle mr-1"></i>${hymn.author || 'Unknown Author'}
            </span>
            ${hymn.category ? `
              <span class="flex-shrink-0">
                <i class="bi bi-tag mr-1"></i>${hymn.category}
              </span>
            ` : ''}
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex-shrink-0">
          <div class="flex gap-2">
            ${window.generateCardActions ? window.generateCardActions(hymn, 'hymn') : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render hymns grid using shared utility
function renderHymnsGrid() {
  return window.renderViewContent(
    hymnsData.viewMode,
    hymnsData.filteredHymns,
    renderHymnCard,
    renderHymnRow
  );
}

// Render hymn lyrics view
function renderHymnLyricsView(hymn) {
  const videoId = extractVideoId(hymn.url);
  
  return `
    <div class="hymn-lyrics-view">
      <!-- Back Button -->
      <button 
        onclick="backToHymnsList()" 
        class="mb-6 inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
      >
        <i class="bi bi-arrow-left mr-2"></i>
        Back to Hymns
      </button>

      <!-- Hymn Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <span class="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded">
              Hymn #${hymn.serial_number}
            </span>
            <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-2">${hymn.title}</h1>
            <p class="text-lg text-gray-600">
              <i class="bi bi-person-circle mr-2"></i>${hymn.author || 'Unknown Author'}
            </p>
            ${hymn.category ? `
              <p class="text-sm text-gray-500 mt-1">
                <i class="bi bi-tag mr-2"></i>${hymn.category}
              </p>
            ` : ''}
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            ${hymn.url ? `
              <button 
                onclick="playHymnEmbedded(${JSON.stringify(hymn).replace(/"/g, '&quot;')})" 
                class="btn-primary"
                title="Play hymn">
                <i class="bi bi-play-fill mr-2"></i>Play
              </button>
            ` : ''}
            <button 
              onclick="copyHymnLinkBySerial(${hymn.serial_number})" 
              class="btn-secondary"
              title="Copy link">
              <i class="bi bi-link-45deg"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Lyrics Section -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <i class="bi bi-book text-purple-600 mr-3"></i>
          Lyrics
        </h2>
        
        ${hymn.lyrics && hymn.lyrics.length > 0 ? `
          <div class="lyrics-content space-y-6">
            ${hymn.lyrics.map((verse, idx) => `
              <div class="lyrics-paragraph" key="${idx}">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${verse}</p>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-8">
            <i class="bi bi-file-text text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">No lyrics available for this hymn</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// View hymn details
function viewHymnDetails(serialNumber) {
  console.log("[DEBUG] Viewing hymn details:", serialNumber);
  
  const hymn = hymnsData.allHymns.find(h => h.serial_number === parseInt(serialNumber));
  
  if (!hymn) {
    console.error("[DEBUG] Hymn not found:", serialNumber);
    if (window.showToast) {
      showToast("Hymn not found", "error");
    }
    return;
  }
  
  // Update state
  hymnsData.showLyrics = true;
  hymnsData.selectedHymn = hymn;
  
  // Update meta tags
  if (window.updateMetaTags) {
    window.updateMetaTags(hymn.title, `View ${hymn.title} by ${hymn.author}`);
  }
  
  // Update URL
  const urlTitle = hymn.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const newUrl = `${window.location.pathname}?hymn=${hymn.serial_number}&title=${urlTitle}`;
  window.history.pushState({ hymn: hymn.serial_number }, '', newUrl);
  
  // Re-render
  if (window.renderAppUI) {
    window.renderAppUI();
  }
}

// Back to hymns list
function backToHymnsList() {
  console.log("[DEBUG] Returning to hymns list");
  
  hymnsData.showLyrics = false;
  hymnsData.selectedHymn = null;
  
  // Reset meta tags
  if (window.resetMetaTags) {
    window.resetMetaTags();
  }
  
  // Update URL
  const newUrl = window.location.pathname;
  window.history.pushState({}, '', newUrl);
  
  // Re-render
  if (window.renderAppUI) {
    window.renderAppUI();
  }
}

// Copy hymn link
function copyHymnLinkBySerial(serialNumber) {
  const hymn = hymnsData.allHymns.find(h => h.serial_number === parseInt(serialNumber));
  
  if (!hymn) {
    console.error("[DEBUG] Hymn not found for copy:", serialNumber);
    return;
  }
  
  const urlTitle = hymn.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const url = `${window.location.origin}${window.location.pathname}?hymn=${hymn.serial_number}&title=${urlTitle}`;
  
  navigator.clipboard.writeText(url).then(() => {
    console.log("[DEBUG] Hymn link copied:", url);
    if (window.showToast) {
      showToast("Link copied to clipboard!", "success");
    }
  }).catch(err => {
    console.error("[DEBUG] Failed to copy link:", err);
    if (window.showToast) {
      showToast("Failed to copy link", "error");
    }
  });
}

// Play hymn in embedded player
function playHymnEmbedded(hymn) {
  console.log('[DEBUG] Playing hymn in embedded player:', hymn.title);
  
  if (!hymn || !hymn.url) {
    console.error('[DEBUG] Invalid hymn or missing URL');
    if (window.showToast) {
      showToast('Cannot play hymn - missing video URL', 'error');
    }
    return;
  }
  
  // Show the shared player with this hymn
  if (window.showSharedPlayer) {
    window.showSharedPlayer(hymn, 'hymn');
  } else {
    console.error('[DEBUG] showSharedPlayer not available');
    if (window.showToast) {
      showToast('Media player not loaded', 'error');
    }
  }
}

// Toggle view mode
function toggleHymnsViewMode(mode) {
  console.log("[DEBUG] Toggling hymns view mode to:", mode);
  hymnsData.viewMode = mode;
  window.setViewMode('hymns', mode);
  updateHymnsDisplay();
}

// Update hymns display
function updateHymnsDisplay() {
  console.log("[DEBUG] Updating hymns display");
  
  if (!hymnsData.isLoaded) {
    console.log("[DEBUG] Hymns not loaded yet, will update when loaded");
    return;
  }
  
  const hymnsGrid = document.getElementById("hymns-grid");
  if (!hymnsGrid) {
    console.warn("[DEBUG] Hymns grid element not found");
    return;
  }
  
  hymnsGrid.innerHTML = renderHymnsGrid();
  
  // Update count display
  const countDisplay = document.querySelector('.text-sm.text-gray-600');
  if (countDisplay) {
    countDisplay.innerHTML = `
      Showing <span class="font-semibold">${hymnsData.filteredHymnsCount}</span> of 
      <span class="font-semibold">${hymnsData.allHymnsCount}</span> hymns
    `;
  }
}

// Render hymns tab
function renderHymnsTab() {
  console.log("[DEBUG] Rendering Hymns tab");
  
  // If data not loaded yet, show loading state
  if (!hymnsData.isLoaded) {
    return `
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="loading-spinner mx-auto mb-4"></div>
          <p class="text-gray-600">Loading hymns data...</p>
        </div>
      </div>
    `;
  }
  
  // Show lyrics view if selected
  if (hymnsData.showLyrics && hymnsData.selectedHymn) {
    return renderHymnLyricsView(hymnsData.selectedHymn);
  }
  
  // Show main hymns list
  return `
    <div class="fade-in">
      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <i class="bi bi-book text-purple-600 mr-3"></i>
          Hymns Library
        </h1>
        <p class="text-gray-600">
          Explore our collection of ${hymnsData.allHymnsCount} traditional hymns
        </p>
      </div>

      <!-- Search and Filter Section -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Search, Category, Author inputs -->
            <div class="relative">
              <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                id="hymns-search"
                placeholder="Search hymns..."
                class="form-input pl-10 w-full"
                oninput="searchHymns(this.value)"
              />
            </div>

            <select
              id="hymns-category"
              class="form-select w-full"
              onchange="filterHymnsByCategory(this.value)"
            >
              <option value="">All Categories</option>
              ${getUniqueCategories().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>

            <select
              id="hymns-author"
              class="form-select w-full"
              onchange="filterHymnsByAuthor(this.value)"
            >
              <option value="">All Authors</option>
              ${getUniqueAuthors().map(author => `<option value="${author}">${author}</option>`).join('')}
            </select>
          </div>
          
          <!-- Results Count and View Toggle -->
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-600">
              Showing <span class="font-semibold">${hymnsData.filteredHymnsCount}</span> of 
              <span class="font-semibold">${hymnsData.allHymnsCount}</span> hymns
            </p>
            
            <!-- Use shared view toggle component -->
            ${window.renderViewToggle ? window.renderViewToggle(hymnsData.viewMode, 'toggleHymnsViewMode') : ''}
          </div>
        </div>
      </div>

      <!-- Hymns Grid/List -->
      <div id="hymns-grid">
        ${renderHymnsGrid()}
      </div>
    </div>
  `;
}

// Initialize hymns tab
function initHymnsTab() {
  console.log("[DEBUG] Initializing Hymns Tab");
  
  // Use shared utility to get view mode
  hymnsData.viewMode = window.getViewMode ? window.getViewMode('hymns') : 'grid';
  console.log("[DEBUG] Initial hymns view mode:", hymnsData.viewMode);
  
  // Export hymnsData to window immediately
  window.hymnsData = hymnsData;
  
  // Export all functions to window
  window.renderHymnsTab = renderHymnsTab;
  window.updateHymnsDisplay = updateHymnsDisplay;
  window.viewHymnDetails = viewHymnDetails;
  window.backToHymnsList = backToHymnsList;
  window.copyHymnLinkBySerial = copyHymnLinkBySerial;
  window.playHymnEmbedded = playHymnEmbedded;
  window.searchHymns = searchHymns;
  window.filterHymnsByCategory = filterHymnsByCategory;
  window.filterHymnsByAuthor = filterHymnsByAuthor;
  window.sortHymns = sortHymns;
  window.toggleHymnsViewMode = toggleHymnsViewMode;
  window.getUniqueCategories = getUniqueCategories;
  window.getUniqueAuthors = getUniqueAuthors;
  window.renderHymnCard = renderHymnCard;
  window.renderHymnRow = renderHymnRow;
  window.renderHymnLyricsView = renderHymnLyricsView;
  window.initHymnsTab = initHymnsTab;
  
  // Load hymns data
  loadHymnsData();
}

// **AUTO-CALL INITIALIZATION WHEN MODULE LOADS**
console.log("[DEBUG] Auto-initializing Hymns module on load");
initHymnsTab();

console.log("[DEBUG] hymns.js module fully loaded");
