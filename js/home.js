/**
 * Home Tab Implementation for ChoristerCorner
 * Handles the main landing page functionality
 */

console.log("[DEBUG] Home tab module loaded");

// Home tab data and state
let homeData = {
  featuredSongs: [],
  featuredHymns: [],
  stats: {
    totalSongs: 0,
    totalHymns: 0,
    totalArtists: 0,
    totalMinutes: 0
  },
  isLoaded: false
};

// Load home data when module is initialized
async function loadHomeData() {
  try {
    console.log("[DEBUG] Loading home data");
    
    // Load songs data for statistics and featured content
    const songsResponse = await fetch('json/songs.json');
    const songsData = await songsResponse.json();
    
    // Load hymns data for statistics and featured content
    const hymnsResponse = await fetch('json/hymns.json');
    const hymnsData = await hymnsResponse.json();
    
    if (Array.isArray(songsData)) {
      homeData.featuredSongs = songsData.slice(0, 3); // Get first 3 songs as featured
      homeData.stats.totalSongs = songsData.length;
      
      // Calculate unique artists from songs
      const uniqueChannels = new Set(songsData.map(song => song.channel));
      
      // Calculate total minutes from songs (rough conversion from duration strings)
      let totalMinutes = 0;
      songsData.forEach(song => {
        if (song.duration) {
          const match = song.duration.match(/(\d+)\s*minutes?/);
          if (match) {
            totalMinutes += parseInt(match[1]);
          }
        }
      });
      
      // Add hymns data
      if (Array.isArray(hymnsData)) {
        homeData.featuredHymns = hymnsData.slice(0, 3); // Get first 3 hymns as featured
        homeData.stats.totalHymns = hymnsData.length;
        
        // Add hymn channels to unique artists
        hymnsData.forEach(hymn => {
          if (hymn.channel) {
            uniqueChannels.add(hymn.channel);
          }
        });
        
        // Add hymn minutes to total
        hymnsData.forEach(hymn => {
          if (hymn.duration) {
            const match = hymn.duration.match(/(\d+)\s*minutes?/);
            if (match) {
              totalMinutes += parseInt(match[1]);
            }
          }
        });
      }
      
      homeData.stats.totalArtists = uniqueChannels.size;
      homeData.stats.totalMinutes = totalMinutes;
      
      homeData.isLoaded = true;
      console.log("[DEBUG] Home data loaded successfully", homeData.stats);
    }
  } catch (error) {
    console.error("[DEBUG] Failed to load home data:", error);
    homeData.isLoaded = false;
  }
}

// Render the Home tab content
window.renderHomeTab = function(tab) {
  console.log("[DEBUG] Rendering Home tab");
  
  if (!homeData.isLoaded) {
    loadHomeData();
  }
  
  return `
    <div class="fade-in">
      <!-- Welcome Hero Section -->
      <div class="text-center mb-12">
        <div class="mx-auto mb-6">
          <i class="bi bi-music-note-beamed text-6xl text-purple-600"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to ChoristerCorner</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A comprehensive platform for choristers and worship leaders to discover, learn, and share beautiful worship songs.
        </p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
          <div class="card hover:scale-105 transition-transform">
            <div class="card-body text-center">
              <i class="bi bi-music-note-list text-3xl text-blue-600 mb-3"></i>
              <div class="text-3xl font-bold text-gray-900" id="total-songs">${homeData.stats.totalSongs}</div>
              <div class="text-gray-600">Total Songs</div>
            </div>
          </div>
          <div class="card hover:scale-105 transition-transform">
            <div class="card-body text-center">
              <i class="bi bi-book text-3xl text-purple-600 mb-3"></i>
              <div class="text-3xl font-bold text-gray-900" id="total-hymns">${homeData.stats.totalHymns}</div>
              <div class="text-gray-600">Traditional Hymns</div>
            </div>
          </div>
          <div class="card hover:scale-105 transition-transform">
            <div class="card-body text-center">
              <i class="bi bi-people text-3xl text-green-600 mb-3"></i>
              <div class="text-3xl font-bold text-gray-900">${homeData.stats.totalArtists}+</div>
              <div class="text-gray-600">Featured Artists</div>
            </div>
          </div>
          <div class="card hover:scale-105 transition-transform">
            <div class="card-body text-center">
              <i class="bi bi-clock text-3xl text-orange-600 mb-3"></i>
              <div class="text-3xl font-bold text-gray-900">${homeData.stats.totalMinutes}+</div>
              <div class="text-gray-600">Minutes of Worship</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Songs Section -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-star-fill text-yellow-500 mr-3"></i>
            Featured Songs
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="featured-songs-container">
            ${renderFeaturedSongs()}
          </div>
        </div>
      </div>

      <!-- Featured Hymns Section -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-book text-purple-500 mr-3"></i>
            Featured Traditional Hymns
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="featured-hymns-container">
            ${renderFeaturedHymns()}
          </div>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-lightning-fill text-blue-500 mr-3"></i>
            Quick Actions
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button class="quick-action-btn bg-blue-50 hover:bg-blue-100 border-blue-200" onclick="navigateToSongs()">
              <i class="bi bi-search text-2xl text-blue-600 mb-2"></i>
              <div class="text-sm font-medium text-blue-900">Search Songs</div>
            </button>
            <button class="quick-action-btn bg-purple-50 hover:bg-purple-100 border-purple-200" onclick="navigateToHymns()">
              <i class="bi bi-book text-2xl text-purple-600 mb-2"></i>
              <div class="text-sm font-medium text-purple-900">Browse Hymns</div>
            </button>
            <button class="quick-action-btn bg-green-50 hover:bg-green-100 border-green-200" onclick="showFavorites()">
              <i class="bi bi-heart text-2xl text-green-600 mb-2"></i>
              <div class="text-sm font-medium text-green-900">View Favorites</div>
            </button>
            <button class="quick-action-btn bg-orange-50 hover:bg-orange-100 border-orange-200" onclick="navigateToContact()">
              <i class="bi bi-plus-circle text-2xl text-orange-600 mb-2"></i>
              <div class="text-sm font-medium text-orange-900">Suggest Song</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div class="card mt-8">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-clock-history text-indigo-500 mr-3"></i>
            Getting Started
          </h2>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <i class="bi bi-1-circle text-lg text-purple-600 mt-1"></i>
              <div>
                <h3 class="font-medium text-gray-900">Explore the Music Library</h3>
                <p class="text-sm text-gray-600">Browse our collection of worship songs and traditional hymns with lyrics and YouTube links.</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <i class="bi bi-2-circle text-lg text-purple-600 mt-1"></i>
              <div>
                <h3 class="font-medium text-gray-900">Use the Search Feature</h3>
                <p class="text-sm text-gray-600">Find songs and hymns by title, artist, or browse by channel.</p>
              </div>
            </div>
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <i class="bi bi-3-circle text-lg text-purple-600 mt-1"></i>
              <div>
                <h3 class="font-medium text-gray-900">Read the Lyrics</h3>
                <p class="text-sm text-gray-600">Each song and hymn includes structured lyrics organized by verses and choruses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Render featured songs
function renderFeaturedSongs() {
  if (!homeData.featuredSongs.length) {
    return `
      <div class="col-span-full text-center py-8">
        <i class="bi bi-music-note text-4xl text-gray-400 mb-3"></i>
        <p class="text-gray-500">Featured songs will appear here once data is loaded.</p>
      </div>
    `;
  }

  return homeData.featuredSongs.map(song => `
    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <i class="bi bi-music-note text-2xl text-purple-600"></i>
        <span class="text-sm text-gray-500">${song.duration || 'N/A'}</span>
      </div>
      <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">${song.title || 'Untitled'}</h3>
      <p class="text-sm text-gray-600 mb-3">${song.channel || 'Unknown Artist'}</p>
      <div class="flex space-x-2">
        <button 
          onclick="playSong('${song.url}')" 
          class="flex-1 btn btn-primary btn-sm"
          ${!song.url ? 'disabled' : ''}
        >
          <i class="bi bi-play-fill"></i>
          <span>Listen</span>
        </button>
        <button 
          onclick="viewSongLyrics(${song.serial_number})" 
          class="btn btn-outline btn-sm"
        >
          <i class="bi bi-file-text"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Render featured hymns
function renderFeaturedHymns() {
  if (!homeData.featuredHymns.length) {
    return `
      <div class="col-span-full text-center py-8">
        <i class="bi bi-book text-4xl text-gray-400 mb-3"></i>
        <p class="text-gray-500">Featured hymns will appear here once data is loaded.</p>
      </div>
    `;
  }

  return homeData.featuredHymns.map(hymn => `
    <div class="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <i class="bi bi-book text-2xl text-purple-600"></i>
        <span class="text-sm text-purple-500">${hymn.duration || 'N/A'}</span>
      </div>
      <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">${hymn.title || 'Untitled'}</h3>
      <p class="text-sm text-gray-600 mb-3">${hymn.channel || 'Unknown Artist'}</p>
      <div class="flex space-x-2">
        <button 
          onclick="playHymn('${hymn.url}')" 
          class="flex-1 btn btn-secondary btn-sm"
          ${!hymn.url ? 'disabled' : ''}
        >
          <i class="bi bi-play-fill"></i>
          <span>Listen</span>
        </button>
        <button 
          onclick="viewHymnLyrics(${hymn.serial_number})" 
          class="btn btn-outline btn-sm"
        >
          <i class="bi bi-file-text"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Home tab specific functions
function navigateToSongs() {
  console.log("[DEBUG] Navigating to Songs tab");
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Songs');
  }
}

function navigateToHymns() {
  console.log("[DEBUG] Navigating to Hymns tab");
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Hymns');
  }
}

function navigateToContact() {
  console.log("[DEBUG] Navigating to Contact tab");
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Contact');
  }
}

function showFavorites() {
  console.log("[DEBUG] Showing favorites (feature to be implemented)");
  // TODO: Implement favorites functionality
  alert('Favorites feature coming soon!');
}

function playSong(url) {
  console.log("[DEBUG] Playing song:", url);
  if (url && url !== 'undefined') {
    window.open(url, '_blank');
  } else {
    alert('Song URL not available');
  }
}

function playHymn(url) {
  console.log("[DEBUG] Playing hymn:", url);
  if (url && url !== 'undefined') {
    window.open(url, '_blank');
  } else {
    alert('Hymn URL not available');
  }
}

function viewSongLyrics(serialNumber) {
  console.log("[DEBUG] Viewing lyrics for song:", serialNumber);
  // Navigate to songs tab and show specific song
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Songs');
    // TODO: Implement song filtering by serial number
  }
}

function viewHymnLyrics(serialNumber) {
  console.log("[DEBUG] Viewing lyrics for hymn:", serialNumber);
  // Navigate to hymns tab and show specific hymn
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Hymns');
    // TODO: Implement hymn filtering by serial number
  }
}

// Initialize home data when the module loads
loadHomeData();

console.log("[DEBUG] Home tab module initialization complete");
