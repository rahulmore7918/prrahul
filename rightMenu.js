
var g = (function(gamma) {
	 

	//----------------- Private Variables ----------------

	var about_popup;
	//----------------- Private Methods ---------------
	function openPDF(url) {
		window.open(url,'pdf');
	}

	function onRightMenuItemClick(clicked_element) {
		$('.menu_click').removeClass('fill_base stroke_left stroke_light').height('39px');
		$('.selected_tab').height('30px');
		var select_node 	= $('.right_menu_list .right_menu_item.selected');
		if(clicked_element != 8)
		{
			select_node.find(".right_menu_icon").addClass('hide');
			select_node.find(".right_menu_icon_selected").removeClass('hide');

			$('.right_menu_list').slideUp(300,function(){
				$(this).addClass('hide');
				switch(clicked_element)
				{
					case 'company' :  // Company Details
								e.changeMode('management');
								if(gamma.hasRole('Account administrator') && gamma.is_primary)
								{
									gamma.pushHistory(clicked_element,'','',{'breadcrumb':'','prefix':'account'},'management');
									gamma.admin.account.account_details.loadAccountDetails();
								}
								else
								{
									gamma.pushHistory('user_details','','',{'user_id':gamma.user_id,'user_name':gamma.user_name,'breadcrumb':'','prefix':'account'},'management');
									gamma.admin.users.user_details.loadUserDetails(gamma.user_id,gamma.user_name);
								}
							   	break;
					case 'users' :  // User Details
								e.changeMode('management');
								if(gamma.hasRole('Account administrator') || gamma.hasRole('User administrator'))
								{
									gamma.pushHistory('admin_details','','',{'default_parameter':'users','breadcrumb':"users"},'management');
									gamma.admin.left_menu.loadAdminDetails('users',true);
								}
								else if(gamma.hasRole('Project administrator') || gamma.hasRole('Manager') || gamma.hasRole('Analyser'))
								{
									gamma.pushHistory('admin_details','','',{'default_parameter':'projects','breadcrumb':"projects"},'management');
									gamma.admin.left_menu.loadAdminDetails('projects',true);
								}
								break;
					case 'gamma_help': window.open('help.html');
							   break;
					case 'about_gamma' : e.subscribe('ABOUT_POPUP_CLOSE',onAboutPopupClose);
										e.enablePlugin('popup',aboutGammaPopup);
							   break;
					case 'log_out' : gamma.logout();
							   break;
				}
			});
		}
	}

	function onAboutPopupClose(){
		if(about_popup != undefined && about_popup != null)
		{
			about_popup.closePopup();
			about_popup.clearMemory();
			about_popup = null;
		}
		e.unSubscribe('ABOUT_POPUP_CLOSE');
		e.disablePlugin(['popup']);
	}

	function aboutGammaPopup() {
        if($('.popup_container').length > 0)
			$('.popup_container').remove();
		about_popup    			= new e.popup({width:700,height:420,default_state:1,style:{popup_content:{padding:28}},notify:{onPopupClose:'ABOUT_POPUP_CLOSE'}});
	    var popup_title_data 	= $('<div/>',{class:'popup_title_data float_left h3 semibold text_transform_capitalize'});

	    var popup_data 			= $('<div/>',{class:'popup_data about_popup'});
	    var roated_div			= $('<div/>',{class:'roated_div'});
	    var popup_content		= $('<div/>',{class:'popup_content'});

	    var logo_container	= $('<div/>',{class:'logo_container'});
	    var logo			= $('<div/>',{class:'logo float_left margin_right_10'});
	    //var sub_logo			= $('<div/>',{class:'sub_logo float_left h3 semibold'}).html('Developer Edge <sup>&reg;</sup>');
		var popup_label = $('<div/>', { class: 'popup_label h4 stroke_dark bold ' }).html("Version " + gamma.gamma_version);
	    var popup_content_text	= $('<div/>',{class:'popup_content_text h4 stroke_dark'}).html(" @ 2016-2019 Acellere GmbH.<br/> All rights reserved.");
	    var company_logo_wraper	= $('<div/>',{class:'company_logo_wraper float_right'});
	    var company_logo	= $('<div/>',{class:'company_logo float_right'});
		var company_address = $('<div/>', {
		    class: 'company_address float_right p'
		}).html("Acellere GmbH<br/>Bockenheimer Landstrasse 51 - 53<br/>60325 Frankfurt a. M.<br/> Germany");
		e.renderIcon(logo,"gamma_logo");
	    e.renderIcon(company_logo,"new_logo_acellere");
		$(".popup_container").addClass("about_popup_container");
		$(".popup_container.about_popup_container .popup_close_btn").attr('id', 'popup_close_button');

		popup_data.append(roated_div);
		$(".popup_title_container").removeClass("stroke_bottom").css("padding","5px 15px 0px 28px");
		$(".close_icon #close line").css({"stroke-width":"11px"});


		logo_container.append(logo);
		//logo_container.append(sub_logo);
		company_logo_wraper.append(company_logo);
		popup_content.append(logo_container,popup_label, popup_content_text,company_logo_wraper,company_address);

	    $(".popup_container").css({"background-color":"#FF6C74",'overflow': 'hidden'});
	   	popup_data.append(popup_content);
	    about_popup.addContent(popup_data);
	    about_popup.openPopup();
    }

	function toggleRightMenuList(event)
	{
		event.stopPropagation();
		var parent  			= $('header');
		var right_menuList  	= $('.right_menu_list');
		var available_height 	= $(window).height() - $('header').height() - 50;
		var notification_width  = 0;
		if(!$('.notification').hasClass('hide'))
			notification_width = $('.notification').outerWidth(true);
		var targetWidth 		= $('.search_click').outerWidth(true) + $('.menu_click').outerWidth(true) + notification_width + ($('.tab').outerWidth(true) * 2) + 1;
	    var targetHeight 		= parent.outerHeight();
	    var pos          		= $(event.currentTarget).offset();
	    right_menuList.width(targetWidth - 2);
	    right_menuList.css('right',0);
	   	right_menuList.css('top',pos.top+targetHeight);
	    right_menuList.css('max-height',available_height);

		if(right_menuList.hasClass('hide'))
		{
			right_menuList.slideDown(300,function(){
		    	$(this).removeClass('hide');
		    });
		}
		else
			gamma.closeRightMenu(event);
	}

	function createRightMenuList() {
		var right_menu_list_data;
		if(gamma.hasRole('Account administrator') && gamma.is_primary)
			right_menu_list_data = [{ id: 'company', name: 'account' }, { id: 'users', name: 'admin' }, { id: 'about_gamma', name: 'about_gamma' }, { id: 'gamma_help', name: 'gamma_help' },{id:'log_out',name:'log_out'}];
		else if(gamma.hasRole('Account administrator') || gamma.hasRole('Project administrator') || gamma.hasRole('User administrator') || gamma.hasRole('Manager') || gamma.hasRole('Analyser'))
			right_menu_list_data = [{ id: 'company', name: gamma.user_name }, { id: 'users', name: 'admin' }, { id: 'about_gamma', name: 'about_gamma' }, { id: 'gamma_help', name: 'gamma_help' },{id:'log_out',name:'log_out'}];
		else
			right_menu_list_data 	= [{id:'company',name:gamma.user_name},{id:'about_gamma',name:'about_gamma'},{id:'log_out',name:'log_out'}];
		var right_menu_list 		= $('<div/>',{class:'right_menu_list unselectable hide fill_base padding_top_10 padding_bottom_10'});
		var selected,border_class = '';
		for(var i = 0 ; i < right_menu_list_data.length ; i++)
		{
			/*if(i != 0)
				border_class = 'line_top_solid stroke_color_20'*/
			var right_menu_item 	= $('<div/>',{class:'right_menu_item float_left padding_1 hand_cursor'});
			right_menu_item.attr('data-id',right_menu_list_data[i].id);
			right_menu_item.attr('data-name',right_menu_list_data[i].name);
			var right_menu_item_inner 		= $('<div/>',{class:'right_menu_item_inner padding_left_20 padding_right_20 float_left'});
			var right_menu_icon 			= $('<div/>',{class:'right_menu_icon float_left margin_top_10'});
			var right_menu_icon_selected 	= $('<div/>',{class:'right_menu_icon_selected float_left margin_top_10 hide'});
			if(right_menu_list_data[i].id == 'company')
			{
				right_menu_icon.addClass('account_image');
				if(gamma.user_image !== '' && gamma.user_image !== undefined && gamma.user_image != 'undefined')
				{
					var serverPath =  (gamma.user_image).replace(/\\\\|\\/g,"/");
					var path_array = (serverPath).split('/');
					path_array.shift();
					var path = path_array.join('/');
					right_menu_icon.css('background-image', 'url(' + path + ')');
				}
			}
			else
			{
				e.renderIcon(right_menu_icon,right_menu_list_data[i].name);
				e.renderIcon(right_menu_icon_selected,right_menu_list_data[i].name+'_selected');
			}
			var text_data 		= gamma.print(right_menu_list_data[i].name);
			if(right_menu_list_data[i].id == 7)
				text_data 		= gamma.print(right_menu_list_data[i].name); //+' '+gamma.gamma_version;
			var right_menu_text 	= $('<div/>',{class:'right_menu_text float_left ellipsis language_text h4 color_medium margin_left_20 text_transform_capitalize'}).html(text_data);
			right_menu_text.attr('data-language_id',gamma.print(right_menu_list_data[i].name));
			right_menu_item_inner.append(right_menu_icon,right_menu_icon_selected,right_menu_text);
			right_menu_item.append(right_menu_item_inner);
			right_menu_list.append(right_menu_item);
		}
		$('body').append(right_menu_list);
		$('.right_menu_list .right_menu_item').on('click',function(event) {
			event.stopPropagation();
			onRightMenuItemClick($(this).attr('data-id'));
		});
		if($(".BCarrowico").hasClass("clicked")){
			$("ul.subnav").slideUp('fast');
			$(".BCarrowico").children().children().attr({'transform':'rotate(0, 6, 6)'});
		}
	}


	function removeRightMenuList() {
	}

	//---------------- Public methods -----------------
	gamma.openRightMenu = function(event) {

		if($('.search_wrapper').width() > 0)
			gamma.closeSearchBox(event);
		gamma.removeSortList();
		$('.menu_click').addClass('fill_base stroke_left stroke_light').height('40px');
		$('.selected_tab').height('29px');
		if($('.right_menu_list').length == 0)
			createRightMenuList(event);
		toggleRightMenuList(event);
	};
	gamma.closeRightMenu = function(event) {
		event.stopPropagation();
		$('.menu_click').removeClass('fill_base stroke_left stroke_light').height('39px');
		$('.selected_tab').height('30px');
		var right_menuList  	= $('.right_menu_list');
		right_menuList.slideUp(300,function(){
			 right_menuList.remove();
		});
	};
	gamma.handleRightMenuEvents = function() {
		$(document).on('click',function(event) {
			if($('.right_menu_list').length > 0)
				gamma.closeRightMenu(event);
		});

		$('.menu_click').on('click',function(event) {
			gamma.openRightMenu(event);
		});
	};
	gamma.loadManagementModeFromHistory = function(clicked_element) {
		onRightMenuItemClick(clicked_element);
	};
	gamma.aboutGammaPopup = function(){
		aboutGammaPopup();
	};;
	gamma.onAboutPopupClose = function () {
		onAboutPopupClose();
	}
	return gamma;
}(g));
