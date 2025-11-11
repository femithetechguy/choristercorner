/**
 * Shared Content Rendering Utilities
 * Provides reusable rendering functions for Songs and Hymns
 */

console.log("[DEBUG] content-renderer.js loading...");

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null
 */
function extractVideoId(url) {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Render thumbnail for grid/list view
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @returns {string} HTML for thumbnail
 */
function renderThumbnail(item, type) {
  const videoId = extractVideoId(item.url);
  const iconClass = type === 'hymn' ? 'bi-book' : 'bi-music-note';
  const gradientColors = type === 'hymn' 
    ? 'from-blue-400 to-purple-500' 
    : 'from-purple-400 to-blue-500';
  
  const playAction = type === 'hymn' 
    ? `playHymnEmbedded(${JSON.stringify(item).replace(/'/g, "\\'")})`
    : `playSongEmbedded(${JSON.stringify(item).replace(/'/g, "\\'")})`;;
  
  return `
    <div class="thumbnail-container cursor-pointer" onclick="${playAction}">
      ${item.url ? `
        <img 
          src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" 
          alt="${item.title}" 
          class="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        <div class="play-overlay">
          <i class="bi bi-play-circle-fill text-6xl text-white opacity-90"></i>
        </div>
      ` : `
        <div class="w-full h-48 bg-gradient-to-br ${gradientColors} flex items-center justify-center">
          <i class="bi ${iconClass} text-6xl text-white opacity-50"></i>
        </div>
      `}
    </div>
  `;
}

/**
 * Render card for grid view
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @returns {string} HTML for card
 */
function renderContentCard(item, type) {
  const isHymn = type === 'hymn';
  const metadata = isHymn 
    ? { label: item.category || '', value: '' }
    : { label: '', value: item.duration || '' };
  
  return `
    <div class="content-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      ${renderThumbnail(item, type)}
      
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
            #${item.serial_number}
          </span>
          ${metadata.value ? `<span class="text-xs text-gray-500">${metadata.value}</span>` : ''}
          ${metadata.label && !metadata.value ? `
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              ${metadata.label}
            </span>
          ` : ''}
        </div>
        
        <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-2" title="${item.title}">
          ${item.title || `Untitled ${isHymn ? 'Hymn' : 'Song'}`}
        </h3>
        
        <p class="text-sm text-gray-600 mb-4 line-clamp-1" title="${isHymn ? item.author : item.channel}">
          ${isHymn ? (item.author || 'Unknown Author') : (item.channel || 'Unknown Artist')}
        </p>
        
        <div class="card-actions">
          ${window.generateCardActions ? window.generateCardActions(item, type) : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render row for list view
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @returns {string} HTML for row
 */
function renderContentRow(item, type) {
  const videoId = extractVideoId(item.url);
  const isHymn = type === 'hymn';
  const iconClass = isHymn ? 'bi-book' : 'bi-music-note';
  const gradientColors = isHymn 
    ? 'from-blue-400 to-purple-500' 
    : 'from-purple-400 to-blue-500';
  
  const playAction = isHymn 
    ? `playHymnEmbedded(${JSON.stringify(item).replace(/'/g, "\\'")})`
    : `playSongEmbedded(${JSON.stringify(item).replace(/'/g, "\\'")})`;
  
  const primaryInfo = isHymn ? item.author : item.channel;
  const secondaryInfo = isHymn ? item.category : item.duration;
  
  return `
    <div class="content-row bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div class="flex items-center p-4 gap-4">
        <!-- Thumbnail -->
        <div class="flex-shrink-0 cursor-pointer" onclick="${playAction}">
          ${item.url ? `
            <div class="relative group">
              <img 
                src="https://img.youtube.com/vi/${videoId}/default.jpg" 
                alt="${item.title}"
                class="w-20 h-14 object-cover rounded"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                <i class="bi bi-play-circle-fill text-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          ` : `
            <div class="w-20 h-14 bg-gradient-to-br ${gradientColors} rounded flex items-center justify-center">
              <i class="bi ${iconClass} text-2xl text-white opacity-50"></i>
            </div>
          `}
        </div>
        
        <!-- Content Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
              #${item.serial_number}
            </span>
            <h3 class="font-semibold text-gray-900 truncate" title="${item.title}">
              ${item.title || `Untitled ${isHymn ? 'Hymn' : 'Song'}`}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="truncate" title="${primaryInfo}">
              <i class="bi bi-person-circle mr-1"></i>${primaryInfo || 'Unknown'}
            </span>
            ${secondaryInfo ? `
              <span class="flex-shrink-0">
                <i class="bi ${isHymn ? 'bi-tag' : 'bi-clock'} mr-1"></i>${secondaryInfo}
              </span>
            ` : ''}
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex-shrink-0">
          <div class="flex gap-2">
            ${window.generateCardActions ? window.generateCardActions(item, type) : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render lyrics view header
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @param {Function} backFunction - Function name to call for back button
 * @returns {string} HTML for lyrics header
 */
function renderLyricsHeader(item, type, backFunction) {
  const isHymn = type === 'hymn';
  const primaryInfo = isHymn ? item.author : item.channel;
  const secondaryInfo = isHymn ? item.category : item.duration;
  
  return `
    <div class="lyrics-view-container">
      <!-- Back Button -->
      <button 
        onclick="${backFunction}()" 
        class="mb-6 inline-flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all font-medium"
      >
        <i class="bi bi-arrow-left mr-2"></i>
        Back to ${isHymn ? 'Hymns' : 'Songs'}
      </button>

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div class="flex-1">
            <span class="inline-block text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-3">
              ${isHymn ? 'Hymn' : 'Song'} #${item.serial_number}
            </span>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">${item.title}</h1>
            <p class="text-lg text-gray-600 flex items-center mb-2">
              <i class="bi bi-person-circle mr-2"></i>${primaryInfo || 'Unknown'}
            </p>
            ${secondaryInfo ? `
              <p class="text-sm text-gray-500 flex items-center">
                <i class="bi ${isHymn ? 'bi-tag' : 'bi-clock'} mr-2"></i>${secondaryInfo}
              </p>
            ` : ''}
          </div>
          
          <!-- Action Buttons - Pass 'lyrics' context -->
          <div class="flex flex-wrap gap-2">
            ${window.generateCardActions ? window.generateCardActions(item, type, 'lyrics') : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render lyrics content section
 * @param {Array} lyrics - Array of lyric verses
 * @param {string} type - 'song' or 'hymn'
 * @returns {string} HTML for lyrics content
 */
function renderLyricsContent(lyrics, type) {
  const iconClass = type === 'hymn' ? 'bi-book' : 'bi-music-note-list';
  
  return `
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <i class="bi ${iconClass} text-purple-600 mr-3 text-3xl"></i>
        Lyrics
      </h2>
      
      ${lyrics && lyrics.length > 0 ? 
        (window.renderLyrics ? window.renderLyrics(lyrics, false) : `
          <div class="lyrics-content space-y-6">
            ${lyrics.map((verse, idx) => `
              <div class="lyrics-paragraph" key="${idx}">
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${verse}</p>
              </div>
            `).join('')}
          </div>
        `) : `
        <div class="text-center py-8">
          <i class="bi bi-file-text text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">No lyrics available for this ${type}</p>
        </div>
      `}
    </div>
  `;
}

/**
 * Render complete lyrics view
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 * @param {Function} backFunction - Function name for back button
 * @returns {string} Complete HTML for lyrics view
 */
function renderLyricsView(item, type, backFunction) {
  return `
    ${renderLyricsHeader(item, type, backFunction)}
    ${renderLyricsContent(item.lyrics, type)}
  `;
}

/**
 * Render search and filter controls
 * @param {Object} config - Configuration object
 * @returns {string} HTML for controls
 */
function renderSearchControls(config) {
  const {
    searchId,
    searchPlaceholder,
    searchFunction,
    filters = [],
    viewMode,
    toggleFunction,
    resultsCount,
    totalCount,
    itemType
  } = config;
  
  return `
    <div class="search-controls mb-6">
      <div class="grid grid-cols-1 md:grid-cols-${filters.length + 1} gap-4 mb-4">
        <!-- Search -->
        <div class="relative">
          <i class="bi bi-search absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            id="${searchId}"
            placeholder="${searchPlaceholder}"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            oninput="${searchFunction}(this.value)"
          />
        </div>

        <!-- Dynamic Filters -->
        ${filters.map(filter => `
          <select
            id="${filter.id}"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onchange="${filter.onChangeFunction}(this.value)"
          >
            <option value="">${filter.placeholder}</option>
            ${filter.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
        `).join('')}
      </div>
      
      <!-- Results Count and View Toggle -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Showing <span class="font-semibold">${resultsCount}</span> of 
          <span class="font-semibold">${totalCount}</span> ${itemType}
        </p>
        
        ${window.renderViewToggle ? window.renderViewToggle(viewMode, toggleFunction) : ''}
      </div>
    </div>
  `;
}

/**
 * Render header section
 * @param {Object} config - Header configuration
 * @returns {string} HTML for header
 */
function renderContentHeader(config) {
  const { icon, title, description, count } = config;
  
  return `
    <div class="content-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center">
        <i class="bi ${icon} text-purple-600 mr-3"></i>
        ${title}
      </h1>
      <p class="text-gray-600">
        ${description.replace('{count}', count)}
      </p>
    </div>
  `;
}

/**
 * Render loading state
 * @param {string} message - Loading message
 * @returns {string} HTML for loading state
 */
function renderLoadingState(message) {
  return `
    <div class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600">${message}</p>
      </div>
    </div>
  `;
}

// Export all functions to window
window.extractVideoId = extractVideoId;
window.renderThumbnail = renderThumbnail;
window.renderContentCard = renderContentCard;
window.renderContentRow = renderContentRow;
window.renderLyricsHeader = renderLyricsHeader;
window.renderLyricsContent = renderLyricsContent;
window.renderLyricsView = renderLyricsView;
window.renderSearchControls = renderSearchControls;
window.renderContentHeader = renderContentHeader;
window.renderLoadingState = renderLoadingState;

console.log("[DEBUG] content-renderer.js loaded");