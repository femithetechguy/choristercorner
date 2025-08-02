# SEO Configuration for ChoristerCorner

## Overview
This folder contains SEO-related files and templates to improve search engine visibility and social media sharing for ChoristerCorner.

## Files Description

### 1. `meta-tags.html`
Contains comprehensive meta tags including:
- Primary meta tags (title, description, keywords)
- Open Graph tags for Facebook sharing
- Twitter Card tags for Twitter sharing
- Additional meta tags for mobile and PWA support

### 2. `schema-webapp.json`
JSON-LD structured data for the main web application, helping search engines understand:
- App functionality and features
- Target audience
- Keywords and categories
- Free access information

### 3. `schema-song-template.json`
Template for individual song structured data, includes placeholders for:
- Song title and description
- Artist/composer information
- Lyrics and duration
- YouTube URL integration

### 4. Root-level SEO files:
- `/robots.txt` - Search engine crawling instructions
- `/sitemap.xml` - Site structure for search engines
- `/site.webmanifest` - PWA manifest for app-like experience

## Implementation Guidelines

### For Main Pages:
1. Include meta tags from `meta-tags.html` in the `<head>` section
2. Add structured data script tag referencing `schema-webapp.json`
3. Ensure canonical URLs are set correctly

### For Individual Songs:
1. Use `schema-song-template.json` as a template
2. Replace placeholders with actual song data:
   - `{{SONG_TITLE}}` → actual song title
   - `{{ARTIST_NAME}}` → artist/channel name
   - `{{YOUTUBE_URL}}` → YouTube video URL
   - `{{LYRICS_TEXT}}` → full lyrics text
   - `{{DURATION}}` → song duration
   - `{{SONG_PAGE_URL}}` → direct link to song page

### Dynamic Meta Tags:
For song-specific pages, update:
```html
<title>{{SONG_TITLE}} - {{ARTIST_NAME}} | ChoristerCorner</title>
<meta name="description" content="Listen to {{SONG_TITLE}} by {{ARTIST_NAME}}. View lyrics, chords, and practice resources at ChoristerCorner.">
<meta property="og:title" content="{{SONG_TITLE}} - {{ARTIST_NAME}} | ChoristerCorner">
<meta property="og:url" content="{{SONG_PAGE_URL}}">
```

## SEO Best Practices Implemented

### Technical SEO:
- ✅ Proper HTML structure with semantic elements
- ✅ Mobile-responsive design
- ✅ Fast loading times
- ✅ Clean URL structure
- ✅ XML sitemap
- ✅ Robots.txt file

### Content SEO:
- ✅ Descriptive page titles
- ✅ Meta descriptions under 160 characters
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Alt text for images
- ✅ Internal linking structure

### Schema Markup:
- ✅ WebApplication schema for main app
- ✅ MusicComposition schema for songs
- ✅ Organization schema for branding
- ✅ Breadcrumb navigation

### Social Media Optimization:
- ✅ Open Graph tags for Facebook
- ✅ Twitter Card tags
- ✅ Proper image dimensions
- ✅ Social media meta descriptions

## Monitoring & Analytics

### Recommended Tools:
1. **Google Search Console** - Monitor search performance
2. **Google Analytics** - Track user behavior
3. **Google PageSpeed Insights** - Monitor loading speed
4. **Rich Results Test** - Validate structured data
5. **Facebook Sharing Debugger** - Test Open Graph tags
6. **Twitter Card Validator** - Test Twitter cards

### Key Metrics to Track:
- Organic search traffic
- Page loading speed
- Mobile usability
- Click-through rates from search results
- Social media sharing engagement
- Core Web Vitals scores

## Content Strategy

### Target Keywords:
- Primary: "worship songs", "church music", "chorister resources"
- Secondary: "christian music", "hymns", "praise songs", "chord charts"
- Long-tail: "worship leader practice tools", "church song lyrics", "christian music library"

### Content Updates:
- Regular addition of new songs
- Weekly content updates
- Seasonal worship song collections
- User-generated content integration

## Local SEO (if applicable):
- Add location-based keywords for regional churches
- Create location-specific landing pages
- Register with Google My Business (if physical location)
- Encourage local church reviews and testimonials
