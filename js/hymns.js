/**
 * Hymns Tab Implementation for ChoristerCorner
 * Handles hymn library, search, filtering, and lyrics display
 */

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
  viewMode: 'grid'
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
    
    // Check if we need to display a specific hymn from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hymnId = urlParams.get('hymn');
    
    if (hymnId) {
      console.log('[DEBUG] Hymn ID detected in URL:', hymnId);
      // Update title
      if (window.updatePageTitleFromUrl) {
        window.updatePageTitleFromUrl();
      }
      // Navigate to that hymn if we're on hymns tab
      const hymn = data.find(h => h.serial_number === parseInt(hymnId));
      if (hymn && window.selectedTabIdx === 2) {
        console.log('[DEBUG] Auto-displaying hymn from URL:', hymn.title);
        viewHymnDetails(parseInt(hymnId));
      }
    }
    
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

/**
 * Search hymns by lyrics content
 * @param {string} query - Search query
 * @returns {Array} - Array of hymns matching the lyrics search
 */
function searchHymnsByLyrics(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return hymnsData.allHymns.filter(hymn => {
    // Check if hymn has lyrics
    if (!hymn.lyrics || hymn.lyrics.length === 0) {
      return false;
    }
    
    // Search through all lyrics verses
    return hymn.lyrics.some(verse => {
      if (typeof verse === 'string') {
        return verse.toLowerCase().includes(searchTerm);
      }
      return false;
    });
  });
}

/**
 * Search hymns by metadata (title, author, number)
 * @param {string} query - Search query
 * @returns {Array} - Array of hymns matching metadata search
 */
function searchHymnsByMetadata(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return hymnsData.allHymns.filter(hymn => {
    return (
      hymn.title?.toLowerCase().includes(searchTerm) ||
      hymn.author?.toLowerCase().includes(searchTerm) ||
      hymn.number?.toString().includes(searchTerm)
    );
  });
}

/**
 * Comprehensive search - searches both metadata and lyrics
 * @param {string} query - Search query
 */
function searchHymns(query) {
  if (!query || query.trim() === '') {
    hymnsData.filteredHymns = hymnsData.allHymns;
    hymnsData.filteredHymnsCount = hymnsData.allHymns.length;
    updateHymnsDisplay();
    return;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  // First, search by metadata (title, author, number)
  const metadataResults = searchHymnsByMetadata(searchTerm);
  
  // Then, search by lyrics
  const lyricsResults = searchHymnsByLyrics(searchTerm);
  
  // Combine results (remove duplicates)
  const combinedResults = [...metadataResults];
  
  // Add lyrics results that aren't already in metadata results
  lyricsResults.forEach(lyricsMatch => {
    const alreadyIncluded = metadataResults.some(
      metadataMatch => metadataMatch.serial_number === lyricsMatch.serial_number
    );
    
    if (!alreadyIncluded) {
      combinedResults.push(lyricsMatch);
    }
  });
  
  // Sort combined results by serial number for consistency
  combinedResults.sort((a, b) => a.serial_number - b.serial_number);
  
  hymnsData.filteredHymns = combinedResults;
  hymnsData.filteredHymnsCount = combinedResults.length;
  updateHymnsDisplay();
  
  // Show a message if search found results in lyrics
  if (lyricsResults.length > 0 && window.showToast) {
    const lyricsOnlyCount = lyricsResults.filter(lyricsMatch => {
      return !metadataResults.some(
        metadataMatch => metadataMatch.serial_number === lyricsMatch.serial_number
      );
    }).length;
    
    if (lyricsOnlyCount > 0) {
      showToast(`Found ${lyricsOnlyCount} hymn(s) matching in lyrics`, "info");
    }
  }
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

// Simplified render functions using shared utilities
function renderHymnCard(hymn) {
  return window.renderContentCard(hymn, 'hymn');
}

function renderHymnRow(hymn) {
  return window.renderContentRow(hymn, 'hymn');
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
  return window.renderLyricsView(hymn, 'hymn', 'backToHymnsList');
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
  
  // Update page title immediately
  document.title = `${hymn.title} - ${hymn.author} | ChoristerCorner`;
  
  // Update meta tags with hymn-specific OG image
  if (window.generateHymnMetaTags && window.updateMetaTags) {
    const metaTags = window.generateHymnMetaTags(hymn);
    window.updateMetaTags(metaTags.title, metaTags.description, metaTags.image, metaTags.url);
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
  
  // Reset page title
  document.title = "ChoristerCorner - Your Ultimate Worship Companion";
  
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
    if (window.showToast) {
      showToast("Hymn not found", "error");
    }
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
      showToast(`Link copied: ${hymn.title}`, "success");
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
    // Toast is already shown in card-actions.js onclick
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
  
  if (!hymnsData.isLoaded) {
    return window.renderLoadingState('Loading traditional hymns...');
  }
  
  if (hymnsData.showLyrics && hymnsData.selectedHymn) {
    return renderHymnLyricsView(hymnsData.selectedHymn);
  }
  
  return `
    <div class="hymns-container">
      ${window.renderContentHeader({
        icon: 'bi-book',
        title: 'Hymns Library',
        description: 'Explore our collection of {count} traditional hymns',
        count: hymnsData.allHymnsCount
      })}

      ${window.renderSearchControls ? window.renderSearchControls({
        searchId: 'hymns-search',
        searchPlaceholder: 'Search hymns by title, author, number, or lyrics...', // Updated placeholder
        searchFunction: 'searchHymns',
        filters: [
          {
            id: 'hymns-author',
            placeholder: 'All Authors',
            options: getUniqueAuthors(),
            onChangeFunction: 'filterHymnsByAuthor'
          }
        ],
        viewMode: hymnsData.viewMode,
        toggleFunction: 'toggleHymnsViewMode',
        resultsCount: hymnsData.filteredHymnsCount,
        totalCount: hymnsData.allHymnsCount,
        itemType: 'hymns'
      }) : ''}

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
  window.printHymnLyrics = printHymnLyrics;
  
  console.log("[DEBUG] Hymns tab functions exported to window");
  
  // Load hymns data immediately
  console.log("[DEBUG] Starting hymns data load...");
  loadHymnsData().then(() => {
    console.log("[DEBUG] Hymns data load complete. isLoaded:", hymnsData.isLoaded);
    console.log("[DEBUG] Loaded", hymnsData.allHymns.length, "hymns");
  }).catch(err => {
    console.error("[DEBUG] Error loading hymns data:", err);
  });
}

// **AUTO-CALL INITIALIZATION WHEN MODULE LOADS**
console.log("[DEBUG] Auto-initializing Hymns module on load");
initHymnsTab();

console.log("[DEBUG] hymns.js module fully loaded");

// Print hymn lyrics
function printHymnLyrics() {
  const hymn = hymnsData.selectedHymn;
  if (!hymn) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Use the shared lyrics parsing function
  let lyricsHTML = '';
  if (hymn.lyrics && hymn.lyrics.length > 0) {
    lyricsHTML = hymn.lyrics.map((verse, index) => {
      // Use the shared parsing function
      const { label, text } = window.parseLyricSection ? window.parseLyricSection(verse) : { label: null, text: verse };
      const displayLabel = label || `Verse ${index + 1}`;
      
      return `
        <div class="hymn-verse">
          <div class="verse-number">${displayLabel}</div>
          <div class="verse-text">
            ${text.split('\n').filter(line => line.trim()).map(line => '<p>' + line.trim() + '</p>').join('')}
          </div>
        </div>
      `;
    }).join('');
  } else {
    lyricsHTML = `
      <div class="hymn-verse">
        <div class="verse-text">
          <p><em>Lyrics not available for this hymn.</em></p>
        </div>
      </div>
    `;
  }
  
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
        <h1 class="hymn-title">${hymn.title || 'Untitled'}</h1>
        <p class="hymn-author">by ${hymn.author || 'Unknown Author'}</p>
        ${hymn.category ? `<div class="hymn-details">${hymn.category}</div>` : ''}
      </div>
      
      <div class="hymn-content">
        ${lyricsHTML}
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

console.log("[DEBUG] Hymns tab module initialization complete");
