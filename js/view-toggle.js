/**
 * Reusable View Toggle Utility
 * Handles grid/list view switching for Songs and Hymns
 */

console.log("[DEBUG] view-toggle.js loading...");

/**
 * Get default view mode based on device
 * @returns {string} 'grid' or 'list'
 */
function getDefaultViewMode() {
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  
  // Default to list on mobile, grid on desktop
  return isMobile ? 'list' : 'grid';
}

/**
 * Get view mode for a specific content type (songs/hymns)
 * @param {string} contentType - 'songs' or 'hymns'
 * @returns {string} 'grid' or 'list'
 */
function getViewMode(contentType) {
  const storageKey = `${contentType}ViewMode`;
  const savedMode = localStorage.getItem(storageKey);
  return savedMode || getDefaultViewMode();
}

/**
 * Set view mode for a specific content type
 * @param {string} contentType - 'songs' or 'hymns'
 * @param {string} mode - 'grid' or 'list'
 */
function setViewMode(contentType, mode) {
  const storageKey = `${contentType}ViewMode`;
  localStorage.setItem(storageKey, mode);
  console.log(`[DEBUG] Set ${contentType} view mode to:`, mode);
}

/**
 * Render view toggle buttons
 * @param {string} currentMode - Current view mode ('grid' or 'list')
 * @param {string} onToggleFunction - Name of the toggle function to call
 * @returns {string} HTML for view toggle buttons
 */
function renderViewToggle(currentMode, onToggleFunction) {
  return `
    <div class="flex gap-2">
      <button
        onclick="${onToggleFunction}('grid')"
        class="px-3 py-2 rounded-lg transition-colors ${
          currentMode === 'grid'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }"
        title="Grid view"
        aria-label="Grid view"
      >
        <i class="bi bi-grid-3x3-gap"></i>
      </button>
      <button
        onclick="${onToggleFunction}('list')"
        class="px-3 py-2 rounded-lg transition-colors ${
          currentMode === 'list'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }"
        title="List view"
        aria-label="List view"
      >
        <i class="bi bi-list-ul"></i>
      </button>
    </div>
  `;
}

/**
 * Render items in grid view
 * @param {Array} items - Array of items to render
 * @param {Function} renderCard - Function to render individual card
 * @returns {string} HTML for grid view
 */
function renderGridView(items, renderCard) {
  if (!items || items.length === 0) {
    return `
      <div class="col-span-full text-center py-12">
        <i class="bi bi-search text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No items found</p>
        <p class="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    `;
  }
  
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${items.map(item => renderCard(item)).join('')}
    </div>
  `;
}

/**
 * Render items in list view
 * @param {Array} items - Array of items to render
 * @param {Function} renderRow - Function to render individual row
 * @returns {string} HTML for list view
 */
function renderListView(items, renderRow) {
  if (!items || items.length === 0) {
    return `
      <div class="text-center py-12">
        <i class="bi bi-search text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No items found</p>
        <p class="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    `;
  }
  
  return `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      ${items.map(item => renderRow(item)).join('')}
    </div>
  `;
}

/**
 * Render content based on view mode
 * @param {string} viewMode - 'grid' or 'list'
 * @param {Array} items - Array of items to render
 * @param {Function} renderCard - Function to render grid card
 * @param {Function} renderRow - Function to render list row
 * @returns {string} HTML for the content
 */
function renderViewContent(viewMode, items, renderCard, renderRow) {
  if (viewMode === 'list') {
    return renderListView(items, renderRow);
  } else {
    return renderGridView(items, renderCard);
  }
}

// Export to window
window.getDefaultViewMode = getDefaultViewMode;
window.getViewMode = getViewMode;
window.setViewMode = setViewMode;
window.renderViewToggle = renderViewToggle;
window.renderGridView = renderGridView;
window.renderListView = renderListView;
window.renderViewContent = renderViewContent;

console.log("[DEBUG] view-toggle.js loaded");