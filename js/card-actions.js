console.log("[DEBUG] card-actions.js loaded");

/**
 * Card Actions Utility
 * Provides reusable action buttons for song/hymn cards
 */

/**
 * Generate action buttons HTML for a card
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @param {Object} options - Options for which buttons to show
 * @returns {string} HTML string for action buttons
 */
function generateCardActions(item, type = 'song', options = {}) {
  const defaults = {
    showPlay: true,
    showLyrics: true,
    showCopyLink: true,
    showOpenNew: true,
    showFavorite: true
  };
  
  const settings = { ...defaults, ...options };
  
  const actions = [];
  
  // Play/Listen button (primary action) - uses same function as thumbnail click
  if (settings.showPlay) {
    const playFunction = type === 'song' ? 'playSongEmbedded' : 'playHymnEmbedded';
    const serialNumber = item.serial_number;
    
    actions.push(`
      <button 
        onclick="playItemBySerial(${serialNumber}, '${type}')" 
        class="card-action-btn card-action-btn-primary"
        title="Play ${type}"
        aria-label="Play ${item.title}"
        ${!item.url ? 'disabled' : ''}>
        <i class="bi bi-play-fill"></i>
      </button>
    `);
  }
  
  // Lyrics button
  if (settings.showLyrics) {
    const lyricsFunction = type === 'song' ? 'viewSongLyrics' : 'viewHymnDetails';
    actions.push(`
      <button 
        onclick="${lyricsFunction}(${item.serial_number})" 
        class="card-action-btn"
        title="View lyrics"
        aria-label="View lyrics for ${item.title}">
        <i class="bi bi-file-text"></i>
      </button>
    `);
  }
  
  // Copy link button
  if (settings.showCopyLink) {
    const copyFunction = type === 'song' ? 'copySongLinkBySerial' : 'copyHymnLinkBySerial';
    actions.push(`
      <button 
        onclick="${copyFunction}(${item.serial_number})" 
        class="card-action-btn"
        title="Copy link"
        aria-label="Copy link for ${item.title}">
        <i class="bi bi-link-45deg"></i>
      </button>
    `);
  }
  
  // Open in new tab button
  if (settings.showOpenNew) {
    const urlTitle = item.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    const url = `${window.location.origin}${window.location.pathname}?${type}=${item.serial_number}&title=${urlTitle}`;
    
    actions.push(`
      <button 
        onclick="openInNewTab('${url}')" 
        class="card-action-btn"
        title="Open in new tab"
        aria-label="Open ${item.title} in new tab">
        <i class="bi bi-box-arrow-up-right"></i>
      </button>
    `);
  }
  
  // Favorite button (placeholder for future implementation)
  if (settings.showFavorite) {
    const isFavorite = checkIfFavorite(item.serial_number, type);
    const heartIcon = isFavorite ? 'bi-heart-fill' : 'bi-heart';
    const heartColor = isFavorite ? 'text-red-500' : '';
    
    actions.push(`
      <button 
        onclick="toggleFavorite(${item.serial_number}, '${type}')" 
        class="card-action-btn ${heartColor}"
        title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
        aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
        <i class="bi ${heartIcon}"></i>
      </button>
    `);
  }
  
  return actions.join('');
}

/**
 * Play item by serial number (wrapper function)
 * @param {number} serialNumber - Item serial number
 * @param {string} type - 'song' or 'hymn'
 */
function playItemBySerial(serialNumber, type) {
  console.log(`[DEBUG] Playing ${type} #${serialNumber}`);
  console.log('[DEBUG] window.songsData:', window.songsData);
  console.log('[DEBUG] window.hymnsData:', window.hymnsData);
  
  if (type === 'song') {
    // Get song from songsData
    if (!window.songsData) {
      console.error('[DEBUG] window.songsData is not defined');
      if (window.showToast) showToast('Songs data not loaded yet', 'error');
      return;
    }
    
    if (!window.songsData.allSongs) {
      console.error('[DEBUG] window.songsData.allSongs is not defined');
      if (window.showToast) showToast('Songs list not loaded yet', 'error');
      return;
    }
    
    const song = window.songsData.allSongs.find(s => s.serial_number === parseInt(serialNumber));
    
    if (!song) {
      console.error('[DEBUG] Song not found:', serialNumber);
      if (window.showToast) showToast('Song not found', 'error');
      return;
    }
    
    console.log('[DEBUG] Found song:', song.title);
    
    if (!window.playSongEmbedded) {
      console.error('[DEBUG] window.playSongEmbedded is not defined');
      if (window.showToast) showToast('Player function not loaded', 'error');
      return;
    }
    
    console.log('[DEBUG] Calling playSongEmbedded with song:', song);
    window.playSongEmbedded(song);
    
  } else if (type === 'hymn') {
    // Get hymn from hymnsData
    if (!window.hymnsData) {
      console.error('[DEBUG] window.hymnsData is not defined');
      if (window.showToast) showToast('Hymns data not loaded yet', 'error');
      return;
    }
    
    if (!window.hymnsData.allHymns) {
      console.error('[DEBUG] window.hymnsData.allHymns is not defined');
      if (window.showToast) showToast('Hymns list not loaded yet', 'error');
      return;
    }
    
    const hymn = window.hymnsData.allHymns.find(h => h.serial_number === parseInt(serialNumber));
    
    if (!hymn) {
      console.error('[DEBUG] Hymn not found:', serialNumber);
      if (window.showToast) showToast('Hymn not found', 'error');
      return;
    }
    
    console.log('[DEBUG] Found hymn:', hymn.title);
    
    if (!window.playHymnEmbedded) {
      console.error('[DEBUG] window.playHymnEmbedded is not defined');
      if (window.showToast) showToast('Player function not loaded', 'error');
      return;
    }
    
    console.log('[DEBUG] Calling playHymnEmbedded with hymn:', hymn);
    window.playHymnEmbedded(hymn);
  }
}

/**
 * Open URL in new tab
 * @param {string} url - URL to open
 */
function openInNewTab(url) {
  console.log('[DEBUG] Opening in new tab:', url);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Check if item is favorited (placeholder)
 * @param {number} serialNumber - Item serial number
 * @param {string} type - 'song' or 'hymn'
 * @returns {boolean}
 */
function checkIfFavorite(serialNumber, type) {
  // Get favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem('favorites') || '{"songs":[],"hymns":[]}');
  const favoritesList = type === 'song' ? favorites.songs : favorites.hymns;
  return favoritesList.includes(serialNumber);
}

/**
 * Toggle favorite status (placeholder for future implementation)
 * @param {number} serialNumber - Item serial number
 * @param {string} type - 'song' or 'hymn'
 */
function toggleFavorite(serialNumber, type) {
  console.log(`[DEBUG] Toggle favorite: ${type} #${serialNumber}`);
  
  // Get current favorites
  const favorites = JSON.parse(localStorage.getItem('favorites') || '{"songs":[],"hymns":[]}');
  const favoritesList = type === 'song' ? favorites.songs : favorites.hymns;
  
  // Toggle favorite
  const index = favoritesList.indexOf(serialNumber);
  if (index > -1) {
    favoritesList.splice(index, 1);
    showToast(`Removed from favorites`, 'info');
  } else {
    favoritesList.push(serialNumber);
    showToast(`Added to favorites`, 'success');
  }
  
  // Save back to localStorage
  if (type === 'song') {
    favorites.songs = favoritesList;
  } else {
    favorites.hymns = favoritesList;
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Re-render current view to update heart icon
  if (window.renderAppUI) {
    window.renderAppUI();
  }
}

/**
 * Generate compact action buttons for smaller cards
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @returns {string} HTML string for compact action buttons
 */
function generateCompactCardActions(item, type = 'song') {
  return generateCardActions(item, type, {
    showPlay: true,
    showLyrics: true,
    showCopyLink: false,
    showOpenNew: false,
    showFavorite: true
  });
}

// Export functions to window
window.generateCardActions = generateCardActions;
window.generateCompactCardActions = generateCompactCardActions;
window.playItemBySerial = playItemBySerial;
window.openInNewTab = openInNewTab;
window.toggleFavorite = toggleFavorite;
window.checkIfFavorite = checkIfFavorite;

console.log("[DEBUG] Card actions utility functions exported to window");