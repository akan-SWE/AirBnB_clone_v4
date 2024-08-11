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
});
