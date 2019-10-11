
/*jshint sub:true*/
(function(g){
    g.componentList = function() {

        //-----fdfgdf----- PRIVATE VARS -----------
		var PATH_COMPONENTLIST = '/views/repositories/'+historyManager.get('currentSubSystemUid')+'/list/components';
		var availbale_list_height,componentList,list_current_count,list_current_page,records_per_page,checked_params,sort_parameter,hasError,total_list_results,total_list_pages,componentlistStepper,currentComponentListFilterId,selectedRadio;
        var request_params  	= {};
        var settings  			= {};
        var plugin_options  	= {};
        var sortTypes 			= {'types':['value_asc','value_desc']};
        var componentListFilter = {"category":['ratings','metrics','duplication'],"status":['all','criticalHotspots','highHotspots','mediumHotspots','notHotspots']};
        // var emulsion_plugins = ['dropDown','radioGroup','checkbox','numericStepper'];
        var panel_holder;

        //------------ PLUGIN SUBSCRIPTIONS ------------------
        e.subscribe('LOAD_LIST_PAGE',onStepperClick);
        e.subscribe('PARAMETER_CHECK',onParameterCheck);
       	e.subscribe('SORT_RADIO_SELECT',onSortSelect);
        e.subscribe('DROPDOWN_CLICK',onFilterSelect);
        e.subscribe('LEFT_SIDEBAR_TOGGLED',removeSortList);

        //---------- PRIVATE METHODS ------------

        //---------- INITIALIZE -------------
        function init(holder) {
        	panel_holder = holder;
	       	list_current_count 	= 0;
	        list_current_page 	= 1;
			records_per_page 	= 20;
			checked_params 		= '';
			sort_parameter 		= '';
			hasError 			= false;

			//these filters will be seen only if thr are more that 1 snapshots
			if ((g.getSnapshotList()).length > 1) {
				componentListFilter.status.push('hotspots_added');
				componentListFilter.status.push('hotspots_deleted');
				componentListFilter.status.push('new');
				componentListFilter.status.push('old');
			}
			$(".plugin_container.plugin_componentList").remove();
			var plugin_container = $('<div/>', { class: 'plugin_container plugin_componentList float_left unselectable' });
			panel_holder.append(plugin_container);
			panel_holder.css('overflow', 'auto');
			getComponentListData();
		}

		function clearMemory() {
			/*-------- REMOVING EVENTS ------*/
			if ($('.dropDown_list').length > 0){
				$('.dropDown_list').remove();
			}
			$(window).off('resize.componentList');
			$('.componenlist_dropdown').off('click');
			$('.dropDown_list .list_data').off('click hover');
			$('.list_header').off('click');
			$(document).off('click.componentList');
			$('.list_row').off('click hover');
			if (panel_holder !== null && panel_holder !== undefined){
				panel_holder.off('scroll.componentList');
			}
			$('.componentlist_pagination').remove();
			$('.panel_header .export_header').remove();
			$(".parameter_wrapper").off('scroll.componentList');
			e.unSubscribe('LOAD_LIST_PAGE');
			e.unSubscribe('PARAMETER_CHECK');
			e.unSubscribe('SORT_RADIO_SELECT');
            e.unSubscribe('DROPDOWN_CLICK');
            e.unSubscribe('LEFT_SIDEBAR_TOGGLED');
		}

		//----------GET componentLIST DATA
		function getComponentListData() {
			if ($('.popup_container').length > 0){
				$('.popup_container').remove();
			}
			if (historyManager.get('currentComponentParameterList') !== ''){
				checked_params = historyManager.get('currentComponentParameterList');
			}
			if (g.loadFromHistory) // if browser back button or refresh is clicked, get data from history
			{
				//var currentHistoryState = $.bbq.getState();
				var currentHistoryState = g.decodeURL(window.location.hash);
				if (!($.isEmptyObject(currentHistoryState))) {
					settings = currentHistoryState.request_data;
					//setting localstorage history values as per browser parameters
					historyManager.set('currentComponentParameter', $.parseJSON(settings.selected_sort_parameter));
					sort_parameter = historyManager.get('currentComponentParameter');

					var history_parameter_list = $.parseJSON(settings.checked_parameters);

					checked_params.selected = history_parameter_list.selected;
					checked_params.type = history_parameter_list.type;
					checked_params.status = history_parameter_list.status;
					checked_params[checked_params.selected] = [];
					for (var i = 0; i < currentHistoryState.plugin_options[checked_params.selected].length; i++) {
						(checked_params[checked_params.selected]).push(parseInt(currentHistoryState.plugin_options[checked_params.selected][i]));
					}
					checked_params.ruletypeid = history_parameter_list.ruletypeid;
					checked_params.ruletypename = history_parameter_list.ruletypename;
					checked_params.metricid = history_parameter_list.metricid;
					checked_params.hotspottype = history_parameter_list.hotspottype;
					checked_params.codeissuetype = history_parameter_list.codeissuetype;
					checked_params.codeissuename = history_parameter_list.codeissuename;
					checked_params.showAllComponents = history_parameter_list.showAllComponents;
					checked_params.showImmediateComponents = history_parameter_list.showImmediateComponents;
					checked_params.showDuplicateComponents = history_parameter_list.showDuplicateComponents;
					historyManager.set('currentComponentParameterList', checked_params);

					currentComponentListFilterId = historyManager.get('currentComponentListFilterId');
					currentComponentListFilterId[checked_params.selected] = history_parameter_list[checked_params.selected];
					historyManager.set('currentComponentListFilterId', currentComponentListFilterId);

					list_current_count = parseInt(settings.start_index);
					list_current_page = parseInt(list_current_count / records_per_page) + 1;
					g.loadFromHistory = false;
				}
			}
			else // else push data to history
			{
				var obj = {};
				if (historyManager.get('currentComponentListFilterId') === '') {
					obj = {};
					switch (checked_params.selected){
						case 'ratings' :
							obj[checked_params.selected] = g.getParameterObjectByName('overallRating', checked_params.selected).id;
							break;
						case 'metrics' :
							obj[checked_params.selected] = g.getParameterObjectByName('LOC', checked_params.selected).id;
							break;
						case 'duplication' :
							obj[checked_params.selected] = g.getParameterObjectByName('clone_loc', checked_params.selected).id;
							break;
						default:
							break;
					}


					historyManager.set('currentComponentListFilterId', obj);
				}
				currentComponentListFilterId = historyManager.get('currentComponentListFilterId');

				if (historyManager.get('currentComponentParameter') === '') {
					var sort_object = {};
					sort_object.parameter_id = parseInt(currentComponentListFilterId[checked_params.selected]);
					if (checked_params.selected == 'ratings'){
						sort_object.sort_type = 'value_asc';
					}
					else{
						sort_object.sort_type = 'value_desc';
					}
					historyManager.set('currentComponentParameter', sort_object);
				}
				sort_parameter = historyManager.get('currentComponentParameter');

				if (checked_params.showAllComponents === undefined) {
					checked_params.showAllComponents = true;
				}

				if (checked_params.showImmediateComponents === undefined){
					checked_params.showImmediateComponents = false;
				}

				if (checked_params.showDuplicateComponents === undefined){
					checked_params.showDuplicateComponents = false;
				}

				if (checked_params.showAllComponents) {
					checked_params.metricid = '';
					checked_params.ruletypeid = '';
					if (checked_params.ruletypename != "duplication") {
						checked_params.ruletypename = '';
					}
					checked_params.status[0] = '';
					checked_params.hotspottype = [""];
					checked_params.codeissuetype = '';
					checked_params.codeissuename = '';
				}
				if (g.isPartialLanguage()) {
					checked_params.ratings = (checked_params.ratings).filter(d => d != (g.getParameterObjectByName('antipatternrating', 'ratings').id));
				}

				if (g.isPartialLanguage()) {
					var metricsColValue = ["CBO", "NOA", "NOM", "RFC", "DOIH", "ATFD", "LCOM", "NOPA", "Complexity"];
					var arrayLength = metricsColValue.length;
					for (var i = 0; i < arrayLength; i++) {
						checked_params.metrics = (checked_params.metrics).filter(d => d != (g.getParameterObjectByName(metricsColValue[i], 'metrics').id));
					}
				}

				historyManager.set('currentComponentParameterList', checked_params);

				//----------- Set parameters to be sent with request -------------------
				request_params = {};
				request_params.selected = checked_params.selected;
				request_params[checked_params.selected] = currentComponentListFilterId[checked_params.selected];
				request_params.type = checked_params.type;
				request_params.status = checked_params.status;
				request_params.ruletypeid = checked_params.ruletypeid;
				request_params.ruletypename = (checked_params.ruletypename) ? checked_params.ruletypename : '';
				request_params.metricid = checked_params.metricid;
				request_params.hotspottype = checked_params.hotspottype;
				request_params.codeissuetype = checked_params.codeissuetype;
				request_params.codeissuename = checked_params.codeissuename;
				request_params.showAllComponents = checked_params.showAllComponents;
				request_params.showImmediateComponents = checked_params.showImmediateComponents;
				request_params.showDuplicateComponents = checked_params.showDuplicateComponents;

				var snapshot_id_old = { 'id': 0 };
				if ((checked_params.status[0]).toLowerCase() == 'new' || (checked_params.status[0]).toLowerCase() == 'old' || (checked_params.status[0]).toLowerCase() == 'hotspots_added' || (checked_params.status[0]).toLowerCase() == 'hotspots_deleted') {
					if (historyManager.get('selectedSnapshots').length == 2) {
						snapshot_id_old = historyManager.get('selectedSnapshots')[1];
					}
					else {
						var index = g.searchObjectIndexById(g.getSnapshotList(), historyManager.get('selectedSnapshots')[0].id);
						snapshot_id_old = g.autoselectSnapshot(index);
					}
					request_params.hotspottype = checked_params.hotspottype = [""];
					request_params.ruletypeid = checked_params.ruletypeid = '';
					request_params.ruletypename = checked_params.ruletypename = '';
					request_params.metricid = checked_params.metricid = '';
					request_params.codeissuetype = checked_params.codeissuetype = '';
					request_params.codeissuename = checked_params.codeissuename = '';
				}
				list_current_count = (list_current_page - 1) * records_per_page;
				//these are the parameters that are sent along with request
				settings = { project_id: historyManager.get('currentSubSystem'), snapshot_id: historyManager.get('selectedSnapshots')[0].id, snapshot_id_old: snapshot_id_old.id, node_id: historyManager.get('currentBreadcrumb').id, checked_parameters: JSON.stringify(request_params), selected_sort_parameter: JSON.stringify(sort_parameter), sortTypes: JSON.stringify(sortTypes), start_index: list_current_count, count: records_per_page };
				//these are the parameters used for client side manipulations
				plugin_options = { 'ratings': checked_params.ratings, 'metrics': checked_params.metrics, 'duplication': checked_params.duplication };
				g.pushHistory('component_list', historyManager.get('currentContext'), plugin_options, settings);
			}
			if (checked_params.ruletypename != '' && checked_params.ruletypename != undefined){
				$('.panel_title .panel_title_text').html("Component List  :  " + g.print(checked_params.ruletypename) + " in " + historyManager.get('currentBreadcrumb').name);
			}
			e.loadJSON(PATH_COMPONENTLIST, listRenderer, settings, true);
		}

		function listRenderer(data, status) {
			if (status == 'success') {
				componentList = data;
				if (componentList.hasOwnProperty("message")) {
					hasError = true;
					if ($('.componentlist_pagination').length > 0){
						$('.componentlist_pagination').remove();
					}
					g.sendErrorNotification(data, PATH_COMPONENTLIST, $('.plugin_componentList'));
				}
				else {
					hasError = false;
					if ($('.plugin_option_list').length === 0){
						g.createPluginOptionList(panel_holder);
					}
					renderPluginData();
				}
			}
			else if (status == 'error') {
				hasError = true;
				$('.plugin_componentList').html('')
				if ($('.componentlist_pagination').length > 0){
					$('.componentlist_pagination').remove();
				}
				g.sendErrorNotification(data, PATH_COMPONENTLIST, $('.plugin_componentList'));
			}
		}

		//--------CREATE componentLIST-----------
		function renderPluginData() {
			var component_list = $('.plugin_componentList');
			component_list.html('');
			component_list.removeClass('plugin_not_available_error_parent');
			$('.sort_list').remove();

			var sort_list = $('<div/>', { class: 'sort_list unselectable fill_base stroke_all stroke_light text_allign_center' });
			sort_list.hide();
			component_list.append(sort_list);

			if (parseInt(componentList.total_components.value) === 0 || !componentList.components.length ||((parseInt(componentList.total_components.value) == 1) && (componentList.components[0].id === null))) {
				hasError = true;
				// var data = {status:'info',message:'No data to display',details:'No content'};
				if ($('.componentlist_pagination').length > 0){
					$('.componentlist_pagination').remove();
				}
				// g.sendErrorNotification(data,PATH_COMPONENTLIST,$('.plugin_componentList'));

				var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.oops_no_data'), details: i18next.t('common.info_description.no_content'), is_add_button: false, button_text: '', is_task_management_button: false, task_management_text: '' };
				g.error_message_view(data, $('.plugin_componentList'));

				handleEvents();
				if (historyManager.get('currentBreadcrumb').id != $('#breadcrumb .header_item:last').attr('nodeid')){
					e.notify(g.notifications.PLUGIN_LOADED);
				}
			}
			else if (!hasError) {
				total_list_results = componentList.total_components.value;
				addPagination();
				var component_table = $('<div/>', { class: 'component_table float_left ' });

				component_list.css('max-width',$(window).width() - 5);
				if (!$('.panel_header').find('.export_header').length){
					var export_header = $('<div/>', { class: 'export_header float_right hand_cursor', title: i18next.t('component_list.export_merics')});
					var export_icon = $('<div/>', { class: 'export_icon ic-download-filled float_left'});
					var export_label = $('<div/>', { class: 'export_label float_left' }).html(i18next.t('component_list.export_merics'));
					export_header.append(export_icon, export_label);
					$('.panel_header').append(export_header);
				}
				component_list.append(component_table);
				addRows();
				handleEvents();
			}
		}

		//-----------ADD PAGINATION CONTROL FOR componentLIST-------------
		function addPagination() {
			$('.componentlist_pagination').remove();
			if (!(parseInt(componentList.total_components.value) === 0 || ((parseInt(componentList.total_components.value) == 1) && (componentList.components[0].id === null)))) {
				var componentlist_pagination = $('<div/>', { class: 'componentlist_pagination float_left clear fill_light' });
				var pagination_title = $('<div/>', { class: 'pagination_title language_text float_left p text_transform_capitalize' }).html(g.print('pages'));
				pagination_title.attr('data-language_id', 'pages');
				var colon = $('<div/>', { class: 'colon p' }).html(':');
				var componentlist_stepper = $('<div/>', { class: 'componentlist_stepper float_left' });
				var page_number = $('<div/>', { class: 'page_number p' });
				var showing_div = $('<div/>', { class: 'showing_div p color_medium fill_base' });
				var showing_text = $('<div/>', { class: 'showing_text language_text float_left text_transform_capitalize' }).html(g.print('showing'));
				showing_text.attr('data-language_id', 'showing');
				var showing_value = $('<div/>', { class: 'showing_value' });
				showing_div.append(showing_text, showing_value);
				componentlist_pagination.append(pagination_title, colon, page_number, componentlist_stepper, showing_div);
				panel_holder.append(componentlist_pagination);
				e.enablePlugin('numericStepper', addListNumericStepper);
			}
		}

		function addListNumericStepper() {
			componentlistStepper = new e.numericStepper({ holder: '.componentlist_stepper', stepperType: 'componentlist', callback: { onTextChange: '' }, notify: { onTextChange: 'LOAD_LIST_PAGE' } });
			total_list_pages = Math.ceil(total_list_results / records_per_page);
			componentlistStepper.setValue(list_current_page);
			componentlistStepper.setMaxValue(total_list_pages);
			$('.page_number').html(componentlistStepper.getValue() + '/' + total_list_pages);
			$('.showing_value').html((list_current_count + 1) + " - " + (list_current_count + componentList.components.length) + " / " + total_list_results);

			if (total_list_pages <= 1) {
				$('.componentlist_pagination').css('position', 'unset');
				$('.componentlist_pagination').css('margin-left', '3.75em');
				$('.componentlist_pagination .pagination_title').hide();
				$('.componentlist_pagination .colon').hide();
				$('.componentlist_pagination .page_number').hide();
				$('.componentlist_pagination .componentlist_stepper').hide();
			}
		}
		// --------- CREATE componentLIST TABLE & ADD ROWS ---------------------------------
		function addRows() {
			var iconmap_json = { 'antipatternrating': 'design-issues', 'metricrating': 'metrics', 'clonerating': 'duplication', 'codequalityrating': 'code-quality' };
			var component_table_header = $('<div/>', { class: 'component_table_header float_left' });
			$('.component_table').append(component_table_header);
			var parameters_length = componentList.components[0].parameters.length;
			var history_selected_param_name = '';
			history_selected_param_name = (g.getParameterObjectById(sort_parameter.parameter_id, checked_params.selected).name) ? g.getParameterObjectById(sort_parameter.parameter_id, checked_params.selected).name:'risk';
			var column_width = adjustScreenSize();
			var list_header_star = $('<div/>', { class: 'list_header_star float_left' }).html(' ');
			var list_header = $('<div/>', { class: 'list_header language_text ellipsis float_left h4 color_dark stroke_all' }).html(g.print('components'));
			list_header.addClass('component_name_column');
			list_header.attr('data-language_id', 'components');

			var list_header_risk = $('<div/>', { id: 'risk', class: 'list_header hand_cursor language_text ellipsis float_left h4 color_dark stroke_all risk_column' });
			var list_header_inner = $('<div/>', { class: 'list_header_inner'});
			list_text = $('<div/>', { class: 'list_text ellipsis h4 color_dark float_left'}).html(i18next.t('component_list.risk'));
			var list_icon = $('<div/>', { class: 'list_icon float_left' });
			var temp = historyManager.get('currentComponentParameter').sort_type.split('_');
			if (temp[1] == 'asc'){
				list_icon.addClass('ic-chevron-up');
			}
			else{
				list_icon.addClass('ic-chevron-down');
			}
			list_icon.hide();

			if (history_selected_param_name.toLowerCase() == 'risk') {
				list_icon.show();
				list_header_risk.attr('data-order', historyManager.get('currentComponentParameter').sort_type);
			}
			else{
				list_header_risk.attr('data-order', 'value_asc');
			}
			list_header_inner.append(list_text, list_icon);
			list_header_risk.append(list_header_inner);
			component_table_header.append(list_header_star, list_header, list_header_risk);

			var updated_parameter_list, i, current_parameterId;
			if (checked_params.selected == 'ratings' && (componentList.components[0].parameters[0].name).toLowerCase() != 'overallrating'){
				updated_parameter_list = getUpdatedParameterList(componentList.components[0].parameters);
			}
			else{
				updated_parameter_list = componentList.components[0].parameters;
			}

			for (i = 0; i < parameters_length; i++) {
				current_parameterId = g.getParameterObjectByName(updated_parameter_list[i].name, checked_params.selected);
				if ((checked_params[checked_params.selected].indexOf(current_parameterId.id)) != -1) {
					list_header = $('<div/>', { id: updated_parameter_list[i].name, class: 'list_header hand_cursor float_left h4 color_dark text_allign_center stroke_all' });
					list_header.width(column_width);

					var list_header_inner 	= $('<div/>',{class:'list_header_inner'});
					var list_text;
					if(checked_params.selected == 'duplication' || checked_params.selected == 'metrics' || (checked_params.selected == 'ratings' && (updated_parameter_list[i].name).toLowerCase() == 'overallrating'))
					{
						list_text = $('<div/>', { class: 'list_text language_text ellipsis h4 color_dark hand_cursor float_left', title: i18next.t('component_list.title.' + updated_parameter_list[i].name) }).html(i18next.t('component_list.' + updated_parameter_list[i].name));
						list_text.attr('data-language_id',updated_parameter_list[i].name);
						list_header_inner.append(list_text);
					}
					else {
						var icon_name = (updated_parameter_list[i].name);
						var list_text_icon = $('<div/>', { class: 'list_text_icon language_text float_left h4 color_dark hand_cursor ic-' + iconmap_json[icon_name], title: i18next.t('component_list.title.'+updated_parameter_list[i].name)});
						list_text_icon.attr('data-language_id',updated_parameter_list[i].name);
						list_text = $('<div/>', { class: 'list_text language_text ellipsis h4 color_dark hand_cursor float_left', title: i18next.t('component_list.title.' + updated_parameter_list[i].name)}).html(i18next.t('component_list.'+updated_parameter_list[i].name));
						list_text.attr('data-language_id',updated_parameter_list[i].name);
						list_header_inner.append(list_text_icon,list_text);
					}
					var list_icon = $('<div/>', { class: 'list_icon float_left' });
					var temp = historyManager.get('currentComponentParameter').sort_type.split('_');
					if (temp[1] == 'asc'){
						list_icon.addClass('ic-chevron-up');
					}
					else{
						list_icon.addClass('ic-chevron-down');
					}
					list_icon.hide();

					if(history_selected_param_name.toLowerCase() == (updated_parameter_list[i].name).toLowerCase())
					{
						list_icon.show();
						list_header.attr('data-order', historyManager.get('currentComponentParameter').sort_type);
					}
					else{
						list_header.attr('data-order', 'value_asc');
					}
					list_header_inner.append(list_icon);
					list_header.append(list_header_inner);
					component_table_header.append(list_header);

					if (checked_params.selected == 'duplication' || checked_params.selected == 'metrics' || (checked_params.selected == 'ratings' && (updated_parameter_list[i].name).toLowerCase() == 'overallrating')){
						list_text.css('max-width', list_header.width() - (list_icon.width() + 10));
					}
					else{
						list_text.css('max-width', list_header.width() - (list_text_icon.width() + list_icon.width() + 10));
					}
				}
			}

			var component_table_body = $('<div/>', { class: 'component_table_body float_left' });
			availbale_list_height = $('.emulsion_panel .content_holder  ').outerHeight(true) - $('.componentlist_pagination').outerHeight(true) - $('.emulsion_panel .component_table_header').outerHeight(true) - $('.plugin_componentList').css('marginTop').replace('px', '') - 1;
			component_table_body.css('max-height', availbale_list_height);
			$('.component_table').append(component_table_body);
			var total_na_count = 0;
			for (i = 0; i < records_per_page && (list_current_count + i) < total_list_results; i++) {
				if (componentList.components[i] !== undefined) {
					var componentType = componentList.components[i].type;
					var list_row = $('<div/>', { class: 'list_row float_left' });
					var cell_color = 'fill_base';
					if (i % 2 !== 0){
						cell_color = 'fill_light';
					}
					list_row.attr('data-id', componentList.components[i].id);
					list_row.attr('data-type', componentType);
					list_row.attr('data-name', componentList.components[i].name);
					var replaced_sig = g.changeSignature(componentList.components[i].sig);
					list_row.attr('data-sig', replaced_sig);

					var list_cell_star = $('<div/>', { class: 'list_cell_star float_left fill_base' });
					if (componentList.components[i].new == "true") {
						var new_icon = $('<div/>', { class: 'new_icon float_left ' });
						e.renderIcon(new_icon, 'star');
						list_cell_star.append(new_icon);
					}
					var list_cell_component = $('<div/>', { class: 'list_cell float_left ellipsis p ' + cell_color, title: replaced_sig });
					list_cell_component.addClass('component_name_column');

					var text_margin_class = 0;
					if (checked_params.status[0] == 'old' || checked_params.status[0] == 'hotspots_deleted') {
						var deleted_icon = $('<div/>', { class: 'deleted_icon float_left' });
						text_margin_class = 20;
						e.renderIcon(deleted_icon, 'components_deleted');
						list_cell_component.append(deleted_icon);
					}
					else {
						var component_icon = $('<div/>', { class: 'component_icon float_left' });
						text_margin_class = 5;
						e.renderIcon(component_icon, g.getIcon(componentType));
						list_cell_component.append(component_icon);
					}

					var component_text = $('<div/>', { class: 'component_text float_left ellipsis ' }).html(componentList.components[i].name).css("margin-left", text_margin_class);
					list_cell_component.append(component_text);

					var list_cell_risk = $('<div/>', { class: 'list_cell float_left ellipsis p risk_column'});

					if(componentList.components[i].risk != 'NA'){
						g.application.componentListToolTip.addTooltip($.parseJSON(componentList.components[i].synopsis), list_cell_risk);
					}
					else{
						total_na_count++;
					}
					// g.application.tasks.addTooltip();

					var subcolumn_background 	= $('<div/>', { class: 'subcolumn_background' });
					var subcolumn_text = $('<div/>', { class: 'subcolumn_text text_allign_center' }).html(componentList.components[i].risk);
					list_cell_risk.append(subcolumn_background, subcolumn_text);
					if (componentList.components[i].risk != 'NA'){
						subcolumn_background.css({ 'background-color': '#0066b1', 'opacity': (componentList.components[i].risk * 2) / 10 });
					}
					else
					{
						subcolumn_background.addClass(cell_color);
						subcolumn_background.parent().find('.subcolumn_text').addClass('risk_shift_right');
					}
					list_row.append(list_cell_star, list_cell_component, list_cell_risk);

					if (checked_params.selected == 'ratings' && (componentList.components[0].parameters[0].name).toLowerCase() != 'overallrating'){
						updated_parameter_list = getUpdatedParameterList(componentList.components[i].parameters);
					}
					else{
						updated_parameter_list = componentList.components[i].parameters;
					}

					for (var j = 0; j < parameters_length; j++) {
						current_parameterId = g.getParameterObjectByName(updated_parameter_list[j].name, checked_params.selected);
						if ((checked_params[checked_params.selected].indexOf(current_parameterId.id)) != -1) {
							var list_cell = $('<div/>', { class: 'list_cell float_left ellipsis p ' + cell_color });
							list_cell.width(column_width);
						//	var list_subcolumn1 = $('<div/>', { class: 'list_subcolumn float_left text_allign_center' });
							var subcolumn_text = $('<div/>', { class: 'list_subcolumn float_left subcolumn_text text_allign_center' });
							var value;
							if (checked_params.selected == 'ratings') {
								value = e.math.round(updated_parameter_list[j].value);
								subcolumn_text.addClass('range_change');
								if (historyManager.get('currentRange') == 'range_2'){
									value = e.math.round(value - 5);
								}
							}
							else{
								value = e.math.round(updated_parameter_list[j].value, true);
							}

							subcolumn_text.html(value);
							if (checked_params.selected == 'ratings') {
								subcolumn_text.attr('title', 'Rating : ' + value);
								if (value < 0.00) {
									subcolumn_text.addClass('color_bad');
								}
							}
							else if (checked_params.selected == 'metrics') {
								var threshold_value;
								for (var k = 0; k < current_parameterId.threshold.length; k++) {
									if (current_parameterId.threshold[k].name !== null) {
										if ((current_parameterId.threshold[k].name).toLowerCase() == (componentList.components[i].type).toLowerCase()) {
											threshold_value = current_parameterId.threshold[k].threshold;
											subcolumn_text.attr('title', 'Value : ' + value + '\nThreshold : ' + threshold_value);
											if (value > threshold_value){
												subcolumn_text.addClass('color_bad');
											}
											break;
										}
									}
									else {
										subcolumn_text.attr('title', 'Value : ' + value);
										break;
									}
								}
							}
							else {
								subcolumn_text.attr('title', 'Value : ' + value);
							}

							if (checked_params.selected == "duplication" && updated_parameter_list[j].name == "duplication_percentage") {
								if (value > 100) {
									value = 100;
									subcolumn_text.attr('title', 'Value : ' + value);
									subcolumn_text.html(value);
								}
								subcolumn_text.append(" %");
							}

						//	list_subcolumn1.append(subcolumn_text);

							list_cell.append(subcolumn_text);
							list_row.append(list_cell);
						}
					}
					component_table_body.append(list_row);
				}
			}
			if (total_na_count == records_per_page) {
				$('.list_header.risk_column').attr('title', "Risk information is not available");
			}
			else{
				$('.list_header.risk_column').attr('title', i18next.t('component_list.risk'));
			}
			var component_table_footer = $('<div/>', { class: 'component_table_footer float_left' });
			$('.component_table').append(component_table_footer);
			var list_footer_star = $('<div/>', { class: 'list_footer_star float_left ' }).html('');
			var list_footer = $('<div/>', { class: 'list_footer float_left stroke_all ' });
			list_footer.addClass('component_name_column');
			var list_footer_risk = $('<div/>', { class: 'list_footer float_left stroke_all risk_column ' });
			component_table_footer.append(list_footer_star, list_footer, list_footer_risk);

			for (i = 0; i < parameters_length; i++) {
				current_parameterId = g.getParameterObjectByName(componentList.components[0].parameters[i].name, checked_params.selected);
				if ((checked_params[checked_params.selected].indexOf(current_parameterId.id)) != -1) {

					list_footer = $('<div/>', { id: componentList.components[0].parameters[i].name, class: 'list_footer float_left stroke_all' });
					list_footer.width(column_width);
					component_table_footer.append(list_footer);
				}
			}
			e.notify(g.notifications.RENDERING_COMPLETE);
			/*var snapshot_id_old = { 'id': 0 };
			if ((checked_params.status[0]).toLowerCase() == 'new' || (checked_params.status[0]).toLowerCase() == 'old' || (checked_params.status[0]).toLowerCase() == 'hotspots_added' || (checked_params.status[0]).toLowerCase() == 'hotspots_deleted') {
				var index = g.searchObjectIndexById(g.getSnapshotList(), historyManager.get('selectedSnapshots')[0].id);
				snapshot_id_old = g.autoselectSnapshot(index);
			}*/
			if (historyManager.get('currentBreadcrumb').id != $('#breadcrumb .header_item:last').attr('nodeid')){
				e.notify(g.notifications.PLUGIN_LOADED);
			}

			$('[title]').tooltipster();
		}


		function adjustScreenSize() {
			var total_width, column_width;
			total_width = $(window).width() - 5;
			column_width = (total_width - 500) / (checked_params[checked_params.selected].length + 1);
			$('.plugin_componentList').css('min-width', 150 * (checked_params[checked_params.selected].length + 1));

			if (column_width > 195) {
				$('.plugin_componentList').width(195 * (checked_params[checked_params.selected].length + 1) + 130);
			}
			else if (column_width < 150) {
				$('.plugin_componentList').width(150 * (checked_params[checked_params.selected].length + 1) + 250);
			}
			else {
				$('.plugin_componentList').width(column_width * (checked_params[checked_params.selected].length + 1) + 250);
			}

			return column_width;
		}


		//This function is used to change the sequence of columns. Overallrating should always be first column
		function getUpdatedParameterList(original_list) {
			var updated_list = [], i;
			for (i = 0; i < original_list.length; i++) {
				if ((original_list[i].name).toLowerCase() == 'overallrating') {
					updated_list.push(original_list[i]);
				}
			}
			for (i = 0; i < original_list.length - 1; i++) {
				updated_list.push(original_list[i]);
			}

			return updated_list;
		}

		// ------------ RENDER SORT DATA AND SHOW SORT LIST---------
		function renderSortData() {
			var sortList = $('.sort_list');
			var history_selectedParameter = historyManager.get('currentComponentParameter');
			var param_name = (history_selectedParameter.parameter_id == 0)?'risk':g.getParameterObjectById(history_selectedParameter.parameter_id, checked_params.selected).name;
			if ((param_name).toLowerCase() == (sortList.attr('data-value')).toLowerCase()){
				selectedRadio = history_selectedParameter.sort_type;
			}
			else {
				selectedRadio = '';
			}

			sortList.html('');
			sortList.hide();
			var sort_row1 = $('<div/>', { class: 'sort_row text_allign_left h4 ' }).html('Sort By : ');
			var sort_row2 = $('<div/>', { class: 'sort_row text_allign_left p color_dark' });
			var snap_radio_group = new e.radioGroup({ data: [{ label: i18next.t('component_list.descending'), value: 'value_desc', radio_image: 'ic-chevron-down' }, { label: i18next.t('component_list.ascending'), value: 'value_asc', radio_image: 'ic-chevron-up' }], selected_radio: selectedRadio, main_class: '', spacing: 20, radio_btn_class: 'radio_button_style fill_light', notify: { onRadioSelect: 'SORT_RADIO_SELECT' } });
			sort_row2.append(snap_radio_group.addHTML());
			sortList.append(sort_row1, sort_row2);
			$('.radio_group').width("100%");
			$('.radio_label').css('max-width', $('.sort_list').width() - ($('radio_btn').width() + $('radio_image').width() + 60));
			if (sortList.width() < 90) {
				$('.radio_label').hide();
			}
			else{
				$('.radio_label').show();
			}
			sortList.slideDown(300);
		}

		function enableOptionPlugins() {
			e.enablePlugin('radioGroup', pluginEnabled);
		}

		function pluginEnabled() {
			e.enablePlugin('checkbox', checkboxEnabled);
		}

		function checkboxEnabled() {
			e.enablePlugin('dropDown', renderOptionData);
		}

		// ------------ RENDER PLUGIN OPTIONS---------
		function renderOptionData() {
			checked_params = historyManager.get('currentComponentParameterList');
			$('.plugin_option_list .option_wrapper').html('');
			var parameter_wrapper = $('<div/>', { class: 'parameter_wrapper float_left' });
			var row_list = $('<div/>', { class: 'parameter_inner_wrapper float_left stroke_bottom stroke_medium' });
			var column_list = $('<div/>', { class: 'parameter_inner_wrapper float_left' });
			//parameter_wrapper.css('max-height',$(window).height() - 170);
			$('.plugin_option_list .option_wrapper').append(parameter_wrapper);
			parameter_wrapper.append(row_list, column_list);

			var parameterOptionHeader;
			parameterOptionHeader = $('<div/>', { class: 'parameter_optionheader parameter_optionheader_rows language_text fill_light text_allign_left h4 semibold text_transform_capitalize ' }).html(g.print('rows'));
			parameterOptionHeader.attr('data-language_id', 'rows');
			row_list.append(parameterOptionHeader);

			parameterOptionHeader = $('<div/>', { class: 'parameter_optionheader language_text fill_light text_allign_left h4 semibold text_transform_capitalize' }).html(g.print('columns'));
			parameterOptionHeader.attr('data-language_id', 'columns');
			column_list.append(parameterOptionHeader);

			var dropdown_array;
			if (checked_params.ruletypeid !== '' || checked_params.metricid !== ''){
				dropdown_array = [{ 'label': 'category', 'text': checked_params.selected }];
			}
			else{
				dropdown_array = [{ 'label': 'category', 'text': checked_params.selected }, { 'label': 'type', 'text': checked_params.status[0] }];
			}
			for (var i = 0; i < dropdown_array.length; i++) {
				var dropdown_container = $('<div/>', { class: 'dropdown_container unselectable' }).html('');

				var temp_text;
				if (checked_params.status[0] === '' && dropdown_array[i].label == 'type'){
					temp_text = 'all';
				}
				else{
					temp_text = dropdown_array[i].text;
				}
				var list_array = [];
				if (dropdown_array[i].label == 'category') {
					column_list.append(dropdown_container);
					list_array = componentListFilter.category;
				}
				else if (dropdown_array[i].label == 'type') {
					row_list.append(dropdown_container);
					list_array = componentListFilter.status;
				}
				new e.dropDown({
					'holder': dropdown_container,
					'default_selection': temp_text,
					'dropDownLabel': dropdown_array[i].label,
					'dropDownTextWidth': '40%',
					'dropDownData': list_array,
					'multipleDropdown': false,
					'notify': { onDropdownItemClick: 'DROPDOWN_CLICK' }
				});
			}
			//componentlist_dropdown.handleEvents();
			$.each(g.getParameterList(), function (key, value) {
				if (key == checked_params.selected || key == 'type') {
					var display_name = g.print(key);
					var append_text = 'title.', tempValueArray = [];
					if (key == 'type') {
						display_name = g.print('component_type');
						append_text = '';
					}
					var parameter_optionheader = $('<div/>', { class: 'parameter_optionheader language_text float_left fill_light text_allign_left p bold 	text_transform_capitalize' }).html(display_name);
					parameter_optionheader.attr('data-language_id', key);
					if (key == checked_params.selected) {
						column_list.append(parameter_optionheader);
					}
					else{
						row_list.append(parameter_optionheader);
					}

					if (key == 'ratings') {
						for (var j = 0, len = value.length; j < len; j++) {
							switch ((value[j].name).toLowerCase()) {
								case 'overallrating':
									tempValueArray.insert(0, value[j]);
									break;
								case 'antipatternrating':
									tempValueArray.insert(1, value[j]);
									break;
								case 'metricrating':
									tempValueArray.insert(2, value[j]);
									break;
								case 'clonerating':
									tempValueArray.insert(3, value[j]);
									break;
								case 'codequalityrating':
									tempValueArray.insert(4, value[j]);
									break;
								default:
									break;
								}
						}
						value = tempValueArray;
					}
					//if(key == 'ratings' && value[0].name != 'overallRating')
					//value = value.reverse();
					var currentState = 1;
					for (var j = 0, len = value.length; j < len; j++) {
						if (g.isPartialLanguage()) {
							if (value[j].name != 'antiPatternRating' &&  value[j].name != 'CBO' && value[j].name != 'NOA' && value[j].name != 'NOM' && value[j].name != 'RFC' && value[j].name != 'DOIH' && value[j].name != 'ATFD' && value[j].name != 'LCOM' && value[j].name != 'NOPA' && value[j].name != 'Complexity') {
								componentCheckList(this);
							}

						}else{
							componentCheckList(this);
						}

						function componentCheckList()
						{
							var parameter_optionvalue = $('<div/>', { class: 'parameter_optionvalue float_left text_allign_left p color_dark' });
							parameter_optionvalue.attr('data-type', key);
							parameter_optionvalue.attr('data-id', value[j].id);
							var option_checkbox = $('<div/>', { class: 'option_checkbox float_left' });

							if (checked_params !== '' && (checked_params[key].indexOf(value[j].id) != -1)) {
								currentState = 1;
							}
							else { currentState = 0; }
							var componentListCheckbox = new e.checkbox({ width: 16, height: 16, current_state: currentState, notify: { onParameterCheck: 'PARAMETER_CHECK' } });
							componentListCheckbox.addTo(option_checkbox);
							var option_text = $('<div/>', { class: 'option_text ellipsis language_text float_left', title: g.print(append_text + value[j].name) }).html(g.print(value[j].name));
							option_text.attr('data-language_id', value[j].name);
							parameter_optionvalue.append(option_checkbox, option_text);


							if (key == checked_params.selected) {
								column_list.append(parameter_optionvalue);
							}
							else if ((value[j].classification).toLowerCase() == 'components'){
								row_list.append(parameter_optionvalue);
							}
							return false;
						}
					}
				}
			});
		}

		//------------updating plugin data on click of update button in plugin option list----------------------
		function updatePluginData() {
			$('.dropDown_list').remove();
			$('.component_table').removeClass('no_mouse_events');
			list_current_page = 1;
			e.notify(g.notifications.DATA_REQUESTED);
			getComponentListData();
		}
		function removeSortList() {
			if ($('.dropDown_list').length > 0){
				$('.dropDown_list').remove();
			}

			$('.sort_list').slideUp(300, function () {
				$('.list_header').removeClass('border-color');
			});
		}

		//---------- HANDLE EVENTS ------------
		function handleEvents() {
			$(".list_header:not('.component_name_column')").on('click', function (event) {
				toggleSortList(event);

				g.closeRightMenu(event);
				if ($(".BCarrowico").hasClass("clicked")) {
					$("ul.subnav").slideUp('fast');
					$(".BCarrowico").children().children().attr({ 'transform': 'rotate(0, 6, 6)' });
				}
			});

			panel_holder.on('scroll.componentList',function() {
				$('.component_table').removeClass('no_mouse_events');
			});

			$(".emulsion_panel[data-panel_id='component_list'] .component_table_body").on('scroll.componentList', function () {
				$(".list_cell.risk_column").webuiPopover('hide');
			});

			$(".emulsion_panel[data-panel_id='component_list']  .content_holder").on('scroll.componentList', function () {
				removeSortList();
			});
			$(document).on('click.componentList', function () {
				removeSortList();
			});

			$(window).on("resize.componentList", function () {
				if (!hasError && historyManager.get('currentPlugin').id == 'component_list') {
					e.resizePanel();
					setTimeout(function() {
						availbale_list_height = $('.emulsion_panel .content_holder ').outerHeight(true) - $('.componentlist_pagination').outerHeight(true) - $('.emulsion_panel .component_table_header').outerHeight(true) - $('.plugin_componentList').css('marginTop').replace('px', '') - 1;
						$('.component_table_body').css('max-height', availbale_list_height);
						if ($('.dropDown_list').length > 0) {
							var target = $(".componentlist_dropdown:eq(" + $('.dropDown_list').attr('data-index') + ")");
							$('.dropDown_list').css('max-height', $('.plugin_option_list').height() - (target.offset().top));
						}

						var column_width = adjustScreenSize();
						column_width = column_width - 5;
						$(".list_header:not(.component_name_column)").width(column_width);
						$(".list_header:not(.risk_column)").width(column_width);
						$(".list_cell:not(.component_name_column)").width(column_width);
						$(".list_cell:not(.risk_column)").width(column_width);
						$(".list_footer:not(.component_name_column)").width(column_width);
						$(".list_footer:not(.risk_column)").width(column_width);

						$(".list_header:not('.risk_column')").each(function () {
							var list_text = $(this).find('.list_text');

							var list_text_icon = $(this).find('.list_text_icon');
							var list_icon = $(this).find('.list_icon');
							if (checked_params.selected == 'metrics' || (checked_params.selected == 'ratings' && $(this).attr('id') == 'overallrating')){
								list_text.css('max-width', $(this).width() - (list_icon.width() + 10));
							}
							else {
								list_text.css('max-width', $(this).width() - (list_text_icon.width() + list_icon.width() + 10));
							}
						});
					}, 10);
				}
				else {
					availbale_list_height = g.contentHeight() - 200;
					$('.plugin_componentList').width(panel_holder.width() - 15);
					$('.plugin_componentList').height(availbale_list_height);
				}
			});
			$('.export_header').off('click.componentList').on('click.componentList', function() {
				var exportUrl = `/views/repositories/${historyManager.get('currentSubSystemUid')}/download/metrics?project_id=${historyManager.get('currentSubSystem')}
									&snapshot_id=${historyManager.get('selectedSnapshots')[0].id}
									&node_id=${historyManager.get('currentBreadcrumb').id}`;
                g.download(exportUrl, 'metrics.json');
			});

			$('.list_row').hover(function () {
				var context = g.getClassification($(this).attr('data-type'));
				if ((g.available_plugin_contexts.indexOf(context.toLowerCase()) > -1) && checked_params.status[0] != 'old' && checked_params.status[0] != 'hotspots_deleted'){
					$(this).toggleClass('hand_cursor');
				}
			});

			$('.list_row').on('click', function () {
				var context = g.getClassification($(this).attr('data-type')).toLowerCase();
				if ((g.available_plugin_contexts.indexOf(context.toLowerCase()) > -1) && checked_params.status[0] != 'old' && checked_params.status[0] != 'hotspots_deleted') {
					historyManager.set('currentContext', context);
					g.setPluginHistory();
					historyManager.set('currentBreadcrumb', { "id": $(this).attr('data-id'), "name": $(this).attr('data-name') });

					e.notify(g.notifications.PLUGIN_UPDATE);
				}
			});
		}

		//-------------------- called on pagination click ----------------------
		function onStepperClick() {
			list_current_page = componentlistStepper.getValue();
			e.notify(g.notifications.DATA_REQUESTED);
			getComponentListData();
		}
		//------------TOGGLE SORT LIST FOR EACH COLUMN----------
		function toggleSortList(event) {
			event.stopPropagation();
			var list_header = $(event.currentTarget);
			var list_header_other = $('.list_header');

			if (list_header.hasClass('hand_cursor')) {
				var targetWidth = $(event.currentTarget).width() - 5;
				var pos = $(event.currentTarget).offset();
				var sortList = $('.sort_list');
				var sideBarwidth = 0;
				sideBarwidth = $(".left-menu-bar").outerWidth() + $(".tree-panel-container").outerWidth();

				sortList.attr('data-value', list_header.attr('id'));
				sortList.width(targetWidth + 5);
				sortList.height(150);

				sortList.css('left', (pos.left - sideBarwidth));
				sortList.css('top', (pos.top - 10));
				if (list_header.hasClass('border-color')) {
					sortList.slideUp(300, function () {
						list_header.removeClass('border-color');
					});
				}
				else {
					list_header_other.removeClass('border-color');
					list_header.addClass('border-color');
					e.enablePlugin('radioGroup', renderSortData);
				}
			}
			e.removeDropdown();
			e.removeComboBox();
		}

		//---------------- called on ckeckbox click in plugin option list -----------------
		function onParameterCheck(checked_options) {
			checked_params = historyManager.get('currentComponentParameterList');
			checked_options = $('.plugin_option_list .checkbox_state_1');

			var selected_category = checked_params.selected;
			var selected_status = checked_params.status[0];
			var selected_ruletypeid = checked_params.ruletypeid;
			var selected_ruletypename = checked_params.ruletypename;
			var selected_metricid = checked_params.metricid;
			var selected_hotspottype = checked_params.hotspottype[0];
			var selected_codeissuetype = checked_params.codeissuetype;
			var selected_codeissuename = checked_params.codeissuename;
			var showImmediateComponents = checked_params.showImmediateComponents;
			var showDuplicateComponents = checked_params.showDuplicateComponents;
			var metrics_array, ratings_array, duplication_array;
			if (selected_category == 'ratings') {
				metrics_array = checked_params.metrics;
				duplication_array = checked_params.duplication;
				ratings_array = [];
			}
			else if (selected_category == 'metrics') {
				ratings_array = checked_params.ratings;
				duplication_array = checked_params.duplication;
				metrics_array = [];
			}
			else if (selected_category == 'duplication') {
				ratings_array = checked_params.ratings;
				metrics_array = checked_params.metrics;
				duplication_array = [];
			}


			var checkedparameters = { selected: selected_category, ratings: ratings_array, metrics: metrics_array, duplication: duplication_array, type: [], status: [selected_status], ruletypeid: selected_ruletypeid, ruletypename: selected_ruletypename, metricid: selected_metricid, hotspottype: [selected_hotspottype], codeissuetype: selected_codeissuetype, codeissuename: selected_codeissuename, showAllComponents: false, showImmediateComponents: showImmediateComponents, showDuplicateComponents: showDuplicateComponents };
			$.each(checked_options, function () {
				var main_parent = $(this).parent().parent();
				switch (main_parent.attr('data-type')) {
					case 'ratings': checkedparameters.ratings.push(parseInt(main_parent.attr('data-id')));
						break;
					case 'metrics': checkedparameters.metrics.push(parseInt(main_parent.attr('data-id')));
						break;
					case 'duplication': checkedparameters.duplication.push(parseInt(main_parent.attr('data-id')));
						break;
					case 'type': checkedparameters.type.push(parseInt(main_parent.attr('data-id')));
						break;
					default:
						break;
				}
			});
			checked_params = checkedparameters;
			historyManager.set('currentComponentParameterList', checked_params);
		}

		//---------------- called on sorting radio button click in sort list -----------------
		function onSortSelect(selected_parameter_name) {
			var selected_parameter 		= $('.sort_list .checked');
			var selected = {};
			var selected_parameter_name = selected_parameter.parent().parent().parent().parent().parent().attr('data-value');
			selected.parameter_id 		= (selected_parameter_name == 'risk')?0:g.getParameterObjectByName(selected_parameter_name, checked_params.selected).id;
			selected.sort_type 			= selected_parameter.parent().attr('data-value');
			historyManager.set('currentComponentParameter', selected);

			//  New design changes are here
			/*var selected = {};
			selected.parameter_id 	= g.getParameterObjectByName(selected_parameter_name,checked_params.selected).id;
			selected.sort_type = sort_type;//selected_parameter.parent().attr('data-value');
			historyManager.set('currentComponentParameter',selected);*/

			currentComponentListFilterId[checked_params.selected] = selected.parameter_id;
			historyManager.set('currentComponentListFilterId', currentComponentListFilterId);

			var selected_list_header = $('#' + selected_parameter_name);
			var selected_list_icon = selected_list_header.find('.list_icon');
			var temp = selected.sort_type.split('_');
			if (temp[1] == 'asc') {
				selected_list_icon.removeClass().addClass('list_icon float_left ic-chevron-down');
			}
			else {
				selected_list_icon.removeClass().addClass('list_icon float_left ic-chevron-up');
			}

			selected_list_icon.show();
			$('.sort_list').slideUp(300, function () {
				selected_list_header.removeClass('border-color');
				list_current_page = 1;
				e.notify(g.notifications.DATA_REQUESTED);
				getComponentListData();
			});
		}
		//---------------- called on dropdown item click in plugin option list -----------------
		function onFilterSelect(selected_item) {
			if (selected_item.label == 'category') {
				checked_params.selected = selected_item.selection;
				historyManager.set('currentComponentParameterList', checked_params);

				if (checked_params.selected == 'ratings' && typeof currentComponentListFilterId[checked_params.selected] === "undefined"){
					currentComponentListFilterId[checked_params.selected] = g.getParameterObjectByName('overallRating', 'ratings').id;
				}
				else if (checked_params.selected == 'metrics' && typeof currentComponentListFilterId[checked_params.selected] === "undefined"){
					currentComponentListFilterId[checked_params.selected] = g.getParameterObjectByName('LOC', 'metrics').id;
				}
				else if (checked_params.selected == 'duplication' && typeof currentComponentListFilterId[checked_params.selected] === "undefined"){
					currentComponentListFilterId[checked_params.selected] = g.getParameterObjectByName('clone_loc', 'duplication').id;
				}

				historyManager.set('currentComponentListFilterId', currentComponentListFilterId);

				var obj = {};
				obj.parameter_id = parseInt(currentComponentListFilterId[checked_params.selected]);
				if (checked_params.selected == 'ratings'){
					obj.sort_type = 'value_asc';
				}
				else{
					obj.sort_type = 'value_desc';
				}
				historyManager.set('currentComponentParameter', obj);
			}
			else if (selected_item.label == 'type') {
				if ((selected_item.selection).toLowerCase() == 'all') {
					checked_params.showAllComponents = true;
					checked_params.status[0] = '';
				}
				else {
					checked_params.showAllComponents = false;
					checked_params.status[0] = selected_item.selection;
				}

				if (checked_params.status[0] == 'criticalHotspots'){
					checked_params.hotspottype = ['C'];
				}
				if (checked_params.status[0] == 'mediumHotspots'){
					checked_params.hotspottype = ['M'];
				}
				if (checked_params.status[0] == 'highHotspots'){
					checked_params.hotspottype = ['H'];
				}
				if (checked_params.status[0] == 'notHotspots'){
					checked_params.hotspottype = ['N'];
				}
				if (checked_params.status[0] === ''){
					checked_params.hotspottype = [''];
				}

				checked_params.ruletypeid = '';
				checked_params.ruletypename = '';
				//checked_params.ruletypeid 		= [];
				checked_params.metricid = '';
				checked_params.codeissuetype = '';
				checked_params.codeissuename = '';
				historyManager.set('currentComponentParameterList', checked_params);
			}
			renderOptionData();
			$('.plugin_option_list .dropdown_text[title]').tooltipster();
		}

		//---------- PUBLIC METHODS ------------
		return {
			initPlugin: function (holder) {
				init(holder);
			},
			enableOptionPlugins: function () {
				enableOptionPlugins();
			},
			renderOptionData: function () {
				renderOptionData();
			},
			updatePluginData: function () {
				updatePluginData();
			},
			clearMemory: function () {
				clearMemory();
			}
		};
	};
	return g;
})(g);
