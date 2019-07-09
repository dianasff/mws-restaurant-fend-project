// For this file i used code provided by the following walkthrough: https://alexandroperez.github.io/mws-walkthrough/
const appName = "restaurant-reviews"
const staticCacheName = appName + "-v1.0"; //It uses a version 1.0
const contentImgsCache = appName + "-images"; // variable for the images

var allCaches = [
  staticCacheName,
  contentImgsCache
];

//It takes the static assets and caches it all
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/', // caches the index.html file
        '/restaurant.html',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/secret.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        'js/sw_register.js', 
        'data/restaurants.json'

      ]);
    })
  );
});

// The Service worker will delete previous caches when it activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(appName) &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/** Hijack fetch requests and respond accordingly */
self.addEventListener('fetch', function(event) {
	const requestUrl = new URL(event.request.url);

  // To make sure we are highjacking requests made to my app
  	if (requestUrl.origin === location.origin) {

    //  if the pathname starts with /restaurant.html it access the cache and fill the page with what maches with /restaurant.html
	if (requestUrl.pathname.startsWith('/restaurant.html')) {
	  event.respondWith(caches.match('/restaurant.html'));
	  return; 
	}
  }
  	// if (requestUrl.pathname.startsWith('/img')) {
   //    event.respondWith(caches.match('/img'));
   //    return; 
   //  }

  // Default behavior: respond with cached elements, if any, falling back to network.
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});