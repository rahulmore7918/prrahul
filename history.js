//========= HISTORY MANAGEMENT ===========

var historyManager = (function(){
 

//---------- PRIVATE VARS ------------------
var storage;
var defaultSettings = {};
var historyObject 	= {};
var current_company,current_system,current_subsystem;

	defaultSettings.companies 	= {selected:'Acellere',companyList:{'Acellere':{systems:{selected:'',systemList:{}}}}};

	defaultSettings.plugins 	= {selected:''};

	defaultSettings.views 		= {};

	defaultSettings.bookmarks 	= {};

	defaultSettings.language 	= {selected:'en'};

	defaultSettings.range 		= {selected:'range_2'};

	defaultSettings.context 	= {selected:'root'};

	defaultSettings.date 		= {selected:''};

	defaultSettings.user 		= {selected:''};

	defaultSettings.oldPlugin 	= {selected:''};

	defaultSettings.dependencyType 	= {selected:''};

	defaultSettings.systemVersion 	= {selected: true};

	defaultSettings.hash 	 	= {selected: ''};


//---------- ON STORAGE READY --------------
initialize(false);


function initialize(flag){
		storage =  $.sessionStorage;
		var myDate = new Date();
		var dateString = g.getFormattedDate((myDate.toString()),'date');
		if(storage.isEmpty('historyObject') || storage.get('historyObject','date') === undefined)
		{
			defaultSettings.date.selected = dateString;
			storage.set('historyObject',defaultSettings);
		}
		else
		{
			if(storage.get('historyObject','date','selected') != dateString || flag === true)
			{
				storage.set('historyObject',{});
			}
		}

		if(storage.isEmpty('historyObject')){
			defaultSettings.date.selected = dateString;
			storage.set('historyObject',defaultSettings);
		}

		current_company 	= storage.get('historyObject','companies','selected');
		current_system  	= storage.get('historyObject','companies','companyList',current_company,'systems','selected');

		if(current_system != "")
			current_subsystem 	= storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','selected');

		//console.log(storage.get('historyObject','companies','companyList',current_company,'systems','selected'));
		//console.log(storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','selected'));

		//current_system  	= storage.get('historyObject','companies','companyList',current_company,'systems','selected');
		//current_subsystem 	= storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','selected');
}

return {
	//------------ SET ----------------------------------------
	set:function(prop,val){
		switch(prop){
			case 'currentDate' :
				storage.set('historyObject','date','selected',val);
				break;
			case 'currentUser' :
				storage.set('historyObject','user','selected',val);
				break;
			case 'currentContext' :
				storage.set('historyObject','context','selected',val);
				break;
			case 'currentCompany' :
				storage.set('historyObject','companies','selected',val);
				current_company = val;
				break;
			case 'selectedTabView' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'selectedTab',val);
				break;
			case 'currentSystem' :
				storage.set('historyObject','companies','companyList',current_company,'systems','selected',val);
				current_system = val;
				if((historyManager.get('currentSystem') === '') || (!historyManager.hasSystem(val)))
				{
					var new_system = {
										subSystems:{
											subSystemList:{}
										}
									}
					storage.set('historyObject','companies','companyList',current_company,'systems','systemList',val,new_system);
				}
				break;
			case 'currentProjectOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','projectOptions',val);
				break;
			case 'currentSubsystemOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subsystemOptions',val);
				break;
			case 'currentSubSystem' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','selected',val);
				current_subsystem = val;
				if((historyManager.get('currentSubSystem') === '') || (!historyManager.hasSubSystem(val)))
				{
					var new_subsystem = {
											subsystemName :'',
											filters:{
												selected:'tree',
												tree:{
													selected:'Example'
												},
												level:{
													selected:'1'
												}
											},
											snapshots:{
												selected:[],
												compare:false
											},
											breadcrumb:{
												id:-1,
												name:''
											},
											changeListParameters:{
												ratings:'',
												metrics:'',
												parameterList:''
											},
											componentListParameters:{
												ratings:'',
												metrics:'',
												parameterList:''
											}
										};
					storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',val,new_subsystem);
				}
				break;

			case 'currentProjectName' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'projectName',val);
				break;
			case 'currentSubSystemName' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'subsystemName',val);
				break;
			case 'currentSubSystemUid' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'subsystemUid',val);
				break;
			case 'currentFilter' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','selected',val);
				break;
			case 'currentLevel' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','level','selected',val);
				break;
			case 'currentNode' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','tree','selected',val);
				break;
			case 'selectedSnapshots' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','selected',val);
				break;
			case 'compareSnapshots' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','compare',val);
				break;
			case 'currentBreadcrumb' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'breadcrumb',val);
				break;
			case 'currentChangeParameter' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters',this.get('currentParameterList').selected,val);
				break;
			case 'currentChangeListFilterId' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListFilter',val);
				break;
			case 'currentParameterList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','parameterList',val);
				break;
			case 'currentComponentParameter' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListParameters',this.get('currentParameterList').selected,val);
				break;
			case 'currentCoverageComponentParameter' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageComponentListParameters',this.get('currentParameterList').selected,val);
				break;
			case 'currentUnitTestsParameter' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'unitTestsListParameters',this.get('currentParameterList').selected,val);
				break;
			case 'currentComponentListFilterId' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListFilter',val);
				break;
			case 'currentComponentParameterList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListParameters','parameterList',val);
				break;
			case 'currentCoverageComponentParameterList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageComponentListParameters','parameterList',val);
				break;
			case 'currentComponentOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentOptions',val);
				break;
			case 'currentHotspotOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'hotspotOptions',val);
				break;
			case 'currentDuplicationOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'duplicationOptions','selected',val);
				break;
			case 'currentCoverageOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageOptions',val);
				break;
			case 'currentUnitTestOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'unitTestsOptions',val);
				break;
			case 'currentMetricsOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'metricsOptions',val);
				break;
			case 'currentDesignIssueOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'designIssueOptions',val);
				break;
			case 'currentCodeIssueOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'codeIssueOptions',val);
				break;
			case 'currentChangeOverviewOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeOverviewOptions',val);
				break;
			case 'currentDependencyOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'dependnecyOptions',val);
				break;
			/*case 'currentCategory' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','parameterList','selected',val);
				break;*/
			case 'currentPlugin' :
				storage.set('historyObject','plugins','selected',val);
				break;
			case 'currentView' :
				storage.set('historyObject','views','selected',val);
				break;
			case 'currentViewList' :
				var views_list;
				if(!this.hasProperty('currentViewList'))
					views_list = [];
				else
					views_list = this.get('currentViewList');

				if(val !== '')
				{
					if(views_list.length >= 10)
						views_list.shift();
					views_list.push(val);
				}
				storage.set('historyObject','views','viewList',views_list);
				break;
			case 'currentBookmark' :
				storage.set('historyObject','bookmarks','selected',val);
				break;
			case 'currentBookmarkList' :
				var bookmarks_list;
				if(!this.hasProperty('currentBookmarkList'))
					bookmarks_list = [];
				else
					bookmarks_list = this.get('currentBookmarkList');

				if(val !== '')
				{
					if(bookmarks_list.length >= 10)
						bookmarks_list.shift();
					bookmarks_list.push(val);
				}
				storage.set('historyObject','bookmarks','bookmarkList',bookmarks_list);
				break;
			case 'currentLanguage' :
				storage.set('historyObject','language','selected',val);
				break;
			case 'currentRange' :
				storage.set('historyObject','range','selected',val);
				break;
			case 'currentOldPlugin' :
				storage.set('historyObject','oldPlugin','selected',val);
				break;
			case 'currentDependencyType' :
				storage.set('historyObject','dependencyType','selected',val);
				break;
			case 'hasSystemVersion' :
				storage.set('historyObject','systemVersion','selected',val);
				break;
			case 'currentHash' :
				storage.set('historyObject','hash','selected',val);
				break;
			/*case 'currentDbName' :
				storage.set('historyObject','dbName','selected',val);
				break;
			case 'currentFilterList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','filterList',val);*/
			case 'currentTasksOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'tasksOptions',val);
				break;
			case 'currentIssuesOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'issuesOptions',val);
				break;
			case 'currentIssueListOptionList' :
				storage.set('historyObject','companies','companyList',current_company,'issueListOptions',val);
				break;
			case 'currentTaskTypeContext' :
				storage.set('historyObject','companies','companyList',current_company,'taskTypeContext',val);
			break;
			case 'currentRepoType' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'repoType',val);
				break;
			case 'currentRepoMetaData' :
				storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'metaData',val);
			break;
			default:
				break;
		}
	},
	get:function(prop){
		var val = '';
		if(this.hasProperty(prop))
		{
			switch(prop){
				case 'currentDate' :
					val = storage.get('historyObject','date','selected');
					break;
				case 'currentUser' :
					val = storage.get('historyObject','user','selected');
					break;
				case 'currentContext' :
					val = storage.get('historyObject','context','selected');
					break;
				case 'currentCompany' :
					val = storage.get('historyObject','companies','selected');
					break;
				case 'currentSystem' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','selected');
					break;
				case 'currentProjectOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','projectOptions');
					break;
				case 'currentSubsystemOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subsystemOptions');
					break;
				case 'currentSubSystem' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','selected');
					break;
				case 'currentProjectName' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'projectName');
					break;
				case 'currentSubSystemName' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'subsystemName');
					break;
				case 'currentSubSystemUid' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'subsystemUid');
					break;
				case 'currentFilter' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','selected');
					break;
				case 'currentLevel' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','level','selected');
					break;
				case 'currentNode' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','tree','selected');
					break;
				case 'selectedSnapshots' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','selected');
					break;
				case 'compareSnapshots' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','compare');
					break;
				case 'projectSettings' :
					val = storage.get('historyObject','companies','companyList',current_company,'system');
					break;
				case 'currentBreadcrumb' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'breadcrumb');
					break;
				case 'currentChangeParameter' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters',this.get('currentParameterList').selected);
					break;
				case 'selectedTabView' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'selectedTab');
					break;
				case 'currentChangeListFilterId' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListFilter');
					break;
				case 'currentParameterList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','parameterList');
					break;
				case 'currentComponentParameter' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListParameters',this.get('currentParameterList').selected);
					break;
				case 'currentCoverageComponentParameter' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageComponentListParameters',this.get('currentParameterList').selected);
					break;
				case 'currentUnitTestsParameter' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'unitTestsListParameters',this.get('currentParameterList').selected);
					break;
				case 'currentComponentListFilterId' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListFilter');
					break;
				case 'currentComponentParameterList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListParameters','parameterList');
					break;
				case 'currentCoverageComponentParameterList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageComponentListParameters','parameterList');
					break;
				case 'currentComponentOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentOptions');
					break;
				case 'currentHotspotOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'hotspotOptions');
					break;
				case 'currentDuplicationOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'duplicationOptions','selected');
					break;
				case 'currentCoverageOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageOptions');
					break;
				case 'currentUnitTestOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'unitTestsOptions');
					break;
				case 'currentMetricsOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'metricsOptions');
					break;
				case 'currentDesignIssueOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'designIssueOptions');
					break;
				case 'currentCodeIssueOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'codeIssueOptions');
					break;
				case 'currentChangeOverviewOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeOverviewOptions');
					break;
				case 'currentDependencyOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'dependnecyOptions');
					break;
				/*case 'currentCategory' :
					val = storage.get('historyObject','companies','companyList','Acellere','systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','parameterList','selected');
					break;*/
				case 'currentPlugin' :
					val = storage.get('historyObject','plugins','selected');
					break;
				case 'currentView' :
					val = storage.get('historyObject','views','selected');
					break;
				case 'currentViewList' :
					val = storage.get('historyObject','views','viewList');
					break;
				case 'currentBookmark' :
					val = storage.get('historyObject','bookmarks','selected');
					break;
				case 'currentBookmarkList' :
					val = storage.get('historyObject','bookmarks','bookmarkList');
					break;
				case 'currentLanguage' :
					val = storage.get('historyObject','language','selected');
					break;
				case 'currentRange' :
					val = storage.get('historyObject','range','selected');
					break;
				case 'currentOldPlugin' :
					val = storage.get('historyObject','oldPlugin','selected');
					break;
				case 'currentDependencyType' :
					val = storage.get('historyObject','dependencyType','selected');
					break;
				case 'hasSystemVersion' :
					val = storage.get('historyObject','systemVersion','selected');
					break;
				case 'currentHash' :
					val = storage.get('historyObject','hash','selected');
					break;
				/*case 'currentDbName' :
					val = storage.get('historyObject','dbName','selected');
					break;
				case 'currentFilterList' :
					val = storage.get('historyObject','companies','companyList','Acellere','systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','filterList');*/
				case 'currentTasksOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'tasksOptions');
					break;
				case 'currentIssuesOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'issuesOptions');
					break;
				case 'currentIssueListOptionList' :
					val = storage.get('historyObject','companies','companyList',current_company,'issueListOptions');
					break;
				case 'currentTaskTypeContext' :
					val = storage.get('historyObject','companies','companyList',current_company,'taskTypeContext');
					break;					
				case 'currentRepoType' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'repoType');
					break;
				case 'currentRepoMetaData' :
					val = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'metaData');
					break;
				default:
					break;
			}
		}
		else
		{
			this.set(prop,'');
		}
		return val;
	},
	hasProperty:function(prop){
		var flag = false;
		switch(prop){
			case 'currentDate' :
				val = storage.isSet('historyObject','date','selected');
				break;
			case 'currentUser' :
				flag = storage.isSet('historyObject','user','selected');
				break;
			case 'currentContext' :
				flag = storage.isSet('historyObject','context','selected');
				break;
			case 'currentCompany' :
				flag = storage.isSet('historyObject','companies','selected');
				break;
			case 'currentSystem' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','selected');
				break;
			case 'currentProjectOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','projectOptions');
				break;
			case 'currentSubsystemOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subsystemOptions');
				break;
			case 'currentSubSystem' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','selected');
				break;
			case 'currentProjectName' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'projectName');
				break;
			case 'currentSubSystemName' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'subsystemName');
				break;
			case 'currentSubSystemUid' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'subsystemUid');
				break;
			case 'currentFilter' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','selected');
				break;
			case 'currentLevel' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','level','selected');
				break;
			case 'currentNode' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'filters','tree','selected');
				break;
			case 'selectedSnapshots' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','selected');
				break;
			case 'compareSnapshots' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','compare');
				break;
			case 'projectSettings' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'system');
				break;
			case 'currentBreadcrumb' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'breadcrumb');
				break;
			case 'selectedTabView' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'selectedTab');
				break;
			case 'currentChangeParameter' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters',this.get('currentParameterList').selected);
				break;
			case 'currentChangeListFilterId' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListFilter');
				break;
			case 'currentParameterList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','parameterList');
				break;
			case 'currentComponentParameter' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListParameters',this.get('currentParameterList').selected);
				break;
			case 'currentCoverageComponentParameter' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageComponentListParameters',this.get('currentParameterList').selected);
				break;
			case 'currentUnitTestsParameter' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'unitTestsListParameters',this.get('currentParameterList').selected);
				break;
			case 'currentComponentListFilterId' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListFilter');
				break;
			case 'currentComponentParameterList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentListParameters','parameterList');
				break;
			case 'currentCoverageComponentParameterList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageComponentListParameters','parameterList');
				break;
			case 'currentComponentOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'componentOptions');
				break;
			case 'currentHotspotOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'hotspotOptions');
				break;
			case 'currentDuplicationOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'duplicationOptions','selected');
				break;
			case 'currentCoverageOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'coverageOptions');
				break;
			case 'currentUnitTestOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'unitTestsOptions');
				break;
			case 'currentMetricsOptionList' :
				flag = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'metricsOptions');
				break;
			case 'currentDesignIssueOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'designIssueOptions');
				break;
			case 'currentCodeIssueOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'codeIssueOptions');
				break;
			case 'currentChangeOverviewOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeOverviewOptions');
				break;
			case 'currentDependencyOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'dependnecyOptions');
				break;
			/*case 'currentCategory' :
				flag = storage.isSet('historyObject','companies','companyList','Acellere','systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','parameterList','selected');
				break;*/
			case 'currentPlugin' :
				flag = storage.isSet('historyObject','plugins','selected');
				break;
			case 'currentView' :
				flag = storage.isSet('historyObject','views','selected');
				break;
			case 'currentViewList' :
				flag = storage.isSet('historyObject','views','viewList');
				break;
			case 'currentBookmark' :
				flag = storage.isSet('historyObject','bookmarks','selected');
				break;
			case 'currentBookmarkList' :
				flag = storage.isSet('historyObject','bookmarks','bookmarkList');
				break;
			case 'currentLanguage' :
				flag = storage.isSet('historyObject','language','selected');
				break;
			case 'currentRange' :
				flag = storage.isSet('historyObject','range','selected');
				break;
			case 'currentOldPlugin' :
				flag = storage.isSet('historyObject','oldPlugin','selected');
				break;
			case 'currentDependencyType' :
				flag = storage.isSet('historyObject','dependencyType','selected');
				break;
			case 'hasSystemVersion' :
				flag = storage.isSet('historyObject','systemVersion','selected');
				break;
			case 'currentHash' :
				flag = storage.isSet('historyObject','hash','selected');
				break;
			/*case 'currentDbName' :
				flag = storage.isSet('historyObject','dbName','selected');
				break;
				case 'currentFilterList' :
					val = storage.get('historyObject','companies','companyList','Acellere','systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'changeListParameters','filterList');*/
			case 'currentTasksOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'tasksOptions');
				break;
			case 'currentIssuesOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'issuesOptions');
				break;
			case 'currentIssueListOptionList' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'issueListOptions');
				break;
			case 'currentTaskTypeContext' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'taskTypeContext');
				break;
			case 'currentRepoType' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'repoType');
				break;
			case 'currentRepoMetaData' :
				flag = storage.isSet('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'metaData');
				break;
			default:
				break;
			}
			return flag;
	},
	popSnapshot: function(){
		var snaps = this.get('selectedSnapshots');
		if(snaps.length > 1)
			snaps.pop();

		storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','selected',snaps);
	},
	deleteSnapshot:function(snapshot){
		var snaps = this.get('selectedSnapshots');
		for(var i=0; i < snaps.length;i++)
		{
			if(snaps[i].id == snapshot.id)
			{
				snaps.splice(i, 1);
			}
		}
		storage.set('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',current_subsystem,'snapshots','selected',snaps);
	},
	removeView:function(index){
		var view_list = this.get('currentViewList');
		view_list.splice(index,1);
		storage.set('historyObject','views','viewList',view_list);
	},
	removeBookmark:function(index){
		var bookmark_list = this.get('currentBookmarkList');
		bookmark_list.splice(index,1);
		storage.set('historyObject','bookmarks','bookmarkList',bookmark_list);
	},
	updateView:function(index,obj){
		var view_list 		= this.get('currentViewList');
		view_list[index] 	= obj;
		storage.set('historyObject','views','viewList',view_list);
	},
	updateBookmark:function(index,obj){
		var bookmark_list 		= this.get('currentBookmarkList');
		bookmark_list[index] 	= obj;
		storage.set('historyObject','bookmarks','bookmarkList',bookmark_list);
	},
	hasSubSystem:function(val){
		var subSystem = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',current_system,'subSystems','subSystemList',val);
		if(subSystem === undefined){
			return false;
		} else{
			return true;
		}
	},
	hasSystem:function(val){
		var system = storage.get('historyObject','companies','companyList',current_company,'systems','systemList',val);
		if(system === undefined){
			return false;
		}else{
			return true;
		}
	},
	initializeData:function(flag){
		initialize(flag);
	}
};

//========= HISTORY MANAGEMENT ===========

})();
