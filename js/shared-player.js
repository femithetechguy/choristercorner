/**
 * Shared Video/Audio Player for ChoristerCorner
 * This module provides a unified player that can be used by both Songs and Hymns
 */

// Global player state
const sharedPlayer = {
  isVisible: false,
  isCollapsed: false,
  currentItem: null,
  type: null // 'song' or 'hymn'
};

// Show the shared player
function showSharedPlayer(item, type) {
  console.log("[DEBUG] Showing shared player for:", item?.title, "Type:", type);
  
  // Validate input parameters
  if (!item || typeof item !== 'object') {
    console.error("[DEBUG] Invalid item passed to showSharedPlayer:", item);
    if (window.showToast) {
      showToast('Unable to play - invalid item data', 'error');
    }
    return;
  }
  
  if (!item.url || typeof item.url !== 'string') {
    console.error("[DEBUG] Invalid URL in item:", item.url);
    if (window.showToast) {
      showToast('Unable to play - invalid URL', 'error');
    }
    return;
  }
  
  // Update page title based on content type
  if (type === 'song') {
    document.title = `${item.title} - ${item.channel} | ChoristerCorner`;
  } else if (type === 'hymn') {
    document.title = `${item.title} - ${item.author} | ChoristerCorner`;
  }
  
  // Update meta tags
  if (type === 'song' && window.generateSongMetaTags && window.updateMetaTags) {
    const metaTags = window.generateSongMetaTags(item);
    window.updateMetaTags(metaTags.title, metaTags.description, metaTags.image, metaTags.url);
  } else if (type === 'hymn' && window.generateHymnMetaTags && window.updateMetaTags) {
    const metaTags = window.generateHymnMetaTags(item);
    window.updateMetaTags(metaTags.title, metaTags.description, metaTags.image, metaTags.url);
  }
  
  // Update URL
  const urlTitle = item.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const paramName = type === 'song' ? 'song' : 'hymn';
  const newUrl = `${window.location.pathname}?${paramName}=${item.serial_number}&title=${urlTitle}`;
  window.history.pushState({ [paramName]: item.serial_number }, '', newUrl);
  
  // Check if player already exists
  const existingPlayer = document.getElementById('shared-player-section');
  
  if (existingPlayer && sharedPlayer.isVisible) {
    // Update existing player instead of creating new one
    console.log("[DEBUG] Updating existing player with new content");
    sharedPlayer.currentItem = item;
    sharedPlayer.type = type;
    
    // Replace the player content
    const playerHTML = renderSharedPlayer();
    existingPlayer.outerHTML = playerHTML;
    
    // Scroll to show the player
    setTimeout(() => {
      const playerSection = document.getElementById('shared-player-section');
      if (playerSection) {
        playerSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  } else {
    // Create new player
    console.log("[DEBUG] Creating new player");
    sharedPlayer.currentItem = item;
    sharedPlayer.type = type;
    sharedPlayer.isVisible = true;
    sharedPlayer.isCollapsed = false;
    
    // Add player to DOM
    const playerHTML = renderSharedPlayer();
    if (playerHTML) {
      document.body.insertAdjacentHTML('beforeend', playerHTML);
      
      // Add body class for spacing
      document.body.classList.add('audio-player-active');
      document.body.classList.remove('player-collapsed');
      
      // Scroll to show the player
      setTimeout(() => {
        const playerSection = document.getElementById('shared-player-section');
        if (playerSection) {
          playerSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    } else {
      console.error("[DEBUG] Failed to render player HTML");
      if (window.showToast) {
        showToast('Unable to display player', 'error');
      }
    }
  }
}

// Close the shared player (single implementation)
function closeSharedPlayer() {
  console.log("[DEBUG] Closing shared player");
  
  const existingPlayer = document.getElementById('shared-player-section');
  if (existingPlayer) {
    existingPlayer.remove();
  }
  
  // Remove body classes
  document.body.classList.remove('audio-player-active', 'player-collapsed');
  
  // Reset player state
  sharedPlayer.isVisible = false;
  sharedPlayer.currentItem = null;
  sharedPlayer.type = null;
  
  // Reset page title
  document.title = "ChoristerCorner - Your Ultimate Worship Companion";
  
  // Reset meta tags
  if (window.resetMetaTags) {
    window.resetMetaTags();
  }
  
  // Reset URL
  const newUrl = window.location.pathname;
  window.history.pushState({}, '', newUrl);
}

// Toggle player collapse
function toggleSharedPlayerCollapse() {
  sharedPlayer.isCollapsed = !sharedPlayer.isCollapsed;
  
  if (sharedPlayer.isCollapsed) {
    document.body.classList.add('player-collapsed');
  } else {
    document.body.classList.remove('player-collapsed');
  }
  
  // Update the player UI
  const playerContent = document.querySelector('.shared-player-content');
  const toggleBtn = document.querySelector('.shared-player-toggle-btn i');
  
  if (playerContent && toggleBtn) {
    if (sharedPlayer.isCollapsed) {
      playerContent.style.display = 'none';
      toggleBtn.className = 'bi bi-chevron-up';
    } else {
      playerContent.style.display = 'grid';
      toggleBtn.className = 'bi bi-chevron-down';
    }
  }
}

// Extract YouTube video ID from URL
function extractVideoId(url) {
  console.log("[DEBUG] Extracting video ID from URL:", url);
  
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      console.log("[DEBUG] Extracted video ID:", match[1]);
      return match[1];
    }
  }
  
  console.warn("[DEBUG] Could not extract video ID from URL:", url);
  return null;
}

// Render the shared player
function renderSharedPlayer() {
  if (!sharedPlayer.isVisible || !sharedPlayer.currentItem) {
    console.warn("[DEBUG] Cannot render player - not visible or no current item");
    return '';
  }

  const item = sharedPlayer.currentItem;
  const type = sharedPlayer.type;
  console.log("[DEBUG] Rendering shared player for:", item?.title);
  
  // Validate required properties
  if (!item.serial_number || !item.title || !item.url) {
    console.error("[DEBUG] Missing required properties in item:", {
      serial_number: item.serial_number,
      title: item.title,
      url: item.url
    });
    return '';
  }

  // Extract YouTube video ID from URL
  const videoId = extractVideoId(item.url);
  
  // Determine the appropriate copy function based on type
  const copyFunction = type === 'song' ? 'copySongLinkBySerial' : 'copyHymnLinkBySerial';
  
  // Render lyrics using the shared utility function
  let lyricsHTML = '';
  if (item.lyrics && item.lyrics.length > 0) {
    if (window.renderLyrics) {
      lyricsHTML = window.renderLyrics(item.lyrics, true);
    } else {
      console.warn('[DEBUG] Lyrics utility not loaded in renderSharedPlayer');
      lyricsHTML = `
        <div class="text-center py-8">
          <i class="bi bi-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
          <p class="text-gray-600 mb-2">Lyrics utility not loaded</p>
          <p class="text-gray-500 text-sm">Please refresh the page</p>
        </div>
      `;
    }
  } else {
    lyricsHTML = `
      <div class="text-center text-gray-500 py-8">
        <i class="bi bi-file-text text-4xl mb-3"></i>
        <p>Lyrics not available for this ${type}</p>
      </div>
    `;
  }
  
  return `
    <div id="shared-player-section" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 transform transition-transform duration-300" style="max-height: 65vh;">
      <!-- Player Header -->
      <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium ${type === 'song' ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100'} px-2 py-1 rounded">
            ${type === 'song' ? 'Song' : 'Hymn'} #${item.serial_number}
          </span>
          <div>
            <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">${item.title || 'Untitled'}</h3>
            <p class="text-xs text-gray-600">${item.channel || item.author || 'Unknown Artist'}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="${copyFunction}(${item.serial_number || 0})" class="btn btn-ghost btn-sm" title="Copy page link">
            <i class="bi bi-link-45deg"></i>
          </button>
          <button onclick="toggleSharedPlayerCollapse()" class="btn btn-ghost btn-sm shared-player-toggle-btn" title="Toggle player size">
            <i class="bi bi-chevron-${sharedPlayer.isCollapsed ? 'up' : 'down'}"></i>
          </button>
          <button onclick="closeSharedPlayer()" class="btn btn-ghost btn-sm" title="Close player">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- Player Content (collapsible) -->
      <div class="shared-player-content grid grid-cols-1 lg:grid-cols-2 gap-0" style="height: calc(65vh - 80px); ${sharedPlayer.isCollapsed ? 'display: none;' : ''}">
        <!-- Video Player -->
        <div class="bg-black flex items-center justify-center h-full">
          ${videoId ? `
            <iframe 
              id="shared-youtube-player"
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
              frameborder="0" 
              allow="autoplay; encrypted-media" 
              allowfullscreen>
            </iframe>
          ` : `
            <div class="text-center text-white p-8">
              <i class="bi bi-music-note text-6xl mb-4"></i>
              <p class="text-lg mb-2">Video Preview Not Available</p>
              <p class="text-sm opacity-75">This ${type} doesn't have a valid YouTube link</p>
            </div>
          `}
        </div>

        <!-- Lyrics Display -->
        <div class="bg-white overflow-y-auto p-6">
          <div class="max-w-none">
            <div class="mb-4">
              <p class="text-gray-700 mb-1 font-medium">by ${item.author || item.channel || 'Unknown Artist'}</p>
              ${type === 'hymn' ? `
                <p class="text-sm text-gray-700 font-medium">
                  ${item.year || 'Year Unknown'}
                  ${item.meter ? ` • ${item.meter}` : ''}
                  ${item.category ? ` • ${item.category}` : ''}
                </p>
              ` : ''}
              <p class="text-sm text-gray-700 font-medium">${item.channel || item.author || 'Unknown'} • ${item.duration || 'Duration Unknown'}</p>
            </div>
            
            <div id="player-lyrics-content" class="space-y-4">
              ${lyricsHTML}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Check if shared player is currently visible
function isSharedPlayerVisible() {
  return sharedPlayer.isVisible;
}

// Get current playing item
function getCurrentPlayingItem() {
  return sharedPlayer.currentItem;
}

// Get current player type
function getCurrentPlayerType() {
  return sharedPlayer.type;
}

// Make functions globally available
window.showSharedPlayer = showSharedPlayer;
window.closeSharedPlayer = closeSharedPlayer;
window.toggleSharedPlayerCollapse = toggleSharedPlayerCollapse;
window.isSharedPlayerVisible = isSharedPlayerVisible;
window.getCurrentPlayingItem = getCurrentPlayingItem;
window.getCurrentPlayerType = getCurrentPlayerType;

console.log("[DEBUG] Shared player module loaded");
