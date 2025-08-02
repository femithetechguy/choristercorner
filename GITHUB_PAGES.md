# ChoristerCorner - GitHub Pages Integration Guide

## 🚀 Deploying to GitHub Pages

ChoristerCorner is fully compatible with GitHub Pages! Here's how to deploy and manage your worship song platform.

### Initial Setup

1. **Fork or Upload** this repository to your GitHub account
2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main (or master)
   - Folder: / (root)
3. **Your site will be available** at: `https://yourusername.github.io/choristercorner`

### 📋 Adding Songs from Playlists

You have three options to update your song library on GitHub Pages:

#### Option 1: Browser Tool + Manual Upload ⭐ Recommended
1. Visit your live site
2. Go to Songs tab → "Add from Playlist"
3. Paste playlist data in format:
   ```
   Amazing Grace - Chris Tomlin - 4:32 - https://www.youtube.com/watch?v=ABC123
   How Great Thou Art | Hillsong United | https://youtu.be/XYZ789
   ```
4. Process and download updated files
5. Upload files to your GitHub repo (csv/ and json/ folders)
6. Site updates automatically!

#### Option 2: GitHub Actions Automation ⚡
1. Go to your repo's Actions tab
2. Find "Update Playlist" workflow
3. Click "Run workflow"
4. Paste your playlist data
5. Files update automatically!

#### Option 3: Local Development 💻
```bash
git clone your-repo-url
npm install
npm run update-playlist "https://youtube.com/playlist?list=..."
git add . && git commit -m "Update songs"
git push
```

### 🔧 Configuration Files

- **`.github/workflows/update-playlist.yml`** - GitHub Actions workflow
- **`scripts/update-playlist.js`** - Node.js automation script
- **`scripts/process-manual-playlist.js`** - Manual data processor
- **`js/playlist-updater.js`** - Browser-based updater

### 📝 Supported Playlist Formats

```
# Format 1: Full details
Title - Artist - Duration - URL

# Format 2: Pipe separated
Title | Artist | URL

# Format 3: Just URLs
https://www.youtube.com/watch?v=VIDEO_ID

# Example:
Amazing Grace - Chris Tomlin - 4:32 - https://www.youtube.com/watch?v=ABC123
How Great Thou Art | Hillsong United | https://youtu.be/XYZ789
https://www.youtube.com/watch?v=DEF456
```

### 🎯 Features That Work on GitHub Pages

✅ **Full song library browsing**
✅ **Search and filtering**  
✅ **Video player with lyrics**
✅ **Responsive mobile design**
✅ **Playlist updater tool**
✅ **File download functionality**
✅ **GitHub Actions automation**

### ❌ Limitations

- No server-side file writing (use download + upload instead)
- YouTube API requires manual setup for advanced features
- Real-time updates require manual file replacement

### 🚀 Live Examples

Visit these live ChoristerCorner sites for inspiration:
- Demo Site: `https://yourusername.github.io/choristercorner`

### 🛠️ Customization

1. **Colors**: Edit `css/styles.css` CSS variables
2. **Content**: Modify `json/app.json` configuration
3. **Songs**: Use the playlist updater or edit files directly
4. **Tabs**: Customize `js/` modules for each section

### 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify file paths are correct
3. Ensure JSON files are valid
4. Test locally before deploying

Happy worship leading! 🎵✨
