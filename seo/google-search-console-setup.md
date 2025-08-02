# Google Search Console Setup Guide

## Step 1: Verify Ownership
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add your property: `https://choristercorner.com`
3. Choose verification method:

### Option A: HTML File Upload
- Download the verification file from Google Search Console
- Upload it to your website root: `/google[verification-code].html`

### Option B: Meta Tag Verification
- Add this meta tag to your index.html `<head>` section:
```html
<meta name="google-site-verification" content="[YOUR-VERIFICATION-CODE]" />
```

### Option C: Google Analytics (if already setup)
- Use existing Google Analytics tracking code

## Step 2: Submit Sitemap
1. In Search Console, go to Sitemaps
2. Submit: `https://choristercorner.com/sitemap.xml`

## Step 3: Monitor Performance
- Check Index Coverage
- Monitor Search Performance
- Review Mobile Usability
- Track Core Web Vitals

## Common Issues to Monitor:
- 404 errors for song pages
- Mobile usability problems
- Page loading speed issues
- Structured data errors

## Recommended Settings:
- Enable email notifications for critical issues
- Set up URL inspection for new song pages
- Monitor international targeting (if applicable)
- Track keyword performance for worship music terms
