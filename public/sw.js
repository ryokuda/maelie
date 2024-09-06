const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = ['/']; // List of URL to cache the resources

self.addEventListener('install', (event) => {
  // Postphone "installation" to after caching
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // /page1 is added to the cache
      })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response; // Return cached response if exists
        }
  console.log( event.request.url );
        return fetch(event.request).then((networkResponse) => {
          if (
            networkResponse && 
            networkResponse.status === 200 && 
            networkResponse.type === 'basic' &&
            networkResponse.headers.get('content-length') !== '0'
          ) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse); // Add to cache
            });
          } else {
            console.warn('Invalid or failed response for:', event.request.url);
          }
          return networkResponse;
        }).catch((error) => {
          console.error('Fetching failed:', error, event.request.url );
          //throw error;
        });
      })
    );
  });

  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
  
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });