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
  viewMode: 'grid' // Will be updated in init
};

// Get default view mode based on device
function getDefaultViewMode() {
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  // Check localStorage first
  const savedMode = localStorage.getItem('songsViewMode');
  if (savedMode) {
    return savedMode;
  }
  
  // Default to list on mobile, grid on desktop
  return isMobile ? 'list' : 'grid';
}

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

// Helper: Parse duration string to seconds
function parseDuration(duration) {
  if (!duration) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
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

// Render song card for grid view
function renderSongCard(song) {
  return `
    <div class="song-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <!-- Thumbnail -->
      <div class="song-thumbnail" onclick="playSongEmbedded({
        serial_number: ${song.serial_number},
        title: '${song.title?.replace(/'/g, "\\'")}',
        channel: '${song.channel?.replace(/'/g, "\\'")}',
        duration: '${song.duration}',
        url: '${song.url}',
        lyrics: ${JSON.stringify(song.lyrics || []).replace(/'/g, "\\'")}
      })">
        ${song.url ? `
          <img 
            src="https://img.youtube.com/vi/${extractVideoId(song.url)}/mqdefault.jpg" 
            alt="${song.title}" 
            class="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            loading="lazy"
          />
          <div class="play-overlay">
            <i class="bi bi-play-circle-fill text-6xl text-white opacity-90"></i>
          </div>
        ` : `
          <div class="w-full h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <i class="bi bi-music-note text-6xl text-white opacity-50"></i>
          </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
            #${song.serial_number}
          </span>
          <span class="text-xs text-gray-500">${song.duration}</span>
        </div>
        
        <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-2" title="${song.title}">
          ${song.title || 'Untitled Song'}
        </h3>
        
        <p class="text-sm text-gray-600 mb-4 line-clamp-1" title="${song.channel}">
          ${song.channel || 'Unknown Artist'}
        </p>
        
        <!-- Action Buttons -->
        <div class="card-actions">
          ${window.generateCardActions ? window.generateCardActions(song, 'song') : ''}
        </div>
      </div>
    </div>
  `;
}

// Render song row for list view
function renderSongRow(song) {
  const videoId = extractVideoId(song.url);
  
  return `
    <div class="song-row bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div class="flex items-center p-4 gap-4">
        <!-- Thumbnail -->
        <div class="flex-shrink-0 cursor-pointer" onclick="playSongEmbedded({
          serial_number: ${song.serial_number},
          title: '${song.title?.replace(/'/g, "\\'")}',
          channel: '${song.channel?.replace(/'/g, "\\'")}',
          duration: '${song.duration}',
          url: '${song.url}',
          lyrics: ${JSON.stringify(song.lyrics || []).replace(/'/g, "\\'")}
        })">
          ${song.url ? `
            <div class="relative group">
              <img 
                src="https://img.youtube.com/vi/${videoId}/default.jpg" 
                alt="${song.title}"
                class="w-20 h-14 object-cover rounded"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                <i class="bi bi-play-circle-fill text-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          ` : `
            <div class="w-20 h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded flex items-center justify-center">
              <i class="bi bi-music-note text-2xl text-white opacity-50"></i>
            </div>
          `}
        </div>
        
        <!-- Song Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
              #${song.serial_number}
            </span>
            <h3 class="font-semibold text-gray-900 truncate" title="${song.title}">
              ${song.title || 'Untitled Song'}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="truncate" title="${song.channel}">
              <i class="bi bi-person-circle mr-1"></i>${song.channel || 'Unknown Artist'}
            </span>
            <span class="flex-shrink-0">
              <i class="bi bi-clock mr-1"></i>${song.duration}
            </span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex-shrink-0">
          <div class="flex gap-2">
            ${window.generateCardActions ? window.generateCardActions(song, 'song') : ''}
          </div>
        </div>
      </div>
    </div>
  `;
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
  const videoId = extractVideoId(song.url);
  
  return `
    <div class="song-lyrics-view">
      <!-- Back Button -->
      <button 
        onclick="backToSongsList()" 
        class="mb-6 inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
      >
        <i class="bi bi-arrow-left mr-2"></i>
        Back to Songs
      </button>

      <!-- Song Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <span class="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded">
              Song #${song.serial_number}
            </span>
            <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-2">${song.title}</h1>
            <p class="text-lg text-gray-600">
              <i class="bi bi-person-circle mr-2"></i>${song.channel || 'Unknown Artist'}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              <i class="bi bi-clock mr-2"></i>${song.duration}
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            ${song.url ? `
              <button 
                onclick="playSongEmbedded(${JSON.stringify(song).replace(/"/g, '&quot;')})" 
                class="btn-primary"
                title="Play song">
                <i class="bi bi-play-fill mr-2"></i>Play
              </button>
            ` : ''}
            <button 
              onclick="copySongLinkBySerial(${song.serial_number})" 
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
          <i class="bi bi-music-note-list text-purple-600 mr-3"></i>
          Lyrics
        </h2>
        
        ${song.lyrics && song.lyrics.length > 0 ? `
          <div class="lyrics-content space-y-6">
            ${song.lyrics.map((paragraph, idx) => `
              <div class="lyrics-paragraph" key="${idx}">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${paragraph}</p>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-8">
            <i class="bi bi-file-text text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">No lyrics available for this song</p>
          </div>
        `}
      </div>
    </div>
  `;
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
      showToast("Link copied to clipboard!", "success");
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
  
  // If data not loaded yet, show loading state
  if (!songsData.isLoaded) {
    return `
      <div class="songs-container">
        <div class="songs-header">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            <i class="bi bi-music-note-list text-purple-600 mr-2"></i>
            Songs Library
          </h2>
          <p class="text-gray-600 mb-6">Loading worship songs...</p>
        </div>
        
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">Loading songs data...</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Show lyrics view if selected
  if (songsData.showLyrics && songsData.selectedSong) {
    return renderSongLyricsView(songsData.selectedSong);
  }
  
  // Show main songs list
  return `
    <div class="songs-container">
      <!-- Header Section -->
      <div class="songs-header">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <i class="bi bi-music-note-list text-purple-600 mr-2"></i>
          Songs Library
        </h2>
        <p class="text-gray-600 mb-6">
          Explore our collection of ${songsData.allSongsCount} worship songs
        </p>
      </div>

      <!-- Search and Filter Section -->
      <div class="songs-controls mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Search, Channel, Sort inputs stay the same -->
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              id="songs-search"
              placeholder="Search songs..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              oninput="searchSongs(this.value)"
            />
          </div>

          <select
            id="songs-channel"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onchange="filterSongsByChannel(this.value)"
          >
            <option value="">All Channels</option>
            ${getUniqueChannels().map(channel => `<option value="${channel}">${channel}</option>`).join('')}
          </select>

          <select
            id="songs-sort"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onchange="sortSongs(this.value)"
          >
            <option value="serial-asc">Serial Number (Low to High)</option>
            <option value="serial-desc">Serial Number (High to Low)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="duration-asc">Duration (Shortest)</option>
            <option value="duration-desc">Duration (Longest)</option>
          </select>
        </div>
        
        <!-- View Mode Toggle and Results Count -->
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Showing <span class="font-semibold">${songsData.filteredSongsCount}</span> of 
            <span class="font-semibold">${songsData.allSongsCount}</span> songs
          </p>
          
          <!-- Use shared view toggle component -->
          ${window.renderViewToggle ? window.renderViewToggle(songsData.viewMode, 'toggleSongsViewMode') : ''}
        </div>
      </div>

      <!-- Songs Grid/List -->
      <div id="songs-grid">
        ${renderSongsGrid()}
      </div>
    </div>
  `;
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
  window.extractVideoId = extractVideoId;
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

// Print song lyrics
function printSongLyrics() {
  const song = songsData.selectedSong;
  if (!song) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Use the shared lyrics parsing function
  let lyricsHTML = '';
  if (song.lyrics && song.lyrics.length > 0) {
    lyricsHTML = song.lyrics.map((verse, index) => {
      // Use the shared parsing function
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
  
  // Generate print-friendly HTML
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${song.title} - Lyrics</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 40px;
          color: #000;
        }
        .song-header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .song-number {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        .song-title {
          font-size: 28px;
          font-weight: bold;
          margin: 0 0 10px 0;
        }
        .song-artist {
          font-size: 18px;
          font-style: italic;
          margin: 0 0 10px 0;
        }
        .song-details {
          font-size: 14px;
          color: #666;
          margin: 0 0 5px 0;
        }
        .song-source {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
        .song-verse {
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
          .song-header { page-break-after: avoid; }
          .song-verse { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="song-header">
        <div class="song-number">Song #${song.serial_number}</div>
        <h1 class="song-title">${song.title || 'Untitled'}</h1>
        <p class="song-artist">by ${song.channel || 'Unknown Artist'}</p>
        <div class="song-details">
          ${song.duration || 'Duration not available'}
          ${song.category ? ` • ${song.category}` : ''}
        </div>
        <p class="song-source">${song.channel} • ${song.duration}</p>
      </div>
      
      <div class="song-content">
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
