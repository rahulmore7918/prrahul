var g = (function (gamma) {
	//------------ Private variables -------------
	var obj_systemHeatMap, obj_changeList, obj_changeOverview, obj_repositoryOverview, obj_componentExplorer, obj_fileExplorer, obj_hotspotDistribution, obj_codeissuesDetails, obj_componentList, obj_dependencyPlot, obj_heatMap, obj_cityView, obj_duplicationDetails, obj_metricsDetails, obj_designIssueDetails, obj_subsystemDashboard, obj_kpiDashboard, obj_releaseManagement, obj_moduleDependency, obj_subsystemList, obj_dashboard, obj_nodeSummary, obj_tree, obj_tasks, obj_issues, obj_issueList, obj_projectList, obj_teamList, obj_partitions, obj_coverageDistribution, obj_commitHistory, obj_componentDependency, objCodeEditor;
	var obj_coverageComponentList, obj_unitTest, obj_complexMethodList;
	//------------ Private methods -------------
	var pluginHolder;
	function handlePluginSelectorEvents () {
		$('[title]').tooltipster();
		$(window).on('resize.plugin_selector',function() {
			$('#bottom_container').height(gamma.contentHeight());
			$('.left-menu-bar,.left-menu-panel-container,.left-menu-view-selection').height($(window).height());
			//managePluginAlignment();
		});

		$(".plugin").on('click',function() {

			var data = $(this).data();
			//setting old plugin history in order to clean old plugin data
			historyManager.set('currentOldPlugin',historyManager.get('currentPlugin'));

			var previous_selection 	= $('#plugin_selector').find('.selected_plugin');
			var current_selction 	= $(this);
			unselectPlugin(previous_selection);
			selectPlugin(current_selction);

			//setting plugin history
			historyManager.set('currentPlugin',{'id':data.plugin_data.id,'name':data.plugin_data.name});
			if (historyManager.get('currentContext') == 'root' || historyManager.get('currentContext') == 'systems')			{
				$('#breadcrumb').addClass('hide');
			} else {
				$('#breadcrumb').removeClass('hide');
			}
			loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin'),true);
		});
	}

	function addErrorMessage () {

		if (!$(".content_holder .plugin_not_available_error").length){
			var data = {status:'info',type:'warnning',is_info:false, message:i18next.t('common.info_title.info_title_change_overview'),details:i18next.t('common.info_description.info_desc_change_overview'), is_add_button:false, button_text:''};
			g.error_message_view(data,$('.content_holder'));

		} else if($(".plugin_not_available_error").length) {
			var data = {status:'info',type:'warnning',is_info:false, message:i18next.t('common.info_title.info_title_change_overview'),details:i18next.t('common.info_description.info_desc_change_overview'), is_add_button:false, button_text:''};
			g.error_message_view(data,$('.content_holder'));

		}
		(e.panelsManager.panels[0].panel).find(".content_holder").addClass("plugin_not_available_error_parent");
		setTimeout(function() {
			$("#timelineContent").css("pointer-events", "auto");
		},1000);
		//e.notify(g.notifications.PLUGIN_LOADED);
	}

	function addInfoContent() {
		$('.panel_title_info_icon').webuiPopover('destroy');
		var panel_title_info_content = $('<div/>', { class: 'panel_title_info_content ' });
		var panel_inner_info_icon = $('<div/>', { class: 'panel_inner_info_icon ic-info ' });
		var plugin_name = $('.panel_title .panel_title_info_icon').attr('id');
		if (plugin_name === 'subsystem_list' && g.is_trial) {
			plugin_name = 'repository_list_opensource';
		}
		var panel_inner_info_content = $('<div/>', { class: 'panel_inner_info_content' }).html(i18next.t("common.plugin_info." + plugin_name));
		panel_title_info_content.append(panel_inner_info_icon, panel_inner_info_content);
		$('.panel_title .panel_title_info_icon').webuiPopover({ content: panel_title_info_content, placement: "right-bottom", style: 'gamma-popover', trigger: 'hover', animation: 'pop' });
	}

	function loadPlugin(holder,plugin,unloadOldPlugin) {
		e.notify(gamma.notifications.DEPENDENCY_LOADED);
		pluginHolder = holder;
		pluginHolder.parent().parent().attr('data-panel_id',plugin.id);
		pluginHolder.parent().find('.panel_header').attr('data-holder_id', plugin.id);
		$('.panel_header .tabs_container').css("display", "none");

		$('#bottom_container').height(gamma.contentHeight());
		$('.left-menu-bar, .left-menu-panel-container,.left-menu-view-selection').height($(window).height());

		var plugin_selector_height = 0;

		$('.emulsion_panel').height(g.contentHeight());
		if ($('#plugin_selector').css("display") == "block") {
			plugin_selector_height = $('#plugin_selector').outerHeight(true);
		}
		$('.content_holder').height($('.emulsion_panel').height() - $('.panel_header').outerHeight() - $('#plugin_selector').outerHeight(true));
		$('.options_holder').height($('.emulsion_panel').height() - plugin_selector_height);

		holder.parent().parent().find('.panel_header .panel_title .panel_title_icon').removeClass(function (index, className) {
			return (className.match(/\ic-\S+/g) || []).join(' ');
		});
		pluginHolder.parent().parent().find('.panel_header .panel_title .panel_title_icon').addClass(g.getPluginMetadata(plugin.id,'pluginIcon'));
        pluginHolder.parent().parent().find('.panel_header .panel_title .panel_title_text').html(i18next.t('common.plugin_title.'+plugin.id));
		pluginHolder.parent().parent().find('.panel_header .panel_title .panel_title_info_icon ').attr("id", plugin.id);

		addInfoContent();
		if($('.content_holder').hasClass('fill_light')) {
			$('.content_holder').removeClass('fill_light');
		}
		if(!gamma.getPluginMetadata(historyManager.get("currentPlugin").id,'show_snapshot_panel') && $("#sideBar").length) {
			(e.panelsManager.panels[0].panel).css("width",$(window).width()- $('.left-menu-bar').outerWidth(true)- $('.tree-panel-container').width());
		} else if(historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems') {
			g.showSnapshot();
		}
		var leftMenuPanelWidth=0;
		if(!$('.left-menu-panel-container').hasClass('hidden')) {
			leftMenuPanelWidth = $('.left-menu-panel-container').width();
		}
		$('.gamma-wraper').width($(window).width()  - $(".left-menu-bar").width() -leftMenuPanelWidth);
		if(historyManager.get("selectedSnapshots").length == 0)			{
			$(".search_click").addClass("disabled");
		}

		if(unloadOldPlugin) {
			unloadOldPluginContent(holder,holder.parent().parent().attr('data-panel_id'));
		}

		if($(".selected_plugin").hasClass("disabled_plugin_option") && gamma.getPluginMetadata(historyManager.get("currentPlugin").id,'show_snapshot_panel')) {
			if(gamma.getPluginMetadata(historyManager.get('currentPlugin').id,'number_of_snapshot') == 1) {
				var snapshot_selected=historyManager.get("selectedSnapshots");
				snapshot_selected.splice(1, 1);
	 			historyManager.set('selectedSnapshots',snapshot_selected);
	 			(e.panelsManager.panels[0].panel).find(".plugin_container").removeClass("plugin_not_available_error_parent");
				(e.panelsManager.panels[0].panel).find(".plugin_container .plugin_not_available_error").remove();
				$(".plugin_options").removeClass("disabled");
				$(".search_click").removeClass("disabled");
				loadPluginContent(plugin);
			}else{
				addErrorMessage();
				$(".plugin_options").addClass("disabled");
			}
		} else if(gamma.getPluginMetadata(historyManager.get('currentPlugin').id,'number_of_snapshot') <= historyManager.get("selectedSnapshots").length || !gamma.getPluginMetadata(historyManager.get("currentPlugin").id,'show_snapshot_panel')) {
			(e.panelsManager.panels[0].panel).find(".plugin_container").removeClass("plugin_not_available_error_parent");
			(e.panelsManager.panels[0].panel).find(".plugin_container .plugin_not_available_error").remove();
			$(".plugin_options").removeClass("disabled");
			$(".search_click").removeClass("disabled");
			loadPluginContent(plugin);
		} else{
			addErrorMessage();
			$(".plugin_options").addClass("disabled");
		}
	/**************** New requirement for tree change *******************/
		if(g.setSendTreeNotification) {
			if (historyManager.get("currentPlugin").id == "module_dependency") {
				g.setSendTreeNotification(false);
			} else {
				g.setSendTreeNotification(true);
			}
		}

		e.removeComboBox();
	}

	//removing css styles of old plugin
	function unselectPlugin(previous_selection) {
		previous_selection.removeClass('selected_plugin');
	}

	//applying css styles to selected plugin
	function selectPlugin(current_selction) {
		current_selction.addClass('selected_plugin');
	}

	//Remove old events and data that are not required
	function unloadOldPluginContent(holder,plugin) {

		var oldPlugin = historyManager.get('currentOldPlugin');
		$('body').off('click hover');
		holder.parent().parent().find('.options_holder').html('');//.addClass('hide')
		holder.parent().parent().find('.plugin_options').hide();
		holder.width(holder.parent().parent().width() - e.panelsManager.panels[0].handleWidth - 0);
		holder.html('');
		//$("#bottom_container").html('');
		switch(oldPlugin.id) {
		case 'dashboard' :
			if(obj_dashboard!== null && obj_dashboard !== undefined) {
				obj_dashboard.clearMemory();
			}
			break;
		case 'project_list':
			if(obj_projectList!== null && obj_projectList !== undefined) {
				obj_projectList.clearMemory();
			}
			break;
		case 'team_list':
			if(obj_teamList!== null && obj_teamList !== undefined) {
				obj_teamList.clearMemory();
			}
			break;
		case 'subsystem_list' :
			if(obj_subsystemList!== null && obj_subsystemList !== undefined) {
				obj_subsystemList.clearMemory();
			}
			break;
		case 'system_heatmap' :
			if(obj_systemHeatMap!== null && obj_systemHeatMap !== undefined) {
				obj_systemHeatMap.clearMemory();
			}
			break;
		case 'change_list' :
			if(obj_changeList!== null && obj_changeList !== undefined) {
				obj_changeList.clearMemory();
			}
			break;
		case 'change_overview':
			if(obj_changeOverview!== null && obj_changeOverview !== undefined) {
				obj_changeOverview.clearMemory();
			}
			break;
		case 'repository_dashboard':
			if(obj_subsystemDashboard!== null && obj_subsystemDashboard !== undefined) {
				obj_subsystemDashboard.clearMemory();
			}
			break;
		case 'release_management':
			if(obj_releaseManagement !== null && obj_releaseManagement !== undefined) {
				obj_releaseManagement.clearMemory();
			}
			break;
		case 'repository_overview':
			if(obj_repositoryOverview!== null && obj_repositoryOverview !== undefined) {
				obj_repositoryOverview.clearMemory();
			}
			break;
		case 'kpi_dashboard':
			if(obj_kpiDashboard!== null && obj_kpiDashboard !== undefined) {
				obj_kpiDashboard.clearMemory();
			}
			break;
		case 'component_explorer':
			if(obj_componentExplorer!== null && obj_componentExplorer !== undefined) {
				obj_componentExplorer.clearMemory();
			}
			break;
		case 'file_explorer':
			if (obj_fileExplorer !== null && obj_fileExplorer !== undefined) {
				obj_fileExplorer.clearMemory();
			}
			break;
		case 'hotspot_distribution':
			if(obj_hotspotDistribution!== null && obj_hotspotDistribution !== undefined) {
				obj_hotspotDistribution.clearMemory();
			}
			break;
		case 'code_issues_details':
			if(obj_codeissuesDetails!== null && obj_codeissuesDetails !== undefined) {
				obj_codeissuesDetails.clearMemory();
			}
			break;
		case 'duplication_details':
			if(obj_duplicationDetails!== null && obj_duplicationDetails !== undefined) {
				obj_duplicationDetails.clearMemory();
			}
			break;
		case 'metrics_details':
			if(obj_metricsDetails!== null && obj_metricsDetails !== undefined) {
				obj_metricsDetails.clearMemory();
			}
			break;
		case 'design_issue_details':
			if(obj_designIssueDetails!== null && obj_designIssueDetails !== undefined) {
				obj_designIssueDetails.clearMemory();
			}
			break;
		case 'component_list':
			if(obj_componentList!== null && obj_componentList !== undefined) {
				obj_componentList.clearMemory();
			}
			break;
		case 'module_dependency':
			if(obj_moduleDependency !== null && obj_moduleDependency !== undefined) {
				obj_moduleDependency.clearMemory();
			}
			break;
		case 'component_dependency':
			if(obj_componentDependency !== null && obj_componentDependency !== undefined) {
				obj_componentDependency.clearMemory();
			}
			break;
		case 'node_summary':
			if(obj_nodeSummary !== null && obj_nodeSummary !== undefined) {
				obj_nodeSummary.clearMemory();
			}
			break;
		case 'dependency_plot':
			if(obj_dependencyPlot!== null && obj_dependencyPlot !== undefined) {
				obj_dependencyPlot.clearMemory();
			}
			break;
		case 'heatmap':
			if(obj_heatMap!== null && obj_heatMap !== undefined) {
				obj_heatMap.clearMemory();
			}
			break;
		case 'city_view':
			if(obj_cityView!== null && obj_cityView !== undefined) {
				obj_cityView.clearMemory();
			}
			break;
		case 'tree':
			if(obj_tree!== null && obj_tree !== undefined) {
				obj_tree.clearMemory();
			}
			break;
		case 'tasks':
			if(obj_tasks!== null && obj_tasks !== undefined) {
				obj_tasks.clearMemory();
			}
			break;
		case 'issues':
			if(obj_issues!== null && obj_issues !== undefined) {
				obj_issues.clearMemory();
			}
			break;
		case 'issue_list':
			if(obj_issueList!== null && obj_issueList !== undefined) {
				obj_issueList.clearMemory();
			}
			break;
		case 'partitions':
			if(obj_partitions!== null && obj_partitions !== undefined) {
				obj_partitions.clearMemory();
			}
			break;
		case 'coverage_distribution':
			if(obj_coverageDistribution!== null && obj_coverageDistribution !== undefined) {
				obj_coverageDistribution.clearMemory();
			}
			break;
		case 'coverage_component_list':
			if (obj_coverageComponentList !== null && obj_coverageComponentList !== undefined) {
				obj_coverageComponentList.clearMemory();
			}
			break;
		case 'complex_method_list':
			if (obj_complexMethodList !== null && obj_complexMethodList !== undefined) {
				obj_complexMethodList.clearMemory();
			}
			break;
		case 'unit_tests':
			if(obj_unitTest!== null && obj_unitTest !== undefined) {
				obj_unitTest.clearMemory();
			}
			break;
		case 'commit_history':
			if (obj_commitHistory !== null && obj_commitHistory !== undefined) {
				obj_commitHistory.clearMemory();
			}
			break;
		case 'code_editor':
			if (objCodeEditor !== null && objCodeEditor !== undefined) {
				objCodeEditor.clearMemory();
			}
			break;
		default :
			break;
		}
	}

	//Loading plugin content

	function loadPluginContent(plugin) {
		var currentPlugin = plugin;
		switch(currentPlugin.id) {
		case 'dashboard' :
			renderDashboardPlugin();
			break;
		case 'project_list':
			renderProjectListPlugin();
			break;
		case 'team_list':
			renderTeamListPlugin();
			break;
		case 'subsystem_list' :
			renderSubsystemListPlugin();
			break;
		case 'system_heatmap' :
			renderSystemHeatMapPlugin();
			break;
		case 'change_list' :
			renderChangeListPlugin();
			break;
		case 'change_overview':
			renderChangeOverviewPlugin();
			break;
		case 'repository_dashboard':
			renderSubsystemDashboardPlugin();
			break;
		case 'release_management':
			renderReleaseManagementPlugin();
			break;
		case 'repository_overview':
			renderRepositoryOverviewPlugin();
			break;
		case 'kpi_dashboard':
			renderKpiDashboardPlugin();
			break;
		case 'component_explorer':
			renderComponentExplorerPlugin();
			break;
		case 'file_explorer':
			renderFileExplorerPlugin();
			break;
		case 'hotspot_distribution':
			renderHotspotDistributionPlugin();
			break;
		case 'code_issues_details':
			renderCodeissuesDetailsPlugin();
			break;
		case 'duplication_details':
			renderDuplicationDetailsPlugin();
			break;
		case 'metrics_details':
			renderMetricsDetailsPlugin();
			break;
		case 'design_issue_details':
			renderDesignIssueDetailsPlugin();
			break;
		case 'component_list':
			renderComponentListPlugin();
			break;
		case 'module_dependency':
			renderModuleDependencyPlugin();
			break;
		case 'component_dependency':
			renderComponentDependencyPlugin();
			break;
		case 'node_summary':
			renderNodeSummaryPlugin();
			break;
		case 'dependency_plot':
			renderDependencyPlotPlugin();
			break;
		case 'heatmap':
			renderHeatmapPlugin();
			break;
		case 'city_view':
			renderCityViewPlugin();
			break;
		case 'tree':
			renderTreePlugin();
			break;
		case 'tasks':
			renderTasksPlugin();
			break;
		case 'issues':
			renderIssuesPlugin();
			break;
		case 'issue_list':
			renderIssueListPlugin();
			break;
		case 'partitions':
			renderPartitionsPlugin();
			break;
		case 'coverage_distribution':
			renderCoverageDistributionPlugin();
			break;
		case 'coverage_component_list':
			renderCoverageComponentListPlugin();
			break;
		case 'complex_method_list':
			renderComplexMethodListPlugin();
			break;
		case 'unit_tests':
			renderUnitTestsPlugin();
			break;
		case 'commit_history':
			renderCommitHistoryPlugin();
			break;
		case 'code_editor':
			renderCodeEditorPlugin();
			break;
		default:
			break;
		}
	}

	function createPluginOptionList(holder) {
		var plugin_option_list 		= $('<div/>',{class:'plugin_option_list unselectable p text_allign_center stroke_left stroke_light'});
		var option_wrapper 			= $('<div/>',{class:'option_wrapper float_left'});
		var option_button_wrapper	= $('<div/>',{class:'option_button_wrapper float_left fill_light margin_top_10 margin_bottom_10'});
		var option_update_button 	= $('<button/>',{type:'button', class:'option_update_button button_small button_secondary transition_bcolor float_right margin_right_10'}).html(i18next.t('plugin_option.update'));
		option_button_wrapper.append(option_update_button);
		var option_reset_button 	= $('<button/>',{type:'button', class:'option_reset_button button_small button_ternary transition_bcolor float_right margin_right_10'}).html(i18next.t('plugin_option.reset'));
		option_button_wrapper.append(option_reset_button);
		plugin_option_list.append(option_wrapper,option_button_wrapper);
		holder.parent().parent().find('.options_holder').removeClass('hidden').append(plugin_option_list);
		gamma.togglePluginOptionList(holder);
		option_update_button.on('click',function(event) {
			e.removeComboBox();
			event.stopPropagation();
			var currentPlugin = holder.parent().parent().attr('data-panel_id');
			if(gamma.getPluginMetadata(currentPlugin,'pluginOptions')) {
				switch(currentPlugin) {
				case 'dashboard' :
					obj_dashboard.updatePluginData();
					break;
				case 'project_list':
					obj_projectList.updatePluginData();
					break;
				case 'team_list':
					obj_teamList.updatePluginData();
					break;
				case 'subsystem_list' :
					obj_subsystemList.updatePluginData();
					break;
				case 'system_heatmap' :
					obj_systemHeatMap.updatePluginData();
					break;
				case 'change_list' :
					obj_changeList.updatePluginData();
					break;
				case 'change_overview':
					obj_changeOverview.updatePluginData();
					break;
				case 'repository_dashboard':
					obj_subsystemDashboard.updatePluginData();
					break;
				case 'release_management':
					obj_releaseManagement.updatePluginData();
					break;
				case 'repository_overview':
					obj_repositoryOverview.updatePluginData();
					break;
				case 'kpi_dashboard':
					obj_kpiDashboard.updatePluginData();
					break;
				case 'component_explorer':
					obj_componentExplorer.updatePluginData();
					break;
				case 'file_explorer':
					obj_fileExplorer.updatePluginData();
					break;
				case 'hotspot_distribution':
					obj_hotspotDistribution.updatePluginData(event,false);
					break;
				case 'code_issues_details':
					obj_codeissuesDetails.updatePluginData();
					break;
				case 'duplication_details':
					obj_duplicationDetails.updatePluginData();
					break;
				case 'metrics_details':
					obj_metricsDetails.updatePluginData();
					break;
				case 'design_issue_details':
					obj_designIssueDetails.updatePluginData();
					break;
				case 'component_list':
					obj_componentList.updatePluginData();
					break;
				case 'dependency_plot':
					obj_dependencyPlot.updatePluginData();
					break;
				case 'heatmap':
					obj_heatMap.updatePluginData();
					break;
				case 'city_view':
					obj_cityView.updatePluginData();
					break;
				case 'tasks':
					obj_tasks.updatePluginData();
					break;
				case 'issues':
					obj_issues.updatePluginData();
					break;
				case 'issue_list':
					obj_issueList.updatePluginData();
					break;
				case 'partitions':
					obj_partitions.updatePluginData();
					break;
				case 'coverage_distribution':
					obj_coverageDistribution.updatePluginData();
					break;
				case 'coverage_component_list':
					obj_coverageComponentList.updatePluginData();
					break;
				case 'complex_method_list':
					obj_complexMethodList.updatePluginData();
					break;
				case 'unit_tests':
					obj_unitTest.updatePluginData();
					break;
				default:
					break;
				}
			}
		});
		option_reset_button.on('click',function(event) {
			event.stopPropagation();
			var currentPlugin = holder.parent().parent().attr('data-panel_id');
			gamma.resetFilters(currentPlugin,true);
		});
		$('.plugin_option_list').on('click',function(event) {
			//event.stopPropagation();
			if($('.dropDown_list').length > 0) {
				var index            = $('.dropDown_list').attr('data-index');
				var current_dropdown = $(".dropdown:eq("+index+")");
				$('.dropDown_list').slideUp(300,function() {
					$('.dropDown_list').remove();
					$('.dropdown').removeClass('active_dropdown');
					current_dropdown.find('.dropdown_arrow').children().removeClass('ic-chevron-up').addClass('ic-chevron-down');
                    // e.prototype.notify(g.prototype.notifications.DATA_REQUESTED);
				});
			}
		});
	}

	//---------TOGGLE PARAMETER OPTION LIST------------------
	function togglePluginOptionList(holder) {
		//event.stopPropagation();
		var targetWidth 		= 300;
	    var plugin_option_list 	= $('.plugin_option_list');
		plugin_option_list.width(targetWidth);
		var option_data;
		var emulsion_panel_width = 	holder.parent().parent().width();
		var emulsion_handle_width = holder.parent().parent().find('.handle').width();
		var emulsion_options_width = holder.parent().parent().find('.options_holder').outerWidth(true);
		holder.width(emulsion_panel_width - emulsion_handle_width - emulsion_options_width);
		$('.content_and_header_wraper').width(emulsion_panel_width - emulsion_handle_width - emulsion_options_width);
		var currentPlugin = holder.parent().parent().attr('data-panel_id');
		if(gamma.getPluginMetadata(currentPlugin,'pluginOptions')) {
			switch(currentPlugin) {
			case 'dashboard' :
				obj_dashboard.enableOptionPlugins();
				break;
			case 'project_list':
				obj_projectList.enableOptionPlugins();
				break;
			case 'team_list':
				obj_teamList.enableOptionPlugins();
				break;
			case 'subsystem_list' :
				obj_subsystemList.enableOptionPlugins();
				break;
			case 'system_heatmap' :
				obj_systemHeatMap.enableOptionPlugins();
				break;
			case 'change_list' :
				obj_changeList.enableOptionPlugins();
				break;
			case 'change_overview':
				obj_changeOverview.enableOptionPlugins();
				break;
			case 'repository_dashboard':
				obj_subsystemDashboard.enableOptionPlugins();
				break;
			case 'release_management':
				obj_releaseManagement.enableOptionPlugins();
				break;
			case 'repository_overview':
				obj_repositoryOverview.enableOptionPlugins();
				break;
			case 'kpi_dashboard':
				obj_kpiDashboard.enableOptionPlugins();
				break;
			case 'component_explorer':
				obj_componentExplorer.enableOptionPlugins();
				break;
			case 'file_explorer':
				obj_fileExplorer.enableOptionPlugins();
				break;
			case 'hotspot_distribution':
				obj_hotspotDistribution.enableOptionPlugins();
				break;
			case 'code_issues_details':
				obj_codeissuesDetails.enableOptionPlugins();
				break;
			case 'duplication_details':
				obj_duplicationDetails.enableOptionPlugins();
				break;
			case 'metrics_details':
				obj_metricsDetails.enableOptionPlugins();
				break;
			case 'design_issue_details':
				obj_designIssueDetails.enableOptionPlugins();
				break;
			case 'component_list':
				obj_componentList.enableOptionPlugins();
				break;
			case 'dependency_plot':
				obj_dependencyPlot.enableOptionPlugins();
				break;
			case 'heatmap':
				obj_heatMap.enableOptionPlugins();
				break;
			case 'city_view':
				obj_cityView.enableOptionPlugins();
				break;
			case 'tasks':
				obj_tasks.renderOptionData();
				break;
			case 'issues':
				obj_issues.renderOptionData();
				break;
			case 'issue_list':
				obj_issueList.enableOptionPlugins();
				break;
			case 'partitions':
				obj_partitions.enableOptionPlugins();
				break;
			case 'coverage_distribution':
				obj_coverageDistribution.enableOptionPlugins();
				break;
			case 'coverage_component_list':
				obj_coverageComponentList.enableOptionPlugins();
				break;
			case 'complex_method_list':
				obj_complexMethodList.enableOptionPlugins();
				break;
			case 'unit_tests':
				obj_unitTest.enableOptionPlugins();
				break;
			case 'commit_history':
				obj_commitHistory.renderOptionData();
				break;
			default:
				break;
			}
		}
		$('.option_button_wrapper').show();
	}

	function renderComponentExplorerPlugin() {
		gamma.enablePlugin('componentExplorer',loadComponentExplorer);
	}

	function loadComponentExplorer() {
		obj_componentExplorer = new gamma.componentExplorer();
		obj_componentExplorer.initPlugin(pluginHolder);
	}

	function renderFileExplorerPlugin() {
		gamma.enablePlugin('fileExplorer', loadFileExplorer);
	}

	function loadFileExplorer() {
		obj_fileExplorer = new gamma.fileExplorer();
		obj_fileExplorer.initPlugin(pluginHolder);
	}

	function renderDashboardPlugin() {
		gamma.enablePlugin('dashboard',loadDashboard);
	}

	function loadDashboard() {
		obj_dashboard = new gamma.dashboard();
		obj_dashboard.initPlugin(pluginHolder);
	}

	function renderSubsystemListPlugin() {
		gamma.enablePlugin('subsystemList',loadSubsystemList);
	}

	function loadSubsystemList() {
		obj_subsystemList = new gamma.subsystemList();
		obj_subsystemList.initPlugin(pluginHolder);
	}

	function renderProjectListPlugin() {
		gamma.enablePlugin('projectList',loadProjectList);
	}

	function loadProjectList() {
		obj_projectList = new gamma.projectList();
		obj_projectList.initPlugin(pluginHolder);
	}

	function renderTeamListPlugin() {
		gamma.enablePlugin('teamList',loadTeamList);
	}

	function loadTeamList() {
		obj_teamList = new gamma.teamList();
		obj_teamList.initPlugin(pluginHolder);
	}
	function renderSystemHeatMapPlugin() {
		gamma.enablePlugin('systemHeatMap',loadSystemHeatMap);
	}

	function loadSystemHeatMap() {
		obj_systemHeatMap = new gamma.systemHeatMap();
		obj_systemHeatMap.initPlugin(pluginHolder);
	}

	function renderChangeListPlugin() {
		gamma.enablePlugin('changeList',loadChangeList);
	}

	function loadChangeList() {
		obj_changeList = new gamma.changeList();
		obj_changeList.initPlugin(pluginHolder);
	}

	function renderChangeOverviewPlugin() {
		gamma.enablePlugin('changeOverview',loadChangeOverview);
	}

	function loadChangeOverview() {
		obj_changeOverview = new gamma.changeOverview();
		obj_changeOverview.initPlugin(pluginHolder);
	}

	function renderSubsystemDashboardPlugin() {
		gamma.enablePlugin('subsystemDashboard',loadSubsystemDashboard);
	}

	function loadSubsystemDashboard() {
		obj_subsystemDashboard = new gamma.repository_dashboard();
		obj_subsystemDashboard.initPlugin(pluginHolder);
	}

	function renderReleaseManagementPlugin() {
		gamma.enablePlugin('releaseManagement',loadReleaseManagement);
	}

	function loadReleaseManagement() {
		obj_releaseManagement = new gamma.releaseManagement();
		obj_releaseManagement.initPlugin(pluginHolder);
	}

	function renderRepositoryOverviewPlugin() {
		gamma.enablePlugin('subsystemOverview',loadRepositoryOverview);
	}

	function loadRepositoryOverview() {
		obj_repositoryOverview = new gamma.repositoryOverview();
		obj_repositoryOverview.initPlugin(pluginHolder);
	}

	function renderKpiDashboardPlugin() {
		gamma.enablePlugin('kpiDashboard',loadKpiDashboard);
	}

	function loadKpiDashboard() {
		obj_kpiDashboard = new gamma.kpiDashboard();
		obj_kpiDashboard.initPlugin(pluginHolder);
	}

	function renderHotspotDistributionPlugin() {
		gamma.enablePlugin('hotspotDistribution',loadHotspotDistribution);
	}

	function loadHotspotDistribution() {
		obj_hotspotDistribution = new gamma.hotspotDistribution();
		obj_hotspotDistribution.initPlugin(pluginHolder);
	}

	function renderCodeissuesDetailsPlugin() {
		gamma.enablePlugin('codeissuesDetails',loadCodeissuesDetails);
	}

	function loadCodeissuesDetails() {
		obj_codeissuesDetails = new gamma.codeissuesDetails();
		obj_codeissuesDetails.initPlugin(pluginHolder);
	}

	function renderDuplicationDetailsPlugin() {
		g.enablePlugin('duplicationDetails',loadDuplicationDetails);
	}

	function loadDuplicationDetails() {
		obj_duplicationDetails = new gamma.duplicationDetails();
		obj_duplicationDetails.initPlugin(pluginHolder);
	}

	function renderMetricsDetailsPlugin() {
		gamma.enablePlugin('metricsDetails',loadMetricsDetails);
	}

	function loadMetricsDetails() {
		obj_metricsDetails = new gamma.metricsDetails();
		obj_metricsDetails.initPlugin(pluginHolder);
	}

	function renderDesignIssueDetailsPlugin() {
		gamma.enablePlugin('designissueDetails',loadDesignIssueDetails);
	}

	function loadDesignIssueDetails() {
		obj_designIssueDetails = new gamma.designIssueDetails();
		obj_designIssueDetails.initPlugin(pluginHolder);
	}

	function renderComponentListPlugin() {
		gamma.enablePlugin('componentList',loadComponentList);
	}

	function loadComponentList() {
		obj_componentList = new gamma.componentList();
		obj_componentList.initPlugin(pluginHolder);
	}

	function renderModuleDependencyPlugin() {
		gamma.enablePlugin('moduleDependency',loadModuleDependency);
	}

	function loadModuleDependency() {
		obj_moduleDependency = new gamma.moduleDependency();
		obj_moduleDependency.initPlugin(pluginHolder);
	}

	function renderComponentDependencyPlugin() {
		gamma.enablePlugin('componentDependency',loadComponentDependency);
	}

	function loadComponentDependency() {
		obj_componentDependency = new gamma.componentDependency();
		obj_componentDependency.initPlugin(pluginHolder);
	}

	function renderNodeSummaryPlugin() {
		gamma.enablePlugin('nodeSummary',loadNodeSummary);
	}

	function loadNodeSummary() {
		obj_nodeSummary = new gamma.nodeSummary();
		obj_nodeSummary.initPlugin(pluginHolder);
	}

	function renderDependencyPlotPlugin() {
		gamma.enablePlugin('dependencyPlot',loadDependencyPlot);
	}

	function loadDependencyPlot() {
		obj_dependencyPlot = new gamma.dependencyPlot();
		obj_dependencyPlot.initPlugin(pluginHolder);
	}

	function renderCityViewPlugin() {
		gamma.enablePlugin('cityView',loadCityView);
	}

	function loadCityView() {
		obj_cityView = new gamma.cityView();
		obj_cityView.initPlugin(pluginHolder);
	}

	function renderHeatmapPlugin() {
		gamma.enablePlugin('heatMap',loadHeatmap);
	}

	function loadHeatmap() {
		obj_heatMap = new gamma.heatMap();
		obj_heatMap.initPlugin(pluginHolder);
	}

	function renderTreePlugin() {
		gamma.enablePlugin('tree',loadTree);
	}

	function loadTree() {
		obj_tree = new gamma.tree();
		obj_tree.initPlugin(pluginHolder);
	}

	function renderTasksPlugin() {
		gamma.enablePlugin('tasks',loadTasks);
	}

	function loadTasks() {
		obj_tasks = new gamma.tasks();
		obj_tasks.initPlugin(pluginHolder);
	}

	function renderIssuesPlugin() {
		gamma.enablePlugin('issues',loadIssues);
	}

	function loadIssues() {
		obj_issues = new gamma.issues();
		obj_issues.initPlugin(pluginHolder);
	}

	function renderIssueListPlugin() {
		gamma.enablePlugin('issue_list',loadIssueList);
	}

	function loadIssueList() {
		obj_issueList = new gamma.issueList();
		obj_issueList.initPlugin(pluginHolder);
	}

	function renderPartitionsPlugin() {
		gamma.enablePlugin('partitions',loadPartitions);
	}

	function loadPartitions() {
		obj_partitions = new gamma.partitions();
		obj_partitions.initPlugin(pluginHolder);
	}
	function renderCoverageDistributionPlugin() {
		gamma.enablePlugin('coverageDistribution',loadCoverageDistribution);
	}

	function loadCoverageDistribution() {
		obj_coverageDistribution = new gamma.coverageDistribution();
		obj_coverageDistribution.initPlugin(pluginHolder);
	}

	function renderCoverageComponentListPlugin() {
		gamma.enablePlugin('componentCoverageList',loadCoverageComponentList);
	}
	function loadCoverageComponentList() {
		obj_coverageComponentList = new gamma.componentCoverageList();
		obj_coverageComponentList.initPlugin(pluginHolder);
	}

	function renderComplexMethodListPlugin() {
		gamma.enablePlugin('complexMethodList', loadComplexMethodList);
	}
	function loadComplexMethodList() {
		obj_complexMethodList = new gamma.complexMethodList();
		obj_complexMethodList.initPlugin(pluginHolder);
	}

	function renderUnitTestsPlugin() {
		gamma.enablePlugin('unitTests',loadUnitTests);
	}
	function loadUnitTests() {
		obj_unitTest = new gamma.unitTests();
		obj_unitTest.initPlugin(pluginHolder);
	}

	function renderCommitHistoryPlugin() {
		gamma.enablePlugin('commitHistory', loadCommitHistory);
	}

	function loadCommitHistory() {
		obj_commitHistory = new gamma.commitHistory();
		obj_commitHistory.initPlugin(pluginHolder);
	}
	function renderCodeEditorPlugin() {
		gamma.enablePlugin('codeEditor', loadCodeEditor);
	}

	function loadCodeEditor() {
		objCodeEditor = new gamma.codeEditor();
		objCodeEditor.initPlugin(pluginHolder);
	}


	//---------------- Public methods -----------------
	gamma.loadPluginSelector = function() {
		gamma.nodeSummaryInit($("#plugin_selector"));
	};
	gamma.handlePluginSelectorEvents = function() {
		handlePluginSelectorEvents();
	};
	gamma.setPluginHistory = function(plugin_id) {
		var context 		= historyManager.get('currentContext');
		var context_data 	= gamma.getContextData(context);
		var plugins 		= gamma.plugins;
		var pluginList 		= gamma.getPluginList();
		var plugin_name;
		var currentPlugin = historyManager.get('currentPlugin');
		if(plugin_id == undefined) {
			if(gamma.isContextPlugin(currentPlugin.id)) {
				plugin_name = currentPlugin.id;
			} else {
				$.each(context_data,function(key,value) {
					if(pluginList.indexOf(key) != -1) {
						plugin_name 	= key;
						return false;
					}
				});
			}
		} else {
			plugin_name = plugin_id;
		}

		historyManager.set('currentOldPlugin',currentPlugin);
		$.each(plugins,function(key,value) {
			if(value.id == plugin_name) {
				historyManager.set('currentPlugin',{'id':value.id,'name':value.name});
				return false;
			}
		});
		/*if(plugin_name == 'component_list' || plugin_name == 'change_list')
		{
			var metadata 	  	= g.getMetadata(plugin_name);
			if(metadata.resetFilters)
				g.resetFilters(plugin_name);
		}*/
	};
	// Reseting row filters for component list & change list
	gamma.resetFilters = function(currentPlugin,sendRequest) {
		e.removeComboBox();
		var checked_params;
		if(gamma.getPluginMetadata(currentPlugin,'pluginOptions')) {
			switch(currentPlugin) {
			case 'dashboard' :
				obj_dashboard.updatePluginData();
				break;
			case 'subsystem_list' :
				checked_params = {'viewOptions':'ProjectView.tiles','plottingOptions':'ProjectList.name','tags':['ProjectList.automotive','ProjectList.germany','ProjectList.india']};
				historyManager.set('currentSubsystemOptionList',checked_params);
				obj_subsystemList.updatePluginData(true);
				obj_subsystemList.renderOptionData();
				break;
			case 'project_list' :
				checked_params = {'viewOptions':'ProjectView.tiles','plottingOptions':'ProjectList.name','tags':['ProjectList.automotive','ProjectList.germany','ProjectList.india']};
				historyManager.set('currentProjectOptionList',checked_params);
				obj_projectList.updatePluginData(true);
				obj_projectList.renderOptionData();
				break;
			case 'system_heatmap' :
				obj_systemHeatMap.updatePluginData();
				break;
			case 'change_list' :
				checked_params = '';
				if(historyManager.get('currentParameterList') !== '') {
					checked_params 	= historyManager.get('currentParameterList');
				}

				checked_params.selected  = 'ratings';
				checked_params.status[0] = "";
				gamma.resetColumnFilters(checked_params,'change_list');
				historyManager.set('currentParameterList',checked_params);

				if(historyManager.get('currentChangeListFilterId') !== '') {
					var obj = {};
					if(checked_params.selected == 'ratings'){
						obj[checked_params.selected] = gamma.getParameterObjectByName('overallRating',checked_params.selected).id;
					}

					historyManager.set('currentChangeListFilterId',obj);
				}
				if(historyManager.get('currentChangeParameter') !== '') {
					var sort_object = {};
					var currentChangeListFilterId 	= historyManager.get('currentChangeListFilterId');
					sort_object.parameter_id 		= parseInt(currentChangeListFilterId[checked_params.selected]);
					sort_object.sort_type 			= 'diff_asc';
					historyManager.set('currentChangeParameter',sort_object);
				}
				if(sendRequest) {
					obj_changeList.updatePluginData();
					obj_changeList.renderOptionData();
				}
				break;
			case 'change_overview':
				obj_changeOverview.updatePluginData();
				break;
			case 'repository_dashboard':
				obj_subsystemDashboard.updatePluginData();
				break;
			case 'release_management':
				obj_releaseManagement.updatePluginData();
				break;
			case 'repository_overview':
				obj_repositoryOverview.updatePluginData();
				break;
			case 'kpi_dashboard':
				obj_kpiDashboard.updatePluginData();
				break;
			case 'component_explorer':
				obj_componentExplorer.updatePluginData();
				break;
			case 'file_explorer':
				obj_fileExplorer.updatePluginData();
				break;
			case 'hotspot_distribution':
				checked_params = '';
				if(historyManager.get('currentHotspotOptionList') !== '') {
					checked_params 	= historyManager.get('currentHotspotOptionList');
				}

				checked_params.plottingOptions  = 'by_loc';
				checked_params.YplottingOptions  = 'By Modules';
				checked_params.filters  		= 'top';
				checked_params.filter_number 	= 0;
				checked_params.filter_text 		= '';

				historyManager.set('currentHotspotOptionList',checked_params);
					//===========set reset parameter true
				obj_hotspotDistribution.updatePluginData('',true);
				obj_hotspotDistribution.renderOptionData();
				break;
			case 'code_issues_details':
				checked_params = '';
				if(historyManager.get('currentCodeIssueOptionList') !== '') {
					checked_params 	= historyManager.get('currentCodeIssueOptionList');
				}

				checked_params.selected 	= 'issue_type';
				checked_params.y_axis 		= 'issues';
				checked_params.issue_type 	= [];
				checked_params.issue_name 	= [];
				checked_params.modules 		= [];

				historyManager.set('currentCodeIssueOptionList',checked_params);
					//===========set reset parameter true
				obj_codeissuesDetails.updatePluginData(true);
				obj_codeissuesDetails.renderOptionData();
				break;
			case 'duplication_details':
				checked_params = '';
				if(historyManager.get('currentDuplicationOptionList') !== '') {
					historyManager.set('currentDuplicationOptionList','by_loc');
				}
					//===========set reset parameter true
				obj_duplicationDetails.updatePluginData(true);
				obj_duplicationDetails.renderOptionData();
				break;

			case 'coverage_distribution':
				checked_params = '';
				checked_params = ['coverage','no_coverage'];
				if(historyManager.get('currentCoverageOptionList') !== '') {
					historyManager.set('currentCoverageOptionList',checked_params);
				}
					//===========set reset parameter true
				obj_coverageDistribution.updatePluginData(true);
				obj_coverageDistribution.renderOptionData();
				break;
			case 'coverage_component_list':
					// checked_params = '';
					// checked_params = ['coverage','no_coverage'];
				var coveragecheckedparameters 		= {type:[],status:[""],hotspottype:["All"]};
				var parameterOptionList=gamma.getParameterList();
				$.each(parameterOptionList,function(key,value) {
					if(key.toLowerCase()=='type') {
						for(var i=0,len=parameterOptionList[key].length;i<len;i++) {
							if((parameterOptionList[key][i].classification).toLowerCase() == 'components')									{
								coveragecheckedparameters.type.push(parseInt(parameterOptionList[key][i].id));
							}
						}
					}
				});
				historyManager.set('currentCoverageComponentParameterList',coveragecheckedparameters);

				var sort_object = {};
				sort_object.parameter_id 	= 'overallrating';
				sort_object.sort_type = 'value_asc';
				if(historyManager.get('currentCoverageComponentParameter') !== '') {
					historyManager.set('currentCoverageComponentParameter',sort_object);
				}

				obj_coverageComponentList.updatePluginData(true);
				obj_coverageComponentList.renderOptionData();
				break;
			case 'unit_tests':
				checked_params = '';
				checked_params = ['run','ignored'];

				historyManager.set('currentUnitTestOptionList',checked_params);

				obj_unitTest.updatePluginData(true);
				obj_unitTest.renderOptionData();
				break;
			case 'metrics_details':
				checked_params = '';
				checked_params = ['violations','no_violations'];
				if(historyManager.get('currentMetricsOptionList') !== '') {
					historyManager.set('currentMetricsOptionList',checked_params);
				}
					//===========set reset parameter true
				obj_metricsDetails.updatePluginData(true);
				obj_metricsDetails.renderOptionData();
				break;
			case 'design_issue_details':
				checked_params = '';
				if(historyManager.get('currentDesignIssueOptionList') !== '') {
					checked_params 	= historyManager.get('currentDesignIssueOptionList');
				}
				checked_params.selected 					= 'component_level_antipatterns';
				checked_params.component_level_antipatterns = [];
				checked_params.method_level_antipatterns 	= [];

				historyManager.set('currentDesignIssueOptionList',checked_params);
					//===========set reset parameter true
				obj_designIssueDetails.updatePluginData(true);
				obj_designIssueDetails.renderOptionData();
				break;
			case 'component_list':
				$('.panel_header .panel_title .panel_title_text').html(g.print('component_list'));
				$('.plugin_nodeSummary .rowDetails').find('.design_issue.fill_highlight').removeClass('fill_highlight').addClass('fill_base');
				checked_params = '';
				if(historyManager.get('currentComponentParameterList') !== '') {
					checked_params 	= historyManager.get('currentComponentParameterList');
				}

				checked_params.selected 				= 'ratings';
				checked_params.showAllComponents 		= true;
				checked_params.showImmediateComponents 	= false;
				checked_params.showDuplicateComponents 	= false;
				gamma.resetColumnFilters(checked_params,'component_list');
				historyManager.set('currentComponentParameterList',checked_params);

				if(historyManager.get('currentComponentListFilterId') !== '') {
					var obj = {};
					if(checked_params.selected == 'ratings') {
						obj[checked_params.selected] = gamma.getParameterObjectByName('overallRating',checked_params.selected).id;
					}
					historyManager.set('currentComponentListFilterId',obj);
				}
				if(historyManager.get('currentComponentParameter') !== '') {
					var sort_object = {};
					var currentComponentListFilterId 	= historyManager.get('currentComponentListFilterId');
					sort_object.parameter_id 			= parseInt(currentComponentListFilterId[checked_params.selected]);
					sort_object.sort_type 				= 'value_asc';
					historyManager.set('currentComponentParameter',sort_object);
				}
				if(sendRequest) {
					obj_componentList.updatePluginData();
					obj_componentList.renderOptionData();
				}
				break;
			case 'dependency_plot':
				obj_dependencyPlot.updatePluginData(true);
				break;
			case 'heatmap':
				obj_heatMap.updatePluginData();
				break;
			case 'complex_method_list':
				obj_complexMethodList.updatePluginData();
				break;
			case 'city_view':
				obj_cityView.updatePluginData();
				break;
			case 'tasks':
				var i;
				var tasksMetadata = gamma.tasks.gamma_formatter.getTasksMetadata();
				var checkedparameters = {'selected_sort_option':'date','criticality_details':[],'status_details':[],'type_details':[],'show_details':false};
				$.each(tasksMetadata,function(key,value) {
					switch(key.toLowerCase()) {
					case 'criticality_details': for (i = 0; i < tasksMetadata[key].length; i++) {
						checkedparameters.criticality_details.push(tasksMetadata[key][i].id);
					}
						break;
					case 'type_details': for (i = 0; i < tasksMetadata[key].length; i++) {
						checkedparameters.type_details.push(tasksMetadata[key][i].id);
					}
						break;
					case 'status_details': for(i = 0; i < tasksMetadata[key].length; i++) {
						checkedparameters.status_details.push(tasksMetadata[key][i].id);
					}
						break;
					default:
						break;
					}
				});
				historyManager.set('currentTasksOptionList',checkedparameters);

				obj_tasks.updatePluginData(true);
				obj_tasks.renderOptionData();
				break;
			case 'issues':

				obj_issues.updatePluginData(true);
				obj_issues.renderOptionData();
				break;

			case 'issue_list':

				var i;
				var issue_list_meta_data = gamma.getIssueListMetadata();
				var checkedparameters = {'selected_sort_option':'date','selected_filter_option':'Project','criticality_details':[],'issue_type':[],'team_details':[],'project_details':[],'show_details':false};
				$.each(issue_list_meta_data,function(key,value) {
					switch(key.toLowerCase()) {
					case 'criticality_details': for (i = 0; i < issue_list_meta_data[key].length; i++) {
						checkedparameters.criticality_details.push(issue_list_meta_data[key][i].id);
					}
						break;
					case 'issue_type': for (i = 0; i < issue_list_meta_data[key].length; i++) {
						checkedparameters.issue_type.push(issue_list_meta_data[key][i].id);
					}
						break;
					case 'team_details': for (i = 0; i < issue_list_meta_data[key].length; i++) {
						checkedparameters.team_details.push(issue_list_meta_data[key][i].id);
					}
						break;
					case 'project_details': for (i = 0; i < issue_list_meta_data[key].length; i++) {
						checkedparameters.project_details.push(issue_list_meta_data[key][i].id);
					}
						break;
					default:
						break;
					}
				});
				historyManager.set('currentIssueListOptionList',checkedparameters);

				obj_issueList.updatePluginData(true);
				obj_issueList.renderOptionData();
				break;

			case 'partitions':
				obj_partitions.updatePluginData(true);
				obj_partitions.renderOptionData();
				break;
			default:
				break;
			}
		}
	};
	//reseting column filters fr componentlist and changelist
	gamma.resetColumnFilters = function(checkedparameters,plugin_id) {
		var i, len;
		var parameterOptionList = gamma.getParameterList();
		checkedparameters.ratings = [];
		checkedparameters.metrics = [];
		checkedparameters.type = [];
		checkedparameters.duplication = [];
		$.each(parameterOptionList,function(key,value) {
			switch(key.toLowerCase())			{
			case 'ratings': for(i=0,len=parameterOptionList[key].length;i<len;i++)								{
				checkedparameters.ratings.push(parseInt(parameterOptionList[key][i].id));
			}
				break;
			case 'metrics': for(i=0,len=parameterOptionList[key].length;i<len;i++) {
				if (parameterOptionList[key][i].name != 'CR' && parameterOptionList[key][i].name != 'NOP') {
					checkedparameters.metrics.push(parseInt(parameterOptionList[key][i].id));
				}
			}
				break;
			case 'type' :   for(i=0,len=parameterOptionList[key].length;i<len;i++) {
				if ((parameterOptionList[key][i].classification).toLowerCase() == 'components') {
					checkedparameters.type.push(parseInt(parameterOptionList[key][i].id));
				}
			}
				break;
			case 'duplication': for(i=0,len=parameterOptionList[key].length;i<len;i++) {
				checkedparameters.duplication.push(parseInt(parameterOptionList[key][i].id));
			}
				break;
			default:
				break;
			}
		});
		if (plugin_id == 'change_list') {
			historyManager.set('currentParameterList',checkedparameters);
		}	else		{
			historyManager.set('currentComponentParameterList',checkedparameters);
		}
	};
	gamma.loadPlugin = function(holder,plugin,unloadOldPlugin) {
		loadPlugin(holder,plugin,unloadOldPlugin);
	};
	gamma.unloadPlugin = function(holder,plugin) {
		unloadOldPluginContent(holder,plugin);
	};
	gamma.createPluginOptionList = function(holder) {
		createPluginOptionList(holder);
	};
	gamma.togglePluginOptionList = function(event) {
		togglePluginOptionList(event);
	}
	return gamma;
}(g));
