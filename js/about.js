/**
 * About Tab Implementation for ChoristerCorner
 * Handles app information, features, and usage guidelines
 */

console.log("[DEBUG] About tab module loaded");

// About tab data
const aboutData = {
  appInfo: {
    name: "ChoristerCorner",
    version: "1.0.0",
    description: "A comprehensive platform for choristers and worship leaders",
    purpose: "To provide easy access to worship songs with lyrics and resources for church choirs and worship teams"
  },
  features: [
    {
      icon: "bi-music-note-list",
      title: "Song Library",
      description: "Comprehensive collection of worship songs with structured lyrics and YouTube integration"
    },
    {
      icon: "bi-search",
      title: "Smart Search",
      description: "Find songs quickly by title, artist, or channel with real-time filtering"
    },
    {
      icon: "bi-file-text",
      title: "Organized Lyrics",
      description: "Lyrics are structured in paragraphs and sections for easy reading and learning"
    },
    {
      icon: "bi-clock",
      title: "Professional Metronome",
      description: "Interactive metronome with adjustable BPM, time signatures, and tap tempo for worship practice"
    },
    {
      icon: "bi-disc",
      title: "Drummer",  // Changed from "Drum Machine"
      description: "Professional drum patterns and rhythms for worship teams and choir practice sessions"
    },
    {
      icon: "bi-phone",
      title: "Mobile Responsive",
      description: "Access your songs anywhere with our mobile-friendly design"
    },
    {
      icon: "bi-youtube",
      title: "YouTube Integration",
      description: "Direct links to YouTube videos for listening and learning"
    },
    {
      icon: "bi-heart",
      title: "Favorites System",
      description: "Save your favorite songs for quick access (coming soon)"
    }
  ],
  mission: {
    title: "Our Mission",
    content: "To empower worship leaders and choristers with easy access to quality worship songs, complete with lyrics, multimedia resources, and practice tools. We believe that worship is central to Christian life, and having the right tools makes all the difference in leading others into God's presence."
  },
  vision: {
    title: "Our Vision",
    content: "To become the go-to platform for worship teams worldwide, providing not just songs and lyrics, but also professional practice tools, resources for training, community building, and spiritual growth in worship ministry."
  },
  howToUse: [
    {
      step: 1,
      title: "Browse the Library",
      description: "Visit the Songs tab to explore our collection of worship songs"
    },
    {
      step: 2,
      title: "Search & Filter",
      description: "Use the search bar to find specific songs or browse by artist/channel"
    },
    {
      step: 3,
      title: "Read Lyrics",
      description: "Click on any song to view the complete lyrics organized by sections"
    },
    {
      step: 4,
      title: "Practice with Tools",
      description: "Use the Metronome for timing and Drummer for rhythm practice"
    },
    {
      step: 5,
      title: "Listen & Learn",
      description: "Use the YouTube links to listen to songs and learn the melodies"
    }
  ],
  practiceTools: [
    {
      icon: "bi-clock",
      title: "Metronome",
      tabName: "Metronome",  // Add this for navigation
      description: "Professional metronome with BPM range from 40-300, multiple time signatures, visual feedback, and tap tempo feature",
      features: ["Adjustable BPM", "Time signatures", "Tap tempo", "Visual indicators", "Mobile friendly"]
    },
    {
      icon: "bi-disc",
      title: "Drummer",  // Change from "Drum Machine" to "Drummer"
      tabName: "Drummer",  // Add this for navigation
      description: "Interactive drum patterns for worship practice with multiple styles and customizable rhythms",
      features: ["Multiple patterns", "Worship styles", "Loop control", "Volume control", "Layer sounds"]
    }
  ],

  credits: [
    {
      category: "Development",
      items: ["Built with modern web technologies", "Responsive design using Tailwind CSS", "Bootstrap Icons for beautiful iconography"]
    },
    {
      category: "Content",
      items: ["Song data from various Christian YouTube channels", "Curated selection of contemporary worship songs", "Community-driven content expansion"]
    },
    {
      category: "Technology",
      items: ["Vanilla JavaScript for optimal performance", "JSON-based data storage", "Mobile-first responsive design"]
    }
  ]
};

// Render the About tab content
window.renderAboutTab = function(tab) {
  console.log("[DEBUG] Rendering About tab");
  
  return `
    <div class="fade-in space-y-8">
      <!-- Hero Section -->
      <div class="text-center">
        <div class="mx-auto mb-6">
          <i class="bi bi-info-circle text-6xl text-purple-600"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">About ${aboutData.appInfo.name}</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          ${aboutData.appInfo.description}
        </p>
        <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          Version ${aboutData.appInfo.version}
        </div>
      </div>

      <!-- Mission & Vision -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <i class="bi bi-bullseye text-blue-600 mr-3"></i>
              ${aboutData.mission.title}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              ${aboutData.mission.content}
            </p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <i class="bi bi-eye text-green-600 mr-3"></i>
              ${aboutData.vision.title}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              ${aboutData.vision.content}
            </p>
          </div>
        </div>
      </div>

      <!-- Practice Tools Section -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-tools text-orange-500 mr-3"></i>
            Professional Practice Tools
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            ${aboutData.practiceTools.map(tool => renderPracticeToolCard(tool)).join('')}
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-star text-yellow-500 mr-3"></i>
            Key Features
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${aboutData.features.map(feature => renderFeatureCard(feature)).join('')}
          </div>
        </div>
      </div>

      <!-- How to Use Section -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-question-circle text-indigo-500 mr-3"></i>
            How to Use ChoristerCorner
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${aboutData.howToUse.map(step => renderHowToStep(step)).join('')}
          </div>
        </div>
      </div>

      <!-- App Statistics -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-graph-up text-purple-500 mr-3"></i>
            Platform Statistics
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" id="app-stats">
            <div class="stat-item">
              <div class="text-3xl font-bold text-blue-600" id="total-songs-stat">-</div>
              <div class="text-gray-600 text-sm">Total Songs</div>
            </div>
            <div class="stat-item">
              <div class="text-3xl font-bold text-green-600" id="total-artists-stat">-</div>
              <div class="text-gray-600 text-sm">Artists/Channels</div>
            </div>
            <div class="stat-item">
              <div class="text-3xl font-bold text-orange-600">2</div>
              <div class="text-gray-600 text-sm">Practice Tools</div>
            </div>
            <div class="stat-item">
              <div class="text-3xl font-bold text-purple-600">100%</div>
              <div class="text-gray-600 text-sm">Free to Use</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technology & Credits -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-award text-orange-500 mr-3"></i>
            Credits & Technology
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${aboutData.credits.map(credit => renderCreditSection(credit)).join('')}
          </div>
        </div>
      </div>

      <!-- Community Section -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-people text-blue-500 mr-3"></i>
            Community & Support
          </h2>
        </div>
        <div class="card-body">
          <div class="text-center">
            <p class="text-gray-700 mb-6">
              ChoristerCorner is a community-driven platform. We welcome feedback, suggestions, and contributions to make this resource even better for worship teams worldwide.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button onclick="navigateToContact()" class="btn btn-primary">
                <i class="bi bi-envelope"></i>
                <span>Contact Us</span>
              </button>
              <button onclick="provideFeedback()" class="btn btn-outline">
                <i class="bi bi-chat-dots"></i>
                <span>Give Feedback</span>
              </button>
              <button onclick="suggestSong()" class="btn btn-secondary">
                <i class="bi bi-plus-circle"></i>
                <span>Suggest a Song</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Version History -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-clock-history text-gray-500 mr-3"></i>
            Version History
          </h2>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div class="border-l-4 border-purple-500 pl-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">Version 1.0.0</h3>
                <span class="text-sm text-gray-500">Current</span>
              </div>
              <p class="text-gray-600 text-sm mt-1">
                Initial release with song library, search functionality, lyrics display, YouTube integration, professional metronome, and drum machine.
              </p>
            </div>
            <div class="border-l-4 border-gray-300 pl-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-600">Version 1.1.0</h3>
                <span class="text-sm text-gray-500">Coming Soon</span>
              </div>
              <p class="text-gray-500 text-sm mt-1">
                Planned features: Favorites system, user accounts, playlist creation, advanced search filters, and more practice tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Render feature card
function renderFeatureCard(feature) {
  return `
    <div class="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <i class="bi ${feature.icon} text-3xl text-purple-600 mb-3"></i>
      <h3 class="font-semibold text-gray-900 mb-2">${feature.title}</h3>
      <p class="text-sm text-gray-600">${feature.description}</p>
    </div>
  `;
}

// Render how-to step
function renderHowToStep(step) {
  return `
    <div class="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
      <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
        ${step.step}
      </div>
      <div>
        <h3 class="font-semibold text-gray-900 mb-1">${step.title}</h3>
        <p class="text-sm text-gray-600">${step.description}</p>
      </div>
    </div>
  `;
}

// Render credit section
function renderCreditSection(credit) {
  return `
    <div>
      <h3 class="font-semibold text-gray-900 mb-3">${credit.category}</h3>
      <ul class="space-y-1">
        ${credit.items.map(item => `
          <li class="text-sm text-gray-600 flex items-start">
            <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
            ${item}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

// Render practice tool card
function renderPracticeToolCard(tool) {
  return `
    <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 hover:shadow-lg transition-all">
      <div class="flex items-center mb-4">
        <i class="bi ${tool.icon} text-4xl text-purple-600 mr-4"></i>
        <div>
          <h3 class="text-xl font-semibold text-gray-900">${tool.title}</h3>
        </div>
      </div>
      <p class="text-gray-700 mb-4">${tool.description}</p>
      <div class="flex flex-wrap gap-2">
        ${tool.features.map(feature => `
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <i class="bi bi-check2 mr-1"></i>
            ${feature}
          </span>
        `).join('')}
      </div>
      <div class="mt-4">
        <button onclick="navigateToTool('${tool.tabName}')" class="btn btn-primary btn-sm">
          <i class="bi ${tool.icon}"></i>
          <span>Try ${tool.title}</span>
        </button>
      </div>
    </div>
  `;
}

// Load and display app statistics
async function loadAppStatistics() {
  try {
    const response = await fetch('json/songs.json');
    const songsData = await response.json();
    
    if (Array.isArray(songsData)) {
      const totalSongs = songsData.length;
      const uniqueChannels = new Set(songsData.map(song => song.channel)).size;
      
      let totalMinutes = 0;
      songsData.forEach(song => {
        if (song.duration) {
          const match = song.duration.match(/(\d+)\s*minutes?/);
          if (match) {
            totalMinutes += parseInt(match[1]);
          }
        }
      });
      
      // Update statistics in the UI
      const totalSongsEl = document.getElementById('total-songs-stat');
      const totalArtistsEl = document.getElementById('total-artists-stat');
      const totalMinutesEl = document.getElementById('total-minutes-stat');
      
      if (totalSongsEl) totalSongsEl.textContent = totalSongs;
      if (totalArtistsEl) totalArtistsEl.textContent = `${uniqueChannels}+`;
      if (totalMinutesEl) totalMinutesEl.textContent = `${totalMinutes}+`;
    }
  } catch (error) {
    console.error("[DEBUG] Failed to load app statistics:", error);
  }
}

// About tab specific functions
function navigateToContact() {
  console.log("[DEBUG] Navigating to Contact tab");
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Contact');
  }
}

function provideFeedback() {
  console.log("[DEBUG] Providing feedback");
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Contact');
    // TODO: Scroll to feedback section or pre-fill form
  }
}

function suggestSong() {
  console.log("[DEBUG] Suggesting a song");
  if (typeof window.switchToTab === 'function') {
    window.switchToTab('Contact');
    // TODO: Pre-fill form with song suggestion template
  }
}

// Replace the individual navigation functions with a single one
function navigateToTool(tabName) {
  console.log(`[DEBUG] Navigating to ${tabName} tab`);
  if (typeof window.switchToTab === 'function') {
    window.switchToTab(tabName);
  }
}

// Keep these for backward compatibility, but simplify them
function navigateToMetronome() {
  navigateToTool('Metronome');
}

function navigateToDrummer() {
  navigateToTool('Drummer');
}

// Load statistics when about tab is rendered
function initializeAboutTab() {
  // Delay to ensure DOM is ready
  setTimeout(() => {
    loadAppStatistics();
  }, 100);
}

// Initialize when the module is loaded
console.log("[DEBUG] About tab module initialization complete");

// Export initialization function for use when tab is displayed
window.initializeAboutTab = initializeAboutTab;
