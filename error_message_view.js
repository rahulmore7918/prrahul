
var g = (function(gamma){

	gamma.error_message_view = function(error_meta_data,holder) {
		
		showError(error_meta_data,holder);
	};

	//--------------CALLED WHEN 'DATA_ERROR' NOTIFICATION IS SENT - COMMON FUNCTION TO HANDLE ERRORS -------------
	function showError(dataObject, holder) {
		var fontErrorIcon = "ic-alert";
		var fontIconColor = "#AEB2BD";

		e.notify(gamma.notifications.RENDERING_COMPLETE);
		var errorStr = "";
		errorStr = dataObject.message;
		if(errorStr == "" || errorStr == undefined){
			errorStr="No data available";
		}
		var errorWrapper = $('<div/>',{class:'error_wrapper float_left'});
		errorWrapper.css('display','block');

		var errorType = $('<div/>', { class: 'error_type ' + fontErrorIcon }).css("color", fontIconColor);
		var errorTitle = $('<div/>',{class:'error_heading'}).html(dataObject.message);
		var errorDescription = $('<div/>',{class:'error_description'});
			var errorDescriptionContent = $('<div/>',{class:'error_description_content'}).html(dataObject.details);
			var errorInfo = $('<div/>',{class:'error_info ic-info'});
			errorInfo.webuiPopover({ title: dataObject.message, content: dataObject.details, placement: 'auto-right',trigger: 'hover' });

		if(dataObject.is_info){
			errorDescription.append(errorDescriptionContent,errorInfo);
		}else{
			errorDescription.append(errorDescriptionContent);
		}
		var taskManagementAccountButton = $('<button/>',{type:'button', class:'add_button button_small'}).html(dataObject.task_management_text);

		var addButton = $('<button/>',{type:'button', class:'add_button button_small '+dataObject.button_event}).html(dataObject.button_text);

		if(dataObject.is_add_button){
			if(dataObject.is_task_management_button){
				errorWrapper.append(errorType, errorTitle, errorDescription, taskManagementAccountButton, addButton);
				addButton.css('margin-left','20px')
			}else{
				errorWrapper.append(errorType, errorTitle, errorDescription, addButton);
			}
		}else{
			errorWrapper.append(errorType, errorTitle, errorDescription);
		}
		if(holder || holder!=""){
			(holder).append(errorWrapper);
		}
		
	}
	return gamma;
}(g));