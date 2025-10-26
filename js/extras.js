console.log("[DEBUG] extras.js loaded");

let extrasData = [];

// Fetch extras data from JSON
async function fetchExtrasData() {
  try {
    const response = await fetch('json/extras.json');
    const data = await response.json();
    // Support both array and {external_tools: [...]}
    extrasData = Array.isArray(data) ? data : (data.external_tools || []);
    console.log("[DEBUG] Loaded extrasData:", extrasData);
  } catch (error) {
    console.error("[DEBUG] Failed to load extras.json:", error);
    extrasData = [];
  }
}

// Render a single card for a resource/tool (no iframe or popup)
function renderExtrasCard(resource) {
  return `
    <div class="extras-card bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col">
      <div class="flex items-center mb-2">
        <i class="bi ${resource.icon || 'bi-tools'} text-2xl text-purple-600 mr-2"></i>
        <h2 class="text-lg font-semibold text-gray-900">${resource.name || resource.title}</h2>
      </div>
      <p class="text-gray-700 mb-3">${resource.description || ''}</p>
      <a href="${resource.url}" target="_blank" rel="noopener"
        class="mt-auto inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2">
        <i class="bi bi-box-arrow-up-right"></i>
        Open Tool
      </a>
      ${resource.tags ? `<div class="mt-2 text-xs text-gray-500">Tags: ${resource.tags.join(', ')}</div>` : ''}
    </div>
  `;
}

// Update in extras.js
async function renderExtrasTab() {
  console.log("[DEBUG] Rendering Extras tab");
  
  const container = document.getElementById("app-root");
  if (!container) {
    console.error("App root container not found");
    return;
  }
  
  const extrasHTML = `
    <div class="max-w-7xl mx-auto p-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">External Tools & Resources</h1>
        <p class="text-gray-600">Discover powerful tools to enhance your music journey and worship experience.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${externalResources.map(resource => renderExtrasCard(resource)).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = extrasHTML;
  
  // Force CSS application after render
  setTimeout(() => {
    forceExtrasButtonStyling();
  }, 50);
}

// Add this function to extras.js
function forceExtrasButtonStyling() {
  const buttons = document.querySelectorAll('.extras-card a[href]');
  console.log('[DEBUG] Forcing styling on', buttons.length, 'extras buttons');
  
  buttons.forEach((button, index) => {
    // Ensure CSS classes are properly applied
    if (!button.style.backgroundColor || button.style.backgroundColor === 'transparent') {
      console.log(`[DEBUG] Fixing button ${index + 1} styling`);
      
      // Apply critical styles inline to ensure they work
      Object.assign(button.style, {
        backgroundColor: '#7c3aed !important',
        color: '#ffffff !important',
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: 'none',
        opacity: '1',
        transition: 'all 0.2s ease'
      });
      
      // Add hover effects
      button.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#8b5cf6';
        this.style.transform = 'translateY(-1px)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#7c3aed';
        this.style.transform = 'translateY(0)';
      });
    }
  });
}

// Render the Extras tab
window.renderExtrasTab = async function(tab) {
  if (!extrasData.length) {
    await fetchExtrasData();
  }
  if (!extrasData.length) {
    return `<div class="text-center text-gray-500 py-12">No extras available.</div>`;
  }
  return `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        <i class="bi bi-tools mr-3"></i> Extras & Resources
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${extrasData.map(resource => renderExtrasCard(resource)).join('')}
      </div>
    </div>
  `;
};

// Optional: Preload data when tab is initialized
window.initializeExtrasTab = fetchExtrasData;