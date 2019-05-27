
var g = (function (gamma) {
    //---------------- Private methods ----------------

    //--------------Left plugin items to be added -----------------
	var leftPlugins = [
        /*  {name: 'ic-home', alignment: 'top', title: 'Dashboard', plugin_mapping: "dashboard"},  */
        {name: 'ic-projects', alignment: 'top', title: 'Projects', plugin_mapping: "project_list"},
        // {name: 'ic-issues', alignment: 'top', title: 'Issues', plugin_mapping: "issue_list"},
        /* {name: 'ic-teams', alignment: 'top', title: 'Teams', plugin_mapping: "team_list"}, */
        //{name: 'ic-tasks', alignment: 'top', title: 'Tasks', plugin_mapping: "task_list"},
        { name: 'ic-scan', alignment: 'top', title: 'Scan Queue', plugin_mapping: "analysis_queue" },
        { name: 'ic-help', alignment: 'bottom', title: 'Help', plugin_mapping: "gamma_help" },
        {name: 'ic-admin', alignment: 'bottom', title: 'Admin', plugin_mapping: "admin_details"},
        {name: 'ic-profile', alignment: 'bottom', title: 'Profile', plugin_mapping: "company"},
        {name: 'ic-logout', alignment: 'bottom', title: 'Logout', plugin_mapping: "logout"}
	];
	var obj_tree={}, leftPanelUserToggle= false;
	var callBreadcrumbresize;
    //------------------ subscriptions ---------------------

    //---------------- Private methods -----------------

    //--------------load left panel and add elements to it-----------------
	function loadLeftPanel() {
		var itemName, itemAlignment, element, elementInnerWraper, elementText, elementLabel;

        //if user is explorer then he should not see admin panel on stagings
		if (gamma.is_cloud && !gamma.hasRole('ACCOUNT_ADMINISTRATOR') && !gamma.hasRole('PROJECT_ADMINISTRATOR') && !gamma.hasRole('USER_ADMINISTRATOR')) {
			leftPlugins = leftPlugins.filter(d => (d.name != 'ic-admin'));
		}

		if(!gamma.hasPermission('RUN_SCAN')) {
			leftPlugins = leftPlugins.filter(d => (d.name != 'ic-scan'));
		}

		$.each(leftPlugins, function (i, item) {
			itemName = item.name;
			itemAlignment = item.alignment;
			elementText = item.title;
			element = $('<div/>', { class: ' left-menu-icon ' });
			elementInnerWraper = $('<div/>', { class: ' left-menu-icon-inner ' + itemName, title: elementText });
			elementLabel = $('<div/>', { class: 'left-menu-label' }).html(elementText);
			elementInnerWraper.append(elementLabel);
			element.append(elementInnerWraper);
			switch (itemAlignment) {
			case 'top':
				$(".left-menu-top-aligned").append(element);
				break;
			case 'bottom':
				$(".left-menu-bottom-aligned").append(element);
				break;
			default:
				break;
			}
		});

        // append intercom
		if(gamma.is_cloud) {
			$(".left-menu-bottom-aligned .left-menu-icon:last-child").before('<div class="left-menu-icon"><div class="left-menu-icon-inner ic-message ic-intercom-chat" title="Chat"><div class="left-menu-label">Chat</div></div></div>');
		}

		$(".left-menu-view-selection .ic-projects").parent().addClass('left-menu-active-item');

		var leftMenuPanelWidth = 0;
		if (!$('.left-menu-panel-container').hasClass('hidden')) {
			leftMenuPanelWidth = $('.left-menu-panel-container').width();
		}
		$('.gamma-wraper').width($(window).width() - $(".left-menu-bar").width() - leftMenuPanelWidth);
		$('.left-menu-bar, .left-menu-panel-container,.left-menu-view-selection').height($(window).height());
		manageLeftPanelView();
	}
	function manageLeftPanelView(){
		if ($(window).width() > 1800 && !leftPanelUserToggle) {
			$('.left-menu-bar').addClass("left-menu-panel-expanded");
			$('.left-menu-bar').removeClass("left-menu-panel-collapsed");
			$('.left-menu-bar').css({ 'width': '11em' });
			$(".logo-container i ").addClass('ic-gamma-wordmark').removeClass('ic-gamma-logo');
			$(".left-panel-toggle-btn").addClass('ic-chevron-left').removeClass('ic-chevron-right');
		} else {
			if (!leftPanelUserToggle){
				$('.left-menu-bar').removeClass("left-menu-panel-expanded");
				$('.left-menu-bar').addClass("left-menu-panel-collapsed");
				$('.left-menu-bar').css({ 'width': '4em' });
				$(".logo-container i").addClass('ic-gamma-logo').removeClass('ic-gamma-wordmark');
				$(".left-panel-toggle-btn").addClass('ic-chevron-right').removeClass('ic-chevron-left');
			}
		}
	}

	function animateMainPanel(width, timer){
		var optionsHolder = $('.gamma-wraper').find('.options_holder');
		var options_width = optionsHolder.outerWidth(true);
		if (optionsHolder.hasClass('hidden')) {
			options_width = 0;
		}
		var width_options = { 'action': 'close' };
		if ($('.search_wrapper').width() != 0){
			width_options.action='open';
		}
		TweenMax.to($('.gamma-wraper'),.3,{width:$(window).width() - width, ease:Power3.easeOut});
		$('.emulsion_panel').animate({ width: $(window).width() - width - $('.tree-panel-container').width() }, timer-110, 'swing', function () {
			e.notify(g.notifications.RESIZE_BREADCRUMB, width_options);
		});
		$('.content_holder, .content_and_header_wraper').animate({ width: $(window).width() - width - $('.tree-panel-container').width() - options_width }, timer-100, 'swing');
		setTimeout(function () {
			$(window).resize();
			$(".left-panel-toggle-btn").css("pointer-events","auto");
		}, 600)

	}

	function completeTween(collapse=false){
		var width_options = { 'action': 'close' };
		if ($('.search_wrapper').width() != 0) {
			width_options.action = 'open';
		}

		if (callBreadcrumbresize){
			e.notify(g.notifications.RESIZE_BREADCRUMB, width_options);
		}
		callBreadcrumbresize=false;
		if(collapse){
			$(".logo-container i").removeClass('ic-gamma-wordmark').addClass('ic-gamma-logo');
			$('.left-menu-bar').toggleClass("left-menu-panel-collapsed");
			$('.left-menu-bar').toggleClass("left-menu-panel-expanded");
		}
	}

	function handleHeaderEvents() {

		$(".left-panel-toggle-btn").on("click", function(){
			leftPanelUserToggle= true;
			callBreadcrumbresize=true;

			if ($('.left-menu-bar').hasClass('left-menu-panel-collapsed')) {
				TweenMax.to($('.left-menu-bar'),.3,{width:'11em', ease:Power3.easeOut,onComplete:completeTween});
				TweenMax.to($(this),.3,{rotation:180});
				animateMainPanel(176,300);
				$(".logo-container i").addClass('ic-gamma-wordmark').removeClass('ic-gamma-logo');
				$('.left-menu-bar').toggleClass("left-menu-panel-collapsed");
				$('.left-menu-bar').toggleClass("left-menu-panel-expanded");
			} else{
				TweenMax.to($('.left-menu-bar'),.3,{width:'4em', ease:Power3.easeOut,onComplete:completeTween,onCompleteParams:[true]});
				TweenMax.to($(this),.3,{directionalRotation:"0_cw"});
				animateMainPanel(64,200);
			}

		})





        //--------------Gamma root plugin selections like project, teams, issues, tasks-----------------
		$('.left-menu-view-selection .ic-home,.left-menu-view-selection .ic-projects, .left-menu-view-selection .ic-teams, .left-menu-view-selection .ic-issues, .left-menu-view-selection .ic-tasks').on('click', function () {

			$('.panel_header').css('display', 'block');
			e.unSubscribe(g.notifications.PLUGIN_LOADED);
			e.unSubscribe(g.notifications.RESIZE_BREADCRUMB);
			e.unSubscribe(g.notifications.SNAPSHOT_BREADCRUMB_UPDATE);

			gamma.sendBreadcrumbNotification = true;
			historyManager.set('currentContext', 'root');
			var selectedClassName = $(this).attr("class").match(/ic-[\w-]*\b/)[0];
			var plugin_name=  _.find(leftPlugins, function (item) {
				return item.name == selectedClassName;
			});
			gamma.setPluginHistory(plugin_name.plugin_mapping);
			e.changeMode('explorer');
			e.notify(g.notifications.PLUGIN_UPDATE);
			gamma.breadcrumbLoaded = false;
			$("#plugin_selector").hide();
			$(document).attr('title', 'Gamma - : ' + i18next.t("common.plugin_title.project_list"));
		});

		$(window).resize(function () {

			manageLeftPanelView();
			$('.left-menu-bar').height($(window).height());

			$('.left-menu-bar, .left-menu-panel-container,.left-menu-view-selection').height($(window).height());
			var leftMenuPanelWidth = 0;
			if (!$('.left-menu-panel-container').hasClass('hidden')) {
				leftMenuPanelWidth = $('.left-menu-panel-container').width();
			}
			$('.gamma-wraper').width($(window).width() - $(".left-menu-bar").width() - leftMenuPanelWidth);
			if($(window).width()<=1100){
				$('.left-menu-bar').removeClass("left-menu-panel-expanded");
				$('.left-menu-bar').addClass("left-menu-panel-collapsed");
				$('.left-menu-bar').css({ 'width': '4em' });
				$(".logo-container i").addClass('ic-gamma-logo').removeClass('ic-gamma-wordmark');
				$(".left-panel-toggle-btn").addClass('ic-chevron-right').removeClass('ic-chevron-left');
			}
		});

        //--------------To open tree-----------------
		$('header #tree-icon-container').on('click', function () {
			$('.tree-panel-container').hasClass('hidden') ? $('.tree-panel-container').removeClass('hidden') : $('.tree-panel-container').addClass('hidden');
			$(this).toggleClass('active');
            //$(".tree-panel-container").toggleClass('hidden');
			var treePanelWidth = 0;
			if (!$('.tree-panel-container').hasClass('hidden')) {
				treePanelWidth = $('.tree-panel-container').width();
			}

			if($(this).hasClass('active')){
				if ((historyManager.get('currentNode') != historyManager.get('currentBreadcrumb').id) || ($('.tree-panel-container').has('.tree_container').length == 0)) {
					$(".tree-panel-container").html('');
					obj_tree = {};
					obj_tree = new gamma.tree();
					obj_tree.initPlugin($(".tree-panel-container"));
				}
			}
			var totalWidth = $(window).width() - $(".left-menu-bar").width() - treePanelWidth;
			$('.emulsion_panel').animate({ width: totalWidth }, 400, 'swing');
			var optionsHolder = $('.gamma-wraper').find('.options_holder');
			var options_width = optionsHolder.outerWidth(true);
			if (optionsHolder.hasClass('hidden')){
				options_width = 0;
			}
			$('.content_holder, .content_and_header_wraper').animate({ width: $(window).width() - $(".left-menu-bar").width() - treePanelWidth - options_width }, 400, 'swing');
			setTimeout(function(){
				$(window).resize();
			},600);
		});

        // //--------------to open help page-----------------
		// $(".left-menu-view-selection .left-menu-icon  .left-menu-icon-inner.ic-help").on("click", function (event) {
		// 	event.stopImmediatePropagation();
		// 	window.open('https://help.mygamma.io');
		// 	gamma.set_mixpanel_event("Views reference doc ", gamma.mixpanel_uid);
		// });

		//--------------to open help page-----------------
		// $(".userHelpClick").on("click", function (event) {
		// 	event.stopImmediatePropagation();
		// 	window.open('https://help.mygamma.io');
		// 	gamma.set_mixpanel_event("Views reference doc ", gamma.mixpanel_uid);
		// });

		//--------------to open userlane assistant or help page-----------------
		if(gamma.is_cloud) {
			helpPopUp();
		} else {
			$(".left-menu-view-selection .left-menu-icon  .left-menu-icon-inner.ic-help").on("click", function (event) {
				event.stopImmediatePropagation();
				window.open('https://help.mygamma.io');
				gamma.set_mixpanel_event("Views reference doc ", gamma.mixpanel_uid);
			});
		}
        //--------------to toggle the icon selection view-----------------
		$(".left-menu-view-selection .left-menu-icon .left-menu-icon-inner").on("click", function () {
			$(".left-menu-view-selection .left-menu-icon ").removeClass("left-menu-active-item");
			$(this).parent().addClass("left-menu-active-item");
			gamma.removeDropDownList();
			e.removeComboBox();
		});
		$(".left-menu-view-selection .left-menu-icon-inner").on("click", function(){
			gamma.hideTreePanel();
			if ($('.menu_option_list_wraper'.length)) {
				$('.menu_option_list_wraper').remove();
			}
		});
        //--------------analysis event binding to open analysis view. Later need to change it to analyis panel which commmented-----------------
		$(".left-menu-view-selection .ic-scan").on("click", function () {
			e.changeMode('management');
			gamma.pushHistory('admin_details', '', '', { 'default_parameter': 'analysis_queue', 'breadcrumb': "analysis_queue" }, 'management');
			gamma.admin.left_menu.loadAdminDetails('analysis_queue', true);
			$(document).attr('title', 'Gamma - : ' + i18next.t("admin.analysis_queue"));

			$('#content .left_container').hide();
			$('header').addClass('hide');
            // $('#content .details_container').show().html('');
		});

        //--------------admin event binding to open profile view-----------------
		$(".left-menu-view-selection .ic-profile").on("click", function () {
			$("header").removeClass('hide');
			e.changeMode('management');
			gamma.pushHistory('user_details', '', '', { 'user_id': gamma.user_id, 'user_name': gamma.user_name, 'breadcrumb': 'company', 'prefix': 'account' }, 'management');
			gamma.admin.account.account_details.loadAccountDetails(gamma.user_id);
			$(document).attr('title', 'Gamma - ' + i18next.t("admin.account.user_details"));
		});
        //--------------admin event binding to open admin view-----------------
		$(".left-menu-view-selection .ic-admin").on("click", function () {
			$("header").removeClass('hide');
			e.changeMode('management');
			if (gamma.hasRole('ACCOUNT_ADMINISTRATOR') || gamma.hasRole('USER_ADMINISTRATOR')) {
				gamma.pushHistory('admin_details', '', '', { 'default_parameter': 'users', 'breadcrumb': "users" }, 'management');
				gamma.admin.left_menu.loadAdminDetails('users', true);
				$(document).attr('title', 'Gamma - ' + i18next.t("common.page_title.admin_details") + ' : ' + i18next.t("admin.users"));
			} else if (gamma.hasRole('PROJECT_ADMINISTRATOR')) {
				if (!gamma.is_trial){
					gamma.pushHistory('admin_details', '', '', { 'default_parameter': 'version_control', 'breadcrumb': "version_control" }, 'management');
					gamma.admin.left_menu.loadAdminDetails('version_control', true);
					$(document).attr('title', 'Gamma - ' + i18next.t("common.page_title.admin_details") + ' : ' + i18next.t("admin.version_control"));
				}else{
					gamma.pushHistory('admin_details', '', '', { 'default_parameter': 'repositories', 'breadcrumb': "repositories" }, 'management');
					gamma.admin.left_menu.loadAdminDetails('repositories', true);
					$(document).attr('title', 'Gamma - ' + i18next.t("common.page_title.admin_details") + ' : ' + i18next.t("admin.repositories"));
				}
			}else{
				gamma.pushHistory('admin_details','','',{'default_parameter':'access_tokens','breadcrumb':''},'management');
					gamma.admin.left_menu.loadAdminDetails('access_tokens', true);
					$(document).attr('title', 'Gamma - ' + i18next.t("common.page_title.admin_details") + ' : ' + i18next.t("admin.access_tokens"));
			}
		});
        //--------------gamma logo event binding to open gamma about popup-----------------
		$(".logo-container").on("click", function () {
			gamma.aboutGammaPopup();
		});

        //--------------logout event binding for logout-----------------
		$(".left-menu-view-selection .ic-logout").on("click", function () {
			gamma.logout();
		});

        /*$('#logo').on('click',function() {
            gamma.sendBreadcrumbNotification = true;
            historyManager.set('currentContext','systems');
            gamma.setPluginHistory('dashboard');
            e.changeMode('explorer');
            e.notify(g.notifications.PLUGIN_UPDATE);
        })*/
	}
    //--------------------select left panel icon on browser back or refresh--------------
	function selectLeftPanelIcon(history_view) {
       //when no plugin_id found in history_view
       /* if (!history_view.plugin_id) {
            history_view.plugin_id = "project_list";
            $('.left-menu-bar .ic-projects').click();
        }*/
		var selectedItem = _.find(leftPlugins, function (item) {
			return item.plugin_mapping == history_view.plugin_id;
		});

		if (_.contains(["company", "edit_account_details", "admin_details", "project_details", "subsystem_details", "user_details", "kpi_details", "version_control_details", "analysis_queue_details"], history_view.plugin_id)) {
			if (history_view.request_data.breadcrumb == "analysis_queue") {
				selectedItem = _.find(leftPlugins, function (item) {
					return item.plugin_mapping == 'analysis_queue';
				});
			}		else if (history_view.request_data.breadcrumb == "company")	{
				selectedItem = _.find(leftPlugins, function (item) {
					return item.plugin_mapping == 'company';
				});
			}	else {
				selectedItem = _.find(leftPlugins, function (item) {
					return item.plugin_mapping == "admin_details";
				});
			}
		} else if (_.contains(["subsystems", "systems", "modules", "components","files"], historyManager.get("currentContext")) ){

			selectedItem = _.find(leftPlugins, function (item) {
				return item.plugin_mapping == "project_list";
			});
		}
        /*else if (history_view.request_data.breadcrumb == "analysis_queue" ){

            selectedItem = _.find(leftPlugins, function (item) {
                return item.plugin_mapping == 'analysis_queue';
            });
        }*/
		$(".left-menu-view-selection .left-menu-icon ").removeClass("left-menu-active-item");
		$(".left-menu-view-selection ." + selectedItem.name).parent().addClass("left-menu-active-item");
	}

	function setLeftPanelActiveElement(element){
		$(".left-menu-view-selection .left-menu-icon ").removeClass("left-menu-active-item");
		var plugin_obj = _.findWhere(leftPlugins, { plugin_mapping: element });
		var plugin_class = plugin_obj.name;
		$("." + plugin_class).parent().addClass("left-menu-active-item");
	}
	// to open help link or userlane popup
	function helpPopUp(){
		var popupHoverContent = `<div class="userlaneWrapper"><ul>
			<li class="userlaneClick">Gamma Quick Start<div class="help-description user-lane">Need Help? Learn how to use Gamma quickly</div></li>
			<li class="userHelpClick">Gamma Help Center<div class="help-description user-help">Stuck? Use our help center</div></li>
		</div>`;
		$(".left-menu-view-selection .left-menu-icon .left-menu-icon-inner.ic-help").webuiPopover({
			content: popupHoverContent,
			placement: "bottom-right",
			trigger: 'hover',
			animation: 'pop',
			onShow: function() {
				$('.webui-popover-inner').addClass("userHelpPopover");
				$('.webui-popover-content').css({'padding-left':'0','padding-right':'0'});
				$('.help-description').hide();
				$(".userlaneClick").off("click").on("click",function(){
					gamma.userRoleBasedLanes(false);
					Userlane('openAssistant');
					
				});
				$(".userHelpClick").on("click", function (event) {
					event.stopImmediatePropagation();
					window.open('https://help.mygamma.io');
					gamma.set_mixpanel_event("Views reference doc ", gamma.mixpanel_uid);
				});
				$('.userlaneClick, .userHelpClick').hover(function(){
					$('.help-description').hide();
					$(this).find('.help-description').show();
				});
				$('.userHelpPopover').hover(function(){
					$('.help-description').hide();
				});
			}
		});
	}
	
    //---------------init left panel -----------------
	function leftPanelInit() {
		loadLeftPanel();
		handleHeaderEvents();
	}
    //---------------- Public methods -----------------
	gamma.leftPanelInit = function () {
		leftPanelInit();
	};
	gamma.selectLeftPanelIcon = function (history_view) {
		selectLeftPanelIcon(history_view);
	};
	gamma.setLeftPanelActiveElement = function (element) {
		setLeftPanelActiveElement(element);
	};

	return gamma;

}(g));
