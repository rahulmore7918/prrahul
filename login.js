
var login=function(){


        var PAGE_GAMMA = '../gamma/';
        var API_VERSION = 'v1';
		adaptDimensions();
		$(".javascript-disabled-err").remove();
		$(".error-msg-main img").remove();

	    $(window).on("resize", function(){
	        adaptDimensions();
	    });
	    $("#forgot_password_form").css("right","-380px");

	      function adaptDimensions()
	      {
	          var window_width       = $(window).width();
	          var window_height      = $(window).height();
	          var login_panel_width  = $('.login-panel').width();
	          var login_panel_height = $('.login-panel').height();
	          var remaining_height   = window_height - login_panel_height;
	          $('.middle-row1').height(Math.round(remaining_height/2));
	          $('.left-row1').height($('.middle-row1').height() - 30);
	          $('.middle-row3,.middle-row4, .right-row3,.left-row3,.left-row4').height(Math.round(remaining_height/4));
	          if(window_height <= 400)
	          {
	            $('.right-row1,.right-row2').height(Math.round((400-$('.right-row3').height())/2));
	            $('.left-row2').height(400 - ($('.left-row1').height() + $('.left-row3').height() + $('.left-row4').height()));
	          }
	          else
	          {
	            $('.right-row1,.right-row2').height(Math.round((window_height-$('.right-row3').height())/2));
	            $('.left-row2').height(window_height - ($('.left-row1').height() + $('.left-row3').height() + $('.left-row4').height()));
	          }
	          var calculated_side_panel;
	          if(window_width < 500)
	            calculated_side_panel = 0;
	          else
	            calculated_side_panel = (window_width*29.51)/100;
	          $('.login-side-panel').width(Math.round(calculated_side_panel/4));
	          var remaining_width = window_width - $('.middle-panel').width();
	          $('.left-panel,.right-panel').width((Math.round((remaining_width/2) - 0.5)));
	      }
      $('.errMsg').hide();

      $('.video-panel').on('click',function(){
      		window.open('gamma_quick_guide.html','_blank');
      });

		$("input[type='text'], input[type='password']").focus(function(){
			$(this).siblings(".error-msg").addClass("hide");
			$(this).css("border-color","#CCCCCC");
		});
      $('.signin-button').click(function(event){
        	event.preventDefault();
          	var uname = $('#username').val();
            var pwd   = $('#password').val();
            var errMsgStr = '';
            var re = new RegExp(/<script[\s\S]*?>[\s\S]*?<\/script>/gi);

            $(".error-msg-main").html('');

          	if(uname === '')
          	{
          		//$('#username').focus();
            	errMsgStr = 'Please enter an Username/Email.';
            	$('#username').siblings(".error-msg").removeClass("hide").html(errMsgStr);
          		$('#username').css("border-color","#f26c69");
            }
          	else if(pwd === '')
          	{
          		//$('#password').focus();
            	errMsgStr = 'Please enter a Password.';
            	$('#password').siblings(".error-msg").removeClass("hide").html(errMsgStr);
          		$('#password').css("border-color","#f26c69");
            }

            if (re.test(uname)) {
                errMsgStr = 'Special characters are not allowed.';
                $('#username').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                $('#username').css("border-color", "#f26c69");
            } else if (re.test(pwd)) {
                errMsgStr = 'Special characters are not allowed.';
                $('#password').siblings(".error-msg").removeClass("hide").html(errMsgStr);
                $('#password').css("border-color", "#f26c69");
            }

          	if(errMsgStr == '')
          	{
                // post the data
	           	$('.error-msg').html('');
	            $.ajax({
	                type:'post',
	                url: `/api/${API_VERSION}/auth`,
									contentType:'application/json; charset=utf-8',
									data: JSON.stringify({'username':uname,'password':pwd}),
	                success: function(data) {
											$('.error-msg').html('');
	                                        localStorage.setItem("current_user", uname);
											localStorage.setItem("user_login", true);
											localStorage.setItem("auth_token", data.token);
	                    window.location.replace(PAGE_GAMMA+window.location.hash);
	                },
	                error: function(data) {
                        $('#username').focus();
                        if (data.responseJSON.error.code == 1002) {
                            $('.error-msg-main').html("<img src='images/warning.svg' alt='warning'>Your account is no longer active. Please contact administrator.").show();
                        }
                        else if(data.responseJSON.error.code == 1003){
                            $('.help-block-error').removeClass('hide');
                            $('.response-message-container').addClass('hide');
                        }else {
                            $('.error-msg-main').html("<img src='images/warning.svg' alt='warning'>Either username or password is incorrect.").show();
                        }
	                }
	            });
         	}
        });
    $(".forgot_password_link").on("click",function(e){
			e.preventDefault();
			$("#login-form .login-panel .error-msg-main").html('');
			$('#login-form .login-param').animate({left: '-380px'},'1000');
			$('#forgot_password_form .login-param').animate({right: '380px'},'1000');
			$("#forgot_password_form input,#forgot_password_form a").removeAttr("tabindex");
			$("#login-form input,#login-form a").attr("tabindex","-1");
    	//$("#login-form").addClass("hide");
    	//$("#forgot_password_form").removeClass("hide");
    });
}
