
var g = (function(gamma) {


	//---------------- Private methods ----------------
	var snapshotSelector,snapshotPluginLoaded = false;
	var selection_data = [], snapshot_dropdown_multiple, snapshot_dropdown, first_snapshot_selection = false;
	var snapshot_list = [], mulitple_snashot_data = [];
	var snapshot_label;

	e.subscribe('SNAPSHOT_DROPDOWN_CLICK',selectSnapshot);
 	e.subscribe('MULTIPLE_SNAPSHOT_DROPDOWN_CLICK',selectMultipleSnapshot);
	//addding snapshot panel
	function datePickerBarEnabled() {
		try {
			gamma.snapshotPluginLoaded = true;
			var snapshotList = gamma.getSnapshotList();

			var datePickerData = [];
			var j = 0;
			for (var i = (snapshotList.length - 1); i >= 0; i--)
			{
				datePickerData[j] = snapshotList[i];
				j++;
			}
			var current_plugin = historyManager.get('currentPlugin');
			var max_snapshots = gamma.getMetadata(current_plugin.id).max_snapshot;

			if (current_plugin.id == 'release_management' && snapshotList.length > 1){
				max_snapshots = 2;
			}

			snapshotSelector = new e.datepickerbar({ holder: 'snapshot_selector', data: datePickerData, maxSnapshots: max_snapshots, notify: { onSnapshotUpdate: 'SNAPSHOT_UPDATE' } });
		}
		catch (error) {
			console.error(error);
		}
	}
	function selectSnapshot(selected_item) {
		var selected_snapshot_obj;
		try {
			selected_snapshot_obj = _.findWhere(snapshot_list, { id: selected_item.selected_data.id });
			selected_snapshot_obj.snapshotType= 1;
			selection_data[0]= selected_snapshot_obj;
			selection_data.splice(1, 1);
			first_snapshot_selection= true;
			historyManager.set('selectedSnapshots',selection_data);
			gamma.setPluginHistory();
			e.notify(g.notifications.SNAPSHOT_UPDATE);
			snapshot_dropdown.handleEvents();
			$('.snapshots_selector1 .dropdown_text.tooltipstered').tooltipster('destroy');
		}
		catch (error) {
			console.log(error);
		}
	}
	function selectMultipleSnapshot(selected_item) {
		var selected_snapshot_obj;
		try {
		selected_snapshot_obj = _.findWhere(snapshot_list, { id: selected_item.selected_data.id });
		selected_snapshot_obj.snapshotType= 2;

		selection_data[1]= selected_snapshot_obj;

		$(".snapshots_selector2").removeClass('snapshots_selector2_inactive');
		$(".snapshots_selector2 .dropdown_text").removeClass('display_snapshot_msg');
	 	historyManager.set('selectedSnapshots',selection_data);
	 	gamma.setPluginHistory();
		e.notify(g.notifications.SNAPSHOT_UPDATE);
		$('.snapshots_selector2 .dropdown_text.tooltipstered').tooltipster('destroy');
		}
		catch (error) {
			console.log(error);
		}
	}
	function loadSnapshots(){
		$(".snapshots_selector1").remove();
		var dropdown_container = $('<div/>', { class: 'snapshots_selector1' });;
		$(".sanpshot_selection_container").append(dropdown_container);
		var new_snapshot_data=[];
		var snapshot_object={
			id:'',
			type:'',
			icon:'',
			tooltip:'',
			displayData:{},
			itemClass:''
		};
		try {
			_.each(snapshot_list, function (item) {
				var str = item.repoUid;
				snapshot_label = item.snapshotlable == null || "" ? str.slice(0, 8) : item.snapshotlable;
				snapshot_object = {
					id: item.id,
					type: item.referenceType,
					icon: '',
					tooltip: '',
					displayData: { label: snapshot_label, date: gamma.getNewFormattedDate(item.timestamp, 'date'), time: gamma.getNewFormattedDate(item.timestamp, 'time'), formatted_date: gamma.getFormattedDate(item.timestamp, 'date', false, true), formatted_time: gamma.getFormattedDate(item.timestamp, 'time', false, true)},
					itemClass: '',
					formatedDate: gamma.getFormattedDate(item.timestamp)
				};
				snapshot_object.icon = getIcon(item.referenceType);
				new_snapshot_data.push(snapshot_object);
			});
		}
		catch (error) {
			console.log(error);
		}

		new_snapshot_data.reverse();
		dropdown_container.html('');

		try {
			var default_selection = _.findWhere(new_snapshot_data, { "formatedDate": gamma.getFormattedDate(historyManager.get('selectedSnapshots')[0].timestamp) }).id;
		}
		catch (error) {
			console.log(error);
		}
		try {
			snapshot_dropdown = new e.comboBox({
				'html_data': Template.snapshot_list_item({ 'list_data': new_snapshot_data }),
				'holder': dropdown_container,
				'multipleDropdown': false,
				'default_selection': default_selection,
				'showSearch': true,
				'showFilters': true,
				'item_selector': "snapshot_dropdown",
				'dropDownData': new_snapshot_data,
				'showIcon': true,
				'showSubtitle': true,
				'filter_custom_icon': true,
				'notify': { onDropdownItemClick: 'SNAPSHOT_DROPDOWN_CLICK' }
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	function getIcon(referenceType) {
		var icon = "ic-snapshot";
		switch (referenceType) {
			case "branch":
				icon = "ic-branch";
				break;
			case "tag":
				icon = "ic-tags";
				break;
			default:
				icon = "ic-snapshot";
				break;
		}
		return icon;
	}
	function loadMultipleSanpshotSelection() {
		var dropdown_container = $('<div/>', { class: 'snapshots_selector2 hide snapshots_selector2_inactive' });
		var snapshot_selector_arrow = $('<div/>', { class: 'snapshot_selector_arrow hide ic-arrow-right' });
		$(".snapshots_selector1").before(dropdown_container);
		$(".snapshots_selector1").before(snapshot_selector_arrow);

		if (historyManager.get('currentPlugin').id === 'change_overview'){
			$(".snapshots_selector2").removeClass('hide').removeClass('snapshots_selector2_inactive');
			$(".snapshots_selector2 .dropdown_text").addClass('display_snapshot_msg');
			$(".snapshot_selector_arrow").removeClass('hide');
		}
		var new_snapshot_data = [];
		var snapshot_object={};
		try {
			_.each(snapshot_list, function (item) {
				var str = item.repoUid;
				snapshot_label = item.snapshotlable == null || "" ? str.slice(0, 8) : item.snapshotlable;
				snapshot_object = {
					id: item.id,
					type: item.referenceType,
					icon: '',
					tooltip: '',
					displayData: { label: snapshot_label, date: gamma.getNewFormattedDate(item.timestamp, 'date'), time: gamma.getNewFormattedDate(item.timestamp, 'time') },
					itemClass: '',
					formatedDate: gamma.getFormattedDate(item.timestamp)
				};
				snapshot_object.icon = getIcon(item.referenceType);
				if (item.id < historyManager.get('selectedSnapshots')[0].id){
					new_snapshot_data.push(snapshot_object);
				}
			});
		}
		catch (error) {
			console.log(error);
		}

		try {
			var default_selection = i18next.t('common.selectSnapshot');
			new_snapshot_data.reverse();
			dropdown_container.html('');
			snapshot_dropdown_multiple = new e.comboBox({
				'html_data': Template.snapshot_list_item({ 'list_data': new_snapshot_data }),
				'holder': dropdown_container,
				'multipleDropdown': false,
				'default_selection': default_selection,
				'showSearch': true,
				'item_selector':"snapshot_dropdown_multiple",
				'showFilters': true,
				'dropDownData': new_snapshot_data,
				'showIcon': true,
				'showSubtitle': true,
				'filter_custom_icon': true,
				'notify': { onDropdownItemClick: 'MULTIPLE_SNAPSHOT_DROPDOWN_CLICK' }
			});
			$(".snapshots_selector2 .dropdown_text").addClass('display_snapshot_msg');
		}
		catch (error) {
			console.log(error);
		}
	}

	function loadSnapshotsLayout(){
		$(".sanpshot_selection_container").html('');
		snapshot_list=gamma.getSnapshotList();
		loadSnapshots();
		loadMultipleSanpshotSelection();
		$("body:not(.dropdown)").on('click', function(){
			gamma.removeDropDownList();
			e.removeComboBox();
		});
		selection_data=historyManager.get('selectedSnapshots');
	}
	function showSnapshot(){
		var requiredSnapshots = gamma.getPluginMetadata(historyManager.get('currentPlugin').id, 'number_of_snapshot');
		mulitple_snashot_data=[];
		if (requiredSnapshots== 2){

			var snapshot_object = {};
			try {
				_.each(snapshot_list, function (item) {
					var str = item.repoUid;
					snapshot_label = item.snapshotlable == null || "" ? str.slice(0, 8) : item.snapshotlable;
					snapshot_object = {
						id: item.id,
						type: item.referenceType,
						icon: '',
						tooltip: '',
						displayData: { label: snapshot_label, date: gamma.getNewFormattedDate(item.timestamp, 'date'), time: gamma.getNewFormattedDate(item.timestamp, 'time') },
						itemClass: '',
						formatedDate: gamma.getFormattedDate(item.timestamp)
					};
					snapshot_object.icon = getIcon(item.referenceType);
					if (item.id < historyManager.get('selectedSnapshots')[0].id){
						mulitple_snashot_data.push(snapshot_object);
					}
				});
			}
			catch (error) {
				console.log(error);
			}
			mulitple_snashot_data.reverse();
			selection_data = historyManager.get('selectedSnapshots');
			snapshot_dropdown_multiple.setListData(Template.snapshot_list_item({ 'list_data': mulitple_snashot_data }),mulitple_snashot_data);
			if(historyManager.get('selectedSnapshots').length==1 || first_snapshot_selection){
				if (mulitple_snashot_data.length){
					$(".snapshots_selector2").removeClass('hide').addClass('snapshots_selector2_inactive').removeClass('disabled').find('.dropdown_text').html('Please Select Snapshot');
					$(".snapshots_selector2_inactive").find('.dropdown_text').addClass('display_snapshot_msg');
					$(".snapshots_selector2").find('.subtitle_first_sec_text,.subtitle_second_sec_text').html('');
					$(".snapshots_selector2").find('.dropdown_icon').removeClass(function (index, css) {
						return (css.match(/\ic-\S+/g) || []).join(' ');
					});
				}else{
					$(".snapshots_selector2").removeClass('hide').addClass('snapshots_selector2_inactive disabled').find('.dropdown_text').html('No snapshot available');
					$(".snapshots_selector2_inactive").find('.dropdown_text').addClass('display_snapshot_msg');
					$(".snapshots_selector2").find('.subtitle_first_sec_text,.subtitle_second_sec_text').html('');
				}
				$(".snapshot_selector_arrow").removeClass('hide');
			}
			if (historyManager.get('selectedSnapshots').length== 2){
				var selected_snapshots = historyManager.get('selectedSnapshots');
				var snapshot_select_container1 = $(".panel_header .sanpshot_selection_container .snapshots_selector1");
				var snapshot_select_container2 = $(".panel_header .sanpshot_selection_container .snapshots_selector2");
				$(".snapshots_selector2").removeClass('hide').removeClass('snapshots_selector2_inactive');
				$(".snapshots_selector2 .dropdown_text").removeClass('display_snapshot_msg');
				$(".snapshot_selector_arrow").removeClass('hide');
				appendData(snapshot_select_container2, 1);
				appendData(snapshot_select_container1, 0);

				function appendData(container,i) {
					$(container).find(".dropdown_text").html(selected_snapshots[i].snapshotlable);
					$(container).find(".subtitle_first_sec_text").html(gamma.getFormattedDate(selected_snapshots[i].timestamp, 'date', false, true));
					$(container).find(".subtitle_second_sec_text").html(gamma.getFormattedDate(selected_snapshots[i].timestamp, 'time', false, true));
					$(container).find(".dropdown_icon").addClass(getIcon(selected_snapshots[1].referenceType));
				}
			}

			first_snapshot_selection=false;
		}
		else{
			/*if (historyManager.get('selectedSnapshots').length==2){
				var snapselected = historyManager.get('selectedSnapshots');
				snapselected.splice(1,1);
				historyManager.set('selectedSnapshots', snapselected);
			}*/
			$(".snapshots_selector1 .dropdown_text").html(historyManager.get('selectedSnapshots')[0].snapshotlable);
			$(".snapshots_selector1 .subtitle_first_sec_text").html(gamma.getFormattedDate(historyManager.get('selectedSnapshots')[0].timestamp, 'date', false, true));
			$(".snapshots_selector1 .subtitle_second_sec_text").html(gamma.getFormattedDate(historyManager.get('selectedSnapshots')[0].timestamp, 'time', false, true));
			$(".snapshots_selector2").addClass('hide').removeClass('snapshots_selector2_inactive');
			$(".snapshots_selector2 .dropdown_text").removeClass('display_snapshot_msg');
			$(".snapshot_selector_arrow").addClass('hide');
		}
		setTimeout(function(){
			bindDropdownCloseEvent();
			if(snapshot_dropdown){snapshot_dropdown.handleEvents();}
        	if(snapshot_dropdown_multiple){snapshot_dropdown_multiple.handleEvents();}
		},1000);

	}
	function bindDropdownCloseEvent(){
		$("body").on("click", function(){
			if ($('.dropDown_list').length > 0) {
				$('.dropDown_list').slideUp(300, function () {
					$('.dropDown_list').remove();
					$('.dropdown').removeClass('active_dropdown');
					$('.dropdown').find('.dropdown_arrow').children().removeClass('ic-chevron-up').addClass('ic-chevron-down');
				});
			}
		});
	}

	//---------------- Public methods ----------------
	gamma.showSnapshot=showSnapshot;
	gamma.snapshotPluginLoaded = snapshotPluginLoaded;
	gamma.updateSnapshotHistory = function() {
		var snapshotList 	= gamma.getSnapshotList();
		var selected_snaps 	= [];
		if(historyManager.get('selectedSnapshots') == '')
		{
			selected_snaps[0] = snapshotList[snapshotList.length - 1 ];
			selected_snaps[0].snapshotType= 1;
			historyManager.set('selectedSnapshots',selected_snaps);
		}
		//after getting projects and snapshots initialize breadcrumb if its not loaded already
		if(!gamma.breadcrumbLoaded)
		{
			e.enablePlugin('breadcrumb',function () {
				var bc = new e.breadcrumb({reset:false});
			});
		}
	};
	gamma.loadSnapshotPanel = function() {
		try {
			if (!gamma.snapshotPluginLoaded) {
				e.enablePlugin('datePickerBar', datePickerBarEnabled);
			}
		}
		catch (error) {
			console.log(error);
		}
	};
	gamma.setSnapshotSelection = function(max_snapshots) {
		try {
			var selected_snap = historyManager.get('selectedSnapshots');
			if (max_snapshots > 1) {
				if (selected_snap.length == 1) {
					var index = gamma.searchObjectIndexById(gamma.getSnapshotList(), selected_snap[0].id);
					selected_snap[1] = gamma.autoselectSnapshot(index);
					historyManager.set('selectedSnapshots', selected_snap);
				}
				snapshotSelector.setSelection(selected_snap, max_snapshots);
			}
			else{
				snapshotSelector.setSelection([selected_snap[0]], max_snapshots);
			}
		}
		catch (error) {
			console.log(error);
		}
	};
	gamma.searchObjectIndexById = function(arrayList,value) {
		var i;
		for(i=0; i < arrayList.length;i++)
		{
			if(arrayList[i].id == value){
				break;
			}
		}
		return i;
	};
	gamma.autoselectSnapshot = function(index) {
		var temp_snapshot = {};
		var snapshotList 	= gamma.getSnapshotList();
		if(index == 0){
			temp_snapshot = snapshotList[index];
		}else{
			temp_snapshot = snapshotList[index-1];
		}
		return temp_snapshot;
	};
	gamma.loadSnapshots = function(){
		loadSnapshots();
	};
	gamma.loadSnapshotsLayout = function () {
		loadSnapshotsLayout();
	};
	gamma.updateSnapshotAfterAnalysis = function(send_notification) {
		try {
			var snapshotList 	= gamma.getSnapshotList();
			var selected_snaps 	= [];
			selected_snaps[0] = snapshotList[snapshotList.length - 1 ];
			selected_snaps[0].snapshotType= 1;
			historyManager.set('selectedSnapshots',selected_snaps);
			gamma.setPluginHistory();
			if (send_notification){
				e.notify(g.notifications.SNAPSHOT_UPDATE);
			}
			loadSnapshotsLayout();
		}
		catch (error) {
			console.log(error);
		}
	};
	return gamma;
}(g));