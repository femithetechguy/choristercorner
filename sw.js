self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Update cache name with timestamp to force update
const CACHE_NAME = 'choristercorner-v1.0.2'; // Increment version to force update
const OFFLINE_URL = '/offline.html';

// Resources to cache immediately - ONLY FILES THAT EXIST
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/css/tailwind-custom.css',
  '/css/home.css',
  '/css/songs.css',
  '/css/hymns.css',
  '/css/metronome.css',     // Add this line
  '/css/about.css',
  '/css/contact.css',
  '/js/app.js',
  '/js/scipts.js',
  '/js/home.js',
  '/js/songs.js',
  '/js/hymns.js',
  '/js/metronome.js',       // Add this line
  '/js/about.js',
  '/js/contact.js',
  '/js/shared-player.js',
  '/json/songs.json',
  '/json/hymns.json',
  '/json/app.json',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/favicon-32x32.png',
  '/images/favicon-16x16.png',
  OFFLINE_URL
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static resources');
        // Cache files one by one to avoid failing on missing files
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url => 
            cache.add(url).catch(error => {
              console.warn(`[SW] Failed to cache ${url}:`, error);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Static resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise fetch from network
        console.log('[SW] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Return a basic offline response for other requests
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});