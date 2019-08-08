//========== varANTS ===========
var g = (function(gamma) {

		var selectedRepository;

		//------------ PRIVATE METHODS ---------------
		//------------- subscribing gamma events ----------------
		function subscribeEvents() {
			e.subscribe(gamma.notifications.DATA_REQUESTED,disablePanel);
			e.subscribe(gamma.notifications.RENDERING_COMPLETE,enablePanel);
			e.subscribe(gamma.notifications.DATA_ERROR,showError);
			e.subscribe(gamma.notifications.ENCRYPTION_LOADED,onEncryptionSettingsLoaded);
			e.subscribe(gamma.notifications.SUBSYSTEMS_LOADED,gamma.updateSubsystemHistory);
			e.subscribe(gamma.notifications.PARAMETERS_LOADED,updateParameterHistory);

			e.subscribe(gamma.notifications.ISSUE_LIST_DETAILS_LOADED,updateIssueListHistory);

			e.subscribe(gamma.notifications.SNAPSHOTS_LOADED,gamma.updateSnapshotHistory);

			e.subscribe(gamma.notifications.HASH_UPDATE,updateSubsystemData);
			e.subscribe(gamma.notifications.BREADCRUMB_UPDATE,updateSubsystemData);
			e.subscribe(gamma.notifications.SEARCH_UPDATE,updateSubsystemData);
			e.subscribe(gamma.notifications.TREE_UPDATE,updateSubsystemData);
			e.subscribe(gamma.notifications.PLUGIN_UPDATE,updateSubsystemData);
			e.subscribe(gamma.notifications.UPDATE_TIMELINE_SELECTION,gamma.onhashChangeUpdateSnapshotList);
			e.subscribe(gamma.notifications.SNAPSHOT_UPDATE,updateSubsystemData);
			//e.subscribe(gamma.notifications.BOOKMARK_UPDATE,updateSubsystemData);
			e.subscribe(gamma.notifications.SUBSYSTEM_UPDATE,onSubsystemChange);
			//e.subscribe(gamma.notifications.LOAD_PLUGIN,onLoadPlugin);
			e.subscribe("PROJECT_RENDER_COMPLETE",onProjectRender);
			e.subscribe(gamma.notifications.PROJECT_UPDATE,onProjectUpdate);
			e.subscribe(gamma.notifications.TEAM_UPDATE,onTeamUpdate);

			e.subscribe(e.notifications.DATA_REQUESTED,disablePanel);
			e.subscribe(e.notifications.DATA_LOADED,enablePanel);

		}
		function onEncryptionSettingsLoaded() {
			//--------- Mixpanel intialization with token -------------
            if (gamma.is_cloud)
            {
                mixpanel.init(gamma.mixpanel_token);

                var APP_ID = gamma.intercom_app_id;
                window.intercomSettings = {
                    app_id: APP_ID,
                    alignment: 'left',
                    horizontal_padding: 50,
                    custom_launcher_selector: '.ic-intercom-chat'
                };
                (function () {
                    var w = window;
                    var ic = w.Intercom;
                    if (typeof ic === "function")
                    {
                        ic('reattach_activator');
                        ic('update', intercomSettings);
                    } else {
                        var d = document;
                        var i = function () { i.c(arguments) };
                        i.q = [];
                        i.c = function (args) { i.q.push(args) };
                        w.Intercom = i;
                        function l() {
                            var s = d.createElement('script');
                            s.type = 'text/javascript';
                            s.async = true;
                            s.src = 'https://widget.intercom.io/widget/' + APP_ID;
                            var x = d.getElementsByTagName('script')[0];
                            x.parentNode.insertBefore(s, x);
                        }
                        if (w.attachEvent) { w.attachEvent('onload', l); }
                        else { w.addEventListener('load', l, false); }

                        l();

                        Intercom('onShow', function () {
							$('.ic-intercom-chat').addClass('ic-message-close').removeClass('ic-message');
                            $('.ic-intercom-chat').parent('.left-menu-icon').addClass('left-menu-active-item');
                        });
                        Intercom('onHide', function () {
                            $('.ic-intercom-chat').removeClass('ic-message-close').addClass('ic-message');
                            $('.ic-intercom-chat').parent('.left-menu-icon').removeClass('left-menu-active-item');
                        });
                    }
				})();
				//Userlane
				gamma.userlaneTrigger(); 
			}

			//--------- Get pluginlist to be shown in ui---------------
			gamma.getPlugins();

			//---------- Set language english/german
			var current_lang = historyManager.get('currentLanguage');
			if(current_lang === '')
			{
				historyManager.set('currentLanguage','en');
			}
			gamma.toggleLanguage(current_lang);

			//---------- Set rating range -5 to 5 / 0 to 10------------
			var current_range = historyManager.get('currentRange');
			if(current_range === '')
			{
				historyManager.set('currentRange','range_2');
			}
			gamma.toggleRange(current_range);

			//----------- Set time zone ----------------
			moment.lang(gamma.getLocale());

			//-----------load left panel --------------------
			gamma.leftPanelInit();
			//--------- Register hashchange event -----------------
			handleBrowserHashChange();
			//--------- Register search click event -----------------
			gamma.handleSearchEvents();
			//--------- Register rightenu click event -----------------
			gamma.handleRightMenuEvents();
			//--------- Register tagging click event -----------------
			gamma.handleTagEvents();
		}

		var oldURL;
		function handleBrowserHashChange() {
			// -------------- Called when browse back button is pressed --------------------
			window.onhashchange = function(event) {
				if ($(".popup_panel_container").length){
					e.notify("CLOSE_POPUP_PANEL");
					window.history.forward();
				}else{
                    var url = window.location.hash;
                    if (!($.isEmptyObject(url)) && url.trim() != '') {
                        var decoded_url = gamma.decodeURL(url);
						if (decoded_url.id != historyManager.get('currentHash') && oldURL) {
							var old_decoded_url = gamma.decodeURL(oldURL);
							if (!($.isEmptyObject(old_decoded_url))) {
								$.each(gamma.plugins, function (key, value) {
									if (value.id == old_decoded_url.plugin_id) {
										historyManager.set('currentOldPlugin', value);
									}
								});
							}
							historyManager.set('currentHash', decoded_url.id);
							popHistory(decoded_url, false);
						}
					}
					else {
                        window.history.forward();
					}
					oldURL = location.href;
				}
				e.removeDropdown();
				e.removeComboBox();
				if ($('.menu_option_list_wraper'.length))
				{
					$('.menu_option_list_wraper').remove();
				}
		  	};
		  	//on refresh click
			  if (!($.isEmptyObject(window.location.hash)) && window.location.hash!="")
		  	{
		  		//This will execute when we copy the URL n open in new tab
		  		var decoded_url = gamma.decodeURL(window.location.hash);
		  		//reload is set to true as we have to refresh the page for new tab.Otherwise repload is false
		  		g.getIssueListDetails();
		  		popHistory(decoded_url,true);
			}
			else{
				  initFramework();
			}
		}

		//------------- Used for google analysis ----------------
		function googleAnalyse() {
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-69740286-1', 'auto');
			ga('set', {
				page: '/gamma/#' + localStorage.getItem('current_user'),
				title: 'Gamma - '+historyManager.get('currentSubSystemName')+' : '+historyManager.get('currentPlugin').name
			});
			ga('send', 'pageview');/*,{ 'dimension1': historyManager.get('currentPlugin').name});*/
		}

		//-----------------------CALLED ON BROWSER BACK BUTTON CLICK ------------------------
		function popHistory(hash,reload) {
			var history_view = hash;
			var history_snaps = [];
			$(".gamma-main-wraper").removeClass("blur-main-content");
			if(history_view != null)
			{
				//callback functions
				function loadPanel() {
					e.enablePlugin('panel',panelLoaded);
				}

				function panelLoaded() {
					new e.panel({target:$('#bottom_container'),height:gamma.contentHeight(),title:historyManager.get('currentPlugin').id});

					$(".search_click").addClass('hide');
					if(history_view.context != 'root' && history_view.context != 'systems' && history_view.mode == 'explorer')
					{
						$(".search_click").removeClass('hide');
						gamma.getSubsystems();
					}
					loadHistoryData();
				}

				function loadHistoryData() {
					$('.popup_container').remove();
					$('.overlay_container').css('display','none')
					//setting history as per the hash only if you are in explorer mode.In management mode we don't need this information
					if(history_view.mode == 'explorer')
					{
                        gamma.setPluginHistory(history_view.plugin_id);
						if(historyManager.get('currentContext') == 'systems')
						{
							g.breadcrumbLoaded = false;
							e.unSubscribe(g.notifications.PLUGIN_LOADED);
							e.unSubscribe(g.notifications.RESIZE_BREADCRUMB);
						}
						if(history_view.context != 'root')
						{
							historyManager.set('currentBreadcrumb',{ "id":history_view.breadcrumb.node_id,"name":history_view.breadcrumb.node_name});
							$("header,#plugin_selector").addClass('hide');
							$("#plugin_selector").hide();
                        }
                        //set snapshot history as per the parameters present in hash
						if(!$.isEmptyObject(history_view.request_data) && history_view.context != 'root' && history_view.context != 'systems')
						{
                            gamma.getSnapshots();
							gamma.updateSnapshotAfterAnalysis(false);
                            history_snaps 		= historyManager.get('selectedSnapshots');
							var max_snapshots 	= (gamma.getMetadata(history_view.plugin_id))?gamma.getMetadata(history_view.plugin_id).max_snapshot:1;
							if(history_view.plugin_id == 'release_management' && (gamma.getSnapshotList()).length > 1)
							{
								max_snapshots = 2;
							}
							if(max_snapshots > 1)
							{
								history_snaps[0] = gamma.searchObjectById(gamma.getSnapshotList(),history_view.request_data.snapshot_id_new);
								history_snaps[0].snapshotType= 1;
								history_snaps[1] = gamma.searchObjectById(gamma.getSnapshotList(),history_view.request_data.snapshot_id_old);
								history_snaps[1].snapshotType= 2;
								historyManager.set('selectedSnapshots',history_snaps);
							}
							else
							{
								var sel_snaps = [];
								if((history_view.plugin_id == 'release_management' || history_view.plugin_id == 'subsystem_dashboard'))
								{
									sel_snaps[0] = gamma.searchObjectById(gamma.getSnapshotList(),history_view.request_data.snapshot_id_new);
								}	
								else if (history_view.plugin_id == 'repository_dashboard')
								{
									sel_snaps[0] = gamma.searchObjectById(gamma.getSnapshotList(), history_snaps[0].id);
								}
								else
								{
									sel_snaps[0] = gamma.searchObjectById(gamma.getSnapshotList(),history_view.request_data.snapshot_id);
								}
								sel_snaps[0].snapshotType= 1;
								historyManager.set('selectedSnapshots',sel_snaps);
							}
							gamma.getAllocatedTagCount();
							$("header,#plugin_selector").removeClass('hide');
						}
					}
					if(history_view.mode == 'explorer')
					{
						$("header,#plugin_selector").addClass('hide');
						$("#plugin_selector").hide();
						function repoDetailsLoaded(data, status) {
							if (status == 'success') {
								g.setRepoMetaData(data);
								gamma.loadFromHistory = true;
								e.notify(gamma.notifications.PLUGIN_UPDATE);
								$(document).attr('title','Gamma - '+historyManager.get('currentPlugin').name);
								if(gamma.googleAnalyzeCode != ""){
									googleAnalyse();
								}
							}
						}
						getRepositoryDetails(historyManager.get('currentSubSystemUid'),repoDetailsLoaded);

					}
					else if(history_view.mode == 'management')
					{
						$("header,#plugin_selector").addClass('hide');
						$("#plugin_selector").hide();
						switch(history_view.plugin_id)
						{
							case 'company' :  // Company Details

										gamma.admin.account.account_details.loadAccountDetails();
									   	break;
							case 'admin_details' :  // User list
										var default_parameter = history_view.request_data.default_parameter;

										gamma.admin.left_menu.loadAdminDetails(default_parameter,true);
										break;
							case 'user_details' :  // User list
										gamma.admin.account.account_details.loadAccountDetails(gamma.user_id);
										break;
							case 'add_user' :

										gamma.admin.users.add_user.addNewUser();
										break;
							case 'edit_user' :  // Company Details
										var user_id = history_view.request_data.user_id;

										gamma.admin.users.edit_user.editUser(user_id, 'EDIT_USER_REDIRECT');
									   	break;
							case 'team_details' :  // Manage Teams
										var team_id 	= history_view.request_data.team_id;
										var team_name 	= history_view.request_data.team_name;
										var default_parameter = history_view.request_data.default_parameter;

										gamma.admin.teams.left_menu.loadTeamDetails(default_parameter,team_id,team_name,true);
										break;
							case 'add_team' :

										gamma.admin.teams.add_team.addNewTeam();
										break;
							case 'edit_team' :
										var team_id = history_view.request_data.team_id;

										gamma.admin.teams.edit_team.editTeam(team_id);
										break;
							case 'project_details' :  // Manage Systems
										var project_id 		= history_view.request_data.project_id;
										var project_name 	= history_view.request_data.project_name;
										var default_parameter = history_view.request_data.default_parameter;

										gamma.admin.projects.left_menu.loadProjectDetails(default_parameter,project_id,project_name,true);
										break;
							case 'add_project' :

										gamma.admin.projects.add_project.addNewProject();
										break;
							case 'edit_project' :
										var project_id = history_view.request_data.project_id;

										gamma.admin.projects.edit_project.editProject(project_id);
										break;
							case 'subsystem_details' :  // Manage Systems
										var subsystem_id 		= history_view.request_data.subsystem_id;
										var subsystem_uid 		= history_view.request_data.subsystem_uid;
										var subsystem_name 		= history_view.request_data.subsystem_name;
										var default_parameter 	= history_view.request_data.default_parameter;

										gamma.admin.subsystems.left_menu.loadSubsystemDetails(default_parameter,subsystem_id,subsystem_uid,subsystem_name,true);
										break;
							case 'add_kpi' :

										gamma.admin.kpis.add_kpi.addNewKpi();
										break;
							case 'add_quality_profile' :

										gamma.admin.kpis.add_kpi.addNewKpi();
										break;
							case 'edit_kpi' :
										var kpi_id = history_view.request_data.kpi_id;

										gamma.admin.kpis.edit_kpi.editKpi(kpi_id);
										break;
							case 'kpi_details' :  // Manage Systems
										var kpi_id 		= history_view.request_data.kpi_id;
										var kpi_name 	= history_view.request_data.kpi_name;
										var default_parameter 	= history_view.request_data.default_parameter;

										gamma.admin.kpis.left_menu.loadKpiDetails(default_parameter,kpi_id,kpi_name,true);
										break;
							case 'version_control_details' :  // Version Controls
										var version_control_id 		= history_view.request_data.version_control_id;
							        	var version_control_name 	= history_view.request_data.version_control_name;

										gamma.admin.version_control.version_control_account_details.loadVersionControlAccountDetails(version_control_id,version_control_name);
										break;
							case 'add_version_control_account' :  // Add Account

										gamma.admin.version_control.add_version_control_account.addNewVersionControlAccount();
										break;
							case 'edit_version_control_account' :  // Add Account
										var version_control_id 		= history_view.request_data.version_control_id;

										gamma.admin.version_control.edit_version_control_account.editVersionControlAccount(version_control_id);
										break;
							case 'add_subsystem' :  // Add Subsystems

										gamma.admin.subsystems.add_subsystem.addNewSubsystem();
										break;
							case 'edit_subsystem' :  // Add Subsystems
											var subsystem_id = history_view.request_data.subsystem_id;

											gamma.admin.subsystems.edit_subsystem.editSubsystem(subsystem_id);
										break;
							case 'analysis_queue_details' :  // Analysis Queue
										var subsystem_uid       = history_view.request_data.repositoryUid;
						        		var analysis_queue_name = history_view.request_data.analysis_queue_name;
						        		var analysis_id 		= history_view.request_data.analysis_req_id;

										gamma.admin.analysis.analysis_details.loadAnalysisDetails(analysis_queue_name, analysis_id, subsystem_uid);
										break;
							default:
								break;

						}
						e.changeMode('management');
						$(".tree-icon").addClass('hide');
						$(document).attr('title','Gamma - '+history_view.plugin_id);
						if(gamma.googleAnalyzeCode != "")
						{
							googleAnalyse();
						}
						$('[title]').tooltipster();
						var leftMenuPanelWidth=0;
						if(!$('.left-menu-panel-container').hasClass('hidden')){
							leftMenuPanelWidth = $('.left-menu-panel-container').width();
						}
						$('.gamma-wraper').width($(window).width()  - $(".left-menu-bar").width() -leftMenuPanelWidth);
					}
					gamma.selectLeftPanelIcon(history_view);
				}

				//if reload is true , that means we are on new tab or page refresh .. so calling initFramework()..on refresh intializing context and panel plugins
				e.changeMode('explorer');
				historyManager.set('currentSystem',history_view.project_id);
				historyManager.set('currentSubSystem',history_view.subsystem_id);
				historyManager.set('currentProjectName',history_view.project_name);
				historyManager.set('currentContext',history_view.context);
				historyManager.set('currentSubSystemUid',history_view.subsystem_uid);
				historyManager.set('currentSubSystemName',history_view.subsystem_name);

				if(history_view.subsystem_id != historyManager.get('currentSubSystem') && !reload && history_view.context != 'root' && history_view.context != 'systems')
				{
					gamma.breadcrumbLoaded 		= true;
					gamma.snapshotPluginLoaded 	= false;
					gamma.setSubsystemHistory(history_view.subsystem_id,history_view.subsystem_name,history_view.subsystem_uid);
					gamma.getParameters();
					gamma.getSnapshots();
					//loadHistoryData();
				}
				else
				{
					if(reload)
					{
						gamma.sendBreadcrumbNotification = false;
						e.enablePlugin('context',loadPanel);
						// initialise userlane
						onProjectRender(true);
					}
					else
					{
						gamma.sendBreadcrumbNotification = true;
						loadHistoryData();
					}
				}
				gamma.getCurrentAnalysis();
			}
			e.notify(g.notifications.RESIZE_BREADCRUMB,{'action':'close'});
		}

		function initFramework() {
			e.enablePlugin('context',onContextPluginEnabled);
		}

		function onContextPluginEnabled() {
			e.enablePlugin('panel',onPanelPluginEnabled);
		}

		function onPanelPluginEnabled() {
			//=========== for the 1st time when user logins, no plugin is selected.so default plugin is project list

			new e.panel({target:$('#bottom_container'),height:gamma.contentHeight(),title:historyManager.get('currentPlugin').id});

			g.getIssueListDetails();
			if(historyManager.get('currentPlugin') == undefined || historyManager.get('currentPlugin') == '')
			{
				$('#team_tab').removeClass('active_tab');
        		$('#team_tab').addClass('color_medium');

        		$('#project_tab').addClass('active_tab');
        		$('#project_tab').removeClass('color_medium');
        		$('#issues_tab').removeClass('active_tab');
	            $('#issues_tab').addClass('color_medium');
	            $('#tasks_tab').removeClass('active_tab');
	    		$('#tasks_tab').addClass('color_medium');

				historyManager.set('currentContext','root')
				gamma.setPluginHistory('project_list');
				gamma.loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin'),true);
			}
			else if(historyManager.get('currentContext') == 'root' || historyManager.get('currentContext') == 'systems')
			{
				gamma.setPluginHistory();
				gamma.loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin'),true);
			}
			else //============= load data from history  ================
			{
				gamma.getSubsystems();
			}
		}

		// ================================= NOTIFICATION SUBSCRIPTIONS ===============================
		//--------------CALLED WHEN 'DATA_REQUESTED' NOTIFICATION IS SENT-------------
		function disablePanel() {
			// $('#loading_msg').show();
			// $("body").css("cursor", "progress");
		}

		//--------------CALLED WHEN 'PROJECT_RENDER_COMPLETE' NOTIFICATION IS SENT-------------
		function onProjectRender(data) {
			//Userlane init
			if(gamma.is_cloud) {
				gamma.userLaneInit(data.scanPresent);
			}
		}

		//--------------CALLED WHEN 'RENDERING_COMPLETE' NOTIFICATION IS SENT-------------
		function enablePanel() {			
			if(e.request_register.length == 0)
			{
				// $("body").css("cursor", "auto");
				// $('#content').scrollTop(0);

				// setTimeout(function(){
				// 	$('#loading_msg').hide();
				// 	$("#loading_overlay").hide();
				// },500);
			}
		}

		//--------------CALLED WHEN PARAMETERS_LOADED notification is sent------------------
		function updateParameterHistory() {
			var i,len;
			var parameterOptionList = gamma.getParameterList();
			if(historyManager.get('currentParameterList') === '')
			{
				var checkedparameters 	= {selected:'ratings',ratings:[],metrics:[],duplication:[],type:[],status:[""],codeissuetype:"",codeissuename:"",ruletypeid:"",ruletypename:"",metricid:"",hotspottype:[""],showAllComponents:true,showImmediateComponents:false,showDuplicateComponents:false};
				var coveragecheckedparameters 		= {type:[],status:[""],hotspottype:[""]};
				$.each(parameterOptionList,function(key,value) {
					switch(key.toLowerCase())
					{
						case 'ratings': for(i=0,len=parameterOptionList[key].length;i<len;i++)
										{
											checkedparameters.ratings.push(parseInt(parameterOptionList[key][i].id));
										}
										break;
						case 'metrics': for(i=0,len=parameterOptionList[key].length;i<len;i++)
										{
											//if(parameterOptionList[key][i].name != 'CR' && parameterOptionList[key][i].name != 'NOP')
											checkedparameters.metrics.push(parseInt(parameterOptionList[key][i].id));
										}
										break;
						case 'type' :   for(i=0,len=parameterOptionList[key].length;i<len;i++)
										{
											if((parameterOptionList[key][i].classification).toLowerCase() == 'components')
											{
												checkedparameters.type.push(parseInt(parameterOptionList[key][i].id));
												coveragecheckedparameters.type.push(parseInt(parameterOptionList[key][i].id));
											}
										}
										break;
						case 'duplication': for(i=0,len=parameterOptionList[key].length;i<len;i++)
											{
												checkedparameters.duplication.push(parseInt(parameterOptionList[key][i].id));
											}
										break;
						default:
							break;
					}
				});
				historyManager.set('currentParameterList',checkedparameters);
				historyManager.set('currentComponentParameterList',checkedparameters);
				historyManager.set('currentCoverageComponentParameterList',coveragecheckedparameters);
			}
		}

		//  function updateIssuesHistory(){

		//  }

		function updateIssueListHistory(){
			//var i;
			var issue_list_meta_data = gamma.getIssueListMetadata();
			if(historyManager.get('currentIssueListOptionList') === '')
			{
				var checkedparameters = {'selected_sort_option':'criticality',/*'selected_filter_option':'Project',*/'criticality_details':[],'issue_type':[],'team_details':[],'project_details':[],'show_details':false};
				$.each(issue_list_meta_data,function(key,value) {
					switch(key.toLowerCase())
					{
						case 'criticality_details': for (var i = 0; i < issue_list_meta_data[key].length; i++) {
										    			checkedparameters.criticality_details.push(issue_list_meta_data[key][i].id);
										    		}
										    		break;
						case 'issue_type': for (var i = 0; i < issue_list_meta_data[key].length; i++) {
										    			checkedparameters.issue_type.push(issue_list_meta_data[key][i].id);
										    		}
										    		break;
						case 'team_details': for (var i = 0; i < issue_list_meta_data[key].length; i++) {
										    			checkedparameters.team_details.push(issue_list_meta_data[key][i].id);
										    		}
										    		break;
						case 'project_details': for (var i = 0; i < issue_list_meta_data[key].length; i++) {
													checkedparameters.project_details.push(issue_list_meta_data[key][i].id);
												};
												break;
						default:
							break;
					}
				});
				historyManager.set('currentIssueListOptionList',checkedparameters);
			}
		}

		//--------------CALLED WHEN 'PLUGIN_UPDATE','HASH_UPDATE','BREADCRUMB_UPDATE','TREE_UPDATE','BOOKMARK_UPDATE' NOTIFICATION IS SENT-------------
		function updateSubsystemData() {
			if(historyManager.get('currentPlugin') == '')
			{
				g.setPluginHistory('project_list');
			}
			if(historyManager.get('currentContext') == 'root' ){
				$('#breadcrumb').addClass('hide');
				$("header").addClass('hide');
			}

			if(historyManager.get('currentContext') == 'systems' || historyManager.get('currentContext') == 'subsystems'){
				$('#project_tab, #team_tab, #issues_tab, #tasks_tab').removeClass('active_tab');
        		$('#project_tab, #team_tab, #issues_tab, #tasks_tab').addClass('color_medium');
			}

			if(historyManager.get('currentContext') == 'root' || historyManager.get('currentContext') == 'systems')
			{
				$(".search_click, .tag_click , .tree-icon, .run_analysis").addClass('hide');
				$(".tree-panel-container").addClass('hidden');
				$("#tree-icon-container").removeClass('active');
				$(window).resize();
				$(".sanpshot_selection_container").html('');
			}
			else
			{
				if ( /*gamma.is_cloud && */ gamma.hasPermission('RUN_SCAN') && gamma.checkRoleOnSubsystem(historyManager.get('currentSubSystemUid'), 'RUN_SCAN')) {
					//$('header .btn-container .available_scan_credit').show();
					$('header .btn-container .available_scan_credit').css("display", "table");
				}
				else {
					$('header .btn-container .available_scan_credit').hide();
				}
				$("header").removeClass('hide');
				$(".search_click, .tag_click , .tree-icon, .run_analysis").removeClass('hide');
				g.setAnalysisSubsystemUid(historyManager.get('currentSubSystemUid'));
				if ($(".tree-panel-container").hasClass('hidden'))
				{
					$("#tree-panel-container").removeClass('active');
				}
				$('#breadcrumb').removeClass('hide');

				var emulsion_panel=e.panelsManager.panels[0].panel;
				emulsion_panel.prepend($("#plugin_selector").clone());
				$("#plugin_selector").remove();
				$("#plugin_selector").removeClass("hide").show();
				g.loadPluginSelector();
			}
			g.loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin'),true);

			$(document).off('click', '#run_analysis_container .available_scan_credit');
			$(document).on('click', '#run_analysis_container .available_scan_credit', function (event) {
				g.hideTreePanel();
				e.changeMode('management');
				g.pushHistory('admin_details', '', '', { 'default_parameter': 'license', 'breadcrumb': "license" }, 'management');
				g.admin.left_menu.loadAdminDetails('license', true);
				$('.left-menu-bar .left-menu-icon').removeClass('left-menu-active-item');
				$('.left-menu-bar .left-menu-bottom-aligned .ic-admin').parent('.left-menu-icon').addClass('left-menu-active-item');
				$(document).attr('title', 'Gamma - ' + i18next.t("common.page_title.admin_details") + ' : ' + i18next.t("admin.license"));
			});
			if(historyManager.get('currentRepoType') == 'remote')
			{
				$("#run_analysis_container .run_analysis").addClass("disabled");
			}
		}

		// function changePluginOptionList() {
		// 	g.loadPluginSelector();
		// }

		//================ this function is called when we select the project from project list ===================
		function onProjectUpdate() {
			historyManager.set('currentContext','systems');
			g.setPluginHistory('subsystem_list');
			// $("header").removeClass('hide');
        	g.loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin'),true);
		}

		function onTeamUpdate(){
			historyManager.set('currentContext','systems');
        	g.setPluginHistory('subsystem_list');
        	g.loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin'),true);
		}

		function getRepositoryDetails(selectedRepoUIdUID,callback) {
			let PATH_GET_REPO_DETAILS = '/repositories/';
			e.loadJSON(`${PATH_GET_REPO_DETAILS}${selectedRepoUIdUID}`, callback, {});
		}
		function getRepositoryDetailsCallBack(data, status) {
			if (status == 'success') {
				g.updateSubsystemHistory(selectedRepository,data);
				g.loadSnapshotsLayout();
				g.getCurrentAnalysis();
				g.setPluginHistory("repository_dashboard");
			}
		}
		//================ this function is called when we select the subsystem from subsystem list ===================
		function onSubsystemChange(selected_subsystem) {
			historyManager.set('currentContext','subsystems');
			selectedRepository = selected_subsystem;
			historyManager.set('currentTaskTypeContext', '');
			getRepositoryDetails(selectedRepository.uid, getRepositoryDetailsCallBack);
		}

		//--------------CALLED WHEN 'DATA_ERROR' NOTIFICATION IS SENT - COMMON FUNCTION TO HANDLE ERRORS -------------
		function showError(data_object) {
			var notification = 'ERROR_POPUP_CLOSE';
			// var error_code = (data_object.responseJSON == undefined)?0:data_object.responseJSON.code;
			// var notification_status = (data_object.responseJSON == undefined)?data_object.status:data_object.responseJSON.status;
			var error = (data_object.responseJSON.error == undefined) ? 0 : data_object.responseJSON.error; //data_object.responseJSON.error;
			console.log(error);
			var error_alert;
			if(data_object.notification_name !== undefined)
			{
				notification = data_object.notification_name;
			}
				
			/*if(error_code == "")//status is 0 when page not found
				window.location.href = gamma.PAGE_NOT_FOUND;*/
			if (error.code == 1759){
				window.location.href = gamma.PAGE_TEMPERED;
			}else{

				function onErrorPopupClose() {
					if ($(".popup_panel_container").length){
						$(".popup_panel_container").css("pointer-events", "auto");
						$('.gamma-main-wraper').css({
							"animation-fill-mode": '',
							'opacity': ''
						});
					}
					e.unSubscribe('ERROR_POPUP_CLOSE');
				}

				function showAlert() {
					var msg_text = error.name;
					var msg_text_more = error.message;
					error_alert    			= new e.popup({width:500,height:'auto',default_state:1,style:{popup_content:{'padding':28}},focusIn:false,notify:{onPopupClose:notification}});

				    //=============== get received data ==================
					var err_text 		= 'error';

					var popup_title_data = $('<div/>', { class:'popup_title_data confirm_popup_title float_left h2 semibold text_transform_capitalize'});
				    var err_color_class = '', font_class="";
				    if(err_text == 'info'){
				    	err_color_class = 'color_info';
				    	font_class = 'ic-info';
				    }
				    else if(err_text == 'success'){
				    	err_color_class = 'color_good';
				    	font_class = 'ic-success';
				    }
				    else if(err_text == 'warning'){
				    	err_color_class = 'color_warning';
				    	font_class = 'ic-alert';
				    }
				    else if(err_text == 'error'){
				    	err_color_class = 'color_bad';
				    	font_class = 'ic-alert';
				    }

				    var error_icon 			= $('<div/>',{class:'error_icon float_left '+err_color_class});
				    e.renderFontIcon(error_icon,font_class);
				    var error_title 		= $('<div/>',{class:'error_title float_left language_text '+err_color_class}).html(g.print(err_text));
				    error_title.attr('data-language_id',err_text);
				    popup_title_data.append(error_icon,error_title);

				    var popup_data 			= $('<div/>',{class:'popup_data explore_error float_left'});
					var error_message 		= $('<div/>',{class:'error_message float_left'});
					var message_text = $('<div/>', { class: 'error_message_text float_left h4' }).html(msg_text);
					//var message_text = $('<div/>', { class: 'error_message_text float_left h4' }).html(i18next.t("server.gamma_error." + error.code + ".message", { value: error.value }));
				    error_message.append(message_text);
				    if(msg_text_more !== '')
				    {
					    var more_info			= $('<div/>',{class:'more_info float_left hand_cursor margin_top_20'});
					    var more_info_text		= $('<div/>',{class:'more_info_text float_left text_transform p semibold'}).html('More');
					    var more_info_icon		= $('<div/>',{class:'more_info_icon float_left margin_left_5'});
					    e.renderIcon(more_info_icon,'triangle');
						more_info.append(more_info_text,more_info_icon);
						var message_info = $('<div/>', { class: 'error_message_info float_left hide p' }).html(msg_text_more);
						//var message_info = $('<div/>', { class: 'error_message_info float_left hide p' }).html(i18next.t("server.gamma_error." + error.code + ".details", { value: error.value }));
					    error_message.append(more_info,message_info);
					}
					var button_text= "ok";
					var button_custom_class="";
					var close_button = $('<button/>', {type:'button', class: 'error_close_button float_right button_small transition_bcolor ' + button_custom_class }).html(button_text);
				    popup_data.append(error_message,close_button);
				    error_alert.addTitle(popup_title_data);
				    error_alert.addContent(popup_data);
				    error_alert.openPopup();

				}

				e.notify(gamma.notifications.RENDERING_COMPLETE);

				console.log(error);

				if (error){
					e.enablePlugin('popup',showAlert);
				}
				else if(notification_status == "success")
				{
					var toast_msg_wraper;
					if(!$(".toast_msg_wraper").length)
					{
						toast_msg_wraper = $('<div/>',{class:'toast_msg_wraper'});
						$("#bottom_container").prepend(toast_msg_wraper);
					}
					var color_class = 'color_good';
					if(data_object.analysis_error)
					{
						color_class = 'color_bad toast_bad';
					}
					var toast_msg = $('<div/>',{class:'p toast_msg '+color_class}).html(data_object.message);
					if(data_object.notification_name)
					{
						e.notify(data_object.notification_name);
					}
				 	$(".toast_msg_wraper").prepend(toast_msg);
				 	if(!data_object.fadeout)
				 	{
					 	setTimeout(function(){
					 		toast_msg.fadeOut(1000, function(){
					 			toast_msg.remove();
					 		});
					 	},3000);
					 }
					 else
					 {
					 	toast_msg.find('.role_refresh').on('click',function() {
					 		historyManager.initializeData(true);
					 		location.reload();
					 	});
					 }
				}
				else//if((data_object.holder !== undefined && data_object.holder !== '')  || (notification_status == 500 && data_object.holder !="") || notification_status =="error_info")
				{
					var error_msg_desc = i18next.t('common.info_description.unreachable_gamma_server');
					if (data_object.holder.hasClass('plugin_hotspotsDistribution')){
						error_msg_desc = i18next.t('common.info_description.info_desc_hotspot');
					}

					var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.oops'), details: error_msg_desc, is_add_button: false, button_text: i18next.t('common.add_new.new_project'), is_task_management_button: false, task_management_text: '', button_event: '' };
					g.error_message_view(data, data_object.holder);

				}
			}
		}

		//---------------- Init method - actual flow starts here-----------------
		// public methods
		gamma.init = function() {
			subscribeEvents();
			gamma.getServerTime();
			gamma.initialiseSocket();
			gamma.config();
			gamma.getQueueCount();

			if (historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems' && /*gamma.is_cloud &&*/ gamma.hasPermission('MANAGE_LICENSE')) {
                //###########license Comment
                gamma.getLicenseDetails()
					.then(license_summary => {
						if (license_summary.scan_status_flag) {
                            $('header .btn-container .available_scan_credit .scan_credit_value').html(license_summary.scan_credit);
                        }
						else {
                            $('header .btn-container .available_scan_credit .scan_credit_value').html('Unlimited');
                        }
				});
			}

			// --- setting heights for containers at the time of loading -----------
			var windowHeight=$(window).height();
			$('#bottom_container').height(windowHeight);
			g.admin.utils.setAdminContentHeight()
			$(window).on('resize',function() {
				windowHeight = $(window).height();
				$('#bottom_container').height(windowHeight);
				g.admin.utils.setAdminContentHeight();
			});
		};
		gamma.onEncryptionSettingsLoaded = function() {
			onEncryptionSettingsLoaded();
		};
		gamma.pushHistory = function(plugin_name,context,plugin_options,request_data,mode) {//-----------Changes window hash value (used for back button functionality)---------
			if(mode == undefined)
			{
				mode = 'explorer';
			}
			var breadcrumb_data 	= {'node_id':historyManager.get('currentBreadcrumb').id,'node_name':historyManager.get('currentBreadcrumb').name};
			var timestamp = moment.utc();
			timestamp.format();  // 2013-02-04T10:35:24-08:00
			var history_obj 		= {'id':timestamp.valueOf(),'plugin_id':plugin_name,'old_plugin_id':plugin_name,'subsystem_id':historyManager.get('currentSubSystem'),'subsystem_uid':historyManager.get('currentSubSystemUid'),'subsystem_name':historyManager.get('currentSubSystemName'),'project_name':historyManager.get('currentProjectName'),'project_id':historyManager.get('currentSystem'),'breadcrumb':breadcrumb_data,'request_data':request_data,'plugin_options':plugin_options,'context':context,'mode':mode};
			var history_obj_str = JSON.stringify(history_obj);
			historyManager.set('currentHash',timestamp.valueOf());

			/*var existing_url = JSON.stringify(gamma.decodeURL(window.location.hash));
			if (existing_url != history_obj_str)
			{*/
			if (e.isIE() && (plugin_name == 'code_issues_details' || plugin_name =="tasks")){}
			else{
				window.location.hash = window.btoa(unescape(encodeURIComponent(history_obj_str)));
			}
			$(document).attr('title', 'Gamma - '+historyManager.get('currentPlugin').name);
				if(gamma.googleAnalyzeCode != "")
				{
					googleAnalyse();
				}
				$("#management_breadcrumb").hide();
				if(mode == "management") {
					gamma.admin.utils.unSubscribeSocketEvents();
					$('[title]').tooltipster();
				}
			//}
		};
		gamma.popHistory = function(hash,reload) {
			popHistory(hash,reload);
		};
		gamma.getParameterObjectById = function(id,type) {//---------------- RETURNS PARAMETER (rating/metrics) BY ID-----------------------
			var obj 				= {};
			var parameterOptionList = gamma.getParameterList();
			var required_val 		= parameterOptionList[type];
			var len 				= required_val.length;
			for(var i =	0 ; i < len ; i++)
			{
				if(required_val[i].id == id)
				{
					obj = required_val[i];
					break;
				}
			}
			return obj;
		};
		gamma.getParameterObjectByName = function(name,type) {//---------------- RETURNS PARAMETER (rating/metrics) BY name-----------------------
			var obj 				= {};
			var parameterOptionList = gamma.getParameterList();
			var required_val 		= parameterOptionList[type];
			var len 				= required_val.length;
			for(var i = 0 ; i < len ; i++)
			{
				if((required_val[i].name).toLowerCase() == name.toLowerCase())
				{
					obj = required_val[i];
					break;
				}
			}
			return obj;
		};
		gamma.searchObjectById = function(arrayList,id) {//---------------- RETURNS object  BY id-----------------------
			var i;
			var match_object = {};
			for(i=0; i < arrayList.length;i++)
			{
				if(arrayList[i].id == id)
				{
					match_object = arrayList[i];
					break;
				}
			}
			return match_object;
		};

		gamma.getIdBySelectedName = function(dataArray,matching_parameter,return_param,selected_name){
            for (var i = 0; i < dataArray.length; i++) {
				if(dataArray[i][matching_parameter].toLowerCase() == selected_name.toLowerCase()){

					return dataArray[i][return_param];
				}
			}
		};
		gamma.forceClosePopup = function(popupContainer){
			popupContainer.remove();
			if($('body').find('.popup_container.state-open').length == 0) {
				$('.overlay_container').remove();
			}

			if($('body').find('.popup_container.state-open').length == 0) {
				$(".gamma-main-wraper").removeClass("blur-main-content");
			}
		}
		return gamma;
}(g));
