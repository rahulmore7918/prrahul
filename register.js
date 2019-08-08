
var register=function(){
	 
	
	var PAGE_GAMMA = '../gamma/';
	var PAGE_LOGIN = 'login';
	var err_text;
	
 //    function DisableBackButton() 
 //    {
 //    	changeHashOnLoad();
	// }
	// DisableBackButton();
	// window.onload = DisableBackButton;
	// window.onpageshow = function (evt) { if (evt.persisted) DisableBackButton() }
	window.onunload = function () { void (0); }
	    
	function changeHashOnLoad() {
	    window.location.href += "#";
	        setTimeout(function(){
	        window.location.href += " ";
	    },50);
	}
	    
	var storedHash = window.location.hash;
	window.setInterval(function () {
	    if (window.location.hash != storedHash) {
	        window.location.hash = storedHash;
	    }
	},50);

	function sendErrorNotification(data_object,url,holder) {		
		err_text 		= (data_object.responseJSON == undefined)?data_object.status:data_object.responseJSON.status;
		var msg_text 		= (data_object.responseJSON == undefined)?data_object.message:data_object.responseJSON.message;

		if(data_object.responseJSON !== undefined)
		{
			if(data_object.responseJSON.code!== undefined && data_object.responseJSON.code == 'GAMMA_DUPLICATE_USER'){
				msg_text = '"'+$('#email').val()+'"'+' is already in use by another account. Please try another email.';
			}
		}

		
		var err_color_class = '';
	    if(err_text == 'info')
	    	err_color_class = 'color_info';
	    else if(err_text == 'success')
	    {
	    	if($('.popup_container .error_title').hasClass('color_bad'))
	    	{
	    		$('.popup_container .error_title').removeClass('color_bad');
	    	}
	    	err_color_class = 'color_good';
	    }
	    else if(err_text == 'error')
	    	err_color_class = 'color_bad';

	    if(err_text == 'error')
	    {
	    	$('.success_icon').addClass('hide');
	    	$('.error_icon').removeClass('hide');
	    }
	    else if(err_text == 'success')
	    {
	    	$('.error_close_button').html('LOGIN');
	    	$('.error_icon').addClass('hide');
	    	$('.success_icon').removeClass('hide');
	    }
	    $('.popup_container .error_title').html(err_text).addClass(err_color_class);
		$('.popup_container .error_message_text').html(msg_text);
		$('.popup_container .more_info_text').html(data_object.details);

		$("#register_outer_container").addClass("blur-main-content");
		$('.popup_container').show();

	}

	$('.error_close_button,.popup_close_btn').on('click',function() {

		$("#register_outer_container").removeClass("blur-main-content");
		if(err_text == 'error')
			$('.popup_container').hide();
		else
		{
			window.location.replace(PAGE_LOGIN);
		}
	});
  	$('.button_register').click(function(event) {
		var email_pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    	var company_name    = ($('#company_name').val()).trim();
        var company_address = ($('#company_address').val()).trim();

        var first_name      = ($('#first_name').val()).trim();
        var last_name       = ($('#last_name').val()).trim();
        var password        = ($('#password').val()).trim();
        var email   		= ($('#email').val()).trim();
        var phone   		= ($('#phone').val()).trim();
        var confirmPassword = ($('#confirmPassword').val()).trim();
        var adminPassword   = ($('#adminPassword').val()).trim();
        
       if(company_name === '' || company_address === ''  || first_name === '' || last_name === '' || password === '' || email === '' || confirmPassword === '' || adminPassword === '')
        {
            var error_msg = '';
            if(company_name === '' && company_address === ''  && first_name === '' && last_name === ''  && password === '' && email === '' && confirmPassword === '' && adminPassword === '')
                error_msg = 'Please enter all mandatory fields.';
            else if(company_name === '')
                error_msg = 'Please enter Company name.';
           	else if(company_address === '')
                error_msg = 'Please enter Company address.';
            else if(first_name === '')
                error_msg = 'Please enter First name.';
           	else if(last_name === '')
                error_msg = 'Please enter Last name.';
            else if(email === '')
                error_msg = 'Please enter Email address.';
            else if(password === '')
                error_msg = 'Please enter Password.';
            else if(confirmPassword === '')
                error_msg = 'Please enter Confirm Password.';
            else if(adminPassword === '')
                error_msg = 'Please enter Admin Password.';
            

            var error = {code:'',status:'error',message:error_msg,details:error_msg};
            sendErrorNotification(error,'','');   
        }
        else if(!email_pattern.test(email))
        {
            var error = {code:'',status:'error',message:'Enter valid email address.',details:'Email address is invalid.'};
            sendErrorNotification(error,'','');
        }
        else if(password.length < 8 || password.length > 255){
        	var error = {code:'',status:'error',message:'Password should be minimum 8 and maximum 255 characters.',details:'Password should be minimum 8 and maximum 16 characters.'};
            sendErrorNotification(error,'',''); 
        }
        else if(confirmPassword.length < 8 || confirmPassword.length > 255){
        	var error = {code:'',status:'error',message:'Confirm Password should be minimum 8 and maximum 255 characters.',details:'Confirm Password should be minimum 8 and maximum 16 characters.'};
            sendErrorNotification(error,'',''); 
        }
        else if(password != confirmPassword){
        	var error = {code:'',status:'error',message:'Passwords and Confirm Password are not matching.',details:'Passwords and Confirm Password are not matching.'};
            sendErrorNotification(error,'',''); 
        }
        else
        {
            //$('#user').submit();
            var user_data = {'company_name':company_name,'company_address':company_address,'first_name':first_name,'last_name':last_name,'email':email,'password':password,'phone':phone,'add_account_token':adminPassword};
            $.ajax({
	                type:'post',
	                url:'/gamma/api/account/addaccount',
	                data:user_data,
	                success: function(data) {
	                	var success_msg = {code:'',status:'success',message:'Account created successfully.Please log to get inside gamma.',details:'Account created successfully.'};
	                	sendErrorNotification(data,'/gamma/api/account/addaccount','');
	                },
	                error: function(data) {
	                	if(data.responseJSON !== undefined && data.responseJSON.code == 'GAMMA_DUPLICATE_TENANT')
	                	{
							var msg_text = "Company '"+company_name+"' already exists. Please try another name.";
							$('#company_name').val('');
							var success_msg = {status:'error',message:msg_text,details:msg_text};
							sendErrorNotification(success_msg,'/gamma/api/account/addaccount','');    
						}
						else if(data.responseJSON !== undefined && data.responseJSON.code == 'GAMMA_DUPLICATE_USER')
						{
							var msg_text = '"'+email+'"'+' is already in use by another account. Please try another email.';
							$('#email').val('');
							var success_msg = {status:'error',message:msg_text,details:msg_text};
							sendErrorNotification(success_msg,'/gamma/api/account/addaccount','');    
						}
						else if(data.responseJSON !== undefined && data.responseJSON.code == 'INVALID_ADMIN_PASSWORD')
						{
							var success_msg = {status:'error',message:data.responseJSON.message,details:data.responseJSON.details};
							sendErrorNotification(success_msg,'/gamma/api/account/addaccount','');    
						}
						else
						{
							sendErrorNotification(data,'/gamma/api/account/addaccount','');
						}
	                }
	                /* statusCode: {
	                    404: function() {
	                        $('.error-msg').html("<br>"+"Either username or password is incorrect."+"<br>"+"Please try again.").show();
	                    },
	                    401:function() {
	                        $('.error-msg').html("<br>"+"Either username or password is incorrect."+"<br>"+"Please try again.").show();
	                    }
	                }*/
	        });      
        }
    });
	function handleInputEvents(element) {
        element.each(function () {
            $(this).keypress(function (ev) {
				var keycode = (ev.keyCode ? ev.keyCode : ev.which);
				/*if(g.currentBrowser === 'Firefox')
					keycode = (ev.charCode ? ev.charCode : ev.which);
				else
					keycode = (ev.keyCode ? ev.keyCode : ev.which);*/

                if (keycode == '13' &&  !ev.shiftKey ) {
                    $(".submit_form_btn").click();
                }
            });
            $(this).on('focusin',function(ev){
                $(this).css("border-color", '#CCCCCC');
            });
            $(this).on('focusout',function(ev){
                $(this).css("border-color", '#eaebee');
            });
            $(this).css("border-color", '#eaebee');
        })
    }
    handleInputEvents($("input, textarea"));
	 $('#phone').on('keydown.releaseManagement',function(event) {
	 	event.stopPropagation();

		var keycode = event.keyCode;
		/*if(g.currentBrowser === 'Firefox')
			keycode = event.charCode;
		else
			keycode = event.keyCode;*/

		if (!(String.fromCharCode(event.which).match(/^[^0-9\b]*$/i)) || keycode == 9 || event.ctrlKey == true || (event.which > 95 && event.which < 105))
	 		return true;
	 	else
	 		return false; 
	 });

	 /*$('#first_name').on('keydown.releaseManagement',function(event) {
	 	event.stopPropagation();
	 	if (!(String.fromCharCode(event.which).match(/^[^a-z\b]*$/i)) || event.keyCode == 9 || event.ctrlKey == true)
	 		return true;
	 	else
	 		return false; 
	 });

	$('#last_name').on('keydown.releaseManagement',function(event) {
	 	event.stopPropagation();
	 	if (!(String.fromCharCode(event.which).match(/^[^a-z\b]*$/i)) || event.keyCode == 9 || event.ctrlKey == true)
	 		return true;
	 	else
	 		return false; 
	 });*/


	$('#company_name').on('keydown.releaseManagement',function(event) {
	 	event.stopPropagation();
		var keycode = event.keyCode;
		/*if(g.currentBrowser() === 'Firefox')
			keycode = event.charCode;
		else
			keycode = event.keyCode;*/

	 	if (!(String.fromCharCode(event.which).match(/^[^a-z\b]*$/i)) || keycode == 9 || keycode == 32 || event.ctrlKey == true)
	 		return true;
	 	else
	 		return false; 
	 });
}