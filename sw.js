var staticCacheName = 'restaurant-static-v1';

let filesToCache = [
    'index.html',
    'restaurant.html',
    'sw.js',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'css/styles.css',
    'css/responsive.css',
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
// self.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open(staticCacheName)
//         .then(function(cache){
//             return cache.addAll(filesToCache);
//         }).catch(function(error){
//           console.log("could not open the cache: " + error);
//         })
//     );
// });


self.addEventListener('fetch', function(event){

  /*
  var urlCheck = new URL(event.request.url);
  if(urlCheck.port === 1337){
    console.log('hey');
  } 

  if it's trying to get restaurants
  DBHelper.openCache().then(function(db){
    var tx = db.transaction('restaurants', 'readonly');
    var store = tx.objectStore('restaurants);
    return store.getAll();
  }).then(function(restaurants){

  })

  if it's trying to get a specific restaurants
  var id = parseInt()
  DBHelper.openCache().then(function(db){
    var tx = db.transaction('restaurants', 'readonly);
    var store = tx.objectStore('restaurants');
    return store.get(id);
  })
  */

  event.respondWith(
    caches.match(event.request).then(function(response){
      // return response or fetch match from the cache
      return response || fetch(event.request).then(function(response){
        var responseClone = response.clone();
        caches.open(staticCacheName).then(function(cache){
          // add the item to the cache!
          // clone the response so you can return it
          cache.put(event.request, responseClone);
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

