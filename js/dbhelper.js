/**
 * Common database helper functions.
 */
class DBHelper {

  
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get API_URL(){
    const port = 1337;
    return `http://localhost:${port}`;
  }

  // opens the database
  static openDatabase(){
    
    if(!navigator.serviceWorker){
      console.log("no service worker!");
      return Promise.resolve();
    }
    
    return idb.open('restaurant-reviews-db', 2, function(upgradeDB) {
      switch (upgradeDB.oldVersion) {
        case 0:
          upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
        case 1:
          upgradeDB.createObjectStore('reviews', {keyPath: 'id', autoIncrement: true})
          .createIndex('restaurant_id', 'restaurant_id');
      }
    });

  }

  // fetches json from the network
  static fetchRestaurantsFromNetwork(){
    return fetch(DBHelper.DATABASE_URL).then(function(response){
      return response.json();
    });
  }

  // writes restaurant objects from json file into database
  static storeRestaurants(restaurants, update = false){
    // opens the database -- returns a promise
    var dbPromise = DBHelper.openDatabase();
    
    return dbPromise.then(function(db){
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      restaurants.forEach(function(restaurant){
        if(update == true){
          store.put(restaurant);
        }
        else{
          var idbRestaurant = store.get(restaurant);
          if(!idbRestaurant || idbRestaurant.updatedAt < restaurant.updatedAt){
            store.put(restaurant);
          }
        }
        });
        return tx.complete;
    }).catch(function(error){
      console.log(`Unable to store restaurants.  ${error}`);
    });
  }

   // writes restaurant objects from json file into database
   static storeSingleRestaurant(restaurant, update = false){
    // opens the database -- returns a promise
    var dbPromise = DBHelper.openDatabase();
    
    return dbPromise.then(function(db){
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      if(update == true){
        store.put(restaurant);
      }
      else{
        var idbRestaurant = store.get(restaurant);
        if(!idbRestaurant || idbRestaurant.updatedAt < restaurant.updatedAt){
          store.put(restaurant);
        }
      }
        return tx.complete;
    }).catch(function(error){
      console.log(`Unable to store restaurants.  ${error}`);
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback, id) {
    var dbPromise = DBHelper.openDatabase();
    var store;
    dbPromise.then(function(db){
      store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
      return store.count();
      }
    ).then(function(count){
      if(id){

      }
      else{
        if(count > 0){
          return store.getAll();
         }
         else{
           var restaurants = DBHelper.fetchRestaurantsFromNetwork();
           DBHelper.storeRestaurants(restaurants);
           return restaurants;
         }
      }
    }).then(function(restaurants){
      callback(null, restaurants);
    }).catch(function(error){
      console.log(`restaurants not retrived and cached.  ${error}`);
    });

}

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {

    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

/**
 *  Puts reviews in idb
 */
static storeReviews(reviews){
  var dbPromise = DBHelper.openDatabase();
  return dbPromise.then(function(db){
    var tx = db.transaction('reviews', 'readwrite');
    var store = tx.objectStore('reviews');
    reviews.forEach(function(review){
      store.put(review);
    });
    return tx.complete;
  });
}

/**
 * Get reviews for restaurant (based on restaurant id)
 */
static getReviewsById(id){
  var dbPromise = DBHelper.openDatabase();
  dbPromise.then(function(db){
    var store = db.transaction('reviews').objectStore('reviews').index('id');
    return store.getAll();
  });
}


  /**
   * Fetches Reviews from stage 3 server
   */
  static fetchReviewsByRestaurantId(id){

    return fetch(`${this.API_URL}/reviews/?restaurant_id=${id}`)
    .then(function(response){
      return response.json();
    }).then(function(reviews){
      DBHelper.storeReviews(reviews);
      return reviews;
    }).catch(function(error){
      console.log(`Could not fetch reviews from the network.  Trying idb.  ${error}`);
      var dbPromise = DBHelper.openDatabase();
      dbPromise.then(function(db){
        var store = db.transaction('reviews').objectStore('reviews').index('id');
        return store.getAll();
      }).then(function(reviews){
        if(reviews.length < 1){
          return null;
        }
        else{
          return reviews;
        }
      });
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }


  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 


}

