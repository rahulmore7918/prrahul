var licenseReactivate = function (g) {
    "use strict";

    $("#reactivate_gamma").submit(function (e) {
        e.preventDefault();
        var machine_key = $('#machine_key').html();
        var license_key = $('#license_key')[0].files[0];
        var reactivation_key = $('#reactivation_key')[0].files[0];
        var formdata = new FormData();
        var errMsgStr = '';

        if ($('#license_key')[0].files.length == 0) {
            errMsgStr = 'Please upload license file ';
            $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            // $('#license_key').css("border-color", "#f26c69");
        }
        if ($('#reactivation_key')[0].files.length == 0) {
            errMsgStr = 'Please upload reactivation file ';
            $('#reactivation_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
            // $('#reactivation_key').css("border-color", "#f26c69");
        }

        if (errMsgStr == '') {
            $('#login_loading_overlay, #login_loading_msg_container').show();
            $('.error-msg').html('');
            $(".error-msg-main").html('');
            formdata.append('license_key', license_key);
            formdata.append('machine_key', machine_key);
            formdata.append('reactivation_key', reactivation_key);

            $.ajax({
                type: 'post',
                url: g.BASE_URL +'/license/validate',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.status == 'success') {
                        var confirm_alert = g.admin.utils.confirmPopup("Your account is reactivated successfully", 'success', false);
                        $('.login_button').html('Ok');
                        $('.login_button').on('click', function () {
                            confirm_alert.closePopup();
                            window.location.href = '/gamma#';
                        });
                        setTimeout(function () {
                            $('.login_button').trigger('click');
                        }, 5000);
                    } else {
                        errMsgStr = data.responseJSON.message;
                        // $('#license_key').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                        $('.error-msg-main').html("<img src='images/warning.svg' alt='warning'>" + errMsgStr).show();
                        // $('#license_key').css("border-color", "#f26c69");
                    }
                    $('#login_loading_overlay, #login_loading_msg_container').hide();
                },
                error: function (data) {
                    errMsgStr = data.responseJSON.error.message;
                    $('.error-msg-main').html("<img src='images/warning.svg' alt='warning'>" + errMsgStr).show();
                    // $('#reactivation_key').css("border-color", "#f26c69");
                    $('#login_loading_overlay, #login_loading_msg_container').hide();
                }
            });
        }
    });

    $('.upload-key').on('click', function (e) {
        $(this).parent().find('input[type="file"]').click();
        showbutton();
    });

    $('.license_key_wrapper input[type="file"]').bind('change', function () {
        $(this).parent().find('.upload-key').children().removeClass('ic-upload-filled');
        $(this).parent().find('.upload-key').html('<i class="ic-check-filled"></i> reactivation key uploaded');
        showbutton();
    });

    $('.license_key_wrapper #license_key').bind('change', function () {
        $(this).parent().find('.upload-key').html('<i class="ic-check-filled"></i> activation key uploaded');
    });

    function showbutton(params) {
        if ($('.ic-check-filled').size() == 2) {
            $('#reactivate_gamma').submit();
            $('.js-reactivate').removeClass("disabled");
        } else {
            $('.js-reactivate').addClass("disabled");
        }
    }
};
