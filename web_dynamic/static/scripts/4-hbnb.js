$(document).ready(function () {
    // Handle checkbox clicks
    $('input[type=checkbox]').click(function () {
        const myListName = [];
        const myId = [];

        // Iterate over checked checkboxes
        $('input[type=checkbox]:checked').each(function () {
            myListName.push($(this).attr('data-name'));
            myId.push($(this).attr('data-id'));
        });

        // Update the amenities text
        if (myListName.length === 0) {
            $('.amenities h4').html('&nbsp;');
        } else {
            $('.amenities h4').text(myListName.join(', '));
        }

        // Log the IDs of the checked checkboxes
        console.log(myId);
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

		// Checking the IDs of amenties
		$('input[type=checkbox]:checked').each(function () {
			amenties.push($(this).data('id'));
		});

		// Send POST request to fetch places based on checked amenties
		$.ajax({
			url: 'http://0.0.0.0:5001/api/v1/places_search/',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({ amenities: amenities }),
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
