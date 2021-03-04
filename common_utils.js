
/*jshint sub:true*/
    var utils = function () {       
        var err_text;
        var PAGE_LOGIN = 'login';
        //---------- PRIVATE METHODS ------------

        //---------- INITIALIZE -------------  
        function adaptDimensions() {
            var window_width = $(window).width();
            var window_height = $(window).height();
            //   var login_panel_width  = $('.login-panel').width();
            var login_panel_height = $('.login-panel').height();
            var remaining_height = window_height - login_panel_height;
            $('.middle-row1').height(Math.round(remaining_height / 2));
            $('.left-row1').height($('.middle-row1').height() - 30);
            $('.middle-row3,.middle-row4, .right-row3,.left-row3,.left-row4').height(Math.round(remaining_height / 4));
            if (window_height <= 400) {
                $('.right-row1,.right-row2').height(Math.round((400 - $('.right-row3').height()) / 2));
                $('.left-row2').height(400 - ($('.left-row1').height() + $('.left-row3').height() + $('.left-row4').height()));
            }
            else {
                $('.right-row1,.right-row2').height(Math.round((window_height - $('.right-row3').height()) / 2));
                $('.left-row2').height(window_height - ($('.left-row1').height() + $('.left-row3').height() + $('.left-row4').height()));
            }
            var calculated_side_panel;
            if (window_width < 500) {
                calculated_side_panel = 0;
            }
            else {
                calculated_side_panel = (window_width * 29.51) / 100;
            }
            $('.login-side-panel').width(Math.round(calculated_side_panel / 4));
            var remaining_width = window_width - $('.middle-panel').width();
            $('.left-panel,.right-panel').width((Math.round((remaining_width / 2) - 0.5)));
        }

        function sendErrorNotification(data_object, url, holder) {
            err_text = (data_object.responseJSON == undefined) ? data_object.status : data_object.responseJSON.status;
            var msg_text = (data_object.responseJSON == undefined) ? data_object.message : data_object.responseJSON.message;

            if (data_object.responseJSON !== undefined) {
                if (data_object.responseJSON.code !== undefined && data_object.responseJSON.code == 'GAMMA_DUPLICATE_USER') {
                    msg_text = '"' + $('#email').val() + '"' + ' is already in use by another account. Please try another email.';
                }
            }


            var err_color_class = '';
            if (err_text == 'info') {
                err_color_class = 'color_info';
            }
            else if (err_text == 'success') {
                if ($('.popup_container .error_title').hasClass('color_bad')) {
                    $('.popup_container .error_title').removeClass('color_bad');
                }
                err_color_class = 'color_good';
            }
            else if (err_text == 'error') {
                err_color_class = 'color_bad';
            }

            if (err_text == 'error') {
                $('.success_icon').addClass('hide');
                $('.error_icon').removeClass('hide');
            }
            else if (err_text == 'success') {
                $('.error_close_button').html('Ok');
                $('.error_icon').addClass('hide');
                $('.success_icon').removeClass('hide');
            }
            $('.popup_container .error_title').html(err_text).addClass(err_color_class);
            $('.popup_container .error_message_text').html(msg_text);
            $('.popup_container .more_info_text').html(data_object.details);

            $("#forgotpasssword_outer_container").addClass("blur-main-content");
            $('.popup_container').show();

        }

        //---------- HANDLE EVENTS ------------		
        function handleEvents() {
            $("#confirm_password_input").on("blur", function () {
                var val = $(this).val().trim();
                var password = ($('#new_password_input').val()).trim();
                var error_msg = "";
                if (val.length < 8) {
                    error_msg = 'Confirm Password should be minimum 8 characters.';
                    $('#confirm_password_input').siblings(".error-msg").removeClass("hide").html(error_msg);
                    $(this).css("border-color", "#f26c69");
                } else if (password != val) {
                    error_msg = 'Passwords entered are not matching.';
                    $('#confirm_password_input').siblings(".error-msg").removeClass("hide").html(error_msg);
                    $(this).css("border-color", "#f26c69");
                }
                else {
                    $(this).siblings(".error-msg").addClass("hide");
                }
            });


            $("#confirm_password_input").on("keyup", function () {
                var val = $(this).val().trim();
                var password = ($('#new_password_input').val()).trim();
                if (password == val) {
                    $(this).css("border-color", "#48c1a3");
                }
                else {
                    $(this).css("border-color", "#CCCCCC");
                }
            });

            $("#new_password_input").on("blur", function () {
                var val = $(this).val().trim();
                var error_msg = "";
                if (val.length >= 8) {
                    $(this).siblings(".error-msg").addClass("hide");
                }
                else {
                    error_msg = 'Password should be minimum 8 characters';
                    $(this).siblings(".error-msg").removeClass("hide").html(error_msg);
                    $(this).css("border-color", "#f26c69");
                }
            });

            $("#new_password_input").on("blur", function () {
                var val = $(this).val().trim();
                var error_msg = "";
                if (val.length >= 8 && val.length <= 16) {
                    $(this).siblings(".error-msg").addClass("hide");
                }
                else {
                    error_msg = 'Password should be minimum 8 and maximum 16 characters.';
                    $(this).siblings(".error-msg").removeClass("hide").html(error_msg);
                    $(this).css("border-color", "#f26c69");
                }
            });


            $("input[type='text'], input[type='password']").on("keyup", function () {
                var val = $(this).val().trim();
                var error_msg = "";
                if (val.length >= 8 && val.length <= 16) {
                    $(this).css("border-color", "#48c1a3");
                }
                else {
                    $(this).css("border-color", "#e0e2e5");
                }
            });

            $(".backto_login_link").on("click", function (e) {
                e.preventDefault();
                window.location.replace(PAGE_LOGIN);
            });

            $("input[type='text'], input[type='password']").focus(function () {
                $(this).siblings(".error-msg").addClass("hide");
            });

        }
        

        //---------- PUBLIC METHODS ------------
        return {
            adaptDimensions: function () {
                adaptDimensions();
            },

            sendErrorNotification: function (data_object) {
                sendErrorNotification(data_object);
            },

            handleEvents:function () {
                handleEvents();
            }
        };
    };
