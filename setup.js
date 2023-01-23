/* Copy to clipboard */
var copyToClipboard = function (link) {

    // Create an auxiliary hidden input
    var aux = document.createElement("input");

    // Get the text from the element passed into the input
    aux.setAttribute("value", link.trim());

    // Append the aux input to the body
    document.body.appendChild(aux);

    // Highlight the content
    aux.select();

    // Execute the copy command
    document.execCommand("copy");

    // Remove the input from the body
    document.body.removeChild(aux);

    // toastr.success('License key copied!');
};


var license = function (g) {
    loadMachineKey(g);
    $(".js-copy-link").hide();
    // get machinekey api on application laod

    $(".setup-complete, .user-details-wrap").css("display", "none");

    $("input[type='text'], input[type='textarea'], input[type = 'password'], textarea ").focus(function () {
        $(this).siblings(".error-msg").addClass("hide");
        // $(this).css("border-color", "#CCCCCC");
    });

    // activate_gamma
    $("#activate_gamma").submit(function (e) {
        e.preventDefault();
        var machine_key = $('#machine_key').html();
        var license_key = $('#license_key')[0].files[0];
        var formdata = new FormData();
        var errMsgStr = '';
        var next_fs;

        if ($('#license_key')[0].files.length == 0) {
            errMsgStr = 'Please upload license file ';
            $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            // $('#license_key').css("border-color", "#f26c69");
        }

        if (errMsgStr == '') {
            $('#login_loading_overlay, #login_loading_msg_container').show();
            $('.error-msg').html('');
            formdata.append('license_key', license_key);
            formdata.append('machine_key', machine_key);
            // validate license key
            $.ajax({
                type: 'post',
                url: g.BASE_URL +'/license/validate',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status == 'success') {
                        if (typeof data.redirect !=  'undefined' && data.redirect == true){
                            $(".licence-details-wrap, .setup-complete").css("display", "none");
                            $(".licence-details-wrap, .user-details-wrap").css("display", "none");
                            $(".setup-complete").css("display", "block");
                        }else{
                            $('#tenant_email').val(data.details.email);
                            $(".licence-details-wrap, .setup-complete").css("display", "none");
                            $(".user-details-wrap").css("display", "block");
                        }
                        $('#login_loading_overlay, #login_loading_msg_container').hide();

                        next_fs = $("fieldset:eq(1)");
                        //activate next step on progressbar using the index of next_fs
                        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
                    } else {
                        errMsgStr = data.message;
                        $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                        // $('#license_key').css("border-color", "#f26c69");
                        $('#login_loading_overlay, #login_loading_msg_container').hide();
                    }
                },
                error: function (data) {
                    errMsgStr = data.responseJSON.error.message;
                    $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                    // $('#license_key').css("border-color", "#f26c69");
                    $('#login_loading_overlay, #login_loading_msg_container').hide();
                }
            });
        }
    });


    $("#user-detail-form").submit(function (e) {
        e.preventDefault();

        var first_name = $('#tenant_first_name').val();
        var last_name = $('#tenant_last_name').val();
        var machine_key = $('#machine_key').html();
        var license_key = $('#license_key')[0].files[0];
        var password = ($('#password').val()).trim();
        var confirmPassword = ($('#confirmPassword').val()).trim();
        var formdata = new FormData();
        var errMsgStr = '';
        var next_fs;

        if (first_name.trim() == "") {
            errMsgStr = 'Please enter first name.';
            $('#tenant_first_name').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            $('#tenant_first_name').css("border-color", "#f26c69");
        }

        if (last_name.trim() == "") {
            errMsgStr = 'Please enter last name.';
            $('#tenant_last_name').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            $('#tenant_last_name').css("border-color", "#f26c69");
        }

        if (password === "") {
            errMsgStr = 'Please enter Password.';
            $('#password').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            $('#password').css("border-color", "#f26c69");
        } else if (password.length < 8 || password.length > 255) {
            errMsgStr = 'Password should be minimum 8 and maximum 255 characters.';
            $('#password').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            $('#password').css("border-color", "#f26c69");
        }

        if (confirmPassword === "") {
            errMsgStr = 'Please enter Confirm Password.';
            $('#confirmPassword').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            $('#confirmPassword').css("border-color", "#f26c69");
        } else if (password != confirmPassword) {
            errMsgStr = 'Passwords and Confirm Password are not matching.';
            $('#confirmPassword').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            $('#confirmPassword').css("border-color", "#f26c69");
        }

        if (errMsgStr == '') {
            $('#login_loading_overlay, #login_loading_msg_container').show();
            $(".error-msg-main").html('');
            $('.error-msg').html('');
            formdata.append('license_key', license_key);
            formdata.append('machine_key', machine_key);
            formdata.append('firstName', first_name);
            formdata.append('lastName', last_name);
            formdata.append('password', password);
            // validate license key
            $.ajax({
                type: 'post',
                url: g.BASE_URL +'/license/setup-account',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status == 'success') {
                        $(".licence-details-wrap, .user-details-wrap").css("display", "none");
                        $(".setup-complete").css("display", "block");
                        $('#login_loading_overlay, #login_loading_msg_container').hide();
                        $('#first_name').append(first_name);
                        $('#first_name').css({'padding-right':'5px;'})
                        $('#last_name').append(last_name);
                    } else {
                        $('.error-msg-main').html("<img src='images/warning.svg' alt='warning'>" + data.message).show();
                        $('#login_loading_overlay, #login_loading_msg_container').hide();
                    }
                    next_fs = $("fieldset:eq(2)");
                    //activate next step on progressbar using the index of next_fs
                    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
                },
                error: function (data) {
                    $('.error-msg-main').html("<img src='images/warning.svg' alt='warning'>" + data.responseJSON.error.message).show();
                    $('#login_loading_overlay, #login_loading_msg_container').hide();
                }
            });
        }
    });

    $('.upload-key').on('click', function () {
        $(this).parent().find('input[type="file"]').click();
    });

    $('.license_key_wrapper input[type="file"]').on('change', function () {
        $(this).parent().find('.upload-key').children().removeClass('ic-upload-filled').addClass('ic-check-filled');
        $('#activate_gamma').submit();
    });

    $(".previous").click(function () {
        if (animating) {
            return false;
        }
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + ((1 - now) * 0.2);
                //2. take current_fs to the right(50%) - from 0%
                left = ((1 - now) * 50) + "%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({ 'left': left });
                previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
            },
            duration: 500,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeOutQuint'
        });
    });

    $(".submit").click(function () {
        return false;
    })


};

var loadMachineKey = function (g) {
    $.ajax({
        type: 'get',
        url: g.BASE_URL + '/license/get-machine-key',
        success: function (data) {
            $('#machine_key').html(data.machine_key);
            $(".js-copy-link").show();
        },
        error: function () {
            $('#machine_key').focus();
        }
    });

    $(".js-copy-link").click(function () {
        var link = $('#machine_key').html();
        copyToClipboard(link);
        var $this = $(this);
        $this.closest(".btn-text").css({
            color: "#72CB67",
            cursor: "pointer",
            padding: "15px",
            fontSize:"1.5em"
        });
    });
}

var migrate = function (g) {
    $('.js-migrate, js-migrate-contact').css("display", "none");
    loadMachineKey(g);
    $(".js-copy-link").hide();

    $("input[type='text'], input[type='textarea'], input[type = 'password'], textarea ").focus(function () {
        $(this).siblings(".error-msg").addClass("hide");
    });

    // migrate_gamma
    $("#migrate_gamma").submit(function (e) {
        e.preventDefault();
        var machine_key = $('#machine_key').html();
        var license_key = $('#license_key')[0].files[0];
        var formdata = new FormData();
        var errMsgStr = '';

        if ($('#license_key')[0].files.length == 0) {
            errMsgStr = 'Please upload license file ';
            $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
        }

        if (errMsgStr == '') {
            $('#login_loading_overlay, #login_loading_msg_container').show();
            $('.error-msg').html('');
            formdata.append('license_key', license_key);
            formdata.append('machine_key', machine_key);
            // validate license key
            $.ajax({
                type: 'post',
                url: g.BASE_URL +'/license/migrate',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    var message = "";
                    if (data.status == 'success') {
                        $('#login_loading_overlay, #login_loading_msg_container').hide();
                        if (data.details.new_email != data.details.old_email) {
                            message = "Your current email address <b>" + data.details.old_email + "</b> has changed to <b>" + data.details.new_email + "</b>";
                        }
                        var confirm_alert = g.admin.utils.confirmPopup("Your account is reactivated successfully. <br/><br/>" + message , 'success', false);
                        $('.login_button').html('Ok');
                        $('.login_button, .popup_close_btn').on('click', function () {
                            confirm_alert.closePopup();
                            g.logout();
                        });
                    } else {
                        errMsgStr = data.message;
                        $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                        $('#login_loading_overlay, #login_loading_msg_container').hide();
                    }
                },
                error: function (data) {
                    errMsgStr = data.responseJSON.error.message;
                    $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                    $('#login_loading_overlay, #login_loading_msg_container').hide();
                }
            });
        }
    });

    $('.upload-key').on('click', function () {
        $(this).parent().find('input[type="file"]').click();
    });

    $('#migrate input[type="file"]').on('change', function () {
        $(this).parent().find('.upload-key').children().removeClass('ic-upload-filled').addClass('ic-check-filled');
        $('#migrate_gamma').submit();
    });

    $(".submit").click(function () {
        return false;
    });

    $.ajax({
        type: 'get',
        url: g.BASE_URL +'/license/valid-migration',
        success: function (data) {
            if(data.status == true){
                $('.js-migrate').show();
                $('.js-migrate-contact').hide();
            }else{
                $('.js-migrate').hide();
                $('.js-migrate-contact').show();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
};