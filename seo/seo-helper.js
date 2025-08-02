/**
 * SEO Helper Module for ChoristerCorner
 * Dynamic meta tag management and structured data injection
 */

class SEOHelper {
  constructor() {
    this.defaultTitle = "ChoristerCorner - Worship Songs, Chords & Resources for Church Musicians";
    this.defaultDescription = "Discover worship songs, chord charts, and practice tools for choristers and worship leaders. Free access to Christian music resources, lyrics, and YouTube integration.";
    this.siteName = "ChoristerCorner";
    this.siteUrl = "https://choristercorner.com";
    this.twitterHandle = "@choristercorner";
  }

  /**
   * Update page title and meta description
   * @param {string} title - Page title
   * @param {string} description - Page description
   * @param {string} path - Current page path
   */
  updatePageMeta(title, description, path = '') {
    // Update title
    document.title = title || this.defaultTitle;
    
    // Update meta description
    this.updateMetaTag('name', 'description', description || this.defaultDescription);
    
    // Update Open Graph tags
    this.updateMetaTag('property', 'og:title', title || this.defaultTitle);
    this.updateMetaTag('property', 'og:description', description || this.defaultDescription);
    this.updateMetaTag('property', 'og:url', `${this.siteUrl}${path}`);
    
    // Update Twitter tags
    this.updateMetaTag('property', 'twitter:title', title || this.defaultTitle);
    this.updateMetaTag('property', 'twitter:description', description || this.defaultDescription);
    
    // Update canonical URL
    this.updateCanonicalUrl(`${this.siteUrl}${path}`);
  }

  /**
   * Update meta tag content
   * @param {string} attribute - 'name' or 'property'
   * @param {string} value - Meta tag identifier
   * @param {string} content - New content
   */
  updateMetaTag(attribute, value, content) {
    let metaTag = document.querySelector(`meta[${attribute}="${value}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      // Create new meta tag if it doesn't exist
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, value);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  }

  /**
   * Update canonical URL
   * @param {string} url - Canonical URL
   */
  updateCanonicalUrl(url) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', url);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', url);
      document.head.appendChild(canonicalLink);
    }
  }

  /**
   * Generate and inject song-specific structured data
   * @param {Object} song - Song object with title, artist, lyrics, etc.
   */
  generateSongSchema(song) {
    if (!song) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "MusicComposition",
      "name": song.title || "Untitled",
      "description": `Worship song: ${song.title} by ${song.channel || 'Unknown Artist'}. View lyrics, chords, and practice at ChoristerCorner.`,
      "composer": {
        "@type": "Person",
        "name": song.channel || "Unknown Artist"
      },
      "performer": {
        "@type": "MusicGroup",
        "name": song.channel || "Unknown Artist"
      },
      "genre": [
        "Christian Music",
        "Worship Music",
        "Contemporary Christian",
        "Gospel"
      ],
      "inLanguage": "en",
      "url": `${this.siteUrl}?song=${song.serial_number}&title=${this.createSlug(song.title)}`,
      "datePublished": new Date().toISOString().split('T')[0],
      "keywords": [
        "worship song",
        "christian music",
        song.title,
        song.channel,
        "church music",
        "praise song"
      ].filter(Boolean),
      "audience": {
        "@type": "Audience",
        "audienceType": [
          "Christian Community",
          "Worship Teams",
          "Church Congregations"
        ]
      },
      "isPartOf": {
        "@type": "WebApplication",
        "name": this.siteName,
        "url": this.siteUrl
      }
    };

    // Add lyrics if available
    if (song.lyrics && Array.isArray(song.lyrics) && song.lyrics.length > 0) {
      schema.lyrics = {
        "@type": "CreativeWork",
        "text": song.lyrics.join('\\n\\n')
      };
    }

    // Add recording information if YouTube URL is available
    if (song.url) {
      schema.recordedAs = {
        "@type": "MusicRecording",
        "name": song.title,
        "url": song.url,
        "duration": song.duration || "Unknown",
        "encodingFormat": "video/mp4"
      };
    }

    this.injectStructuredData('song-schema', schema);
  }

  /**
   * Generate and inject app-level structured data
   */
  generateAppSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": this.siteName,
      "description": this.defaultDescription,
      "url": this.siteUrl,
      "applicationCategory": "MusicApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": this.siteName,
        "url": this.siteUrl
      },
      "keywords": [
        "worship songs",
        "church music",
        "chorister",
        "worship leader",
        "christian music",
        "hymns",
        "praise songs",
        "chord charts",
        "music practice",
        "church resources",
        "song lyrics",
        "worship resources"
      ],
      "featureList": [
        "Song Library with Lyrics",
        "Chord Charts and Progressions",
        "Practice Tools for Musicians",
        "Worship Resources",
        "YouTube Integration",
        "Search and Filter Songs",
        "Mobile-Friendly Interface"
      ],
      "softwareVersion": "1.0.0",
      "datePublished": "2025-08-02",
      "dateModified": new Date().toISOString().split('T')[0],
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "audience": {
        "@type": "Audience",
        "audienceType": [
          "Choristers",
          "Worship Leaders",
          "Church Musicians",
          "Music Directors",
          "Christian Musicians"
        ]
      }
    };

    this.injectStructuredData('app-schema', schema);
  }

  /**
   * Inject structured data into the page
   * @param {string} id - Script tag ID
   * @param {Object} schema - Schema object
   */
  injectStructuredData(id, schema) {
    // Remove existing schema script if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script tag
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Update SEO for song page
   * @param {Object} song - Song object
   */
  updateSongSEO(song) {
    if (!song) return;

    const title = `${song.title} - ${song.channel || 'Unknown Artist'} | ${this.siteName}`;
    const description = `Listen to ${song.title} by ${song.channel || 'Unknown Artist'}. View lyrics, chords, and practice resources at ChoristerCorner.`;
    const path = `?song=${song.serial_number}&title=${this.createSlug(song.title)}`;

    this.updatePageMeta(title, description, path);
    this.generateSongSchema(song);

    // Update Open Graph image if available (placeholder for future implementation)
    // this.updateMetaTag('property', 'og:image', song.imageUrl || `${this.siteUrl}/images/og-image.png`);
  }

  /**
   * Reset SEO to default values
   */
  resetToDefault() {
    this.updatePageMeta(this.defaultTitle, this.defaultDescription, '');
    this.generateAppSchema();
    
    // Remove song-specific schema
    const songSchema = document.getElementById('song-schema');
    if (songSchema) {
      songSchema.remove();
    }
  }

  /**
   * Create URL-friendly slug from title
   * @param {string} title - Original title
   * @returns {string} URL-friendly slug
   */
  createSlug(title) {
    if (!title) return 'untitled';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate breadcrumb structured data
   * @param {Array} breadcrumbs - Array of breadcrumb items {name, url}
   */
  generateBreadcrumbSchema(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${this.siteUrl}${crumb.url}`
      }))
    };

    this.injectStructuredData('breadcrumb-schema', schema);
  }

  /**
   * Initialize SEO for the application
   */
  initialize() {
    console.log("[SEO] Initializing SEO helper");
    
    // Set default app-level structured data
    this.generateAppSchema();
    
    // Set default meta tags if not already present
    if (!document.querySelector('meta[name="description"]')) {
      this.updatePageMeta(this.defaultTitle, this.defaultDescription);
    }
  }
}

// Export for use in other modules
window.SEOHelper = SEOHelper;

// Initialize SEO helper when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.seoHelper = new SEOHelper();
    window.seoHelper.initialize();
  });
} else {
  window.seoHelper = new SEOHelper();
  window.seoHelper.initialize();
}

console.log("[SEO] SEO Helper module loaded");
