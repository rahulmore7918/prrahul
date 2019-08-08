
var g = (function(gamma) {
	 
	
	//---------------- Public methods -----------------
	gamma.setSubsystemHistory = function(subsystem_id,subsystem_uid,subsystem_name,subsystem_breadcrumb,currentRepoMetaData) {
		historyManager.set('currentSubSystem',subsystem_id);
		historyManager.set('currentSubSystemName',subsystem_name);
		historyManager.set('currentSubSystemUid',subsystem_uid);
		historyManager.set('currentBreadcrumb',subsystem_breadcrumb);
		historyManager.set('currentRepoMetaData',currentRepoMetaData);
	};
	gamma.setRepoMetaData = function(currentRepoMetaData) {
		historyManager.set('currentRepoMetaData',currentRepoMetaData);
	};

	gamma.validateSubsystem = function(subsystem_id,subsystem_name) {
		var subsystemList = gamma.getSubsystemList();
		for(var i = 0 ; i < subsystemList.length ; i++)
		{
			if((subsystemList[i].id == subsystem_id) && ((subsystemList[i].name).toLowerCase() == subsystem_name.toLowerCase()))
				return true;
		}
		return false;
	};
	gamma.updateSubsystemHistory = function(selected_subsystem, repoDetails= historyManager.get('currentRepoMetaData')) {
		var subsystemList 		= gamma.getSubsystemList();
		if(selected_subsystem == undefined )
		{
			if(historyManager.get('currentSubSystem') === '')
				selected_subsystem 	= {'id':subsystemList[0].subsystem_id,'uid':subsystemList[0].uid,'name':subsystemList[0].subsystem_name};
			else
				selected_subsystem = {'id':historyManager.get('currentSubSystem'),'uid':historyManager.get('currentSubSystemUid'),'name':historyManager.get('currentSubSystemName')};
		}
		if((!historyManager.hasSubSystem(selected_subsystem.id)) && historyManager.get('currentSubSystem') === '')
		{
			gamma.setSubsystemHistory(selected_subsystem.id,selected_subsystem.uid,selected_subsystem.name,{ "id":-1, "name":''},repoDetails);
		}
		else
		{
			gamma.breadcrumbLoaded = false;	
			gamma.snapshotPluginLoaded = false;
			if (!historyManager.get('currentBreadcrumb').id){
				historyManager.set('currentBreadcrumb', { "id": -1, "name": '' });
			}
			else
			{
				var breadcrumb_id = (historyManager.get('currentBreadcrumb').id).toString();
				if(breadcrumb_id.indexOf('_project') > -1){
					historyManager.set('currentBreadcrumb',{ "id":-1, "name":''});
				}
			}
			gamma.setSubsystemHistory(selected_subsystem.id,selected_subsystem.uid,selected_subsystem.name,{ "id":historyManager.get('currentBreadcrumb').id, "name":historyManager.get('currentBreadcrumb').name},repoDetails);
		}
		//after getting projects getting snapshot and parameters for particular project
		historyManager.set('selectedSnapshots',[]);
		if(historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems')
		{
			gamma.getParameters();
			// gamma.gammatasks.formatter.getTasksMetadata();
			gamma.getSnapshots();
			gamma.loadSnapshotsLayout();
		}

		if($("#timelineContent").length){
			gamma.reloadSnapshot();
		}
	};
	gamma.getProjectById = function(id) {
		var subsystemList 		= gamma.getSubsystemList();
		for(var i = 0 ; i < subsystemList.length ; i++)
		{
			if(subsystemList[i].id == id){
				return subsystemList[i];
			}
		}
	};
	return gamma;
}(g));