/**
 * Songs Tab Implementation for ChoristerCorner
 * Handles song library, search, filtering, and lyrics display
 */

console.log("[DEBUG] songs.js loading...");

// Songs data store
let songsData = {
  allSongs: [],
  filteredSongs: [],
  showLyrics: false,
  selectedSong: null,
  isLoaded: false,
  allSongsCount: 0,
  filteredSongsCount: 0,
  viewMode: 'grid'
};

// Fetch and process songs data
async function loadSongsData() {
  console.log("[DEBUG] Loading songs data from JSON...");
  
  try {
    const response = await fetch("json/songs.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("[DEBUG] Songs data loaded:", data.length, "songs");
    
    // Store all songs
    songsData.allSongs = data;
    songsData.filteredSongs = data;
    songsData.allSongsCount = data.length;
    songsData.filteredSongsCount = data.length;
    songsData.isLoaded = true;
    
    // Export to window for global access
    window.songsData = songsData;
    
    console.log("[DEBUG] songsData exported to window:", window.songsData);
    
    // Update display if on songs tab
    if (window.selectedTabIdx === 1) {
      updateSongsDisplay();
    }
    
    return data;
  } catch (error) {
    console.error("[DEBUG] Error loading songs data:", error);
    if (window.showToast) {
      showToast("Failed to load songs data", "error");
    }
    songsData.isLoaded = false;
    window.songsData = songsData;
    return [];
  }
}

// Get unique channels for filter dropdown
function getUniqueChannels() {
  if (!songsData.allSongs || songsData.allSongs.length === 0) return [];
  
  const channels = songsData.allSongs
    .map(song => song.channel)
    .filter(channel => channel && channel.trim() !== '');
  
  return [...new Set(channels)].sort();
}

// Parse duration string (MM:SS) to seconds
function parseDuration(duration) {
  if (!duration) return 0;
  const parts = duration.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

// Search songs
function searchSongs(query) {
  console.log("[DEBUG] Searching songs with query:", query);
  
  if (!query || query.trim() === '') {
    songsData.filteredSongs = songsData.allSongs;
  } else {
    const searchTerm = query.toLowerCase().trim();
    songsData.filteredSongs = songsData.allSongs.filter(song => {
      return (
        song.title?.toLowerCase().includes(searchTerm) ||
        song.channel?.toLowerCase().includes(searchTerm)
      );
    });
  }
  
  songsData.filteredSongsCount = songsData.filteredSongs.length;
  updateSongsDisplay();
}

// Filter songs by channel
function filterSongsByChannel(channel) {
  console.log("[DEBUG] Filtering songs by channel:", channel);
  
  if (!channel || channel === '') {
    songsData.filteredSongs = songsData.allSongs;
  } else {
    songsData.filteredSongs = songsData.allSongs.filter(song => 
      song.channel === channel
    );
  }
  
  songsData.filteredSongsCount = songsData.filteredSongs.length;
  updateSongsDisplay();
}

// Sort songs
function sortSongs(sortBy) {
  console.log("[DEBUG] Sorting songs by:", sortBy);
  
  songsData.filteredSongs = [...songsData.filteredSongs].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '');
      case 'duration-asc':
        return parseDuration(a.duration) - parseDuration(b.duration);
      case 'duration-desc':
        return parseDuration(b.duration) - parseDuration(a.duration);
      case 'serial-asc':
        return a.serial_number - b.serial_number;
      case 'serial-desc':
        return b.serial_number - a.serial_number;
      default:
        return 0;
    }
  });
  
  updateSongsDisplay();
}

// Simplified render functions using shared utilities
function renderSongCard(song) {
  return window.renderContentCard(song, 'song');
}

function renderSongRow(song) {
  return window.renderContentRow(song, 'song');
}

// Render songs grid using shared utility
function renderSongsGrid() {
  return window.renderViewContent(
    songsData.viewMode,
    songsData.filteredSongs,
    renderSongCard,
    renderSongRow
  );
}

// Render song lyrics view
function renderSongLyricsView(song) {
  return window.renderLyricsView(song, 'song', 'backToSongsList');
}

// View song lyrics
function viewSongLyrics(serialNumber) {
  console.log("[DEBUG] Viewing song lyrics:", serialNumber);
  
  const song = songsData.allSongs.find(s => s.serial_number === parseInt(serialNumber));
  
  if (!song) {
    console.error("[DEBUG] Song not found:", serialNumber);
    if (window.showToast) {
      showToast("Song not found", "error");
    }
    return;
  }
  
  // Update state
  songsData.showLyrics = true;
  songsData.selectedSong = song;
  
  // Update meta tags
  if (window.updateMetaTags) {
    window.updateMetaTags(song.title, `View lyrics for ${song.title} by ${song.channel}`);
  }
  
  // Update URL
  const urlTitle = song.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const newUrl = `${window.location.pathname}?song=${song.serial_number}&title=${urlTitle}`;
  window.history.pushState({ song: song.serial_number }, '', newUrl);
  
  // Re-render
  if (window.renderAppUI) {
    window.renderAppUI();
  }
}

// Back to songs list
function backToSongsList() {
  console.log("[DEBUG] Returning to songs list");
  
  songsData.showLyrics = false;
  songsData.selectedSong = null;
  
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

// Copy song link
function copySongLinkBySerial(serialNumber) {
  const song = songsData.allSongs.find(s => s.serial_number === parseInt(serialNumber));
  
  if (!song) {
    console.error("[DEBUG] Song not found for copy:", serialNumber);
    if (window.showToast) {
      showToast("Song not found", "error");
    }
    return;
  }
  
  const urlTitle = song.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const url = `${window.location.origin}${window.location.pathname}?song=${song.serial_number}&title=${urlTitle}`;
  
  navigator.clipboard.writeText(url).then(() => {
    console.log("[DEBUG] Song link copied:", url);
    if (window.showToast) {
      showToast(`Link copied: ${song.title}`, "success");
    }
  }).catch(err => {
    console.error("[DEBUG] Failed to copy link:", err);
    if (window.showToast) {
      showToast("Failed to copy link", "error");
    }
  });
}

// Play song in embedded player
function playSongEmbedded(song) {
  console.log('[DEBUG] Playing song in embedded player:', song.title);
  
  if (!song || !song.url) {
    console.error('[DEBUG] Invalid song or missing URL');
    if (window.showToast) {
      showToast('Cannot play song - missing video URL', 'error');
    }
    return;
  }
  
  // Show the shared player with this song
  if (window.showSharedPlayer) {
    window.showSharedPlayer(song, 'song');
  } else {
    console.error('[DEBUG] showSharedPlayer not available');
    if (window.showToast) {
      showToast('Media player not loaded', 'error');
    }
  }
}

// Toggle view mode
function toggleSongsViewMode(mode) {
  console.log("[DEBUG] Toggling songs view mode to:", mode);
  songsData.viewMode = mode;
  window.setViewMode('songs', mode);
  updateSongsDisplay();
}

// Update songs display
function updateSongsDisplay() {
  console.log("[DEBUG] Updating songs display");
  
  if (!songsData.isLoaded) {
    console.log("[DEBUG] Songs not loaded yet, will update when loaded");
    return;
  }
  
  const songsGrid = document.getElementById("songs-grid");
  if (!songsGrid) {
    console.warn("[DEBUG] Songs grid element not found");
    return;
  }
  
  songsGrid.innerHTML = renderSongsGrid();
  
  // Update count display
  const countDisplay = document.querySelector('.text-sm.text-gray-600');
  if (countDisplay) {
    countDisplay.innerHTML = `
      Showing <span class="font-semibold">${songsData.filteredSongsCount}</span> of 
      <span class="font-semibold">${songsData.allSongsCount}</span> songs
    `;
  }
}

// Render songs tab
function renderSongsTab() {
  console.log("[DEBUG] Rendering Songs tab");
  
  if (!songsData.isLoaded) {
    return window.renderLoadingState ? window.renderLoadingState('Loading worship songs...') : '<div>Loading...</div>';
  }
  
  if (songsData.showLyrics && songsData.selectedSong) {
    return renderSongLyricsView(songsData.selectedSong);
  }
  
  return `
    <div class="songs-container">
      ${window.renderContentHeader ? window.renderContentHeader({
        icon: 'bi-music-note-list',
        title: 'Songs Library',
        description: 'Explore our collection of {count} worship songs',
        count: songsData.allSongsCount
      }) : ''}

      ${window.renderSearchControls ? window.renderSearchControls({
        searchId: 'songs-search',
        searchPlaceholder: 'Search songs...',
        searchFunction: 'searchSongs',
        filters: [
          {
            id: 'songs-channel',
            placeholder: 'All Channels',
            options: getUniqueChannels(),
            onChangeFunction: 'filterSongsByChannel'
          }
        ],
        viewMode: songsData.viewMode,
        toggleFunction: 'toggleSongsViewMode',
        resultsCount: songsData.filteredSongsCount,
        totalCount: songsData.allSongsCount,
        itemType: 'songs'
      }) : ''}

      <div id="songs-grid">
        ${renderSongsGrid()}
      </div>
    </div>
  `;
}

// Print song lyrics
function printSongLyrics() {
  const song = songsData.selectedSong;
  if (!song) return;

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  let lyricsHTML = '';
  if (song.lyrics && song.lyrics.length > 0) {
    lyricsHTML = song.lyrics.map((verse, index) => {
      const { label, text } = window.parseLyricSection ? window.parseLyricSection(verse) : { label: null, text: verse };
      const displayLabel = label || `Verse ${index + 1}`;
      
      return `
        <div class="song-verse">
          <div class="verse-number">${displayLabel}</div>
          <div class="verse-text">
            ${text.split('\n').filter(line => line.trim()).map(line => '<p>' + line.trim() + '</p>').join('')}
          </div>
        </div>
      `;
    }).join('');
  } else {
    lyricsHTML = `
      <div class="song-verse">
        <div class="verse-text">
          <p><em>Lyrics not available for this song.</em></p>
        </div>
      </div>
    `;
  }
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${song.title} - Lyrics</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; color: #000; }
        .song-header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .song-number { font-size: 14px; color: #666; margin-bottom: 10px; }
        .song-title { font-size: 28px; font-weight: bold; margin: 0 0 10px 0; }
        .song-artist { font-size: 18px; font-style: italic; margin: 0 0 10px 0; }
        .song-verse { margin-bottom: 25px; page-break-inside: avoid; }
        .verse-number { font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333; }
        .verse-text { margin-left: 20px; line-height: 1.8; }
        .verse-text p { margin: 0 0 5px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; text-align: center; }
        @media print { body { margin: 20px; } .song-header { page-break-after: avoid; } .song-verse { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="song-header">
        <div class="song-number">Song #${song.serial_number}</div>
        <h1 class="song-title">${song.title || 'Untitled'}</h1>
        <p class="song-artist">by ${song.channel || 'Unknown Artist'}</p>
      </div>
      <div class="song-content">${lyricsHTML}</div>
      <div class="footer"><p>Printed from ChoristerCorner.com</p></div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.onload = function() {
    printWindow.print();
    printWindow.onafterprint = function() { printWindow.close(); };
  };
}

// Initialize songs tab
function initSongsTab() {
  console.log("[DEBUG] Initializing Songs Tab");
  
  // Use shared utility to get view mode
  songsData.viewMode = window.getViewMode ? window.getViewMode('songs') : 'grid';
  console.log("[DEBUG] Initial view mode:", songsData.viewMode);
  
  // Export songsData to window immediately
  window.songsData = songsData;
  
  // Export all functions to window
  window.renderSongsTab = renderSongsTab;
  window.updateSongsDisplay = updateSongsDisplay;
  window.viewSongLyrics = viewSongLyrics;
  window.backToSongsList = backToSongsList;
  window.copySongLinkBySerial = copySongLinkBySerial;
  window.playSongEmbedded = playSongEmbedded;
  window.searchSongs = searchSongs;
  window.filterSongsByChannel = filterSongsByChannel;
  window.sortSongs = sortSongs;
  window.toggleSongsViewMode = toggleSongsViewMode;
  window.getUniqueChannels = getUniqueChannels;
  window.renderSongCard = renderSongCard;
  window.renderSongRow = renderSongRow;
  window.renderSongLyricsView = renderSongLyricsView;
  window.initSongsTab = initSongsTab;
  window.printSongLyrics = printSongLyrics;
  
  console.log("[DEBUG] Songs tab functions exported to window");
  
  // Load songs data immediately
  console.log("[DEBUG] Starting songs data load...");
  loadSongsData().then(() => {
    console.log("[DEBUG] Songs data load complete. isLoaded:", songsData.isLoaded);
    console.log("[DEBUG] Loaded", songsData.allSongs.length, "songs");
  }).catch(err => {
    console.error("[DEBUG] Error loading songs data:", err);
  });
}

// **AUTO-CALL INITIALIZATION WHEN MODULE LOADS**
console.log("[DEBUG] Auto-initializing Songs module on load");
initSongsTab();

console.log("[DEBUG] songs.js module fully loaded");

// Add event listeners for better mobile support
window.addEventListener('load', () => {
  console.log("[DEBUG] Window loaded, checking for pending song parameters");
  setTimeout(() => {
    checkPendingSongUrlParameters();
  }, 500);
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  console.log("[DEBUG] Popstate event, checking URL parameters");
  // Reset the processing flag for new navigation
  songsData.urlParametersProcessed = false;
  
  if (songsData.isLoaded) {
    handleSongUrlParameters();
  } else {
    // If songs aren't loaded yet, store the song ID for later
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('song');
    if (songId) {
      sessionStorage.setItem('pendingSongId', songId);
    }
  }
});

// Display lyrics in the lyrics container
function displayLyrics(lyrics) {
  const lyricsContainer = document.getElementById('lyrics-display');
  if (!lyricsContainer) {
    console.log('[DEBUG] Lyrics display container not found');
    return;
  }
  
  if (lyrics && lyrics.length > 0) {
    console.log('[DEBUG] Rendering full lyrics view with utility function');
    // Use the shared lyrics rendering function for full view (not media player)
    lyricsContainer.innerHTML = window.renderLyrics(lyrics, false);
  } else {
    lyricsContainer.innerHTML = '<p class="text-gray-500 italic text-center py-8">No lyrics available</p>';
  }
}

console.log("[DEBUG] Songs tab module initialization complete");
