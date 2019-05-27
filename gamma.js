
//---------now gamma will be returned to g and all private methods can be acessible using g
var g = (function() {

		//---------------Private variables-------------
		var LOCALE 						= 'en';
	    var RANGE						= 'range_1';
	    var LANG_TEXT 					= '';
	    var DOMAIN_NAME   				=  window.location.origin;
		var encrypt_url, gamma_version = 0.1, correction_time, googleAnalyzeCode = "", maxZipUploadSize = 50, user_roles = [], user_permissions = [], subsystem_roles = [], user_id = '', user_uid='', user_name = '', user_image = '', is_primary, application_mode = '', languages = [], task_integration = [], is_false_positive;
		var tenant_uid, subdomain, is_trial;
		var breadcrumbLoaded 			= false;
		var loadFromHistory   			= false;
		var sendBreadcrumbNotification 	= true;
		var codeEditorTheme = "oceanic-next",availablePluginList, subsystemList, snapshotList, parameterOptionList, issue_meta_data, issue_list_meta_data, nodeTypeList, currentAnalysisList = [];
        var gamma = {};
		var API_VERSION = 'v1';
	    // ---------- PATHS -------
	// console.log(historyManager.get('currentSystem'));
		var paths = {
			// PATH_SUBSYSTEMS: `/projects/${historyManager.get('currentSystem')}/repositories`,

	    	//PATH_SUBSYSTEMS: "/gamma/api/projects/getprojects"+"?"+new Date().getTime(),
	    	PATH_SUBSYSTEMS: "/projects/",
			PATH_PLUGINS: "/metadata/pluginviews",
			PATH_PROJECT_SEARCH: "/views/repositories/",
			PATH_MAX_LEVELS: "/gamma/api/projects/getmaxlevels",
			PATH_NODE_TYPES:"/gamma/api/nodes/getnodetypes",
			//var PATH_SNAPSHOTS: "/gamma/api/snapshots/getsnapshots"+"?"+new Date().getTime(),
			PATH_SNAPSHOTS: "/repositories/",
			PATH_NODESUMMARY: "/gamma/api/projects/getnodesummary",
			PATH_COMPONENTSUMMARY: "/gamma/api/projects/getcomponentsummary",
			PATH_LOCALISATION: "/views/localisation",
			PATH_USER_DETAILS: "/metadata/user",
			PATH_CONFIGURATION_DETAILS: "/metadata/config",
			PATH_PARAMETERS: "/repositories/",
			PATH_ISSUE_LIST_DETAILS:"/gamma/api/issuelist/getissuelistmetadata",
            PATH_QUEUE_COUNT: "/repositories/scans/count",
			PATH_CURRENT_ANALYSIS:"/repositories/scans",

			PATH_BREADCRUMB: "/views/repositories/",
			PATH_TREE:"/views/repositories/",
			PATH_SERVER_TIME:"/metadata/servertime",
			PATH_LOGOUT: "/auth/logout",
			PAGE_LOGIN: "login",
			PAGE_ERROR: "license-summary",
			PAGE_TEMPERED: "license-deactivated"
	    };

		// ----- NOTIFICATIONS -----
		var notifications 	= {
			DATA_REQUESTED: "DATA_REQUESTED",
			DATA_RECEIVED: "DATA_RECEIVED",
			ENCRYPTION_LOADED: "ENCRYPTION_LOADED",
			SUBSYSTEMS_LOADED: "SUBSYSTEMS_LOADED",
			SNAPSHOTS_LOADED: "SNAPSHOTS_LOADED",
			PARAMETERS_LOADED: "PARAMETERS_LOADED",
			RENDERING_COMPLETE: "RENDERING_COMPLETE",
			SUBSYSTEM_UPDATE:"SUBSYSTEM_UPDATE",
			BREADCRUMB_UPDATE: "BREADCRUMB_UPDATE",
			PLUGIN_UPDATE: "PLUGIN_UPDATE",
			DEPENDENCY_LOADED:"DEPENDENCY_LOADED",
			TREE_UPDATE: "TREE_UPDATE",
			SEARCH_UPDATE: "SEARCH_UPDATE",
			SNAPSHOT_UPDATE: "SNAPSHOT_UPDATE",
			SNAPSHOT_BREADCRUMB_UPDATE:"SNAPSHOT_BREADCRUMB_UPDATE",
			VIEW_UPDATE:"VIEW_UPDATE",
			LANGUAGE_SELECT: "LANGUAGE_SELECT",
			RANGE_SELECT: "RANGE_SELECT",
			DATA_ERROR: 'DATA_ERROR',
			COMPONENT_POPUP_CLOSE:'COMPONENT_POPUP_CLOSE',
			ERROR_POPUP_CLOSE:'ERROR_POPUP_CLOSE',
			PLUGIN_LOADED:'PLUGIN_LOADED',
			HASH_UPDATE:'HASH_UPDATE',
			RESIZE_BREADCRUMB:'RESIZE_BREADCRUMB',
			LOAD_PLUGIN:'LOAD_PLUGIN',
			ADD_PROJECT_POPUP_CLOSE : 'ADD_PROJECT_POPUP_CLOSE',
			PROJECT_UPDATE:'PROJECT_UPDATE',
			NODE_SUMMARY:'NODE_SUMMARY',
 			ISSUES_DETAILS_LOADED : 'ISSUES_DETAILS_LOADED',
			ISSUE_LIST_DETAILS_LOADED: 'ISSUE_LIST_DETAILS_LOADED', 			NODE_TAG_UPDATED : 'NODE_TAG_UPDATED',
 			UPDATE_TIMELINE_SELECTION:'UPDATE_TIMELINE_SELECTION',
 			GET_TAG_COUNT:'GET_TAG_COUNT'
		};

		// var errors = {
		// 	ERROR_CODE_400:"Database Error"
		// };

		//----------------  Private methods ----------------
		// function getPluginPath(name,type) {
		// 	if(type =="css"){
		// 		return "../"+name+"/style.css";
		// 	}else if(type =="js"){
		// 		return "../"+name+"/plugin.js";
		// 	}
		// }

		function sendErrorNotification(data,data_url,holder,notification_name,fadeout) {
			data.holder 	= holder;
			data.requestURL = DOMAIN_NAME + data_url;
			data.notification_name = notification_name;
			data.fadeout    = fadeout;
			e.notify(notifications.DATA_ERROR,data);
		}
		function updateLocalization(data,status) {
			if(status == 'success')
			{
				if(data.hasOwnProperty("message"))
				{
					g.setLanguageText(language_data[historyManager.get('currentLanguage')]);
					sendErrorNotification(data,paths.PATH_LOCALISATION,$('#content'));
				}
				else{
					g.setLanguageText(data);
				}
			}
			else
			{
				g.setLanguageText(language_data[historyManager.get('currentLanguage')]);
				sendErrorNotification(data,paths.PATH_LOCALISATION,$('#content'));
			}
		}

	function pluginsLoaded(data, status) {

			if(status == 'success')
			{
				availablePluginList = data.pluginList;
				if(availablePluginList.hasOwnProperty("message")){
					sendErrorNotification(availablePluginList,paths.PATH_PLUGINS,$('#content'));
				}
			}
			else
			{
				sendErrorNotification(availablePluginList,paths.PATH_PLUGINS,$('#content'));
			}
		}

		function subsystemsLoaded(data,status) {
			if(status == 'success')
			{
				if(data.hasOwnProperty("message")){
					sendErrorNotification(data,paths.PATH_OVERVIEW,$('#content'));
				}else
			    {
			    	subsystemList = data;
			    	e.notify(notifications.SUBSYSTEMS_LOADED);
				}
			}
			else if(status == 'error')
			{
				sendErrorNotification(data,paths.PATH_OVERVIEW,$('#content'));
			}
		}

		function parametersLoaded(data,status) {
			if(status == 'success')
			{
				if(data.hasOwnProperty("message")){
					sendErrorNotification(data,paths.PATH_PARAMETERS,$('#content'));
				}else
			    {
					parameterOptionList = data;
			    	nodeTypeList 		= data.type;
					var classification_map 	= {};
					nodeTypeList.forEach(function(d){
						classification_map[d.name] = d.classification;
					});
					parameterOptionList.metrics=_.filter(parameterOptionList.metrics, function (item) {return _.indexOf(g.metrics_list, item.name) != -1 });
					gamma.classification_map = classification_map;
					e.notify(notifications.PARAMETERS_LOADED);
				}
			}
			else if(status == 'error')
			{
				sendErrorNotification(data,paths.PATH_PARAMETERS,$('#content'));
			}
		}

		function snapshotsLoaded(data,status) {
			if(status == 'success')
			{
				if(data.hasOwnProperty("message")){
					sendErrorNotification(data,paths.PATH_SNAPSHOTS,$('#content'));
				}else
			    {
			    	snapshotList = data.reverse();
			    	e.notify(notifications.SNAPSHOTS_LOADED);
					//g.getSnapshotsForSideBar();
				}
			}
			else if(status == 'error')
			{
				sendErrorNotification(data,paths.PATH_SNAPSHOTS,$('#content'));
			}
		}

		// function issueDetailsLoaded(data, status) {
		// 	if (status == 'success')
		// 	{
		// 		if(data.hasOwnProperty("message")){
		// 			sendErrorNotification(data,paths.PATH_ENCRYPTION,$('#content'));
		// 		}else
		// 		{
		// 			issue_meta_data = data;
		// 			e.notify(notifications.ISSUES_DETAILS_LOADED);
	    // 		}
	    // 	}
	    // 	else if(status == 'error') {
		// 		g.sendErrorNotification(data,'/gamma/api/issues/getissuetype',$('.plugin_container'));
		// 	}
		// }

		// function issueListDetailsLoaded(data, status) {

		// 	if (status == 'success')
		// 	{
		// 		if(data.hasOwnProperty("message")){
		// 			sendErrorNotification(data, paths.PATH_ISSUE_LIST_DETAILS,$('#content'));
		// 		}else
		// 		{
		// 			issue_list_meta_data = data;
		// 			e.notify(notifications.ISSUE_LIST_DETAILS_LOADED);
	    // 		}
	    // 	}
	    // 	else if(status == 'error') {
		// 		g.sendErrorNotification(data,'/gamma/api/issuelist/getissuetype',$('.plugin_container'));
		// 	}
		// }

		// function nodeTypesLoaded(data,status) {
		// 	if (status == 'success')
		// 	{
		// 		if(data.hasOwnProperty("message")){
		// 			sendErrorNotification(data,paths.PATH_ENCRYPTION,$('#content'));
		// 		}else
		// 		{
		// 			nodeTypeList 		= data;
		// 			var classification_map 	= {};
		// 			nodeTypeList.forEach(function(d){
		// 				classification_map[d.name] = d.classification;
		// 			});
		// 			gamma.classification_map = classification_map;
	    // 		}
	    // 	}
	    // 	else if(status == 'error') {
		// 		g.sendErrorNotification(data,'/gamma/api/issuelist/getissuetype',$('.plugin_container'));
		// 	}
		// }

		function analysisDataLoaded(data,status) {
			if (status == 'success')
			{
                if(data) {
                    currentAnalysisList = data;
                    if(data.length)
                    {
                        data.forEach(function(d){
                            d.sessionId 	= d.scanId;
                            d.subsystemId   = d.repoUid;
                            d.percentage    = d.currentPercentage;
                            gamma.startAnalysisAnimation(d);
                        });
                    }
                    else
                    {
                        gamma.clearAnimationIntervals();
                    }
                }
	    	}
		}

		function setConfigString(data, status) {
			if (status == 'success') {
				var configData = data;
				e.loadJSON(paths.PATH_USER_DETAILS, setUserString, { 'timestamp': new Date().getTime() });
			}
			else if (status == 'error') {
				encrypt_url = false;
				sendErrorNotification(data, paths.PATH_CONFIGURATION_DETAILS, $('#content'));
			}

			function setUserString(userDetails, status) {
				if (status == 'success') {
					var userData = userDetails;
					if (data.hasOwnProperty("message")) {
						sendErrorNotification(data, paths.PATH_USER_DETAILS, $('#content'));
					} else {
						gamma.encrypt_url = configData.encryptURL;
						gamma.gamma_version = configData.version;
						gamma.googleAnalyzeCode = configData.googleAnalyzeCode;
						gamma.user_roles = userData.role;
						gamma.user_permissions = userData.permissions;
						gamma.subsystem_roles = userData.subsystem_roles;
						gamma.user_id = userData.id;
						gamma.user_uid = userData.user_uid;
						gamma.user_name = userData.name;
						gamma.first_name = userData.first_name;
						gamma.last_name = userData.last_name;
						gamma.email = userData.email;
						gamma.user_image = userData.image;
						gamma.is_primary = userData.is_primary;
						gamma.application_mode = configData.mode;
						gamma.languages = configData.languages;
						gamma.partial_languages = configData.partial_languages;
						gamma.task_integration = configData.task_integration;
						gamma.skip_license = configData.skip_license;
						gamma.gamma_website_host = configData.gamma_website_host;
						gamma.gamma_website_env = configData.gamma_website_env;
						gamma.mixpanel_token = configData.mixpanel_token;
						gamma.intercom_app_id = configData.intercom_app_id;
						gamma.is_cloud = configData.is_cloud;
						gamma.mixpanel_uid = configData.mixpanel_uid;
						gamma.tenant_uid = userData.tenant_uid;
						// gamma.tenant_id = userData.tenant_id;
						gamma.subdomain = userData.subdomain;
						gamma.is_trial = userData.is_trial;
						gamma.first_login = userData.first_login;
						gamma.last_login = userData.last_login;
						gamma.has_scanned = userData.has_scanned;
						gamma.codeEditorTheme = configData.codeEditorTheme;
						gamma.is_false_positive = configData.is_false_positive;
						gamma.enableREScan = configData.enableREScan ;
						gamma.enablePRScan = configData.enablePRScan ;
                        API_VERSION = configData.apiVersion;
                        gamma.API_VERSION = API_VERSION;
						gamma.BASE_URL = DOMAIN_NAME + "/api/" + API_VERSION;
						if (configData.taskInsights == true || configData.taskInsights == "true") {
							gamma.isTasksInsightsEnabled = true;
						} else if (configData.taskInsights == false || configData.taskInsights == "false") {
							gamma.isTasksInsightsEnabled = false;
						}
						maxZipUploadSize = configData.maxZipUploadSize;
						if (encrypt_url == undefined) {
							encrypt_url = true;
						}

						if (configData.dbChanged) {
							historyManager.initializeData(true);
						}
						else if (historyManager.get('currentUser') != userData.id) {
							historyManager.initializeData(true);
						}

						if (historyManager.get('currentUser') == '') {
							historyManager.set('currentUser', userData.id);
						}
						e.notify(notifications.ENCRYPTION_LOADED);
					}
					if (localStorage.getItem("user_login")) {
						// Intercom
						if (gamma.is_cloud) {
							window.Intercom('boot', {
								app_id: gamma.intercom_app_id,
								'email': gamma.email,
								'name': gamma.first_name + " " + gamma.last_name,
								user_id: gamma.mixpanel_uid,
								'subdomain': gamma.subdomain,
								//Logged out user so may not have any user related info
							});
						}
						// gamma.set_mixpanel_event("Logged in ", gamma.mixpanel_uid, { 'subdomain': gamma.subdomain, 'email': gamma.email, 'first_name': gamma.first_name, 'last_name': gamma.last_name });
						//mix panel event

						var first_login_date = moment(gamma.first_login).format('YYYY-MM-DDTHH:mm:ss');
						var last_login_date = moment(gamma.last_login).format('YYYY-MM-DDTHH:mm:ss');
						var eventObj = {
							profile_properties: {
								'First portal login': first_login_date,
								'Last portal login': last_login_date,
								"first_name": gamma.first_name,
								"last_name": gamma.last_name,
								"email": gamma.email
							},
							event_properties: {
								'User type': (gamma.is_trial ? 'Open Source' : 'Paid'),
								'First portal login': first_login_date,
								'Last portal login': last_login_date
							}
						};

						if (gamma.is_trial) {
							eventObj.profile_properties['Open source domain'] = gamma.subdomain;
						} else {
							eventObj.profile_properties['Paid domain'] = gamma.subdomain;
						}
						gamma.set_mixpanel_event("Gamma portal login", gamma.mixpanel_uid, eventObj);

						localStorage.removeItem("user_login");
					}
				}
				else if (status == 'error') {
					encrypt_url = false;
					sendErrorNotification(data, paths.PATH_USER_DETAILS, $('#content'));
				}
			}
		}

		function setQueueCount(data,status) {
			if(status == 'success')
			{
				if (!gamma.hasPermission('VIEW_SCAN')) {
					$("header .analysis_status").hide();
				}else{
					$("header .analysis_status").show();
				}
			}
		}

		function setServerTime(data,status) {
			if(status == 'success')
			{
				if(data.hasOwnProperty("message")){
					sendErrorNotification(data,paths.PATH_SERVER_TIME,$('#content'));
				}else
				{
					/*var server_time = data.server_time;
					var client_time = new Date().getTime();
					gamma.correction_time = server_time - client_time;*/
					gamma.correction_time = moment(data.server_time).diff(new Date());
				}
			}
			else if(status == 'error')
			{
				encrypt_url = false;
				//sendErrorNotification(data, paths.PATH_SERVER_TIME,$('#content'));
			}
		}

		function loggedout() {
			sessionStorage.clear();
			localStorage.clear();
			window.location.replace(g.paths.PAGE_LOGIN);
			e.log("You have logout successfully");
		}

		//------------------Public scope----------- Used to expose private methods outside------------
		gamma.DOMAIN_NAME 					= DOMAIN_NAME;
		gamma.BASE_URL                      = DOMAIN_NAME + "/api/" + API_VERSION;
		gamma.interval                      = 0;
		gamma.PAGE_ERROR 					= '/license-summary';
		gamma.PAGE_TEMPERED 				= "/license-deactivated"
		gamma.PAGE_NOT_FOUND 				= '/404.html';
		gamma.encrypt_url  					= encrypt_url;
		gamma.user_roles 					= user_roles;
		gamma.user_permissions 				= user_permissions;
		gamma.subsystem_roles 				= subsystem_roles;
		gamma.user_id 						= user_id;
		gamma.user_uid						= user_uid;
		gamma.user_name 					= user_name;
		gamma.user_image					= user_image;
		gamma.is_primary        			= is_primary;
		gamma.tenant_uid                    = tenant_uid;
		gamma.subdomain                     = subdomain;
		gamma.is_trial                      = is_trial;
		gamma.gamma_version 				= gamma_version;
		gamma.googleAnalyzeCode 			= googleAnalyzeCode;
		gamma.notifications 				= notifications;
		gamma.paths 						= paths;
		gamma.setSubsystemContext 			= false;
		gamma.loadFromHistory 				= loadFromHistory;
		gamma.breadcrumbLoaded 				= breadcrumbLoaded;
		gamma.sendBreadcrumbNotification 	= sendBreadcrumbNotification;
		gamma.correction_time 				= correction_time;
		gamma.application_mode 				= application_mode;
		gamma.task_integration 				= task_integration;
		gamma.languages 					= languages;
		gamma.issue_id 						= null;
		gamma.line_number 					= null;
		gamma.active_language 				= '';
		gamma.partial_languages 			= [];
		gamma.is_false_positive             = is_false_positive;
		gamma.isTasksInsightsEnabled = false;
		gamma.enableREScan = false;
		gamma.enablePRScan = false;
        gamma.codeEditorTheme = codeEditorTheme;
        gamma.API_VERSION = API_VERSION;

		gamma.admin = {
			'account': {},
			'users': {},
			'projects': {},
			'teams': {},
			'roles': {},
			'subsystems': {},
			'version_control': {},
			'tags': {},
			'analysis': {},
			'kpis': {},
			'license': {},
			'access_tokens': {},
			'notifications': {},
			'quality_profile': {},
			'public_url': {}
		};
		gamma.tasks = {
			'gamma_formatter':{},
			'jira_formatter':{},
			'task_details':{},
			'integration':{},
			'create_task':{},
			'insights':{}
		};

		gamma.component_explorer = {'codeIssueCheck':{}};
		gamma.application 					= {'project':{},'repository':{}};
		gamma.issues_data 					= null;
		gamma.leftMenuItem;

		gamma.setLocale = function (locale) {
			LOCALE = locale;
		};
		gamma.getLocale = function() {
			return LOCALE;
		};
		gamma.setRange = function(range) {
			RANGE = range;
		};
		gamma.getRange = function(){
			return RANGE;
		};
		gamma.setLanguageText = function(lang_text) {
			LANG_TEXT = lang_text;
		};
		gamma.getFilesize = function() {
			return maxZipUploadSize;
		};
		gamma.getLanguageText = function() {
			return LANG_TEXT;
		};
		gamma.getPluginList = function() {
			return availablePluginList;
		};
		gamma.getParameterList = function() {
			return parameterOptionList;
		};
		gamma.getIssueMetadata = function() {
			return issue_meta_data;
		};
		gamma.getIssueListMetadata = function() {
			return issue_list_meta_data;
		};
		gamma.getSubsystemList = function() {
			return subsystemList;
		};
		gamma.setSubsystemList = function(list) {
			subsystemList = list;
		};
		gamma.getSnapshotList = function() {
			return snapshotList;
		};
		gamma.getNodeTypes = function() {
			return nodeTypeList;
		};
		gamma.getCurrentAnaysisList = function () {
			return currentAnalysisList;
		};
		gamma.enablePlugin = function(name,callBack) {
			if(callBack !== undefined) {
                callBack.call();
            }
			/*$("head").append("<link>");
			css = $("head").children(":last");
			css.attr({
				rel:  "stylesheet",
				type: "text/css",
				href: getPluginPath(name,'css')
			});
			var path =	getPluginPath(name,'js');
			require([path], function(util) {
				if(callBack !== undefined){
					callBack.call();
				}
			});*/
		};
		gamma.disablePlugin = function(name) {
			/*requirejs.undef(getPluginPath(name,'js'));
			requirejs.undef(getPluginPath(name,'css'));
			$("head script[data-requiremodule|='"+getPluginPath(name,'js')+"']").remove();
			$("head link[href|='"+getPluginPath(name,'css')+"']").remove();*/
		};
		gamma.getFormattedDate = function(timestamp,param,getSeconds,timePeriod) {
			timestamp = timestamp.substr(0, timestamp.length-1);
			var ms = moment(timestamp);
			//ms.add(330,'minutes');
			var d = new Date();
			var n = d.getTimezoneOffset();
			ms.add(-n,'minutes');
			if(!param){
				return ms.format("DD-MMM-YYYY HH:mm");
			}else if(param == 'date'){
				if (timePeriod){
					return ms.format("MMM D, YYYY");
				}else{
					return ms.format("DD-MMM-YYYY");
				}
			}else if(param == 'time'){
				if(getSeconds){
					return ms.format("HH:mm:ss");
				}else if (timePeriod){
					return ms.format("h:mm a");
				}else{
					return ms.format("HH:mm");
				}
			}else{
				return timestamp;
			}
		};
		gamma.getNewFormattedDate = function (timestamp, param) {
			timestamp = timestamp.substr(0, timestamp.length - 1);
			var ms = moment(timestamp);
			var d = new Date();
			var n = d.getTimezoneOffset();
			ms.add(-n, 'minutes');
			if (!param) {
				return ms.format("DD/MMM/YYYY HH:mm");
			} else if (param == 'date') {
				return ms.format("MM/DD/YY");
			} else if (param == 'time') {
				return ms.format("h:mm a");
			} else {
				return timestamp;
			}
		};

		gamma.removeDropDownList = function(){
			if ($('.dropDown_list').length > 0) {
				$('.dropDown_list').slideUp(300, function () {
					$('.dropDown_list').remove();
					$('.dropdown').removeClass('active_dropdown');
					$('.dropdown').find('.dropdown_arrow').children().removeClass('ic-chevron-up').addClass('ic-chevron-down');
				});
			}
		}

		gamma.formatSynopsys = function(syn){
		 	var cleanFormat = syn.slice(0, syn.length);
			cleanFormat = cleanFormat.replace(/([${]){2}/g, "");
			cleanFormat = cleanFormat.replace(/[{}]/g, "");
		  	cleanFormat = cleanFormat.replace(/[;]/g, ",  ");
			cleanFormat = cleanFormat.replace(/[:]/g, " : ");
			cleanFormat = cleanFormat.replace(/["]/g, " ");
			cleanFormat = cleanFormat.trim();
			if (cleanFormat.charAt(cleanFormat.length - 1) == ","){
				cleanFormat = cleanFormat.slice(0, cleanFormat.length - 1);
			}
		  	return cleanFormat;
		}

		gamma.hideTreePanel = function () {
			$(".tree-icon").addClass('hide');
			$(".tree-panel-container").addClass('hidden');
			$("#tree-icon-container").removeClass('active');
			$(window).resize();
		}

		gamma.difference = function(d1, d2) {
          	var m = moment(d1);
          	var actual_age = 0;

          	var years = m.diff(d2, 'years');
          	m.add(-years, 'years');

          	var months = m.diff(d2, 'months');
          	m.add(-months, 'months');

          	var weeks = m.diff(d2, 'weeks');
          	m.add(-weeks, 'weeks');

          	var days = m.diff(d2, 'days');
          	m.add(-days, 'days');

          	var hours = m.diff(d2, 'hours');
          	m.add(-hours, 'hours');

          	var minutes = m.diff(d2, 'minutes');
          	m.add(-minutes, 'minutes');

          	var seconds = m.diff(d2, 'seconds');
			var time_text = '';
          	if(years <= 0){
                if(months <= 0){
                    if(weeks <= 0){
                        if(days <= 0){
                            if(hours <= 0){
                                if(minutes <= 0){
									time_text = (seconds > 1) ? ' seconds ago' : ' second ago';
									actual_age = seconds + time_text;
                                }else{
									time_text = (minutes > 1) ? ' minutes ago' : ' minute ago';
									actual_age = minutes + time_text;
                                }
                            }else{
								time_text = (hours > 1) ? ' hours ago' : ' hour ago';
								actual_age = hours + time_text;
                            }
                        }else{
							time_text = (days > 1) ? ' days ago' : ' day ago';
							actual_age = days + time_text;
                        }
                    }else{
						time_text = (weeks > 1) ? ' weeks ago' : ' week ago';
						actual_age = weeks + time_text;
                    }
                }else{
					time_text = (months > 1) ? ' months ago' : ' month ago';
					actual_age = months + time_text;
                }
            }else{
					time_text = (years > 1) ? ' years ago' : ' year ago';
					actual_age = years + time_text;
            }

            return actual_age;
		}
		gamma.getTagsColor= function(index){
			var colors_length = gamma.tag_colors.length;
			if (index < colors_length){
				return g.tag_colors[index];
			}else if (index > colors_length) {
				return gamma.getTagsColor(index - colors_length);//g.code_issue_colors[index];
			}
			/* else
				return g.code_issue_colors[index - colors_length]; */
		}

        gamma.currentBrowser = function(){
        	// Opera 8.0+
			var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

			// Firefox 1.0+
			var isFirefox = typeof InstallTrigger !== 'undefined';

			// Safari 3.0+ "[object HTMLElementConstructor]"
			var isSafari = navigator.userAgent.indexOf("Safari") > -1;//var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

			// Internet Explorer 6-11
			var isIE = false || !!document.documentMode;

			// Edge 20+
			var isEdge = !isIE && !!window.StyleMedia;

			// Chrome 1+
			var isChrome = !!window.chrome && !!window.chrome.webstore;

			// Blink engine detection
			var isBlink = (isChrome || isOpera) && !!window.CSS;

			if(isOpera){
				return 'Opera';
			}else if(isFirefox){
				return 'Firefox';
			}else if(isSafari){
				return 'Safari';
			}else if(isIE){
				return 'IE';
			}else if(isEdge){
				return 'Edge';
			}else if(isBlink){
				return 'Blink';
			}else{
				return 'Chrome';
			}

        };

		gamma.getFormattedTime = function(timestamp1,timestamp2,useServerTime) {
			var utc1 	= moment(timestamp1).utc();//new Date(timestamp1.getTime() + timestamp1.getTimezoneOffset() * 60000);
			if(useServerTime){
				timestamp2 = moment().add('milliseconds', gamma.correction_time);
			}
			var utc2 	= moment(timestamp2).utc();//new Date(timestamp2.getTime() + timestamp2.getTimezoneOffset() * 60000);
			var difference 	= utc2 - utc1;//timestamp2.getTime() - timestamp1.getTime();
			var ms  		= moment.duration(difference, 'milliseconds');

			var hours 	= parseInt(ms / (60 * 60 * 1000));
			var mins =  Math.floor((ms / (60 * 1000)) % 60);
			var sec = Math.floor((ms / 1000) % 60);
			hours 	= (hours >= 10)?hours:'0'+hours;
			mins 	= (mins >= 10)?mins:'0'+mins;
			sec 	= (sec >= 10)?sec:'0'+sec;
			return hours+":"+mins+":"+sec;
		};
		gamma.print = function(input) {
			var language_text = gamma.getLanguageText();
			if(language_text !== undefined)
			{
				if(language_text[input] !== undefined){
					return language_text[input];
				}else{
					return input;
				}
			}
		};
        gamma.removeSortList = function(){
        	if($('.sort_list').css("display") == "block" ){
	        	$('.sort_list').slideUp(300,function(){
					$('.list_header').removeClass('border-color');
				});
	        }
        }
		gamma.toggleLanguage = function(lang_name) {
			this.setLocale(lang_name);
			historyManager.set('currentLanguage',lang_name);
			e.loadJSON(paths.PATH_LOCALISATION,updateLocalization,{lang_id:lang_name});
		};
		gamma.config = function () {
			e.loadJSON(paths.PATH_CONFIGURATION_DETAILS, setConfigString, { 'timestamp': new Date().getTime() });
		};
		gamma.getQueueCount = function() {
            if (g.hasPermission('VIEW_SCAN')) {
                e.loadJSON( paths.PATH_QUEUE_COUNT,setQueueCount,{'timestamp':new Date().getTime()});
            }
		};
		gamma.getServerTime = function() {
			e.loadJSON(paths.PATH_SERVER_TIME,setServerTime,{'timestamp':new Date().getTime()});
		};
		gamma.toggleRange = function(range_name) {
			this.setRange(range_name);
			historyManager.set('currentRange',range_name);
		};
		gamma.decodeURL = function(url) {
			var obj = {};
			if(url.indexOf('#') != -1)
			{
		  		var hash = url.substring(url.indexOf('#')+1);
		  		if(hash.lastIndexOf('#') != -1 && hash.lastIndexOf('#') == (hash.length - 1))
		  		{
		  			hash = hash.slice(0,-1);
		  		}
		  		obj = $.parseJSON(decodeURIComponent(escape(window.atob(hash))));
			}
			return obj;
	  	};
	  	gamma.encryptURL = function(url) {
	  		var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r= 0 ;var c1= 0 ; var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
	  		var encode_url = Base64.encode(url);
	  		return encode_url;
	  	};
	  	gamma.decryptURL = function(url) {
	  		var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r= 0 ;var c1= 0 ; var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
		  	var decode_url = Base64.decode(url);
		  	return decode_url;
	  	};
	  	gamma.getPlugins = function() {
	  		e.loadJSON(paths.PATH_PLUGINS,pluginsLoaded);
	  	};
	  	gamma.getSubsystems = function() {
	  		e.loadJSON(paths.PATH_SUBSYSTEMS + historyManager.get('currentSystem') + '/repositories', subsystemsLoaded, {});
	  	};
	  	gamma.getSnapshots = function() {
			e.loadJSON(paths.PATH_SNAPSHOTS + historyManager.get('currentSubSystemUid') + '/snapshots', snapshotsLoaded, { 'sortBy': 'timestamp', 'orderBy':'desc'});
	  	};
	  	gamma.getParameters = function() {
				e.loadJSON(paths.PATH_PARAMETERS + historyManager.get('currentSubSystemUid') + '/metadata',parametersLoaded,{project_id:historyManager.get('currentSubSystem')});
	  	};
	  	gamma.getIssueListDetails = function() {
	  		// e.loadJSON(g.DOMAIN_NAME + paths.PATH_ISSUE_LIST_DETAILS,issueListDetailsLoaded);
	  	};
	  	gamma.getNodeTypes = function() {
	  		///e.loadJSON(g.DOMAIN_NAME + paths.PATH_NODE_TYPES,nodeTypesLoaded);
	  	};
	  	gamma.sendErrorNotification = function(data,data_url,holder,notification_name,fadeout) {
	  		sendErrorNotification(data,data_url,holder,notification_name,fadeout);
	  	};
	  	gamma.getCurrentAnalysis = function() {
            if (g.hasPermission('VIEW_SCAN')) {
                e.loadJSON(paths.PATH_CURRENT_ANALYSIS,analysisDataLoaded,{timestamp:new Date().getTime()});
            }
	  	};
	  	gamma.changeSignature = function(signature) {
			if(signature !== undefined)
			{
				if(signature !== null && signature.length > 0 && (signature.match(/(\$\d+)$/g)) !== null)
				{
					var endIndex = signature.lastIndexOf("$");
				    if (endIndex != -1)
				    {
				        var newstr = signature.substring(0, endIndex);
				        return newstr;
				    }
				    else{
						return signature;
					}
				}
				else{
					return signature;
				}
			}
		};
		gamma.contentHeight = function() {
			//var height_factor = 1;
			var headerHeight=0;
			if (!$('header').hasClass('hide')){
				headerHeight = $('header').height();
			}
			return $(window).height() - headerHeight ;
		};
		gamma.formatRating  = function(input) {
			if(input){
				return e.math.round(input-5);
			}else{
				return 'NA';
			}
		};
		gamma.hasRole = function(role_name) {
			if((gamma.user_roles).indexOf(role_name) > -1){
				return true;
			}else{
				return false;
			}
		};
		gamma.hasPermission = function(permission_name) {
			if((gamma.user_permissions).indexOf(permission_name) > -1){
				return true;
			}else{
				return false;
			}
		};
		gamma.hasRepositoryPermission = function(permission_name,repositoryUid) {
			var currentSubSystemData = _.findWhere(gamma.subsystem_roles, {repository_uid: repositoryUid});
			if((currentSubSystemData.permissions).indexOf(permission_name) > -1){
				return true;
			}else{
				return false;
			}
		};
		gamma.checkRoleOnSubsystem = function(repository_uid,permission) {
			if (gamma.hasRole('ACCOUNT_ADMINISTRATOR') || gamma.hasRole('PROJECT_ADMINISTRATOR')){
				return true;
			}else
			{
				if((gamma.subsystem_roles).length > 0)
				{
					var subsystem_role_name = _.findWhere(gamma.subsystem_roles, { 'repository_uid': repository_uid}).role_identifier;
					if ((subsystem_role_name == 'MANAGER' || subsystem_role_name == 'ANALYSER') && gamma.hasRepositoryPermission(permission,repository_uid)) {
						return true;
					}else if (subsystem_role_name == 'EXPLORER')
					{
						if (permission == 'VIEW_SCAN_HISTORY' || permission == 'VIEW_SNAPSHOT'){
							return true;
						}else{
							return false;
						}
                    }
                    else {
                        return false;
                    }
				}
				else{
					return false;
				}
			}
		};
		gamma.includeCssForTemplate = function(path) {
			var templateCss	= $('<link/>',{rel:'stylesheet', type: "text/css", href: "../templates/"+path+"/style.css"});
			$("head").append(templateCss);
		};
		gamma.removeCssForTemplate = function(path) {
			requirejs.undef("../templates/"+path+"/style.css");
		    $("head link[href|='../templates/"+path+"/style.css']").remove();
		};
		gamma.logout = function() {
			var customResponse={
				success:{
					isCustom: false,
					message : ''
				},
				error:{
					isCustom:true
				}
			};
            if (gamma.is_cloud)
            {
                window.Intercom('shutdown');
            }
            if (localStorage.getItem("auth_token") === null){
                loggedout();
			}else{
				e.postData('POST',gamma.paths.PATH_LOGOUT,loggedout,'',customResponse);
			}
		}
		gamma.initialiseSocket = function() {
			var socket = io.connect(window.location.origin ,{
				'query': "token=" + localStorage.getItem('auth_token')
            });
            //var socket = io.connect();
			socket.on('update',function(msg) {
				if(!gamma.hasPermission('RUN_SCAN')){
					$("header .analysis_status").hide();
				}else
				{
					if(msg.hasOwnProperty('queue_count') && (parseInt(msg.queue_count) > 0))
					{
						//if(parseInt(msg.queue_count) > 0)
						//{
							$("header .analysis_status").show().addClass("in_progress");
							$("header .analysis_status .analysis_count").html(msg.queue_count).removeClass("hide");
							$(".left-menu-bar .left-menu-icon .ic-scan").parent().addClass('has-count');
							$(".left-menu-bar .ic-scan.left-menu-icon-inner").attr('data-content', msg.queue_count);
						//}
					}
					else if(msg.hasOwnProperty('queue_count') && (parseInt(msg.queue_count) <= 0))
					{
							$("header .analysis_status").removeClass("in_progress");
							$("header .analysis_status .analysis_count").addClass("hide");
							$(".left-menu-bar .left-menu-icon .ic-scan").parent().removeClass('has-count');
							$(".left-menu-bar .ic-scan.left-menu-icon-inner").attr('data-content', "");
						//}
					}
					else
					{
                        e.notify('SOCKET_UPDATE',msg);
						//gamma.setAnalysisState(msg);
						var eventObj = {
							profile_properties: {},
							event_properties: {
								'Status': msg.status,
								'Language': '',
								'LOC': (msg.LOC) ? msg.LOC : ''
							}
						};
						var report_msg = {};
						if (msg.status == "SUCCESS" || msg.status == "FAIL" || msg.status == "ABORT" || msg.status == 'CANCEL' || msg.status == 'QUEUED') {
                            if (gamma.hasPermission('MANAGE_LICENSE')) {
								gamma.getLicenseDetails()
								.then(function(license_summary) {
									if (license_summary.scan_status_flag) {
										$('header .btn-container .available_scan_credit .scan_credit_value').html(license_summary.scan_credit);
									} else {
										$('header .btn-container .available_scan_credit .scan_credit_value').html('Unlimited');
									}
								});
							}

							if(msg.status == "SUCCESS" && msg.projectName !== undefined && msg.projectName != 'undefined')
							{
								if (parseInt(msg.user) == parseInt(gamma.user_id)){
									eventObj.event_properties.Language = msg.languages;
									gamma.set_mixpanel_event("Scan Status", gamma.mixpanel_uid, eventObj);
								}
								report_msg = {status:'success',message:"Scan for '"+msg.projectName+"' completed successfully.",details:''};
                                g.addToast(report_msg);
								if(historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems' && e.mode == "explorer" && msg.subsystemId == historyManager.get('currentSubSystemUid')){
									e.showErrorSticker(i18next.t('common.snapshot_update_notification'), true, msg);
								}
								gamma.has_scanned = true;
								if(gamma.is_cloud) {
									gamma.userRoleBasedLanes(false);
									//Opening Userlane popup after first successful scan
									// setTimeout(function(){
									// 	Userlane('openAssistant');
									// }, 2000);									
								}
							}
							else if(msg.status == "FAIL" && msg.projectName !== undefined && msg.projectName != 'undefined')
							{
								if (msg.user == gamma.user_id) {
									eventObj.event_properties.Language = msg.languages;
									eventObj.event_properties['Reason'] = i18next.t('gws.analysis_message.' + msg.message);
									gamma.set_mixpanel_event("Scan Status", gamma.mixpanel_uid, eventObj);
								}
								report_msg = {status:'success',message:"Scan for '"+msg.projectName+"' Failed.Check scan history for details.",details:'',isError:true};
								g.addToast(report_msg);
								// gamma.has_scanned = true;
							}
							else if(msg.status == "ABORT")
							{
								if (msg.user == gamma.user_id) {
									eventObj.event_properties.Language = msg.languages;
									gamma.set_mixpanel_event("Scan Status", gamma.mixpanel_uid, eventObj);
								}
								var show_message = "Scan for '"+msg.projectName+"' Aborted.Check scan history for details.";
								if(msg.message == 'ANALYSER_NOT_REACHABLE'){
									show_message = "Could not abort scan.Please try again later.";
								}
								report_msg = {status:'success',message:show_message,details:'',isError:true};
								g.addToast(report_msg);
							}
							else if(msg.status == 'CANCEL')
							{
								if (msg.user == gamma.user_id) {
									eventObj.event_properties.Language = msg.languages;
									gamma.set_mixpanel_event("Scan Status", gamma.mixpanel_uid, eventObj);
								}
								report_msg = {status:'success',message:"Scan for '"+msg.projectName+"' Cancelled.Check scan history for details.",details:'',isError:true};
								g.addToast(report_msg);
							}
						}
					}
				}
			});

			function removeMenuoptions() {
				if ($('.menu_option_list_wraper'.length)) {
						$('.menu_option_list_wraper').remove();
					}

				if($('.dropDown_list').length ){
					$('.dropDown_list').remove()
					}
				}

			socket.on('update_permissions',function(msg) {
				var confirm_message = '';
				if (msg.role_type == 'project')
				{
					if (msg.action == 'add'){
                        confirm_message = i18next.t('admin.permission.assign_project_role', { project_name: msg.project_name, role_name: msg.role_name});
					}else if (msg.action == 'update'){
						confirm_message = i18next.t('admin.permission.update_project_role', { project_name: msg.project_name , role_name : msg.role_name});
					}else if (msg.action == 'remove'){
						confirm_message = i18next.t('admin.permission.remove_project_role', { project_name: msg.project_name });
					}else if (msg.action == 'link'){
						confirm_message = i18next.t('admin.permission.link_unlink_repository', { project_name: msg.project_name });
					}else if (msg.action == 'unlink'){
						confirm_message = i18next.t('admin.permission.unlink_repository', { project_name: msg.project_name, repository_name: msg.repository_name });
					}
				}
				else if (msg.role_type == 'global')
				{
					confirm_message = i18next.t('admin.permission.update_global_role');
				}
				var confirm_alert = gamma.admin.utils.confirmPopup(confirm_message, 'info', false,true);
				$('.login_button').on('click', function () {
					confirm_alert.closePopup();
					gamma.logout();
				});
			});

			socket.on('account_status',function(msg) {
                //var report_msg = {status:'success',message:g.print(msg),details:'',analysis_error:true};
				//g.addErrorAlert(report_msg);
				var errorMsg = { "error": { "code": null, "name": "accountStatusUpdated", "message": g.print(msg), "status":"info" } }
				g.addErrorAlert(errorMsg);
				setTimeout(function(){
					gamma.logout();
				},3000);
			});

			socket.on('delete_subsystem',function(msg) {
				e.notify('SOCKET_DELETE_SUBSYSTEM',msg);
			});


			socket.on('REVIEW_REQUEST_UPDATE',function(msg) {
				e.notify('REVIEW_REQUEST_UPDATE',msg);
			});

			socket.on('system_upgrade',function(msg) {
				gamma.logout();
				// e.notify('SYSTEM_UPGRADE',msg);
				// var confirmMessage = i18next.t('admin.permission.version_upgrade');
				// var confirm_alert = gamma.admin.utils.confirmPopup(confirmMessage, 'info', false,true);
				// $('.login_button').on('click', function () {
				// 	confirm_alert.closePopup();
				// 	gamma.logout();
				// });
			});

			socket.on("error", function (error) {
				if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
					// redirect user to login page perhaps?
					console.log("User's token is invalid");
					gamma.logout();
				}
			});
		}


		/**
		 * Mixpanel code start
		 *
		 * Example :-
		 * Event with userId (gamma.mixpanel_uid) :- gamma.set_mixpanel_event("test me gamma ", 213);
		 * Event with profileDetails 				     :- gamma.set_mixpanel_event("test me gamma ", 213 ,{ 'email': 'shahaji.patil@acellere.com', 'first_name': 'sameer', 'last_name': 'patil'});
		 * Event with customDetails 				     :- gamma.set_mixpanel_event("test me gamma ", 213 , { 'project name': 'Gamma test Project  ','owner details':'shahaji patil' });
		 * Event with Profile and Custom Details 	     :- gamma.set_mixpanel_event("test me gamma ", 213 ,{ 'email': 'shahaji.patil@acellere.com', 'first_name': 'sameer', 'last_name': 'patil','project name': 'Gamma test Project  ','owner details':'shahaji patil'});
		**/
		gamma.set_mixpanel_event = function (event, userId, eventDetails,increment) {
			if (gamma.is_cloud) {
				if (userId != undefined && userId != "") {

					// check userid exist else register
					mixpanel.identify(userId);
					var eventProperties = {};
					var profileProperties = {};

					// set profileProperties details
					if (eventDetails != undefined && eventDetails != "") {

						if (eventDetails.profile_properties != undefined && eventDetails.profile_properties != "") {
							for (var i in eventDetails.profile_properties) {
								profileProperties["$" + i] = eventDetails.profile_properties[i];
							}
						}

						if (eventDetails.event_properties != undefined && eventDetails.event_properties != "") {
							eventProperties = eventDetails.event_properties;
						}

						// register/update profileProperties with basic details
						mixpanel.people.set(profileProperties);
					}

				}

				if (event != undefined && event != "") {

					if (eventProperties != "" && eventProperties != undefined) {
						// increment event by +1
						if (increment != undefined && increment == true) {
							for (var j in eventProperties) {
								var incrementEvent = eventProperties[j];
								mixpanel.people.increment(incrementEvent);
							}
						}
						// event with custom properies
						mixpanel.track(event, eventProperties);
					} else {
						// event only
						mixpanel.track(event);
					}


				}
			}
		}
		/**
		 *  mixpanel code end
		**/
		gamma.isPartialLanguage = function(){
			if((gamma.partial_languages).includes(gamma.active_language)){
				return true;
			}
			return false;
		}
		gamma.setActiveLanguage = function(activeLanguage){
			gamma.active_language = activeLanguage;
		}
		gamma.getLicenseDetails = function() {
			return new Promise(function(resolve, reject) {
				try {
					$.get( gamma.BASE_URL +'/license/license-details', [])
						.then( function(license_data) {
							var consumed_loc, total_loc, consumed_scan, total_scan, scan_status_flag, loc_status_flag;

							consumed_loc = (license_data.current.loc) ? license_data.current.loc:0;
							total_loc = license_data.license_detail.metrics.loc.limit;
							consumed_scan = (license_data.current.scans) ? license_data.current.scans:0;
							total_scan = license_data.license_detail.metrics.scans.limit;

							if (consumed_loc > total_loc && total_loc != -1){
								consumed_loc = total_loc;
							}
							if (consumed_scan > total_scan && total_scan != -1){
								consumed_scan = total_scan;
							}

							if (total_scan != -1) {
								scan_status_flag = true;
							} else {
								scan_status_flag = false;
							}

							if(total_loc != -1) {
                                loc_status_flag = true ;
                            }
							else {
                                loc_status_flag = false;
                            }

							var license_summary = {
								"loc": { "consumed_value": e.format.abbrNumber(consumed_loc, 2), "total_value": e.format.abbrNumber(total_loc, 2) },
								"scan_count": { "consumed_value": e.format.abbrNumber(consumed_scan, 2), "total_value": e.format.abbrNumber(total_scan, 2) },
								"loc_status_flag": loc_status_flag,
								"scan_status_flag": scan_status_flag,
								"scan_credit": e.format.abbrNumber(total_scan - consumed_scan, 2)
							};
							if (scan_status_flag){
								$('header .btn-container .available_scan_credit .scan_credit_value').html(license_summary.scan_credit);
							}else{
								$('header .btn-container .available_scan_credit .scan_credit_value').html('Unlimited');
							}
							resolve(license_summary);
						});
				} catch (err) {
					console.log(err);
					reject(err);
				}
			});
		}
		var basePathforView = DOMAIN_NAME + '/api';
        gamma.download = function(url,fileName) {
			var xhr = new XMLHttpRequest();
            var path;
            if (url.includes("/views/")) {
                path = basePathforView + url;
            } else {
                path = g.BASE_URL + url;
            }


            xhr.open('GET', path, true);
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                if (this.status == 200) {
                    // get binary data as a response
                    var data = this.response;
                    var file = new Blob([data], {
                        type: data.type
                    });
                    if (file.size == 57) {
                        var module_error = {
                            'status': 'error',
                            'code': 500,
                            'message': 'This repository is no more available.',
                            'details': "This repository has been deleted."
                        };
                        g.sendErrorNotification(module_error, '', $(''));
                    } else {
                        var isChrome = !!window.chrome && !!window.chrome.webstore;

                        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                        var isEdge = !isIE && !!window.StyleMedia;

                        var ua = navigator.userAgent.toLowerCase();
                        if (isChrome || (ua.indexOf('safari') != -1)) {
                            var baseUrl = window.URL || window.webkitURL;

                            var downloadLink = document.createElement('a');
                            downloadLink.href = baseUrl.createObjectURL(data);
                            downloadLink.setAttribute('target', '_self');
                            downloadLink.setAttribute('download', fileName);
                            downloadLink.click();
                        } else if (isEdge || isIE) {
                            window.navigator.msSaveOrOpenBlob(file, fileName);
                        } else {
                            // var fileURL = URL.createObjectURL(file);
                            // window.open(fileURL);

                            var downloadLink = document.createElement('a');

                            downloadLink.target = '_blank';
                            downloadLink.download = fileName;

                            var baseUrl = window.URL || window.webkitURL;
                            var downloadUrl = baseUrl.createObjectURL(file);

                            downloadLink.href = downloadUrl;

                            document.body.append(downloadLink);
                            downloadLink.click();

                            document.body.removeChild(downloadLink);
                            baseUrl.revokeObjectURL(downloadUrl);
                        }
                    }
                }
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('auth_token'));
            xhr.send();
        }
	  	return gamma;
}());
