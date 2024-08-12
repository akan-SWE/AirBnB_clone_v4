/* global $ */

// Execute when the DOM is fully loaded
$(function () {
  // Initialize an empty object to store selected amenities
  const selectedAmenities = {};
  // Listen for changes to checkboxes within elements with class 'popover'
  $('.popover INPUT').change(function () {
    // Get the 'data-id' and 'data-name' attributes of the changed checkbox
    const id = $(this).data('id');
    const name = $(this).data('name');

    // Add or remove the amenity based on the checkbox state
    if ($(this).is(':checked')) {
      // Add the amenity if the checkbox is checked
      selectedAmenities[id] = name;
    } else {
    // Remove the amenity if the checkbox is unchecked
      delete selectedAmenities[id];
    }
    $('.amenities h4').text(Object.values(selectedAmenities).join(', '));
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
