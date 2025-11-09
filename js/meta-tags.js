console.log("[DEBUG] meta-tags.js loaded");

/**
 * Update page meta tags for social sharing
 * @param {Object} item - Song or hymn object
 * @param {string} type - 'song' or 'hymn'
 */
function updateMetaTags(item, type = 'song') {
  if (!item) {
    console.warn('[DEBUG] No item provided for meta tag update');
    return;
  }

  const baseUrl = window.location.origin;
  const itemUrl = `${baseUrl}/?${type}=${item.serial_number}`;
  
  // Generate description
  const description = type === 'song' 
    ? `${item.title} by ${item.channel || 'Unknown Artist'} - ${item.duration}`
    : `Hymn #${item.serial_number}: ${item.title} by ${item.author || 'Unknown Author'} - ${item.duration}`;
  
  // Update page title
  document.title = `${item.title} | ChoristerCorner`;
  
  // Update or create meta tags
  updateMetaTag('og:type', 'music.song');
  updateMetaTag('og:url', itemUrl);
  updateMetaTag('og:title', item.title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:site_name', 'ChoristerCorner');
  
  // Try to get YouTube thumbnail as OG image
  if (item.url) {
    const videoId = extractVideoIdFromUrl(item.url);
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      updateMetaTag('og:image', thumbnailUrl);
      updateMetaTag('og:image:width', '1280');
      updateMetaTag('og:image:height', '720');
      updateMetaTag('twitter:image', thumbnailUrl);
    }
  }
  
  // Twitter Card meta tags
  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:url', itemUrl, 'name');
  updateMetaTag('twitter:title', item.title, 'name');
  updateMetaTag('twitter:description', description, 'name');
  
  // Add music-specific meta tags
  if (item.channel) {
    updateMetaTag('music:musician', item.channel);
  }
  if (item.duration) {
    updateMetaTag('music:duration', convertDurationToSeconds(item.duration));
  }
  
  console.log('[DEBUG] Meta tags updated for:', item.title);
}

/**
 * Update or create a meta tag
 * @param {string} property - Meta tag property or name
 * @param {string} content - Meta tag content
 * @param {string} attr - Attribute type ('property' or 'name')
 */
function updateMetaTag(property, content, attr = 'property') {
  let meta = document.querySelector(`meta[${attr}="${property}"]`);
  
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attr, property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
function extractVideoIdFromUrl(url) {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Convert duration string to seconds
 * @param {string} duration - Duration string (e.g., "5 minutes 27 seconds")
 * @returns {number} - Duration in seconds
 */
function convertDurationToSeconds(duration) {
  if (!duration) return 0;
  
  let totalSeconds = 0;
  
  // Extract minutes
  const minutesMatch = duration.match(/(\d+)\s*minute/i);
  if (minutesMatch) {
    totalSeconds += parseInt(minutesMatch[1]) * 60;
  }
  
  // Extract seconds
  const secondsMatch = duration.match(/(\d+)\s*second/i);
  if (secondsMatch) {
    totalSeconds += parseInt(secondsMatch[1]);
  }
  
  return totalSeconds;
}

/**
 * Reset meta tags to default
 */
function resetMetaTags() {
  const baseUrl = window.location.origin;
  
  document.title = 'ChoristerCorner - Your Digital Music Companion';
  
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:url', baseUrl);
  updateMetaTag('og:title', 'ChoristerCorner - Your Digital Music Companion');
  updateMetaTag('og:description', 'Your comprehensive digital music companion for worship, practice, and performance.');
  updateMetaTag('og:image', `${baseUrl}/assets/og-image.png`);
  updateMetaTag('og:image:width', '1200');
  updateMetaTag('og:image:height', '630');
  
  updateMetaTag('twitter:card', 'summary_large_image', 'name');
  updateMetaTag('twitter:url', baseUrl, 'name');
  updateMetaTag('twitter:title', 'ChoristerCorner - Your Digital Music Companion', 'name');
  updateMetaTag('twitter:description', 'Your comprehensive digital music companion for worship, practice, and performance.', 'name');
  updateMetaTag('twitter:image', `${baseUrl}/assets/og-image.png`, 'name');
  
  console.log('[DEBUG] Meta tags reset to default');
}

// Export functions to window
window.updateMetaTags = updateMetaTags;
window.resetMetaTags = resetMetaTags;
window.extractVideoIdFromUrl = extractVideoIdFromUrl;

console.log("[DEBUG] Meta tag utility functions exported to window");