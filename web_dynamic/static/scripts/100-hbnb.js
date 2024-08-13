/* global $ */

// Execute when the DOM is fully loaded
$(function () {
  // Initialize an empty object to store selected amenities
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  function updateDict (dict, key, value, op) {
    if (op === 'add') {
      dict[key] = value;
    } else {
      delete dict[key];
    }
  }

  $('button').click(function () {
    const amenities = Object.keys(selectedAmenities);
    const states = Object.keys(selectedStates);
    const cities = Object.keys(selectedCities);

    // Checking the IDs of amenities
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/', // API endpoint for searching places
      type: 'POST',
      data: JSON.stringify({ amenities, states, cities }),
      contentType: 'application/json',
      success: function (places) {
        createPlaces(places);
      },
      error: function (error) {
        console.log('Error', error);
      }
    });
  });

  function createPlaces (places) {
    // Iterate over each place returned by the API
    const sectionPlaces = $('section.places');
    sectionPlaces.empty();
    places.forEach(function (place) {
      // Create an article element to hold place details
      const article = $('<article></article>');
      article.addClass('article');

      // Create and append the title box with place name and price
      const titleBox = $('<div></div>');
      titleBox.addClass('title_box');
      $('<h2>').text(place.name).appendTo(titleBox);
      $('<div>').text(place.price_by_night).addClass('price_by_night').appendTo(titleBox);
      article.append(titleBox);

      // Create and append the information box with place details (guests, rooms, bathrooms)
      const info = $('<div></div>');
      info.addClass('information');
      $('<div>').text(place.max_guest + ' Guests').addClass('max_guest').appendTo(info);
      $('<div>').text(place.number_rooms + ' Rooms').addClass('number_rooms').appendTo(info);
      $('<div>').text(place.number_bathrooms + ' Bathrooms').addClass('number_bathrooms').appendTo(info);
      article.append(info);

      // Add the place description to the article
      $('<div>').text(place.description).addClass('description').appendTo(article);
      // Append the article to the section.places in the DOM
      sectionPlaces.append(article);
    });
  }

  // Listen for changes to checkboxes within elements with class 'popover'
  $('input[type=checkbox]').change(function () {
    // Get the 'data-id' and 'data-name' attributes of the changed checkbox
    const id = $(this).data('id');
    const name = $(this).data('name');
    const op = $(this).is(':checked') ? 'add' : 'delete';

    // Add or remove the amenity, states and cities based on the checkbox state
    if ($(this).attr('name') === 'amenities') {
      updateDict(selectedAmenities, id, name, op);
      $('.amenities h4').text(Object.values(selectedAmenities).join(', '));
    } else if ($(this).attr('name') === 'states') {
      updateDict(selectedStates, id, name, op);
      $('.locations h4').text(Object.values(selectedStates).join(', '));
    } else {
      updateDict(selectedCities, id, name, op);
    }
  });

  // Perform an AJAX POST request to fetch places data
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/', // API endpoint for searching places
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    success: function (places) {
      createPlaces(places);
    }
  });

  // check API status
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (json) {
      if (json.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    },
    error: function (xhr, status) {
      // On error, remove the available class
      $('#api_status').removeClass('available');
      console.log('Error ' + status);
    }
  });
});
