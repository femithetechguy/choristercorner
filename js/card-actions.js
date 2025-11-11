/**
 * Card Actions Utility
 * Generates reusable action buttons for songs and hymns
 */

console.log("[DEBUG] card-actions.js loading...");

/**
 * Generate action buttons for song/hymn cards
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @param {string} context - 'card' or 'lyrics'
 * @returns {string} HTML for action buttons
 */
function generateCardActions(item, type, context = 'card') {
  // context can be 'card' or 'lyrics'
  
  const isHymn = type === 'hymn';
  const isLyricsView = context === 'lyrics';
  const playFunction = isHymn ? 'playHymnEmbedded' : 'playSongEmbedded';
  const copyFunction = isHymn ? 'copyHymnLinkBySerial' : 'copySongLinkBySerial';
  const viewFunction = isHymn ? 'viewHymnDetails' : 'viewSongLyrics';
  const favoriteFunction = isHymn ? 'toggleHymnFavorite' : 'toggleSongFavorite';
  
  // Check if item is favorited
  const isFavorited = checkIfFavorited(item.serial_number, type);
  
  return `
    <!-- Play Button -->
    ${item.url ? `
      <button 
        onclick="${playFunction}(${JSON.stringify(item).replace(/'/g, "\\'")}); showActionToast('Playing ${escapeHtml(item.title)}', 'info')"
        class="btn btn-sm btn-primary"
        title="Play ${type}"
        aria-label="Play ${type}">
        <i class="bi bi-play-fill"></i>
      </button>
    ` : ''}
    
    <!-- View Lyrics Button - Hide in lyrics view -->
    ${!isLyricsView ? `
      <button 
        onclick="${viewFunction}(${item.serial_number}); showActionToast('Loading lyrics...', 'info')"
        class="btn btn-sm btn-outline"
        title="View lyrics"
        aria-label="View lyrics">
        <i class="bi bi-file-text"></i>
      </button>
    ` : ''}
    
    <!-- Copy Link Button - Always show -->
    <button 
      onclick="${copyFunction}(${item.serial_number})"
      class="btn btn-sm btn-outline"
      title="Copy link"
      aria-label="Copy link to clipboard">
      <i class="bi bi-link-45deg"></i>
    </button>
    
    <!-- Open in New Tab Button - Hide in lyrics view -->
    ${item.url && !isLyricsView ? `
      <button 
        onclick="openInNewTab('${item.url}'); showActionToast('Opening in new tab...', 'info')"
        class="btn btn-sm btn-outline"
        title="Open in YouTube"
        aria-label="Open video in new tab">
        <i class="bi bi-box-arrow-up-right"></i>
      </button>
    ` : ''}
    
    <!-- Favorite Button - Always show -->
    <button 
      onclick="${favoriteFunction}(${item.serial_number})"
      class="btn btn-sm ${isFavorited ? 'btn-favorite-active' : 'btn-outline'}"
      title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}"
      aria-label="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}"
      id="favorite-btn-${type}-${item.serial_number}">
      <i class="bi ${isFavorited ? 'bi-heart-fill' : 'bi-heart'}"></i>
    </button>
  `;
}

/**
 * Open URL in new tab
 * @param {string} url - URL to open
 */
function openInNewTab(url) {
  if (!url) {
    console.error('[DEBUG] No URL provided to openInNewTab');
    if (window.showToast) {
      showToast('No video URL available', 'error');
    }
    return;
  }
  
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Check if item is favorited
 * @param {number} serialNumber - Item serial number
 * @param {string} type - 'song' or 'hymn'
 * @returns {boolean} True if favorited
 */
function checkIfFavorited(serialNumber, type) {
  const storageKey = type === 'hymn' ? 'favoritedHymns' : 'favoritedSongs';
  const favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
  return favorites.includes(serialNumber);
}

/**
 * Toggle song favorite status
 * @param {number} serialNumber - Song serial number
 */
function toggleSongFavorite(serialNumber) {
  const storageKey = 'favoritedSongs';
  let favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const index = favorites.indexOf(serialNumber);
  let message = '';
  let isFavorited = false;
  
  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
    message = 'Removed from favorites';
    isFavorited = false;
  } else {
    // Add to favorites
    favorites.push(serialNumber);
    message = 'Added to favorites';
    isFavorited = true;
  }
  
  localStorage.setItem(storageKey, JSON.stringify(favorites));
  
  // Update button appearance
  const btn = document.getElementById(`favorite-btn-song-${serialNumber}`);
  if (btn) {
    const icon = btn.querySelector('i');
    if (isFavorited) {
      btn.classList.add('btn-favorite-active');
      btn.classList.remove('btn-outline');
      icon.classList.remove('bi-heart');
      icon.classList.add('bi-heart-fill');
      btn.title = 'Remove from favorites';
    } else {
      btn.classList.remove('btn-favorite-active');
      btn.classList.add('btn-outline');
      icon.classList.remove('bi-heart-fill');
      icon.classList.add('bi-heart');
      btn.title = 'Add to favorites';
    }
  }
  
  if (window.showToast) {
    showToast(message, 'success');
  }
  
  console.log('[DEBUG] Song favorite toggled:', serialNumber, isFavorited);
}

/**
 * Toggle hymn favorite status
 * @param {number} serialNumber - Hymn serial number
 */
function toggleHymnFavorite(serialNumber) {
  const storageKey = 'favoritedHymns';
  let favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const index = favorites.indexOf(serialNumber);
  let message = '';
  let isFavorited = false;
  
  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
    message = 'Removed from favorites';
    isFavorited = false;
  } else {
    // Add to favorites
    favorites.push(serialNumber);
    message = 'Added to favorites';
    isFavorited = true;
  }
  
  localStorage.setItem(storageKey, JSON.stringify(favorites));
  
  // Update button appearance
  const btn = document.getElementById(`favorite-btn-hymn-${serialNumber}`);
  if (btn) {
    const icon = btn.querySelector('i');
    if (isFavorited) {
      btn.classList.add('btn-favorite-active');
      btn.classList.remove('btn-outline');
      icon.classList.remove('bi-heart');
      icon.classList.add('bi-heart-fill');
      btn.title = 'Remove from favorites';
    } else {
      btn.classList.remove('btn-favorite-active');
      btn.classList.add('btn-outline');
      icon.classList.remove('bi-heart-fill');
      icon.classList.add('bi-heart');
      btn.title = 'Add to favorites';
    }
  }
  
  if (window.showToast) {
    showToast(message, 'success');
  }
  
  console.log('[DEBUG] Hymn favorite toggled:', serialNumber, isFavorited);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show action toast message
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', 'info', 'warning'
 */
function showActionToast(message, type = 'info') {
  // Use the global showToast function if available
  if (window.showToast) {
    window.showToast(message, type);
  } else {
    // Fallback to console if toast not available
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

// Export to window
window.generateCardActions = generateCardActions;
window.openInNewTab = openInNewTab;
window.checkIfFavorited = checkIfFavorited;
window.toggleSongFavorite = toggleSongFavorite;
window.toggleHymnFavorite = toggleHymnFavorite;
window.escapeHtml = escapeHtml;
window.showActionToast = showActionToast;

console.log("[DEBUG] card-actions.js loaded");