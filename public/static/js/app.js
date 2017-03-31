/* Submit form and trigger slide submit */
$(function () {
    $("form").submit(function (event) {

        /* disable the click */
        event.preventDefault();

        /* custom form validation for iOS */
        if (validateForm(this)) {

            /* Remove any Previous Errors */
            $("#requiredAlert").addClass('hidden');
            $(this).find('div.form-group').removeClass('has-error');

            /* force close keyboard on mobile */
            $(document.activeElement).blur();

            /* handle unsub */
            if ($('#pledge input:checkbox').is(':checked')) {
            } else {
                var email = $("#inputEmail").val();
                $('#pledge #unsub').attr({value: email, name: "unsub"});
            }

            /* format postcode */
            $("#inputPostcode").val(function (index, value) {
                return formatPostcode(value);
            });

            /* submit form */
            var bsdFormId = $(this).attr("data-bsd-form-id");
            submitBsdForm(bsdFormId);

            /* move to next slide */
            var that = $(this);
            $(this).trigger("slide:submit", that);

        } else {

            $(this).find('input[type="email"]').filter(function () {
                return !isValidEmailAddress(this.value);
            }).closest('div.form-group').addClass('has-error').each(function () {
                /* Show Error Status */
                $("#formErrorAlert ul").append('<li>Please enter a valid email address</li>');
                $("#formErrorAlert").removeClass('hidden');
            });

            /* Custom Validation Errors - highlight input(s) */
            $(this).find('input[required]').filter(function () {
                return !this.value;
            }).closest('div.form-group').addClass('has-error');

            /* Show Error Status */
            $("#formErrorAlert ul").append('<li>Please enter all required fields</li>');
            $("#formErrorAlert").removeClass('hidden');

        }

    });
});


/* Handle Custom Submits */
$(function () {

    /* Fill out Hidden Emails */
    $("#pledge form").submit(function (event) {
        var email = $("#inputEmail").val();
        $('input[data-email="true"]').val(email);
    });

    /* Get Next Slide based on chosen Activity */
    $('#activity-appeals input:radio').change(function () {
        var target = $(this).attr("data-href");
        $('#activity-appeals button[type="submit"]').attr("data-href", target);
    });

    /* Get Next Slide based on if you have Idea */
    $('#other-something input:radio').change(function () {
        var target = $(this).attr("data-href");
        $('#other-something button[type="submit"]').attr("data-href", target);
    });

    /* Get Share Text based on Activity */
    $("#activity-appeals form").submit(function () {
        var activity = $('#activity-appeals form [type="radio"]:checked').val();
        $('#share-main [data-option="' + activity + '"]').removeClass('hidden');
    });

    /* Get Share Text for Own Idea */
    $('#other-something form').submit(function () {
        var answer = $('#other-something form input:checked').val();
        if (answer == 'Yes; free text field') {
            $('#share-main [data-option="all"]').addClass('hidden');
            $('#share-main [data-option="ownIdea"]').removeClass('hidden');
        }
    });

    /* Get Share Text for Just Attend */
    $('#other-closest form').submit(function () {
        var answer = $('#other-closest form input:checked').val();
        if (answer == "I’d like to attend something; not organise it") {
            $('#share-main [data-option="all"]').addClass('hidden');
        } else {
            $('#share-main [data-option="all"]').addClass('hidden');
            $('#share-main [data-option="closeIdea"]').removeClass('hidden');
        }
    });

});


/* Submit Form to BSD */
function submitBsdForm(id) {
    var form = 'form[data-bsd-form-id="' + id + '"]';
    $.ajax({
        type: "POST",
        data: $(form).serialize(),
        url: "https://tggt-survey.appspot.com/api/ijqw7dx/signup/" + id,
        dataType: "json",
        success: function (response) {
            console.log(response);
        }
    });
};


/* Custom Form Validation for iOS */
function validateForm(form) {

    /* check for required fields */
    var len = $(form).find('input[required]').filter(function () {
        return !this.value;
    }).length;

    /* check email format */
    var email = $('#pledge form').find('input[type="email"]').val();
    if (isValidEmailAddress(email)) {
    } else {
        return false;
    }

    /* validation response  */
    if (len) {
        return false;
    } else {
        return true;
    }

}

/* Validate Email */
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

/* Format Postcode */
function formatPostcode(postcode) {
    var parts = postcode.replace(/\s+/g, '').toUpperCase().match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/);

    if (parts) {
        parts.shift();
        return (parts.join(' '));
    } else {
        return postcode;
    }
}