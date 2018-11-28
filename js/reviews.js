// have it print form data
// then see if you can post form data to the site

/*
    saves review to idb
    idb handles POST
*/




function clearForm(){

}



/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      fillBreadcrumb();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.alttext;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
}


const submitReview = function(){
    const name = document.getElementById("reviewName").value;
    const rating = document.getElementById("reviewRating").value - 0;
    const reviewComment = document.getElementById("reviewComment").value;
    var complete = true;

    if(name.trim().length == 0){
        var nameNeeded = document.getElementById("name-needed");
        nameNeeded.style.display = "block";
        complete = false;
    }
    // edge case: multiple resubmissions where name might be filled out but the other areas are left blank.  
    else{
        var nameNeeded = document.getElementById("name-needed");
        nameNeeded.style.display = "none";
    }
    

    if(reviewComment.trim().length == 0){
        var reviewNeeded = document.getElementById("review-needed");
        reviewNeeded.style.display = "block";
        complete = false;
    }
    // edge case: multiple resubmissions where review comment might be filled out but the other areas are left blank.
    else{
        var reviewNeeded = document.getElementById("review-needed");
        reviewNeeded.style.display = "none";
    }

    // only makes changes if all form areas are complete
    if(complete){
        DBHelper.saveNewReview(self.restaurant.id, name, rating, reviewComment);
        
    }

    // unblocks the submit button
    const bttn = document.getElementById("bttnSubmitReview");
    bttn.onclick = submitReview();
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const restaurantLink = document.getElementById('restaurant-link');
  restaurantLink.href = DBHelper.urlForRestaurant(restaurant);
  restaurantLink.innerHTML = restaurant.name;

//   const li = document.createElement('li');
//   li.innerHTML = a;
//   breadcrumb.appendChild(li);
}



/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
