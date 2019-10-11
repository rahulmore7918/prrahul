
var g = (function(gamma){

	var dataObject = '';
	gamma.addErrorAlert = function(dataObjectParam) {
		dataObject = dataObjectParam;
		showError();
	};

	//--------------CALLED WHEN 'DATA_ERROR' NOTIFICATION IS SENT - COMMON FUNCTION TO HANDLE ERRORS -------------
	function showError() {
		var notification = 'ERROR_POPUP_CLOSE';
		let notificationStatus = "error";
		if(dataObject.error.status != undefined){
			notificationStatus = dataObject.error.status;
		}
		//var errorCode = (dataObject.responseJSON == undefined)?0:dataObject.responseJSON.error.code;
		//var notificationStatus = (dataObject.responseJSON == undefined)?dataObject.status:dataObject.responseJSON.status;

		var errorAlert;
		if(dataObject.notification_name !== undefined){
			notification = dataObject.notification_name;
		}

        if(dataObject.notification_name === undefined){
            e.subscribe(gamma.notifications.ERROR_POPUP_CLOSE,onErrorPopupClose);
        }

        e.notify(gamma.notifications.RENDERING_COMPLETE);
        showAlert();

        var errorStr = "";
        errorStr = dataObject.error.message;
        if(errorStr == "" || errorStr == undefined){
            errorStr="No data available";
        }

		function onErrorPopupClose() {
			if (errorAlert != undefined) {
				errorAlert.clearMemory();
				errorAlert = null;
			}
			e.unSubscribe('ERROR_POPUP_CLOSE');
		}

		function showAlert() {
			errorAlert = new e.popup({ width: 500, height: 'auto', default_state: 1, style: { popup_content: { 'padding': 28 } }, focusIn: false, notify: { onPopupClose: notification } });
			//=============== get received data ==================
			var errText = notificationStatus;
			var msgText = (dataObject.responseJSON == undefined) ? dataObject.error.message : dataObject.responseJSON.error.message;
            if (msgText == "" || msgText == undefined) {
                msgText = "Something went wrong. Please try again after some time.";
            }
            var msgTextMore = (dataObject.responseJSON == undefined) ? dataObject.error.details : dataObject.responseJSON.error.details;
            var popupTitleData = $('<div/>', { class: 'popup_title_data confirm_popup_title float_left h2 semibold text_transform_capitalize' });
            var errColorClass = '';
			let errorTitle;
			let statusType = '';
			if (errText == 'info'){
				errColorClass = 'color_info';
				statusType = 'ic-info';
			}else if (errText == 'success'){
				errColorClass = 'color_good';
				statusType = 'ic-success';
			}else if (errText == 'warning'){
				errColorClass = 'color_warning';
				statusType = 'ic-alert';
			}else if (errText == 'error'){
				errColorClass = 'color_bad';
				statusType = 'ic-alert';
			}
			var errorIcon = $('<div/>', { class: errColorClass + ' error_icon float_left ' + statusType});
			// e.renderIcon(errorIcon, errText);
			errorTitle = $('<div/>', { class: 'error_title float_left language_text ' + errColorClass }).html(g.print(errText));
			errorTitle.attr('data-language_id', errText);
			popupTitleData.append(errorIcon, errorTitle);

			var popupData = $('<div/>', { class: 'popup_data explore_error float_left' });
			var errorMessage = $('<div/>', { class: 'error_message float_left' });
			var messageText = $('<div/>', { class: 'error_message_text float_left h4' }).html(msgText);//.html(gamma.errors[error_code]);
			errorMessage.append(messageText);
			if (msgTextMore && msgTextMore !== '') {
				var moreInfo = $('<div/>', { class: 'more_info float_left hand_cursor margin_top_20' });
				var more_info_text = $('<div/>', { class: 'more_info_text float_left text_transform p semibold' }).html('More');
				var moreInfoIcon = $('<div/>', { class: 'more_info_icon float_left margin_left_5' });
				e.renderIcon(moreInfoIcon, 'triangle');
				moreInfo.append(more_info_text, moreInfoIcon);
				var messageInfo = $('<div/>', { class: 'error_message_info float_left hide p' }).html(msgTextMore);
				errorMessage.append(moreInfo, messageInfo);
			}
			var closeButton = $('<button/>', { type: 'submit', class: 'error_close_button float_right button_small transition_bcolor' }).html('ok');
			popupData.append(errorMessage, closeButton);
			errorAlert.addTitle(popupTitleData);
			errorAlert.addContent(popupData);
			errorAlert.openPopup();

			$('.more_info').on('click', function () {
				if ($('.error_message_info').hasClass('hide')) {
					$(this).find('.more_info_icon').children().children().attr({ 'transform': 'rotate(90, 16, 16)' });
					$('.error_message_info').slideDown(300, function () {
						$(this).removeClass('hide');
					});
				}
				else {
					$(this).find('.more_info_icon').children().children().attr({ 'transform': 'rotate(0, 6, 6)' });
					$('.error_message_info').slideUp(300, function () {
						$(this).addClass('hide');
					});
				}
			});

			$('.error_close_button').on('click', function () {
				if(errorAlert === null){
					g.forceClosePopup($(this).parents('.popup_container'));
				}else{
					errorAlert.closePopup();
				}
			});
		}
	}
	return gamma;
}(g));