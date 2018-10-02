import idb from 'idb';

var staticCacheName = 'restaurant-static-v1';

const dbPromise = idb.open(database, 1, function(upgradeDB){
  switch(upgradeDb.oldversion){
    case 0:
      upgradeDb.createObjectStore('restaurants', {keypath: 'id'});
  }
});

let filesToCache = [
    'index.html',
    'restaurant.html',
    'sw.js',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'css/styles.css',
    'css/responsive.css',
    'data/restaurants.json',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg'
];


// followed along with google's walkthrough on service worker
// https://developers.google.com/web/fundamentals/primers/service-workers/

/* installs service worker  */
self.addEventListener('install', function(event) {
    console.log("installing");
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function(cache){
            console.log('Opened cache');
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('fetch', function(event){
  // if it's from port '1337' handle it with indexeddb
  // return restaurants 

// if it's not from 1337, keep code from stage 1
  event.respondWith(
    caches.match(event.request).then(function(response){
      // return response or fetch match from the cache
      return response || fetch(event.request).then(function(response){
        caches.open(staticCacheName).then(function(cache){
          // add the item to the cache!
          // clone the response so you can return it
          cache.put(event.request, response.clone());
        })
        return response;
      })
    })
  );
});

  self.addEventListener('activate', function(event){
    event.waitUntil(
      // get cache keys
      caches.keys().then(function(cacheNames){
        return Promise.all( 
          // iterates through all the cache names
          cacheNames.filter(function(cacheName){
            // will only return cache names from restaruant-static and not the current cache
            return cacheName.startsWith('restaurant-static-') && cacheName != staticCacheName;
          }).map(function(cacheName){
            // deletes old caches
            return cache.delete(cacheName);
          })
        );
      })
    );

  });

