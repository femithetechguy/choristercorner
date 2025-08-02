/**
 * Browser-based Playlist Updater for ChoristerCorner
 * Extracts playlist data and generates updated songs.json format
 */

class PlaylistUpdater {
  constructor() {
    this.existingSongs = [];
  }

  /**
   * Extract playlist ID from YouTube URL
   */
  extractPlaylistId(url) {
    const patterns = [
      /[?&]list=([^&\n?#]+)/,
      /youtube\.com\/playlist\?list=([^&\n?#]+)/,
      /youtube\.com\/watch\?.*list=([^&\n?#]+)/
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
   * Load existing songs data
   */
  async loadExistingSongs() {
    try {
      const response = await fetch('./json/songs.json');
      if (response.ok) {
        this.existingSongs = await response.json();
        console.log(`Loaded ${this.existingSongs.length} existing songs`);
      }
    } catch (error) {
      console.log('No existing songs found, starting fresh');
      this.existingSongs = [];
    }
  }

  /**
   * Generate new song entry
   */
  createSongEntry(title, channel, duration, url) {
    const nextSerialNumber = this.existingSongs.length > 0 
      ? Math.max(...this.existingSongs.map(s => s.serial_number)) + 1 
      : 1;

    return {
      serial_number: nextSerialNumber + this.newSongs.length,
      title: title.trim(),
      channel: channel.trim(),
      duration: duration || 'Unknown',
      url: url,
      lyrics: [
        "Verse 1:",
        "Please add lyrics here...",
        "",
        "Chorus:",
        "Please add lyrics here...",
        "",
        "Verse 2:",
        "Please add lyrics here..."
      ]
    };
  }

  /**
   * Process manual playlist input
   */
  processManualPlaylist(playlistText) {
    const lines = playlistText.split('\n').filter(line => line.trim());
    const newSongs = [];
    const existingUrls = new Set(this.existingSongs.map(song => song.url));

    for (const line of lines) {
      // Try to parse line formats:
      // 1. "Title - Channel - Duration - URL"
      // 2. "Title | Channel | URL"
      // 3. Just URL (will need manual title/channel input)
      
      if (line.includes('youtube.com/watch') || line.includes('youtu.be/')) {
        const urlMatch = line.match(/(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/);
        
        if (urlMatch && !existingUrls.has(urlMatch[1])) {
          const url = urlMatch[1];
          
          // Try to extract title and channel from the line
          const parts = line.split(/[-|]/);
          
          let title = 'Unknown Title';
          let channel = 'Unknown Channel';
          let duration = 'Unknown';
          
          if (parts.length >= 3) {
            title = parts[0].replace(urlMatch[1], '').trim();
            channel = parts[1].trim();
            duration = parts[2].replace(urlMatch[1], '').trim();
          } else if (parts.length >= 2) {
            title = parts[0].replace(urlMatch[1], '').trim();
            channel = parts[1].replace(urlMatch[1], '').trim();
          } else {
            // Extract title from URL if possible
            const urlParams = new URLSearchParams(new URL(url).search);
            title = urlParams.get('v') || 'Unknown Title';
          }
          
          newSongs.push(this.createSongEntry(title, channel, duration, url));
        }
      }
    }

    return newSongs;
  }

  /**
   * Generate downloadable files
   */
  generateDownloadableFiles(allSongs) {
    // Generate JSON
    const jsonContent = JSON.stringify(allSongs, null, 2);
    
    // Generate CSV
    const csvHeaders = ['serial_number', 'title', 'channel', 'duration', 'url', 'lyrics'];
    const csvRows = allSongs.map(song => {
      const lyricsText = song.lyrics.join(' | ');
      return [
        song.serial_number,
        `"${song.title.replace(/"/g, '""')}"`,
        `"${song.channel.replace(/"/g, '""')}"`,
        song.duration,
        song.url,
        `"${lyricsText.replace(/"/g, '""')}"`
      ].join(',');
    });
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    return { jsonContent, csvContent };
  }

  /**
   * Download file to user's computer
   */
  downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create UI for playlist updater
function createPlaylistUpdaterUI() {
  return `
    <div class="playlist-updater-container">
      <div class="card">
        <div class="card-header">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <i class="bi bi-collection-play mr-2"></i>
            Playlist Updater
          </h3>
          <p class="text-sm text-gray-600 mt-1">Add songs from YouTube playlists to your library</p>
        </div>
        
        <div class="card-body space-y-6">
          <!-- Method Selection -->
          <div>
            <label class="form-label">Update Method</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="updateMethod" value="manual" checked class="mr-2">
                <span>Manual Input (Paste playlist data)</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="updateMethod" value="url" class="mr-2">
                <span>Playlist URL (Requires manual extraction)</span>
              </label>
            </div>
          </div>

          <!-- Manual Input Section -->
          <div id="manual-input-section">
            <label class="form-label">Playlist Data</label>
            <textarea 
              id="playlist-data" 
              class="form-textarea" 
              rows="10" 
              placeholder="Paste your playlist data here. Supported formats:
• Title - Channel - Duration - URL
• Title | Channel | URL  
• Just URLs (one per line)

Example:
Amazing Grace - Chris Tomlin - 4:32 - https://www.youtube.com/watch?v=ABC123
How Great Thou Art | Hillsong | https://youtu.be/XYZ789"
            ></textarea>
            <div class="form-help">
              Paste playlist data in any of the supported formats. The tool will extract song information automatically.
            </div>
          </div>

          <!-- URL Input Section -->
          <div id="url-input-section" style="display: none;">
            <label class="form-label">YouTube Playlist URL</label>
            <input 
              type="url" 
              id="playlist-url" 
              class="form-input" 
              placeholder="https://www.youtube.com/playlist?list=..."
            >
            <div class="form-help">
              <strong>Note:</strong> Due to YouTube API limitations, you'll need to manually extract playlist data. 
              The tool will help you format it correctly.
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button id="process-playlist" class="btn btn-primary">
              <i class="bi bi-gear mr-2"></i>
              Process Playlist
            </button>
            <button id="preview-results" class="btn btn-outline" disabled>
              <i class="bi bi-eye mr-2"></i>
              Preview Results
            </button>
            <button id="download-files" class="btn btn-secondary" disabled>
              <i class="bi bi-download mr-2"></i>
              Download Files
            </button>
            <button id="github-instructions" class="btn btn-ghost" disabled>
              <i class="bi bi-github mr-2"></i>
              GitHub Pages
            </button>
          </div>

          <!-- Results -->
          <div id="results-section" style="display: none;">
            <h4 class="font-semibold text-gray-900 mb-3">Processing Results</h4>
            <div id="results-content" class="bg-gray-50 p-4 rounded-lg"></div>
          </div>

          <!-- Preview -->
          <div id="preview-section" style="display: none;">
            <h4 class="font-semibold text-gray-900 mb-3">New Songs Preview</h4>
            <div id="preview-content" class="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize playlist updater functionality
function initializePlaylistUpdater() {
  const updater = new PlaylistUpdater();
  let processedSongs = [];

  // Wait for DOM elements to be available
  setTimeout(() => {
    // Check if required elements exist
    const processButton = document.getElementById('process-playlist');
    const previewButton = document.getElementById('preview-results');
    const downloadButton = document.getElementById('download-files');
    const githubButton = document.getElementById('github-instructions');
    
    if (!processButton) {
      console.error('Playlist updater elements not found in DOM');
      return;
    }

    // Method selection
    const methodRadios = document.querySelectorAll('input[name="updateMethod"]');
    const manualSection = document.getElementById('manual-input-section');
    const urlSection = document.getElementById('url-input-section');

    methodRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'manual') {
          manualSection.style.display = 'block';
          urlSection.style.display = 'none';
        } else {
          manualSection.style.display = 'none';
          urlSection.style.display = 'block';
        }
      });
    });

    // Process playlist
    processButton.addEventListener('click', async () => {
    const method = document.querySelector('input[name="updateMethod"]:checked').value;
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    try {
      // Load existing songs
      await updater.loadExistingSongs();
      
      let newSongs = [];
      
      if (method === 'manual') {
        const playlistData = document.getElementById('playlist-data').value;
        if (!playlistData.trim()) {
          throw new Error('Please enter playlist data');
        }
        
        updater.newSongs = [];
        newSongs = updater.processManualPlaylist(playlistData);
      } else {
        const playlistUrl = document.getElementById('playlist-url').value;
        if (!playlistUrl.trim()) {
          throw new Error('Please enter a playlist URL');
        }
        
        // For URL method, show instructions
        resultsContent.innerHTML = `
          <div class="text-center">
            <i class="bi bi-info-circle text-4xl text-blue-500 mb-4"></i>
            <h5 class="font-semibold mb-2">Manual Extraction Required</h5>
            <p class="text-sm text-gray-600 mb-4">
              To extract playlist data, please:
            </p>
            <ol class="text-left text-sm space-y-2 max-w-md mx-auto">
              <li>1. Open the playlist URL in a new tab</li>
              <li>2. Copy song titles, channels, and URLs</li>
              <li>3. Switch to "Manual Input" method</li>
              <li>4. Paste the data in the supported format</li>
            </ol>
          </div>
        `;
        resultsSection.style.display = 'block';
        return;
      }
      
      processedSongs = [...updater.existingSongs, ...newSongs];
      
      resultsContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center text-green-600">
            <i class="bi bi-check-circle mr-2"></i>
            <span class="font-semibold">Processing Complete!</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">Existing Songs:</span> ${updater.existingSongs.length}
            </div>
            <div>
              <span class="font-medium">New Songs:</span> ${newSongs.length}
            </div>
            <div>
              <span class="font-medium">Total Songs:</span> ${processedSongs.length}
            </div>
            <div>
              <span class="font-medium">Duplicates Skipped:</span> ${updater.existingSongs.filter(existing => 
                document.getElementById('playlist-data').value.includes(existing.url)
              ).length}
            </div>
          </div>
        </div>
      `;
      
      resultsSection.style.display = 'block';
    document.getElementById('preview-results').disabled = false;
    document.getElementById('download-files').disabled = false;
    document.getElementById('github-instructions').disabled = false;    } catch (error) {
      resultsContent.innerHTML = `
        <div class="text-red-600">
          <i class="bi bi-exclamation-triangle mr-2"></i>
          Error: ${error.message}
        </div>
      `;
      resultsSection.style.display = 'block';
    }
  });

  // Preview results
  previewButton.addEventListener('click', () => {
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    
    const newSongs = processedSongs.slice(updater.existingSongs.length);
    
    if (newSongs.length === 0) {
      previewContent.innerHTML = '<p class="text-gray-500">No new songs to preview.</p>';
    } else {
      previewContent.innerHTML = newSongs.map(song => `
        <div class="bg-white p-3 rounded border mb-2">
          <div class="font-medium">#${song.serial_number} - ${song.title}</div>
          <div class="text-sm text-gray-600">${song.channel} • ${song.duration}</div>
          <div class="text-xs text-blue-600 truncate">${song.url}</div>
        </div>
      `).join('');
    }
    
    previewSection.style.display = 'block';
  });

  // Download files
  downloadButton.addEventListener('click', () => {
    const { jsonContent, csvContent } = updater.generateDownloadableFiles(processedSongs);
    
    // Download both files
    updater.downloadFile(jsonContent, 'songs.json', 'application/json');
    updater.downloadFile(csvContent, 'songs.csv', 'text/csv');
    
    // Show success message
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += `
      <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded">
        <div class="flex items-center text-green-700">
          <i class="bi bi-download mr-2"></i>
          <span class="font-semibold">Files Downloaded!</span>
        </div>
        <p class="text-sm text-green-600 mt-1">
          Please replace the files in your project's csv/ and json/ folders.
        </p>
      </div>
    `;
  });

  // GitHub Pages instructions
  githubButton.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900 flex items-center">
              <i class="bi bi-github mr-2"></i>
              GitHub Pages Integration
            </h3>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- Method 1: Manual Upload -->
            <div class="card">
              <div class="card-header">
                <h4 class="font-semibold text-gray-900">📁 Method 1: Manual File Upload</h4>
              </div>
              <div class="card-body">
                <ol class="list-decimal list-inside space-y-2 text-sm">
                  <li>Click "Download Files" to get updated songs.json and songs.csv</li>
                  <li>Go to your GitHub repository</li>
                  <li>Navigate to the csv/ and json/ folders</li>
                  <li>Upload the new files (replace existing ones)</li>
                  <li>Commit changes with a message like "Update song library"</li>
                  <li>GitHub Pages will automatically rebuild your site</li>
                </ol>
              </div>
            </div>

            <!-- Method 2: GitHub Actions -->
            <div class="card">
              <div class="card-header">
                <h4 class="font-semibold text-gray-900">⚡ Method 2: GitHub Actions (Automated)</h4>
              </div>
              <div class="card-body space-y-4">
                <p class="text-sm text-gray-600">Use the included GitHub workflow for automatic updates:</p>
                
                <div class="bg-gray-50 p-3 rounded">
                  <h5 class="font-medium mb-2">Setup Steps:</h5>
                  <ol class="list-decimal list-inside space-y-1 text-sm">
                    <li>Ensure the .github/workflows/update-playlist.yml file is in your repo</li>
                    <li>Go to your GitHub repo → Actions tab</li>
                    <li>Find "Update Playlist" workflow</li>
                    <li>Click "Run workflow"</li>
                    <li>Paste your playlist data in the text box</li>
                    <li>Click "Run workflow" button</li>
                  </ol>
                </div>

                <div class="bg-blue-50 p-3 rounded">
                  <h5 class="font-medium mb-2">Playlist Data Format:</h5>
                  <pre class="text-xs bg-white p-2 rounded border"><code>${document.getElementById('playlist-data').value || `Amazing Grace - Chris Tomlin - 4:32 - https://www.youtube.com/watch?v=ABC123
How Great Thou Art | Hillsong United | https://youtu.be/XYZ789`}</code></pre>
                </div>
              </div>
            </div>

            <!-- Method 3: Local Development -->
            <div class="card">
              <div class="card-header">
                <h4 class="font-semibold text-gray-900">💻 Method 3: Local Development</h4>
              </div>
              <div class="card-body">
                <ol class="list-decimal list-inside space-y-2 text-sm">
                  <li>Clone your repository locally</li>
                  <li>Run <code class="bg-gray-100 px-1 rounded">npm install</code></li>
                  <li>Use the Node.js scripts: <code class="bg-gray-100 px-1 rounded">npm run update-playlist "playlist-url"</code></li>
                  <li>Commit and push changes</li>
                  <li>GitHub Pages will automatically update</li>
                </ol>
              </div>
            </div>

            <div class="bg-green-50 border border-green-200 rounded p-4">
              <div class="flex items-start">
                <i class="bi bi-lightbulb text-green-600 mr-2 mt-0.5"></i>
                <div class="text-sm">
                  <p class="font-medium text-green-800 mb-1">💡 Recommended Workflow:</p>
                  <p class="text-green-700">Use Method 1 (Manual Upload) for simplicity, or Method 2 (GitHub Actions) for automation. Both work perfectly with GitHub Pages!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  });
  
  }, 200); // End setTimeout - wait for DOM elements to be created
}

// Export for use in songs tab
window.PlaylistUpdater = {
  createUI: createPlaylistUpdaterUI,
  initialize: initializePlaylistUpdater
};
