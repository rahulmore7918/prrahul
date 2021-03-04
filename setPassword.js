 
var setPassword=function(){
	 
	
	// var PAGE_GAMMA = '../gamma/';
	var PAGE_LOGIN = 'login';
	var err_text;
	var utilsObj = new utils();
	
	window.onunload = function () { void (0); }

	var storedHash = window.location.hash;
	window.setInterval(function () {
	    if (window.location.hash != storedHash) {
	        window.location.hash = storedHash;
	    }
	},50);

	$('.error_close_button,.popup_close_btn').on('click',function() {

		$("#forgotpasssword_outer_container").removeClass("blur-main-content");
		if(err_text == 'error')
		{
			$('.popup_container').hide();
		}
		else
		{
			window.location.replace(PAGE_LOGIN);
		}
	});

	

	utilsObj.handleEvents();

	$('.button_set_password').click(function(event) {
		event.preventDefault();
        var url = window.location.href;
        var urlArr= url.split("set_password/");
        var tenant_uid = urlArr[1];
     	var password        = ($('#new_password_input').val()).trim();     	
        var confirmPassword = ($('#confirm_password_input').val()).trim();
        var error_msg="";
       	if(password === ''){
            error_msg = 'Please enter a password';
        	$('#new_password_input').siblings(".error-msg").removeClass("hide").html(error_msg);
        }
        else if(password === ''){
            error_msg = 'Please enter a confirm password';
            $('#new_password_input').siblings(".error-msg").removeClass("hide").html(error_msg);
        }
     	else if(password.length < 8 || password.length > 255){
        	error_msg ='Password should be minimum 8 and maximum 255 characters.';
      	 	$('#new_password_input').siblings(".error-msg").removeClass("hide").html(error_msg); 
        }
        else if(confirmPassword.length < 8 || confirmPassword.length > 255){
           	error_msg ='Confirm Password should be minimum 8 and maximum 255 characters.';
      	 	$('#confirm_password_input').siblings(".error-msg").removeClass("hide").html(error_msg); 
        }
        else if(password != confirmPassword){
            error_msg ='Passwords entered are not matching.';
      	 	$('#confirm_password_input').siblings(".error-msg").removeClass("hide").html(error_msg);        
      	}      
        else
        {
            var user_data = {'password':password, 'tenantUIDencoded':tenant_uid};
            $.ajax({
	                type:'post',
	                url: '/api/v1/users/password/set',
	                data:user_data,
	                success: function(data) {
	                	$(".login-param").addClass("hide");
	                	$(".success-msg, .backto_login_link").removeClass("hide");
	                },
	                error: function(data) {
	                	if(data.responseJSON !== undefined && data.responseJSON.code == 'GAMMA_NO_USER_ACCOUNT')
	                	{
							var msg_text = 'Something went wrong please try again.';
							$('input').val('');
							var success_msg = {status:'error',message:msg_text,details:msg_text};
							sendErrorNotification(success_msg,'/gamma/api/account/setpassword','');    
						}
						else
						{
							sendErrorNotification(data,'/gamma/api/account/setpassword','');
						}
	                }
	        });      
        }
    });
	utilsObj.adaptDimensions();
	$(window).on("resize", function(){
		utilsObj.adaptDimensions();
	});	
}
