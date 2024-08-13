$(document).ready(function () {
    // Initialize storage for selected states and cities
	const selectedStates = new Set();
        const selectedCities = new Set();

        // Function to update the h4 tag with the list of checked states and cities
        function updateLocationHeader() {
            const selectedStateNames = Array.from(selectedStates).map(id =>  $('input[data-id="${id}"][data-name]').data('name'));
	    const selectedCityNames = Array.from(selectedCities).map(id => $('input[data-id="${id}"][data-name]').data('name'));
	    const allSelected = [...selectedStateNames, ...selectedCityNames];
	    
	    if (allSelected.length === 0) { 
            	$('#locations h4').html('&nbsp;');
        } else {
            $('#locations h4').text(allSelected.join(', '));
	}
      }

    // Handle checkbox changes
    $('input[type=checkbox]').change(function () {
	    const id = $(this).data('id');
	    const isChecked = $(this).is(':checked');

	    // Update selected states or cities
	    if ($(this).dtat('name').includes('City')) {
		if (isChecked) {
		    selectedCities.add(id);
		} else {
		    selectedCities.delete(id);
		}
	    } else {
		if (isChecked) {
		    selectedStates.add(id);
		} else {
		    selectedStates.delete(id);
		}
	    }

	    // Update the h4 tag with the current selection
	    updateLocationHeader();

    });

    // Function to check API status
    function updateApiStatus() {
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
    }
	// Checking API status
	updateApiStatus();

	// Handle button click
	$('#search_btn').click(function () {
		const amenities = [];
		const cities = Array.from(selectedCities);
		const states = Array.from(selectedStates);

		// Checking the IDs of amenties
		$('input[type=checkbox]:checked').each(function () {
			amenties.push($(this).data('id'));
		});

		// Send POST request to fetch places based on checked amenties
		$.ajax({
			url: 'http://0.0.0.0:5001/api/v1/places_search/',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				amenities: amenities,
				cities: cities,
				states: states
			}),
			success: function (places) {
				const placesSection = $('.places');
				placesSection.empty();

				// Add each place to the section
				places.forEach(place => {
					const article = `
					   <article>
					   <div class="title_box">
                            		     <h2>${place.name}</h2>
                            		     <div class="price_by_night">$${place.price_by_night}</div>
                          		</div>
                          		<div class="information">
                            		   <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                            		   <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                            		   <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                          		</div>
                          		<div class="description">
                            		  ${place.description}
			    		</div>
                        	    </article>`;
                    		placesSection.append(article);
				});
			},
			error: function (xhr, status) {
				console.log('Enter fecting place: ' + status);
			}
		});
	});

	// Review toggling functionality
	const reviewSection = $('#reviews-section')
	const toggleButton = $('#reviews-toggle')

	// Function to fetch and display reviews
	function fetchAndDisplayReview() {
          $.ajax({
		  url: '/api/v1/reviews',
		  type: 'GET',
		  dataType: 'json',
		  success: function (reviews) {
		    reviewsSection.empty()

		    reviews.forEach(review => {
		      const reviewElement = `
			<div class="review">
		          <p><strong>${review.reviewer}:</strong> ${review.content}</p>
	                </div>`
		    reviewsSwction.append(reviewElement)
		   });

	           reviewsSection.show()
		   toggleButton.text('hide')
		   toggleButton.attr('data-show', 'hide')
		  }
		  error: function (xhr, status) {
	            console.log('Error fetching reviews: ' + status)
		  }
	  });
	}

	// Function to hide reviews
	function hideReviews() {
	  reviewsSection.empty()
	  reviewsSection.hide()
	  toggleButton.text('show')
          toggleButton.attr('data-show', 'show')
	}

	// Event listener for the toggle button
	toggleButton.on('click', function () {
	  if (toggleButton.attr('data-show') === 'show') {
	    fetchAndDisplayReviews()
	  } else {
	    hideReviews()
	  }
	});
});
