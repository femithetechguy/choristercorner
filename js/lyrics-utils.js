console.log("[DEBUG] lyrics-utils.js loaded");

/**
 * Parse a single lyric section and extract its label
 * @param {string} lyricText - Raw lyric text
 * @returns {Object} - { label: string|null, text: string }
 */
function parseLyricSection(lyricText) {
  let text = lyricText.trim();
  let label = null;
  
  // Pattern 1: Label with colon (e.g., "Verse 1:", "Chorus:")
  const labelWithColonRegex = /^(Verse \d+|Chorus|Bridge|Intro|Outro|Pre-Chorus|Interlude|Tag|Refrain|Hook):\s*/i;
  const colonMatch = text.match(labelWithColonRegex);
  
  if (colonMatch) {
    label = colonMatch[1];
    text = text.replace(labelWithColonRegex, '').trim();
    return { label, text };
  }
  
  // Pattern 2: Standalone label on first line (e.g., "Verse 1\n...")
  const standaloneLabelRegex = /^(Verse \d+|Chorus|Bridge|Intro|Outro|Pre-Chorus|Interlude|Tag|Refrain|Hook)\s*\n/i;
  const standaloneMatch = text.match(standaloneLabelRegex);
  
  if (standaloneMatch) {
    label = standaloneMatch[1];
    text = text.replace(standaloneLabelRegex, '').trim();
    return { label, text };
  }
  
  // Pattern 3: Label at start without newline but with whitespace
  const labelOnlyRegex = /^(Verse \d+|Chorus|Bridge|Intro|Outro|Pre-Chorus|Interlude|Tag|Refrain|Hook)\s+/i;
  const labelOnlyMatch = text.match(labelOnlyRegex);
  
  if (labelOnlyMatch && text.length > labelOnlyMatch[0].length + 10) {
    // Only match if there's substantial text after the label
    label = labelOnlyMatch[1];
    text = text.replace(labelOnlyRegex, '').trim();
    return { label, text };
  }
  
  return { label: null, text };
}

/**
 * Render lyrics array with proper section labels
 * @param {Array} lyrics - Array of lyric sections
 * @param {boolean} isMediaPlayer - Whether rendering for media player (smaller styling)
 * @returns {string} - HTML string
 */
function renderLyrics(lyrics, isMediaPlayer = false) {
  if (!lyrics || lyrics.length === 0) {
    return '<p class="text-gray-500 italic">No lyrics available</p>';
  }
  
  return lyrics.map((verse, index) => {
    const { label, text } = parseLyricSection(verse);
    const displayLabel = label || `Verse ${index + 1}`;
    
    // Different styling for media player vs full lyrics view
    const verseClass = isMediaPlayer ? 'verse mb-6' : 'verse mb-8';
    const labelClass = isMediaPlayer 
      ? 'text-sm font-semibold text-purple-600 mb-2'
      : 'text-lg font-semibold text-purple-700 mb-3';
    const textClass = isMediaPlayer
      ? 'text-gray-700 whitespace-pre-line leading-relaxed'
      : 'text-gray-800 whitespace-pre-line leading-loose text-base';
    
    return `
      <div class="${verseClass}">
        <h4 class="${labelClass}">${displayLabel}</h4>
        <p class="${textClass}">${text}</p>
      </div>
    `;
  }).join('');
}

/**
 * Get a plain text version of lyrics without HTML formatting
 * @param {Array} lyrics - Array of lyric sections
 * @returns {string} - Plain text lyrics
 */
function getLyricsPlainText(lyrics) {
  if (!lyrics || lyrics.length === 0) {
    return 'No lyrics available';
  }
  
  return lyrics.map((verse, index) => {
    const { label, text } = parseLyricSection(verse);
    const displayLabel = label || `Verse ${index + 1}`;
    return `${displayLabel}\n${text}`;
  }).join('\n\n');
}

/**
 * Search lyrics for a specific term
 * @param {Array} lyrics - Array of lyric sections
 * @param {string} searchTerm - Term to search for
 * @returns {Array} - Array of matching sections with context
 */
function searchLyrics(lyrics, searchTerm) {
  if (!lyrics || lyrics.length === 0 || !searchTerm) {
    return [];
  }
  
  const term = searchTerm.toLowerCase();
  const matches = [];
  
  lyrics.forEach((verse, index) => {
    const { label, text } = parseLyricSection(verse);
    const displayLabel = label || `Verse ${index + 1}`;
    
    if (text.toLowerCase().includes(term)) {
      matches.push({
        index,
        label: displayLabel,
        text: text,
        preview: getSearchPreview(text, term, 50)
      });
    }
  });
  
  return matches;
}

/**
 * Get a preview snippet around a search term
 * @param {string} text - Full text
 * @param {string} searchTerm - Term to highlight
 * @param {number} contextLength - Characters before and after
 * @returns {string} - Preview text with ellipsis
 */
function getSearchPreview(text, searchTerm, contextLength = 50) {
  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);
  
  if (index === -1) return text.substring(0, 100) + '...';
  
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + searchTerm.length + contextLength);
  
  let preview = text.substring(start, end);
  if (start > 0) preview = '...' + preview;
  if (end < text.length) preview = preview + '...';
  
  return preview;
}

// Export functions to window for use in other modules
window.parseLyricSection = parseLyricSection;
window.renderLyrics = renderLyrics;
window.getLyricsPlainText = getLyricsPlainText;
window.searchLyrics = searchLyrics;

console.log("[DEBUG] Lyrics utility functions exported to window");

// Check if lyrics utility is loaded
console.log('=== LYRICS UTILITY CHECK ===');
console.log('window.renderLyrics exists:', typeof window.renderLyrics);
console.log('window.parseLyricSection exists:', typeof window.parseLyricSection);

// If not loaded, check scripts
const scripts = Array.from(document.scripts);
const lyricsUtilScript = scripts.find(s => s.src && s.src.includes('lyrics-utils.js'));
console.log('lyrics-utils.js script tag:', lyricsUtilScript ? 'FOUND' : 'NOT FOUND');
if (lyricsUtilScript) {
  console.log('  src:', lyricsUtilScript.src);
}