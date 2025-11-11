self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Update cache name with timestamp to force update
const CACHE_NAME = 'chorister-corner-v1.1.33'; // Updated version
const DATA_CACHE_NAME = 'chorister-corner-data-v1.1.33'; // Updated version

// Static assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/css/shared.css',           // Add this
  '/css/home.css',
  '/css/songs.css',
  '/css/hymns.css',
  '/css/metronome.css',
  '/css/drummer.css',
  '/css/about.css',
  '/css/contact.css',
  '/js/scipts.js',
  '/js/home.js',
  '/js/songs.js',
  '/js/hymns.js',
  '/js/metronome.js',
  '/js/drummer.js',
  '/js/about.js',
  '/js/contact.js',
  '/js/shared-player.js',
  '/js/playlist-updater.js',
  '/js/lyrics-utils.js',
  '/js/meta-tags.js',
  '/js/card-actions.js',
  '/js/view-toggle.js',        // Add this
  '/js/content-renderer.js',   // Add this
  '/js/extras.js'               // Add this if you have it
];

// Dynamic content URLs (API-like calls)
const dataUrls = [
  '/json/app.json',
  '/json/songs.json',
  '/json/hymns.json'
];

const OFFLINE_URL = '/offline.html';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version:', CACHE_NAME);
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('[SW] Caching static assets');
          return cache.addAll(urlsToCache);
        }),
      
      // Cache dynamic data with stale-while-revalidate
      caches.open(DATA_CACHE_NAME)
        .then((cache) => {
          console.log('[SW] Pre-caching dynamic data');
          return cache.addAll(dataUrls);
        })
    ]).then(() => {
      console.log('[SW] Skip waiting to activate immediately');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker version:', CACHE_NAME);
  
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control immediately
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Service worker activated and ready');
      
      // Notify all clients about the update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_NAME
          });
        });
      });
    })
  );
});

// Fetch event with different strategies for different content types
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (dataUrls.some(dataUrl => request.url.includes(dataUrl))) {
    // Stale-while-revalidate for JSON data
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE_NAME));
  } else if (urlsToCache.some(staticUrl => request.url.includes(staticUrl))) {
    // Cache-first for static assets
    event.respondWith(cacheFirst(request, CACHE_NAME));
  } else {
    // Network-first for everything else
    event.respondWith(networkFirst(request, CACHE_NAME));
  }
});

// Cache-first strategy (good for static assets)
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('[SW] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] Fetching and caching:', request.url);
  const response = await fetch(request);
  
  if (response.status === 200) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  
  return response;
}

// Stale-while-revalidate strategy (good for data that changes)
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Serve cached version immediately if available
  if (cachedResponse) {
    console.log('[SW] Serving stale data:', request.url);
    
    // Update cache in background
    fetch(request).then(response => {
      if (response.status === 200) {
        const cache = caches.open(cacheName);
        cache.then(c => c.put(request, response.clone()));
        console.log('[SW] Updated cache in background:', request.url);
      }
    }).catch(err => console.log('[SW] Background update failed:', err));
    
    return cachedResponse;
  }
  
  // No cache, fetch from network
  console.log('[SW] No cache, fetching:', request.url);
  const response = await fetch(request);
  
  if (response.status === 200) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network-first strategy (good for dynamic content)
async function networkFirst(request, cacheName) {
  try {
    console.log('[SW] Network first:', request.url);
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback for offline
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}