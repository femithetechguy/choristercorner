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