
var g = (function(gamma) {


	//----------------- Private Variables ----------------
	var defaultParameter ="tags";
	var repo_dropdown , reloadHotspotdata = false , tag_confirm_alert;
	var getAllocatedTagsData, getNonAllocatedTagsData,selected_category;
  	e.subscribe('TAG_DROPDOWN_CLICK',onTagCategorySelect);
	e.subscribe('BREADCRUMB_UPDATE',getAllocatedTagCount);
	e.subscribe('GET_TAG_COUNT',getAllocatedTagCount);

	//----------------- Private Methods ----------------
	function onTagCategorySelect(selected_item){
		if($(".tagging_popup_data").length){
			var categoryIndex = getCategoryDataByName(selected_item.selection);
			selected_category=selected_item.selection;
			var tempTagArr=[], selected_tags;

			/*for(var j = 0; j < getNonAllocatedTagsData[categoryIndex].json_agg.length;j++){*/
				var tempTagObjArr=[];
				var tempTagID=null;
				var tempTagName="";
				var tempTagObj={};
				$.each(getNonAllocatedTagsData[categoryIndex].json_agg, function(i,item){
					tempTagObjArr = item.split(":");
					tempTagID =tempTagObjArr[0];
					tempTagName =tempTagObjArr[1];
					tempTagObj={'label':tempTagName,'value':tempTagID};
				   	tempTagArr.push(tempTagObj)
				});
				/*if(j==1){
					selected_tags=tempTagID;
				}
			}*/
			tempTagArr.sort(function(a,b) {return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);} );


			var tagRadioGroup 	= new e.radioGroup({data:tempTagArr,
													main_class:'',spacing:10,
													selected_radio:selected_tags,
													text: {font:"p"},
													radio_btn_class:'radio_button_style pattern_2',
													theme : {name: "inline",color: "#9f3c8f"}, clickable : false});

			$('.addnew_tags_radio_wraper').html(tagRadioGroup.addHTML());
		}
	}
	function getCategoryDataByName(categoryName){
		for (var j = 0; j < getNonAllocatedTagsData.length; j++){
			if(getNonAllocatedTagsData[j].name == categoryName)
				return  j;
		}
	}
	function getAllocatedTagCount(){
		var nodeID = historyManager.get('currentBreadcrumb').id
		var subsystemid = historyManager.get('currentSubSystem');
		var dataToSend = {
			'nodeid': nodeID,
			'subsystemid':subsystemid
		}
		e.loadJSON('/tags/nodes/count', tagsCountReceived, dataToSend);
	}
	function tagsCountReceived(data, status){
		if(status == 'success'){
			showTagCount(data)
		}
		else if(status == 'error'){
			gamma.sendErrorNotification(data, '/tags/nodes/count', $('#content .right_container'));
		}
	}
	function showTagCount(data){
		$(".tag_click .tag_count").html(data[0].count);
		if(data[0].count != 0)
			$(".tag_click .tag_count").removeClass("hide");
		else
			$(".tag_click .tag_count").addClass("hide");
	}
	function loadTagsData() {
		var nodeID = historyManager.get('currentBreadcrumb').id
		var subsystemid = historyManager.get('currentSubSystem');
		var dataToSend = {
			'nodeid': nodeID,
			'subsystemid':subsystemid
		}
		e.loadJSON('/tags/tagcategories/allocatedAndNonallocated', tagsDataReceived, dataToSend);
	}

	function tagsDataReceived(data, status) {
		if(status == 'success'){

			getAllocatedTagsData = data.getAllocatedTagsData;
			getNonAllocatedTagsData = data.getNonAllocatedTagsData;
			addPopupContent();
		}
		else if(status == 'error'){
			gamma.sendErrorNotification(data,'/tags/tagcategories/allocatedAndNonallocated',$('.'));
		}

	}
	function manageTagsPopup(){

        if($('.popup_container').length > 0)
			$('.popup_container').remove();
		tag_confirm_alert    			= new e.popup({width:800,height:'auto',default_state:1,style:{popup_content:{padding:5}},notify:{onPopupClose:'TAG_CONFIRM_POPUP_CLOSE'/*,onPopupClose:'NODE_TAG_UPDATED'*/}});
	    var popup_title_data 	= $('<div/>',{class:'popup_title_data float_left h3 semibold text_transform_capitalize'});

    	var title_icon 			= $('<div/>',{class:'error_icon tag_title_icon float_left'});
    	e.renderFontIcon(title_icon,"ic-tags");

	    var popup_title 		= $('<div/>',{class:'error_title float_left language_text '}).html("Tags");
	    popup_title.attr('data-language_id',"warning");
	    popup_title_data.append(title_icon,popup_title);

	    var popup_data 			= $('<div/>',{class:'popup_data explore_error float_left tagging_popup_data tagging_popup_data_explore'});
	   	var popup_bredcrumb 	= $('<div/>',{class:'popup_bredcrumb'});

	    tag_confirm_alert.addContent(popup_data);

	    //addPopupContent();

	    loadTagsData();

	    tag_confirm_alert.addTitle(popup_title_data);
	    tag_confirm_alert.openPopup();
	    var taggingBreadcrumb = $('<ul/>',{class:'breadmenu'})
	    var taggingBreadcrumbItem1 = $('<li/>',{class:'float_left'}).html($("#breadcrumb .breadmenu > li:nth-last-child(2)").html());
	    var taggingBreadcrumbItem2 = $('<li/>',{class:'float_left'}).html($("#breadcrumb .breadmenu  > li:last-child").html());
	    taggingBreadcrumb.append(taggingBreadcrumbItem1,taggingBreadcrumbItem2);
	    popup_bredcrumb.append(taggingBreadcrumb);
	    //popup_bredcrumb.append($("#breadcrumb ").html());
	    $(".popup_title_data").append(popup_bredcrumb);
	    $(".popup_title_data .breadmenu .rootBC,.popup_title_data .breadmenu .type_icon, .popup_title_data .breadmenu .subnav, .popup_title_data .breadmenu li:last-child .BCarrowico").remove()
	    $(".popup_title_container").css("padding-left","48px");
	   // $(".popup_title_data .breadmenu li:nth-last-child(n-(-n-2))").remove();


	}

	function addPopupContent(){
		 /**********  ***************/
		var tempTagArr=[],selected_tags;
	    var currentTagsMainWraper 	= $('<div/>',{class:'current_tags_main_wraper float_left '});
	    var currentTagsMainTitle 	= $('<div/>',{class:'current_tags_main_title  bold stroke_dark h3'});

	    var addNewTagsMainWraper 	= $('<div/>',{class:'addnew_tags_main_wraper float_left '});
	    var addnewTagsMainTitle 	= $('<div/>',{class:'addnew_tags_main_title  bold stroke_dark h3'});

	    var tagErrorDiv = $('<div/>', {class:'float_left tag_error_wraper hide'});
		var issue_title_error = $('<div/>',{class:'error_msg tag_error p hide'}).html('Please select tag to add.');
		tagErrorDiv.append(issue_title_error);
		addNewTagsMainWraper.append(tagErrorDiv);

     	var addNewTagRadioboxWraper 	= $('<div/>',{class:'addnew_tags_radio_wraper float_left '});

	    currentTagsMainWraper.append(currentTagsMainTitle);
	    addNewTagsMainWraper.append(addnewTagsMainTitle);

	    //drop down
	    var tagCategoryArray=[];
      	if(getNonAllocatedTagsData.length > 0) {
			for(var i = 0 ; i < getNonAllocatedTagsData.length ; i++)
			{
				/*if(getNonAllocatedTagsData[i].json_agg[0].length != 0 || getNonAllocatedTagsData[i].json_agg[1].length != 0 )
					tagCategoryArray.push(getNonAllocatedTagsData[i].name);	*/
				if(getNonAllocatedTagsData[i].json_agg.length != 0)
					tagCategoryArray.push(getNonAllocatedTagsData[i].name);
			}
			selected_category=getNonAllocatedTagsData[0].name;
		    createDropdown(addNewTagsMainWraper,'tag_category',tagCategoryArray);

			/*for(var j = 0; j < getNonAllocatedTagsData[0].json_agg.length;j++){*/
				var tempTagObjArr=[];
				var tempTagID=null;
				var tempTagName="";
				var tempTagObj={};
				$.each(getNonAllocatedTagsData[0].json_agg, function(i,item){
					tempTagObjArr = item.split(":");
					tempTagID =tempTagObjArr[0];
					tempTagName =tempTagObjArr[1];
					tempTagObj={'label':tempTagName,'value':tempTagID};
				   	tempTagArr.push(tempTagObj)
				});
				selected_tags=tempTagID;
				/*if(j==1){
					selected_tags=tempTagID;
				}
			}*/
			tempTagArr.sort(function(a,b) {return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);} );
			var tagRadioGroup 	= new e.radioGroup({data:tempTagArr,
													main_class:'',
													spacing:10,
													selected_radio:selected_tags,
													text: {font:"p"},
													radio_btn_class:'radio_button_style pattern_2',
													theme : {name: "inline",color: "#9f3c8f"}, clickable : false});

			addNewTagRadioboxWraper.append(tagRadioGroup.addHTML());
			if(tagCategoryArray.length)
				addNewTagsMainWraper.append(addNewTagRadioboxWraper);
		}
		else{
				var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.info_tags_message'), details: i18next.t('common.info_description.info_desc_no_tags'), is_add_button:false, button_text:'',is_task_management_button:false,task_management_text:'',button_event:''};
            g.error_message_view(data,$('.popup_data'));
		}
	    if(getAllocatedTagsData.length > 0)
		{
			for (var i = 0; i < getAllocatedTagsData.length; i++)
			{
				var currentTag = $('<div/>',{class:'current_tag float_left '});
				var currentTagTitle = $('<div/>',{class:'current_tag_title float_left color_medium p'}).html(getAllocatedTagsData[i].name);

				currentTag.append(currentTagTitle);
				if(getAllocatedTagsData[i].allocated_tags.length !== 0){
					//for (var j = 0; j < getAllocatedTagsData[i].allocated_tags.length; j++){
						var tagsDivWraper = $('<div/>',{class:'tags_wraper context_wraper float_left'});
						var tempTagArr = (getAllocatedTagsData[i].allocated_tags).split(":");
						var tempTagID =tempTagArr[0];
						var tempTagName =tempTagArr[1];
						var tempTagColor =tempTagArr[2];
						var tagsDiv = $('<div/>',{class:'tags p fill_light'});
						var tagsDivText = $('<div/>',{class:'tags_text p color_medium'}).html(''+tempTagName);
						var tagColor = $('<span/>',{class:'tag_color'}).css("background-color",tempTagColor);
						tagsDiv.append(tagsDivText,tagColor);
						tagsDiv.attr('data-tag_id',tempTagID);
						tagsDiv.attr('data-tag_name',tempTagName);

						tagsDivWraper.append(tagsDiv);
						currentTag.append(tagsDivWraper);
						var contextMenuPlugin = new e.contextMenu({target:tagsDivWraper,items:['Delete'],item_ids:['delete_node_tag'], holder:tagsDivWraper, backgroundColor:'fff'});
					//}
					currentTagsMainWraper.append(currentTag);
				}
			}

		}
		else{
			var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.info_tags_message'), details: i18next.t('common.info_description.info_desc_no_tags'), is_add_button:false, button_text:'',is_task_management_button:false,task_management_text:'',button_event:''};
            g.error_message_view(data,$('.popup_data'));

		}
		var cancel_button = $('<button/>',{type:'button', class:'button_small cancel_button margin_top_30 float_right fill_medium_light'}).html(i18next.t('admin.tag.done'));
    	var save_button   = $('<button/>',{type:'submit', class:'button_small save_button transition_bcolor margin_right_10 margin_top_30 float_right clear'}).html(i18next.t('admin.tag.add_tag'));

    	$(".popup_data").html('').append(currentTagsMainWraper, addNewTagsMainWraper);

		if(tagCategoryArray.length){
			$(".addnew_tags_main_wraper .element_wrapper").show();
			addNewTagsMainWraper.append(save_button,cancel_button);
			currentTagsMainTitle.html('Current Tags');
			addnewTagsMainTitle.html('Add New Tags');
		}
		else{
			$(".addnew_tags_main_wraper .element_wrapper").hide();
			var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.info_tags_message'), details: i18next.t('common.info_description.info_desc_no_tags'), is_add_button:false, button_text:'',is_task_management_button:false,task_management_text:'',button_event:''};
			var admin_data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.admin_info_tags_message'), details: i18next.t('common.info_description.admin_info_desc_no_tags'), is_add_button: false, button_text: '', is_task_management_button: false, task_management_text: '', button_event: '' };
			var user_data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.user_info_tags_message'), details: i18next.t('common.info_description.user_info_desc_no_tags'), is_add_button: false, button_text: '', is_task_management_button: false, task_management_text: '', button_event: '' };

			if (g.hasPermission('ADD_TAG')) {
				if (getAllocatedTagsData.length > 0) {
					g.error_message_view(data, $('.popup_data .addnew_tags_main_wraper'));
				} else {
					g.error_message_view(admin_data, $('.popup_data'));
					$(".current_tags_main_wraper").css("border", 0);
				}
			}
			else {
				if (getAllocatedTagsData.length > 0) {
					g.error_message_view(data, $('.popup_data .addnew_tags_main_wraper'));
				} else {
					g.error_message_view(user_data, $('.popup_data'));
					$(".current_tags_main_wraper").css("border", 0);
				}
			}
		}
	     $('.cancel_button').on('click',function() {
			tag_confirm_alert.closePopup();
			//e.notify(g.notifications.NODE_TAG_UPDATED);
		});

		$('.save_button').on('click',function(){

			var nodeID = historyManager.get('currentBreadcrumb').id;
			// var subsystemId = historyManager.get('currentSubSystem');
			var subsystemId = historyManager.get('currentSubSystem');
			var selected_options 	  	= $('.addnew_tags_radio_wraper .checked').parent().attr('data-value');
			var categoryId;
			for (var j = 0; j < getNonAllocatedTagsData.length; j++){
				if(getNonAllocatedTagsData[j].name == selected_category)
					categoryId=  getNonAllocatedTagsData[j].id;

			}

			if(selected_options){
				var nodeTagData = {
					'nodeId':nodeID,
					'subsystemId':subsystemId,
					'tagId':selected_options,
					'categoryId':categoryId
				}
				function onNodeTagsAdded(dataResponse,status) {
					if(status == 'success')
			    	{
	                	reloadHotspotdata = true;
	                	loadTagsData();
	                	gamma.nodeSummaryInit($("#plugin_selector"));
			    	}
			    	// else if(status == 'error')
			    	// {
					// 	g.addErrorAlert(dataResponse);
			    	// }
				}
				var customResponse;
				customResponse = {
					success: {
						isCustom: true,
						message: 'Tag(s) added successfully.'
					},
					error: {
						isCustom: false
					}
				}
				e.postData("POST", '/tags/addNodes/nodes', onNodeTagsAdded, nodeTagData, customResponse);
				$(".tag_error_wraper").addClass("hide");
			} else{
				$(".tag_error_wraper").removeClass("hide");
			}

        });
		$('.delete_node_tag').on('click',function() {
			var nodeTagId={'itemId':$(this).parents(".tags_wraper").find(".tags").attr("data-tag_id")};
			function tagDeleteCallback(dataResponse,status) {
				if(status == 'success')
		    	{
		            reloadHotspotdata = true;
	               loadTagsData();
	               gamma.nodeSummaryInit($("#plugin_selector"));
		    	}
		    	// else if(status == 'error')
		    	// {
				// 	g.addErrorAlert(dataResponse);
		    	// }
			}
			var customResponse;
			customResponse = {
				success: {
					isCustom: true,
					message: 'Tag removed successfully.'
				},
				error: {
					isCustom: false
				}
			}
			e.postData("DELETE", `/tags/nodes/${nodeTagId.itemId}`, tagDeleteCallback,'', customResponse);
		});
		var deleteIconContext = $('<span>',{class:'delete_icon_context float_left'});
		e.renderIcon(deleteIconContext,'close');
		$(".context_menu .delete_node_tag").append(deleteIconContext);
		/*if(repo_dropdown)
	    	repo_dropdown.handleEvents();*/
		$(".addnew_tags_main_wraper .element_wrapper .dropdown_label").html("Tag Category");
	}

	function onTagPopupClose() {
		if(tag_confirm_alert != undefined && tag_confirm_alert != null)
		{
			tag_confirm_alert.clearMemory();
			tag_confirm_alert = null;
		}
		getAllocatedTagCount();
		e.unSubscribe('TAG_CONFIRM_POPUP_CLOSE');
		e.disablePlugin(['popup']);
		if(historyManager.get('currentPlugin').id == 'hotspot_distribution' && reloadHotspotdata)
		{
			reloadHotspotdata =false;
			e.notify('NODE_TAG_UPDATED');
		}
	}

	function createDropdown(holder,label,dropdown_data) {
		var element_wrapper = $('<div/>', {class:'element_wrapper '});
		holder.append(element_wrapper);
		var dropdown_wrapper = $('<div/>',{class:'dropdown_wrapper '+label});
		element_wrapper.append(dropdown_wrapper)
		repo_dropdown = new e.dropDown({holder:dropdown_wrapper,
		    dropDownData : dropdown_data,
		    text_transform_capitalize:false,
		    dropDownLabel:label,
		    showLabel:true,
		    multipleDropdown:false,
		    notify:{onDropdownItemClick:'TAG_DROPDOWN_CLICK'}
		});
	}
	 function popupPluginEnabled() {
	 	e.enablePlugin('dropDown',dropdownPluginEnabled);
	}
	function dropdownPluginEnabled(){
		e.enablePlugin('radioGroup',radioGroupPluginEnabled);
	}
	function radioGroupPluginEnabled(){
		manageTagsPopup();
	}
	//---------------- Public methods -----------------
	gamma.handleTagEvents = function() {

		/*$('.tag_click').on('click',function(event) {

			//loadNonAllocatedTags();
		});*/
	}
	gamma.getAllocatedTagCount = function(){
		getAllocatedTagCount();
	}
	gamma.openTagPopup=function(){
		e.subscribe('TAG_CONFIRM_POPUP_CLOSE',onTagPopupClose);
		e.enablePlugin('popup',popupPluginEnabled);
	}
	return gamma;
}(g));
