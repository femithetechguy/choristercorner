/**
 * Songs Tab Implementation for ChoristerCorner
 * Handles song library, search, filtering, and lyrics display
 */

console.log("[DEBUG] Songs tab module loaded");

// Songs tab data and state
let songsData = {
  allSongs: [],
  filteredSongs: [],
  currentView: 'grid', // 'grid' or 'list'
  searchTerm: '',
  sortBy: 'title', // 'title', 'channel', 'duration', 'serial_number'
  sortOrder: 'asc', // 'asc' or 'desc'
  selectedSong: null,
  showLyrics: false,
  isLoaded: false,
  // Video player state
  currentPlayingSong: null,
  isVideoPlayerVisible: false,
  videoPlayerContainer: null,
  // Player collapse state
  isPlayerCollapsed: false,
  // Playlist updater state
  showPlaylistUpdater: false,
  // URL handling state to prevent duplicate processing
  urlParametersProcessed: false
};

// Load songs data
async function loadSongsData() {
  try {
    console.log("[DEBUG] Loading songs data");
    const response = await fetch('json/songs.json');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      songsData.allSongs = data;
      songsData.filteredSongs = [...data];
      songsData.isLoaded = true;
      console.log("[DEBUG] Songs data loaded successfully:", data.length, "songs");
      
      // Check if we need to show a specific song from URL parameters
      handleSongUrlParameters();
      
      // Also check for pending song parameters (mobile reliability)
      setTimeout(() => {
        checkPendingSongUrlParameters();
      }, 200);
    }
  } catch (error) {
    console.error("[DEBUG] Failed to load songs data:", error);
    songsData.isLoaded = false;
  }
}

// Handle URL parameters for direct song links
function handleSongUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('song');
  
  // Only process if there's a song ID in the URL and we haven't processed this specific URL yet
  if (!songId) {
    console.log("[DEBUG] No song ID in URL, skipping URL parameter processing");
    return;
  }
  
  // Prevent processing the same URL parameters multiple times
  const currentUrl = window.location.href;
  if (songsData.urlParametersProcessed && songsData.lastProcessedUrl === currentUrl) {
    console.log("[DEBUG] URL parameters already processed for this URL, skipping");
    return;
  }
  
  console.log("[DEBUG] Direct song link detected:", songId);
  songsData.urlParametersProcessed = true; // Mark as processed
  songsData.lastProcessedUrl = currentUrl; // Store the processed URL
    
    const song = songsData.allSongs.find(s => s.serial_number === parseInt(songId));
    
    if (song) {
      // Store the song ID for later use if app isn't fully loaded yet
      sessionStorage.setItem('pendingSongId', songId);
      
      // Switch to Songs tab if not already there
      if (typeof window.switchToTab === 'function') {
        window.switchToTab('Songs');
      }
      
      // Show the song lyrics with multiple retry attempts for mobile
      let retryCount = 0;
      const maxRetries = 50; // Maximum 5 seconds of retries
      const showSong = () => {
        console.log("[DEBUG] Attempting to show song:", song.title, `(attempt ${retryCount + 1}/${maxRetries})`);
        
        // Check if the app UI is ready
        if ((document.getElementById('app-root') || document.getElementById('app')) && typeof viewSongLyrics === 'function') {
          viewSongLyrics(song.serial_number);
          updatePageTitle(song);
          // Clear the pending song ID since we successfully showed it
          sessionStorage.removeItem('pendingSongId');
          console.log("[DEBUG] Successfully showed song:", song.title);
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log("[DEBUG] App not ready yet, retrying in 100ms");
          setTimeout(showSong, 100);
        } else {
          console.error("[DEBUG] Failed to show song after maximum retries:", song.title);
          sessionStorage.removeItem('pendingSongId');
        }
      };
      
      // Start showing the song with a small delay to ensure everything is loaded
      setTimeout(showSong, 300);
    } else {
      console.warn("[DEBUG] Song not found for ID:", songId);
      // Clear any pending song ID if song doesn't exist
      sessionStorage.removeItem('pendingSongId');
    }
}

// Check for pending song URL parameters (for mobile reliability)
function checkPendingSongUrlParameters() {
  // Don't process if we already handled URL parameters
  if (songsData.urlParametersProcessed) {
    console.log("[DEBUG] URL parameters already processed, skipping pending check");
    return;
  }
  
  const pendingSongId = sessionStorage.getItem('pendingSongId');
  
  if (pendingSongId && songsData.allSongs.length > 0) {
    console.log("[DEBUG] Processing pending song ID:", pendingSongId);
    const song = songsData.allSongs.find(s => s.serial_number === parseInt(pendingSongId));
    
    if (song) {
      // Ensure we're on the Songs tab
      if (typeof window.switchToTab === 'function') {
        window.switchToTab('Songs');
      }
      
      // Show the song with retry logic to ensure mobile is ready
      let retryCount = 0;
      const maxRetries = 30; // Maximum 3 seconds of retries
      const showPendingSong = () => {
        if ((document.getElementById('app-root') || document.getElementById('app')) && typeof viewSongLyrics === 'function') {
          viewSongLyrics(song.serial_number);
          updatePageTitle(song);
          sessionStorage.removeItem('pendingSongId');
          console.log("[DEBUG] Successfully showed pending song:", song.title);
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(showPendingSong, 100);
        } else {
          console.error("[DEBUG] Failed to show pending song after maximum retries:", song.title);
          sessionStorage.removeItem('pendingSongId');
        }
      };
      
      setTimeout(showPendingSong, 300);
    } else {
      // Clear invalid pending song ID
      sessionStorage.removeItem('pendingSongId');
    }
  }
}

// Update page title for shared song links
function updatePageTitle(song) {
  if (song && song.title) {
    // Use SEO helper if available
    if (window.seoHelper) {
      window.seoHelper.updateSongSEO(song);
    } else {
      // Fallback to basic title update
      const originalTitle = document.title;
      document.title = `${song.title} - ${song.channel || 'Unknown Artist'} | ChoristerCorner`;
      
      // Store the restore function for later use
      window.restorePageTitle = () => {
        document.title = originalTitle;
        // Reset SEO to default if helper is available
        if (window.seoHelper) {
          window.seoHelper.resetToDefault();
        }
      };
    }
  }
}

// Render the Songs tab content
window.renderSongsTab = function(tab) {
  console.log("[DEBUG] Rendering Songs tab");
  
  if (!songsData.isLoaded) {
    loadSongsData();
  } else {
    // Only check for pending song parameters on first load or if there are actual URL parameters
    // Don't re-process if we're just switching tabs
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('song');
    
    if (songId && !songsData.urlParametersProcessed) {
      setTimeout(() => {
        checkPendingSongUrlParameters();
      }, 100);
    }
  }
  
  if (songsData.showLyrics && songsData.selectedSong) {
    return renderSongLyricsView();
  }
  
  return `
    <div class="fade-in">
      <!-- Songs Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 flex items-center mb-2">
            <i class="bi bi-music-note-list text-purple-600 mr-3"></i>
            Song Library
          </h1>
          <p class="text-gray-600">Discover and explore our collection of worship songs</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 md:mt-0">
          <button onclick="togglePlaylistUpdater()" class="btn btn-outline btn-sm">
            <i class="bi bi-collection-play mr-1"></i>
            Add from Playlist
          </button>
          <span id="song-count-display" class="text-sm text-gray-500">${songsData.filteredSongs.length} of ${songsData.allSongs.length} songs</span>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search Bar -->
            <div class="lg:col-span-2">
              <div class="relative">
                <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  id="song-search"
                  class="form-input pl-10 w-full" 
                  placeholder="Search songs, artists, channels, or lyrics..."
                  value="${songsData.searchTerm}"
                  oninput="handleSearch(this.value)"
                >
              </div>
            </div>
            
            <!-- Sort By -->
            <div>
              <select id="sort-by" class="form-select w-full" onchange="handleSort(this.value)">
                <option value="title" ${songsData.sortBy === 'title' ? 'selected' : ''}>Sort by Title</option>
                <option value="channel" ${songsData.sortBy === 'channel' ? 'selected' : ''}>Sort by Artist</option>
                <option value="duration" ${songsData.sortBy === 'duration' ? 'selected' : ''}>Sort by Duration</option>
                <option value="serial_number" ${songsData.sortBy === 'serial_number' ? 'selected' : ''}>Sort by ID</option>
              </select>
            </div>
            
            <!-- View Toggle -->
            <div class="flex rounded-md border border-gray-300">
              <button 
                onclick="toggleView('grid')" 
                class="flex-1 py-2 px-3 text-sm ${songsData.currentView === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-50'} rounded-l-md border-r border-gray-300"
              >
                <i class="bi bi-grid"></i> Grid
              </button>
              <button 
                onclick="toggleView('list')" 
                class="flex-1 py-2 px-3 text-sm ${songsData.currentView === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-50'} rounded-r-md"
              >
                <i class="bi bi-list"></i> List
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlist Updater Section -->
      ${songsData.showPlaylistUpdater ? `
        <div class="mb-6">
          <div id="playlist-updater-container">
            ${window.PlaylistUpdater ? window.PlaylistUpdater.createUI() : `
              <div class="card">
                <div class="card-body text-center">
                  <i class="bi bi-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                  <h4 class="font-semibold text-gray-900 mb-2">Playlist Updater Not Available</h4>
                  <p class="text-gray-600 mb-4">The playlist updater module is not loaded.</p>
                  <button onclick="togglePlaylistUpdater()" class="btn btn-outline">Close</button>
                </div>
              </div>
            `}
          </div>
        </div>
      ` : ''}

      <!-- Songs Grid/List -->
      <div id="songs-container">
        ${renderSongsContainer()}
      </div>

      <!-- Embedded Video Player with Lyrics (only render if not already present) -->
      ${document.getElementById('video-player-section') ? '' : renderEmbeddedVideoPlayer()}
    </div>
  `;
};

// Render songs container based on current view
function renderSongsContainer() {
  if (!songsData.filteredSongs.length) {
    return `
      <div class="card">
        <div class="card-body text-center py-12">
          <i class="bi bi-music-note text-6xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No songs found</h3>
          <p class="text-gray-600">Try adjusting your search or filters</p>
        </div>
      </div>
    `;
  }

  if (songsData.currentView === 'grid') {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${songsData.filteredSongs.map(song => renderSongCard(song)).join('')}
      </div>
    `;
  } else {
    return `
      <div class="card">
        <div class="card-body p-0">
          <div class="divide-y divide-gray-200">
            ${songsData.filteredSongs.map(song => renderSongListItem(song)).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

// Render individual song card (grid view)
function renderSongCard(song) {
  return `
    <div class="card hover:shadow-lg transition-shadow">
      <div class="card-body">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">#${song.serial_number}</span>
          <span class="text-sm text-gray-500">${song.duration || 'N/A'}</span>
        </div>
        
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${song.title || 'Untitled'}</h3>
        <p class="text-sm text-gray-600 mb-4 flex items-center">
          <i class="bi bi-person-circle mr-1"></i>
          ${song.channel || 'Unknown Artist'}
        </p>
        
        <!-- Lyrics Preview -->
        ${song.lyrics && song.lyrics.length > 0 ? `
          <div class="mb-4 p-2 bg-gray-50 rounded text-xs text-gray-600 line-clamp-2">
            ${song.lyrics[0] || 'No lyrics preview available'}
          </div>
        ` : ''}
        
        <div class="flex space-x-2">
          <button 
            onclick="playSong('${song.url}')" 
            class="flex-1 btn btn-primary btn-sm"
            ${!song.url ? 'disabled' : ''}
            title="Listen on YouTube"
          >
            <i class="bi bi-play-fill"></i>
            <span>Listen</span>
          </button>
          <button 
            onclick="viewSongLyrics(${song.serial_number})" 
            class="btn btn-outline btn-sm"
            title="View lyrics"
          >
            <i class="bi bi-file-text"></i>
          </button>
          <button 
            onclick="copySongLinkBySerial(${song.serial_number})" 
            class="btn btn-ghost btn-sm"
            title="Copy page link"
          >
            <i class="bi bi-link-45deg"></i>
          </button>
          <button 
            onclick="toggleFavorite(${song.serial_number})" 
            class="btn btn-ghost btn-sm"
            title="Add to favorites"
          >
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render individual song list item (list view)
function renderSongListItem(song) {
  return `
    <div class="p-4 hover:bg-gray-50 transition-colors">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3">
            <span class="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">#${song.serial_number}</span>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">${song.title || 'Untitled'}</h3>
              <p class="text-sm text-gray-600 flex items-center">
                <i class="bi bi-person-circle mr-1"></i>
                ${song.channel || 'Unknown Artist'}
                <span class="mx-2">•</span>
                <i class="bi bi-clock mr-1"></i>
                ${song.duration || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2 ml-4">
          <button 
            onclick="playSong('${song.url}')" 
            class="btn btn-primary btn-sm"
            ${!song.url ? 'disabled' : ''}
            title="Listen on YouTube"
          >
            <i class="bi bi-play-fill"></i>
          </button>
          <button 
            onclick="viewSongLyrics(${song.serial_number})" 
            class="btn btn-outline btn-sm"
            title="View lyrics"
          >
            <i class="bi bi-file-text"></i>
          </button>
          <button 
            onclick="copySongLinkBySerial(${song.serial_number})" 
            class="btn btn-ghost btn-sm"
            title="Copy page link"
          >
            <i class="bi bi-link-45deg"></i>
          </button>
          <button 
            onclick="toggleFavorite(${song.serial_number})" 
            class="btn btn-ghost btn-sm"
            title="Add to favorites"
          >
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render song lyrics view
function renderSongLyricsView() {
  const song = songsData.selectedSong;
  if (!song) return '';

  return `
    <div class="fade-in">
      <!-- Lyrics Header -->
      <div class="flex items-center justify-between mb-6">
        <button onclick="closeLyricsView()" class="btn btn-ghost">
          <i class="bi bi-arrow-left"></i>
          <span>Back to Songs</span>
        </button>
        <div class="flex items-center space-x-2">
          <button onclick="playSong('${song.url}')" class="btn btn-primary" ${!song.url ? 'disabled' : ''}>
            <i class="bi bi-play-fill"></i>
            <span>Listen</span>
          </button>
          <button onclick="copySongLinkBySerial(${song.serial_number})" class="btn btn-outline">
            <i class="bi bi-link-45deg"></i>
            <span>Copy Page Link</span>
          </button>
          <button onclick="toggleFavorite(${song.serial_number})" class="btn btn-outline">
            <i class="bi bi-heart"></i>
          </button>
        </div>
      </div>

      <!-- Song Details -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded mb-2 inline-block">#${song.serial_number}</span>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">${song.title || 'Untitled'}</h1>
              <p class="text-lg text-gray-600 flex items-center mb-2">
                <i class="bi bi-person-circle mr-2"></i>
                ${song.channel || 'Unknown Artist'}
              </p>
              <p class="text-gray-500 flex items-center">
                <i class="bi bi-clock mr-2"></i>
                ${song.duration || 'Duration not available'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lyrics Content -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-file-text mr-2"></i>
            Lyrics
          </h2>
        </div>
        <div class="card-body">
          ${renderLyricsContent(song)}
        </div>
      </div>
    </div>
  `;
}

// Render embedded video player with lyrics
function renderEmbeddedVideoPlayer() {
  if (!songsData.isVideoPlayerVisible || !songsData.currentPlayingSong) {
    return '';
  }

  const song = songsData.currentPlayingSong;
  console.log("[DEBUG] Rendering embedded video player for:", song.title);

  // Extract YouTube video ID from URL
  const videoId = extractYouTubeVideoId(song.url);
  
  return `
    <div id="video-player-section" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 transform transition-transform duration-300" style="max-height: 65vh;">
      <!-- Player Header -->
      <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">#${song.serial_number}</span>
          <div>
            <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">${song.title || 'Untitled'}</h3>
            <p class="text-xs text-gray-600">${song.channel || 'Unknown Artist'}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="copySongLinkBySerial(${song.serial_number})" class="btn btn-ghost btn-sm" title="Copy page link">
            <i class="bi bi-link-45deg"></i>
          </button>
          <button onclick="togglePlayerCollapse()" class="btn btn-ghost btn-sm" title="Toggle player size">
            <i class="bi bi-chevron-${songsData.isPlayerCollapsed ? 'up' : 'down'}"></i>
          </button>
          <button onclick="closeVideoPlayer()" class="btn btn-ghost btn-sm" title="Close player">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- Player Content (collapsible) -->
      ${!songsData.isPlayerCollapsed ? `
        <div class="video-player-content grid grid-cols-1 lg:grid-cols-2 gap-0" style="height: calc(65vh - 80px);">
          <!-- Video Player -->
          <div class="bg-black flex items-center justify-center h-full">
            ${videoId ? `
              <iframe 
                id="youtube-player"
                width="100%" 
                height="100%"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="w-full h-full"
              ></iframe>
            ` : `
              <div class="text-center text-white p-8">
                <i class="bi bi-play-circle text-6xl mb-4"></i>
                <p>Video not available</p>
                <p class="text-sm text-gray-300 mt-2">Invalid YouTube URL</p>
              </div>
            `}
          </div>

          <!-- Lyrics Section -->
          <div class="p-4 bg-white overflow-y-auto border-l border-gray-200 lg:border-l lg:border-t-0 border-t h-full">
            <h4 class="font-semibold text-gray-900 flex items-center mb-3">
              <i class="bi bi-file-text mr-2"></i>
              Lyrics
            </h4>
            <div class="lyrics-container text-sm leading-relaxed">
              ${renderLyricsContent(song)}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Extract YouTube video ID from various YouTube URL formats
function extractYouTubeVideoId(url) {
  if (!url) return null;
  
  console.log("[DEBUG] Extracting video ID from URL:", url);
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log("[DEBUG] Extracted video ID:", match[1]);
      return match[1];
    }
  }
  
  console.warn("[DEBUG] Could not extract video ID from URL:", url);
  return null;
}

// Play song in embedded player
function playSongEmbedded(song) {
  console.log("[DEBUG] Playing song in embedded player:", song.title);
  
  songsData.currentPlayingSong = song;
  songsData.isVideoPlayerVisible = true;
  
  // Update the songs display to show the new player
  updateSongsDisplay();
  
  // Scroll to show the player (mobile friendly)
  setTimeout(() => {
    const playerSection = document.getElementById('video-player-section');
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 100);
}

// Close video player
function closeVideoPlayer() {
  console.log("[DEBUG] Closing video player");
  
  songsData.currentPlayingSong = null;
  songsData.isVideoPlayerVisible = false;
  songsData.isPlayerCollapsed = false;
  
  // Update the display to remove player
  updateSongsDisplay();
}

// Close song player (alias for closeVideoPlayer for compatibility)
function closeSongPlayer() {
  closeVideoPlayer();
}

// Toggle player size (mobile responsive)
function togglePlayerSize() {
  console.log("[DEBUG] Toggling player size");
  
  const playerSection = document.getElementById('video-player-section');
  const iframe = document.getElementById('youtube-player');
  
  if (playerSection && iframe) {
    const isExpanded = playerSection.classList.contains('expanded');
    
    if (isExpanded) {
      // Collapse to normal size
      playerSection.classList.remove('expanded');
      playerSection.style.height = 'auto';
      iframe.style.height = '300px';
    } else {
      // Expand to larger size
      playerSection.classList.add('expanded');
      playerSection.style.height = '80vh';
      iframe.style.height = '400px';
    }
  }
}

// Toggle lyrics section size
function toggleLyricsSize() {
  console.log("[DEBUG] Toggling lyrics size");
  
  const lyricsContainer = document.querySelector('.lyrics-container');
  if (lyricsContainer) {
    const currentHeight = lyricsContainer.style.maxHeight;
    
    if (currentHeight === '250px' || !currentHeight) {
      lyricsContainer.style.maxHeight = '500px';
    } else {
      lyricsContainer.style.maxHeight = '250px';
    }
  }
}

// Render lyrics content
function renderLyricsContent(song) {
  if (!song.lyrics || !Array.isArray(song.lyrics) || song.lyrics.length === 0) {
    return `
      <div class="text-center py-4">
        <i class="bi bi-file-text text-3xl text-gray-400 mb-2"></i>
        <p class="text-gray-500 text-sm">Lyrics not available for this song.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-4">
      ${song.lyrics.map((verse, index) => {
        // Split verse by line breaks and render each line as a paragraph
        const lines = verse.split('\n').filter(line => line.trim() !== '');
        return `
          <div class="lyrics-verse">
            <div class="text-gray-800 leading-relaxed text-sm space-y-1">
              ${lines.map(line => `<p class="mb-1">${line.trim()}</p>`).join('')}
            </div>
            ${index < song.lyrics.length - 1 ? '<div class="border-b border-gray-200 mt-3"></div>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Toggle player collapse/expand
function togglePlayerCollapse() {
  console.log("[DEBUG] Toggling player collapse");
  songsData.isPlayerCollapsed = !songsData.isPlayerCollapsed;
  updateVideoPlayerDisplay();
}

// Toggle playlist updater
function togglePlaylistUpdater() {
  console.log("[DEBUG] Toggling playlist updater");
  songsData.showPlaylistUpdater = !songsData.showPlaylistUpdater;
  updateSongsDisplay();
  
  // Initialize playlist updater when shown
  if (songsData.showPlaylistUpdater && window.PlaylistUpdater) {
    // Use a more robust initialization with multiple retries
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 250;
    
    const tryInitialize = () => {
      const processButton = document.getElementById('process-playlist');
      if (processButton) {
        console.log("[DEBUG] Playlist updater elements found, initializing...");
        const success = window.PlaylistUpdater.initialize();
        if (success) {
          console.log("[DEBUG] Playlist updater successfully initialized");
        } else {
          console.error("[DEBUG] Playlist updater initialization failed");
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.log(`[DEBUG] Playlist updater elements not ready, retry ${retryCount}/${maxRetries}...`);
        setTimeout(tryInitialize, retryDelay);
      } else {
        console.error("[DEBUG] Failed to initialize playlist updater after maximum retries");
      }
    };
    
    // Start the initialization process
    setTimeout(tryInitialize, 100);
  }
}

// Search functionality
function handleSearch(searchTerm) {
  console.log("[DEBUG] Handling search:", searchTerm);
  songsData.searchTerm = searchTerm.toLowerCase();
  filterSongs();
  
  // Update only the songs list, preserve video player state
  updateSongsListOnly();
}

// Sort functionality
function handleSort(sortBy) {
  console.log("[DEBUG] Handling sort:", sortBy);
  songsData.sortBy = sortBy;
  sortSongs();
  
  // Update only the songs list, preserve video player state
  updateSongsListOnly();
}

// Filter songs based on search term
function filterSongs() {
  if (!songsData.searchTerm) {
    songsData.filteredSongs = [...songsData.allSongs];
    return;
  }

  console.log("[DEBUG] Filtering songs with search term:", songsData.searchTerm);
  
  songsData.filteredSongs = songsData.allSongs.filter(song => {
    const title = (song.title || '').toLowerCase();
    const channel = (song.channel || '').toLowerCase();
    const searchTerm = songsData.searchTerm;
    
    // Check title and channel
    const titleMatch = title.includes(searchTerm);
    const channelMatch = channel.includes(searchTerm);
    
    // Check lyrics if available
    let lyricsMatch = false;
    if (song.lyrics && Array.isArray(song.lyrics)) {
      lyricsMatch = song.lyrics.some(verse => 
        (verse || '').toLowerCase().includes(searchTerm)
      );
    }
    
    const isMatch = titleMatch || channelMatch || lyricsMatch;
    
    // Debug log matches
    if (isMatch) {
      const matchTypes = [];
      if (titleMatch) matchTypes.push('title');
      if (channelMatch) matchTypes.push('channel');
      if (lyricsMatch) matchTypes.push('lyrics');
      console.log(`[DEBUG] Match found in ${song.title} - matched in: ${matchTypes.join(', ')}`);
    }
    
    return isMatch;
  });
  
  console.log("[DEBUG] Filtered results:", songsData.filteredSongs.length, "songs");
}

// Sort songs
function sortSongs() {
  songsData.filteredSongs.sort((a, b) => {
    let aVal, bVal;
    
    switch (songsData.sortBy) {
      case 'title':
        aVal = (a.title || '').toLowerCase();
        bVal = (b.title || '').toLowerCase();
        break;
      case 'channel':
        aVal = (a.channel || '').toLowerCase();
        bVal = (b.channel || '').toLowerCase();
        break;
      case 'duration':
        // Extract minutes for sorting
        aVal = extractMinutes(a.duration);
        bVal = extractMinutes(b.duration);
        break;
      case 'serial_number':
        aVal = a.serial_number || 0;
        bVal = b.serial_number || 0;
        break;
      default:
        return 0;
    }
    
    if (aVal < bVal) return songsData.sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return songsData.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Extract minutes from duration string for sorting
function extractMinutes(duration) {
  if (!duration) return 0;
  const match = duration.match(/(\d+)\s*minutes?/);
  return match ? parseInt(match[1]) : 0;
}

// Toggle view between grid and list
function toggleView(view) {
  console.log("[DEBUG] Toggling view to:", view);
  songsData.currentView = view;
  
  // Update only the songs list, preserve video player state
  updateSongsListOnly();
}

// Update songs display
function updateSongsDisplay() {
  console.log("[DEBUG] Updating songs display");
  
  updateSongsListOnly();
  
  // Update video player if it's visible
  updateVideoPlayerDisplay();
}

// Update only the songs list without affecting video player
function updateSongsListOnly() {
  console.log("[DEBUG] Updating songs list only");
  
  // Preserve search input focus and cursor position
  const searchInput = document.getElementById('song-search');
  const wasSearchFocused = searchInput && document.activeElement === searchInput;
  const cursorPosition = wasSearchFocused ? searchInput.selectionStart : null;
  
  const container = document.getElementById('songs-container');
  if (container) {
    container.innerHTML = renderSongsContainer();
  }
  
  // Update the song count display in the header
  updateSongCountDisplay();
  
  // Restore search input focus and cursor position if it was focused
  if (wasSearchFocused) {
    setTimeout(() => {
      const newSearchInput = document.getElementById('song-search');
      if (newSearchInput) {
        newSearchInput.focus();
        if (cursorPosition !== null) {
          newSearchInput.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    }, 0);
  }
}

// Update song count in the header
function updateSongCountDisplay() {
  const countElement = document.getElementById('song-count-display');
  if (countElement) {
    countElement.textContent = `${songsData.filteredSongs.length} of ${songsData.allSongs.length} songs`;
  }
}

// Update search input placeholder based on video player state
function updateSearchPlaceholder() {
  const searchInput = document.getElementById('song-search');
  const searchContainer = searchInput?.parentElement;
  
  if (searchInput && searchContainer) {
    if (songsData.isVideoPlayerVisible && songsData.currentPlayingSong) {
      searchInput.placeholder = 'Search while playing (current song preserved)...';
      // Add a visual indicator that a song is playing
      if (!searchContainer.querySelector('.playing-indicator')) {
        const playingIcon = document.createElement('i');
        playingIcon.className = 'bi bi-play-circle playing-indicator absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-sm';
        playingIcon.title = 'Song currently playing - search won\'t interrupt playback';
        searchContainer.appendChild(playingIcon);
      }
    } else {
      searchInput.placeholder = 'Search songs, artists, channels, or lyrics...';
      // Remove the playing indicator
      const playingIcon = searchContainer.querySelector('.playing-indicator');
      if (playingIcon) {
        playingIcon.remove();
      }
    }
  }
}

// Update video player display
function updateVideoPlayerDisplay() {
  const existingPlayer = document.getElementById('video-player-section');
  
  if (songsData.isVideoPlayerVisible && songsData.currentPlayingSong) {
    // Add body classes for spacing
    document.body.classList.add('video-player-active');
    if (songsData.isPlayerCollapsed) {
      document.body.classList.add('player-collapsed');
    } else {
      document.body.classList.remove('player-collapsed');
    }
    
    // If player should be visible but doesn't exist, add it
    if (!existingPlayer) {
      const playerHTML = renderEmbeddedVideoPlayer();
      document.body.insertAdjacentHTML('beforeend', playerHTML);
    } else {
      // Only update if the song has actually changed
      const currentSongSerial = existingPlayer.querySelector('[title*="Copy page link"]')?.getAttribute('onclick')?.match(/\d+/)?.[0];
      if (currentSongSerial !== String(songsData.currentPlayingSong.serial_number)) {
        console.log("[DEBUG] Song changed, updating video player");
        existingPlayer.outerHTML = renderEmbeddedVideoPlayer();
      } else {
        console.log("[DEBUG] Same song playing, keeping existing video player");
      }
    }
  } else {
    // Remove body classes and player
    document.body.classList.remove('video-player-active', 'player-collapsed');
    if (existingPlayer) {
      existingPlayer.remove();
    }
  }
  
  // Update search placeholder to reflect video player state
  updateSearchPlaceholder();
}

// Song action functions

// Generate custom song page URL
function generateSongPageUrl(song) {
  const baseUrl = window.location.origin + window.location.pathname;
  const songSlug = encodeURIComponent(song.title?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'untitled');
  return `${baseUrl}?song=${song.serial_number}&title=${songSlug}`;
}

// Copy song link functionality (custom page link, not YouTube)
function copySongLink(song, showNotification = true) {
  console.log("[DEBUG] Copying custom song page link:", song.title);
  
  if (!song || !song.serial_number) {
    if (showNotification) {
      showCopyNotification('Unable to generate link for this song', 'error');
    }
    return false;
  }
  
  try {
    const customUrl = generateSongPageUrl(song);
    
    // Use the Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(customUrl).then(() => {
        if (showNotification) {
          showCopyNotification(`Page link copied: ${song.title}`, 'success');
        }
      }).catch(() => {
        fallbackCopyToClipboard(customUrl, song.title, showNotification);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      fallbackCopyToClipboard(customUrl, song.title, showNotification);
    }
    return true;
  } catch (error) {
    console.error("[DEBUG] Failed to copy song page link:", error);
    if (showNotification) {
      showCopyNotification('Failed to copy link', 'error');
    }
    return false;
  }
}

// Copy YouTube link functionality (separate function)
function copyYouTubeLink(song, showNotification = true) {
  console.log("[DEBUG] Copying YouTube link:", song.title);
  
  if (!song.url) {
    if (showNotification) {
      showCopyNotification('YouTube link not available for this song', 'error');
    }
    return false;
  }
  
  try {
    // Use the Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(song.url).then(() => {
        if (showNotification) {
          showCopyNotification(`YouTube link copied: ${song.title}`, 'success');
        }
      }).catch(() => {
        fallbackCopyToClipboard(song.url, song.title, showNotification);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      fallbackCopyToClipboard(song.url, song.title, showNotification);
    }
    return true;
  } catch (error) {
    console.error("[DEBUG] Failed to copy YouTube link:", error);
    if (showNotification) {
      showCopyNotification('Failed to copy YouTube link', 'error');
    }
    return false;
  }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text, songTitle, showNotification) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful && showNotification) {
      showCopyNotification(`Link copied: ${songTitle}`, 'success');
    } else if (!successful && showNotification) {
      showCopyNotification('Failed to copy link', 'error');
    }
    
    return successful;
  } catch (error) {
    console.error("[DEBUG] Fallback copy failed:", error);
    if (showNotification) {
      showCopyNotification('Failed to copy link', 'error');
    }
    return false;
  }
}

// Show copy notification
function showCopyNotification(message, type = 'success') {
  // Remove any existing notifications
  const existingNotification = document.getElementById('copy-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'copy-notification';
  notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Copy song link by serial number (for onclick handlers)
function copySongLinkBySerial(serialNumber) {
  const song = songsData.allSongs.find(s => s.serial_number === serialNumber);
  if (song) {
    copySongLink(song);
  } else {
    console.warn("[DEBUG] Song not found for serial number:", serialNumber);
    showCopyNotification('Song not found', 'error');
  }
}

// Copy YouTube link by serial number (for onclick handlers)
function copyYouTubeLinkBySerial(serialNumber) {
  const song = songsData.allSongs.find(s => s.serial_number === serialNumber);
  if (song) {
    copyYouTubeLink(song);
  } else {
    console.warn("[DEBUG] Song not found for serial number:", serialNumber);
    showCopyNotification('Song not found', 'error');
  }
}

function playSong(url) {
  console.log("[DEBUG] Playing song with URL:", url);
  
  if (!url || url === 'undefined') {
    alert('Song URL not available');
    return;
  }
  
  // Find the song object by URL for embedded player
  const song = songsData.allSongs.find(s => s.url === url);
  if (song) {
    playSongEmbedded(song);
  } else {
    console.warn("[DEBUG] Song not found for URL:", url);
    // Fallback to opening in new tab
    window.open(url, '_blank');
  }
}

function viewSongLyrics(serialNumber) {
  console.log("[DEBUG] Viewing lyrics for song:", serialNumber);
  const song = songsData.allSongs.find(s => s.serial_number === serialNumber);
  if (song) {
    songsData.selectedSong = song;
    songsData.showLyrics = true;
    
    // Update page title for direct links
    updatePageTitle(song);
    
    // Re-render the tab content
    if (typeof window.renderAppUI === 'function') {
      window.renderAppUI();
      if (typeof setupEventListeners === 'function') {
        setupEventListeners();
      }
    } else {
      // Fallback: try again after a delay if renderAppUI isn't available
      console.log("[DEBUG] renderAppUI not available, retrying...");
      setTimeout(() => {
        if (typeof window.renderAppUI === 'function') {
          window.renderAppUI();
          if (typeof setupEventListeners === 'function') {
            setupEventListeners();
          }
        }
      }, 200);
    }
  } else {
    console.warn("[DEBUG] Song not found for serial number:", serialNumber);
  }
}

function closeLyricsView() {
  console.log("[DEBUG] Closing lyrics view");
  songsData.showLyrics = false;
  songsData.selectedSong = null;
  
  // Restore original page title if it was changed
  if (typeof window.restorePageTitle === 'function') {
    window.restorePageTitle();
  } else if (window.seoHelper) {
    // Use SEO helper to reset to default
    window.seoHelper.resetToDefault();
  }
  
  // Clean up URL parameters
  const url = new URL(window.location);
  url.searchParams.delete('song');
  url.searchParams.delete('title');
  window.history.replaceState({}, '', url);
  
  // Re-render the tab content
  if (typeof window.renderAppUI === 'function') {
    window.renderAppUI();
    if (typeof setupEventListeners === 'function') {
      setupEventListeners();
    }
  }
}

function toggleFavorite(serialNumber) {
  console.log("[DEBUG] Toggling favorite for song:", serialNumber);
  // TODO: Implement favorites functionality
  alert('Favorites feature coming soon!');
}

// Initialize songs data when the module loads
loadSongsData();

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

console.log("[DEBUG] Songs tab module initialization complete");
