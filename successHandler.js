
var g = (function(gamma){

	var dataObject = '';
	gamma.addToast = function(dataObjectParam) {
		dataObject = dataObjectParam;
		displayToast();
	};

	//--------------CALLED WHEN 'DATA_ERROR' NOTIFICATION IS SENT - COMMON FUNCTION TO HANDLE ERRORS -------------
	function displayToast() {
        var toastMsgWraper;
        if(!$(".toast_msg_wraper").length)
        {
            toastMsgWraper = $('<div/>',{class:'toast_msg_wraper'});
            //toastMsgWraper.css('z-index',e.nextHighestDepth());
            $("#bottom_container").prepend(toastMsgWraper);
        }
        var colorClass = 'color_good';
        if(dataObject.isError && dataObject.isError != 'undefined'){
            colorClass = 'color_bad toast_bad';
        }
        var toastMsg = $('<div/>',{class:'p toast_msg '+colorClass}).html(dataObject.message);

        $(".toast_msg_wraper").prepend(toastMsg);
        // if(!dataObject.fadeout)
        // {
        setTimeout(function(){
            toastMsg.fadeOut(1000, function(){
                toastMsg.remove();
            });
        },3000);
        // }
        // else
        // {
        //     toastMsg.find('.role_refresh').on('click',function() {
        //         historyManager.initializeData(true);
        //         location.reload();
        //     });
        // }
	}
	return gamma;
}(g));