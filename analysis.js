var g = (function(gamma) {

	var run_analysis_popup;
	var branchDataArray = [];
	var blincking_object = {};
	var switchButton;
	var analysis_type = '';
	var repository_name = '';
	var fastScan=false, commitId;
	var available_scans;
    var disableFastScan = ['cpp', 'objective_c', 'typescript', 'javascript'];
    const serviceProvider = ['git', 'github', 'bit', 'bitbucket', 'gitlab'];

	function updateAnalysisButtonState(analysis_details) {
		//$('header .run_analysis').attr('data-subsystem_uid',analysis_details.subsystemId);
		if(analysis_details && analysis_details.subsystemId == $('header .run_analysis').attr('data-subsystem_uid'))
		{
			var blink_btn = $("header .run_analysis[data-subsystem_uid='" + analysis_details.subsystemId + "']");
			blink_btn.data('analysis_details',analysis_details);
			/*if((analysis_details.percentage < 20 || analysis_details.status_message == 'UPDATING_SOURCES') && analysis_details.message != 'QUEUED')
				blink_btn.addClass('disabled').attr('title', 'Abort will be enabled only after checkout is complete.');
			else
				blink_btn.removeClass('disabled').removeAttr( "title" );*/
			if(analysis_details.status == "QUEUED")
			{
				gamma.startAnalysisAnimation(analysis_details,blink_btn);
			}
			else if(analysis_details.status == 'ABORTING')
			{
				$('header .run_analysis .btn-text').html('ABORTING');
				$('header .run_analysis').addClass('disabled');
			}
			else if(analysis_details.status == 'SUCCESS' || analysis_details.status == 'FAIL' || analysis_details.status == 'ABORT' || analysis_details.status == 'CANCEL')
			{
				$('header .run_analysis').removeClass('disabled');
				gamma.stopAnalysisAnimation(analysis_details.subsystemId);
			}
		}
	}

	$('header .run_analysis').on('click',function(event) {
		e.removeDropdown();
		e.removeComboBox();
		event.stopPropagation();

		if($('header .run_analysis .btn-text').html() == 'Abort Scan')
		{
			var analysis_details = $(this).data('analysis_details');
			gamma.abortAnalysis(event,analysis_details);
		}
		else{
			$('.dropDown_list').remove();
            $('.dropdown').removeClass('active_dropdown');
            $('.dropdown').find('.dropdown_arrow').children().removeClass('ic-chevron-up').addClass('ic-chevron-down');
			gamma.openRunAnalysisPopup(historyManager.get('currentSubSystemUid'));
		}
	});

	function subscribeEvents() {
		e.subscribe('SWITCHBUTTON_SELECT',onSwitchbuttonClick);
	}

	function unSubscribeEvents() {
		e.unSubscribe('SWITCHBUTTON_SELECT');
	}

	function onSwitchbuttonClick(clicked_item) {
		var selected_branch_string = '';
		$('.run_analysis_popup .error-msg').css('display', 'none');
		$('.run_analysis_popup .inputbox_wraper').removeClass('input-error');
		$('.run_analysis_popup .selected_branch input').css("border-color", '#eaebee');
		$('.run_analysis_popup .no_record_msg').addClass('hide');
		$('.run_analysis_popup .search_input').val('');

        if(clicked_item.target.hasClass('branches')){
			analysis_type = 'branch';
			$('.run_analysis_popup .commit-field-wrapper .commit-input').val('');
			$('.run_analysis_popup').find('.search_analysis_wrapper, .branch_list_wrapper').removeClass('hide');
			$('.run_analysis_popup .commit-field-wrapper').addClass('hide');
			selected_branch_string = (branchDataArray.repoType.toLowerCase() == 'zip') ? '' : ((branchDataArray.branches.length) > 0 ? branchDataArray.branches[0].split('refs/heads/')[1] : '');

        	$('.search_input').attr('placeholder',i18next.t('common.run_analysis.search_branch'));
			if(branchDataArray.branches.length > 0)
        	{
				$('.run_analysis_popup .run_analysis_button_wrapper').removeClass('disabled');
        		if(analysis_type.toLowerCase() == 'tag')
        		{
					$('.selected_branch .selected_snapshot_input').val(branchDataArray.branches[0].split('refs/heads/')[1]);
        			$('.selected_branch').attr('data-actual',branchDataArray.branches[0]);
				}
				else
				{
					var branch_name = ((branchDataArray.repoBranchOrTag.split('refs/heads/').length > 1 && _.contains(branchDataArray.branches, branchDataArray.repoBranchOrTag)) ? branchDataArray.repoBranchOrTag.split('refs/heads/')[1] : (branchDataArray.branches[0].split('refs/heads/')[1]));
					var actual_name = ((branchDataArray.repoBranchOrTag.split('refs/heads/').length > 1 && _.contains(branchDataArray.branches, branchDataArray.repoBranchOrTag)) ? (branchDataArray.repoBranchOrTag).toLowerCase() : branchDataArray.branches[0]);
					$('.selected_branch .selected_snapshot_input').val(branch_name);
					$('.selected_branch').attr('data-actual',actual_name);
				}

				if (_.contains(branchDataArray.branches, branchDataArray.repoBranchOrTag)) {
					selected_branch_string = branchDataArray.repoBranchOrTag.split('refs/heads/')[1];
				} else {
					selected_branch_string = branchDataArray.branches[0].split('refs/heads/')[1];
				}
			}else{
				selected_branch_string = branchDataArray.repoBranchOrTag;
			}
			dataUpdate(branchDataArray.branches, $('.branch_list_wrapper'),'heads');
		}
		else if (clicked_item.target.hasClass('branch_commit')) {
			$('.run_analysis_popup .run_analysis_button_wrapper').removeClass('disabled');
			analysis_type = 'branch_commit';
			$('.run_analysis_popup').find('.search_analysis_wrapper, .branch_list_wrapper').addClass('hide');
			$('.run_analysis_popup .commit-field-wrapper').removeClass('hide');
		}
        else{
			analysis_type = 'tag';
			$('.run_analysis_popup .commit-field-wrapper .commit-input').val('');
			$('.run_analysis_popup').find('.search_analysis_wrapper, .branch_list_wrapper').removeClass('hide');
			$('.run_analysis_popup .commit-field-wrapper').addClass('hide');
			$('.search_input').attr('placeholder',i18next.t('common.run_analysis.search_tag'));
			if(branchDataArray.tags.length > 0)
        	{
				$('.run_analysis_popup .run_analysis_button_wrapper').removeClass('disabled');
        		//$('.analysis_label').html(i18next.t('common.run_analysis.tag'));
        		if(analysis_type == 'tag')
        		{
					var tag_name = ((branchDataArray.repoBranchOrTag.split('refs/tags/').length > 1 && _.contains(branchDataArray.tags, branchDataArray.repoBranchOrTag)) ? branchDataArray.repoBranchOrTag.split('refs/tags/')[1] : (branchDataArray.tags[0].split('refs/tags/')[1]));

					var actual_name = ((branchDataArray.repoBranchOrTag.split('refs/tags/').length > 1 && _.contains(branchDataArray.tags, branchDataArray.repoBranchOrTag)) ? (branchDataArray.repoBranchOrTag).toLowerCase() : branchDataArray.tags[0]);
					$('.selected_branch .selected_snapshot_input').val(tag_name);
					$('.selected_branch').attr('data-actual',actual_name);
				}
				else
				{
					$('.selected_branch .selected_snapshot_input').val(branchDataArray.tags[0].split('refs/tags/')[1]);
					$('.selected_branch').attr('data-actual',branchDataArray.tags[0]);
				}

				if (_.contains(branchDataArray.tags, branchDataArray.repoBranchOrTag)) {
					selected_branch_string = branchDataArray.repoBranchOrTag.split('refs/tags/')[1];
				} else {
					selected_branch_string = branchDataArray.tags[0].split('refs/tags/')[1];
				}

				dataUpdate(branchDataArray.tags, $('.branch_list_wrapper'),'tags');
			}
			else{
				$('.selected_branch .selected_snapshot_input').val('');
				$('.branch_list_wrapper').html('');
				selected_branch_string = branchDataArray.repoBranchOrTag;
				var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('admin.tag.error.no_tags_found'), details: i18next.t('common.info_description.no_content'), is_add_button: false, button_text: '', is_task_management_button: false, task_management_text: '' };
				g.error_message_view(data, $('.branch_list_wrapper'));
				$('.run_analysis_popup .run_analysis_button_wrapper').addClass('disabled');
			}

        }
		if (branchDataArray.repoType.toLowerCase() == 'zip' || branchDataArray.repoType.toLowerCase() == 'remote') {
			repository_name = branchDataArray.repoName;
		}
		else {
			repository_name = selected_branch_string;
		}

		if ($('.selected_list_item').length > 0){
			setTimeout(function () {
				$('.branch_list_wrapper').animate({ scrollTop: $('.selected_list_item').position().top }, 1000);
			}, 250);
		}
		// if (available_scans <= 0) {
		// 	$('.run_analysis_popup .popup_button_wrapper .run_analysis_button_wrapper').addClass('disabled');
		// 	$('.warningPopUp').removeClass('hide');
		// }
	}

	function createPopup(data,status) {
		unSubscribeEvents();
		subscribeEvents();

		if(status == 'success')
		{
			branchDataArray = data;

			branchDataArray.branches.sort(function (a, b) {
				return a.replace(/^\W+/, 'z').localeCompare(b.replace(/^\W+/, 'z'));
			});

			branchDataArray.tags.sort(function (a, b) {
				return a.replace(/^\W+/, 'z').localeCompare(b.replace(/^\W+/, 'z'));
			});

			branchDataArray.tags = branchDataArray.tags.reverse();

			var totalSnapshots = parseInt(branchDataArray.totalSnapshots);
			var erasableSnapshots = parseInt(branchDataArray.erasableSnapshots);
            var scan_credit = parseInt(branchDataArray.scanDetails.license_detail.metrics.scans.limit);
			var scan_history = parseInt(branchDataArray.scanDetails.license_detail.metrics.snapshots.limit);

            if (branchDataArray.scanDetails.current.scans == undefined) {
				branchDataArray.scanDetails.current.scans = 0;
			}
			var consumed_scan_credit = branchDataArray.scanDetails.current.scans;
			available_scans = scan_credit - consumed_scan_credit;
			var available_scan_history = (scan_history == -1) ? "Unlimited" : (scan_history - totalSnapshots);
			var actualAvailableSnapshots = (scan_history == -1) ? "Unlimited" : (scan_history - totalSnapshots) + erasableSnapshots;
			var popup_width = 650;
	        var popup_height = 570;

			var popup_title_data = $('<div/>',{class:'popup_title_data float_left h2 text_transform_capitalize'});
			var popup_data = $('<div/>',{class:'popup_data run_analysis_popup float_left'});

				var popup_icon       = $('<div/>',{class:'popup_icon float_left ic-run-analysis run_analysis_icon'});
		    	var popup_title      = $('<div/>',{class:'error_title_msg float_left'}).html(i18next.t('common.run_analysis.run_analysis_title'));
		    	var available_credit = $('<div/>',{class:'error_title_msg available_credit float_left'}).html(i18next.t('common.run_analysis.scan_credit_available')+available_scan_history);
		    	popup_title_data.append(popup_icon, popup_title);//, available_credit);

		    	var repository_outer_wrapper = $('<div/>',{class:'repository_outer_wrapper'});
		    	var repository_details 	= $('<div/>',{class:'repository_details float_left'});

				var branch_actual_name = '';
				if (branchDataArray.repoBranchOrTag.includes('heads') && branchDataArray.branches.length > 0){
					branch_actual_name = ((((branchDataArray.repoBranchOrTag).split('/')).length > 1 && _.contains(branchDataArray.branches, branchDataArray.repoBranchOrTag)) ? branchDataArray.repoBranchOrTag : branchDataArray.branches[0]);
					analysis_type = 'branch';
				} else if (branchDataArray.repoBranchOrTag.includes('tags') && branchDataArray.tags.length > 0){
					branch_actual_name = ((((branchDataArray.repoBranchOrTag).split('/')).length > 1 && _.contains(branchDataArray.tags, branchDataArray.repoBranchOrTag)) ? branchDataArray.repoBranchOrTag : branchDataArray.tags[0]);
					analysis_type = 'tag';
				} else if (branchDataArray.repoBranchOrTag.includes('heads')){
					branch_actual_name = branchDataArray.repoBranchOrTag;
					analysis_type = 'branch';
				} else if (branchDataArray.repoBranchOrTag.includes('tags')) {
					branch_actual_name = branchDataArray.repoBranchOrTag;
					analysis_type = 'tag';
				}else{
					branch_actual_name = branchDataArray.repoBranchOrTag;
					analysis_type = 'branch_commit';
				}

				var analysis_label = $('<div/>',{class:'analysis_label float_left color_medium h4'}).html("Snapshot label :");
				var selected_branch_string = (branchDataArray.repoType.toLowerCase() == 'zip') ? '' : ((branchDataArray.branches.length) > 0 ? branchDataArray.branches[0].split('refs/heads/')[1] : '');
				if (branchDataArray.repoBranchOrTag != '') {
					if(analysis_type === 'branch'){
						if (branchDataArray.branches.length > 0) {
							if (_.contains(branchDataArray.branches, branchDataArray.repoBranchOrTag)){
								selected_branch_string = branchDataArray.repoBranchOrTag.split('refs/heads/')[1];
							}else{
								selected_branch_string = branchDataArray.branches[0].split('refs/heads/')[1];
							}
						}else{
							selected_branch_string = branchDataArray.repoBranchOrTag;
						}
					}else{
						if (branchDataArray.tags.length > 0) {
							if(_.contains(branchDataArray.tags, branchDataArray.repoBranchOrTag)){
								selected_branch_string = branchDataArray.repoBranchOrTag.split('refs/tags/')[1];
							}else{
								selected_branch_string = branchDataArray.tags[0].split('refs/tags/')[1];
							}
						}else{
							selected_branch_string = branchDataArray.repoBranchOrTag;
						}
					}
				}

				if (branchDataArray.repoType.toLowerCase() == 'zip' || branchDataArray.repoType.toLowerCase() == 'remote') {
					repository_name=branchDataArray.repoName;
				}
				else {
					repository_name = selected_branch_string;
				}

				var selected_snapshot_input = $('<input/>', { class: 'selected_snapshot_input p stroke_light stroke_all', placeholder: "Snapshot label" }).val(repository_name);
				var inputbox_wraper = $('<div/>', { class: 'inputbox_wraper' });
				var input_error = $('<div/>', { class: 'error-msg p color_bad' });
				inputbox_wraper.append(selected_snapshot_input,input_error);
				var selected_branch = $('<div/>', { class: 'selected_branch float_left h4 color_dark' }).append(inputbox_wraper);
				if (analysis_type.toLowerCase() == 'branch_commit') {
					selected_snapshot_input.val("");
				}
				selected_branch.attr('data-actual', branch_actual_name);
				if(branchDataArray.branches.length <= 0){
					//analysis_label.html('');
					//selected_snapshot_input.val('');
				}
				var scan_label = $('<div/>',{class:'scan_label float_right color_medium h4'}).html(i18next.t('common.run_analysis.available_scans'));
				var scan_count = $('<div/>', { class: 'scan_count float_right h4 color_dark' }).html((scan_credit == -1) ? 'Unlimited' : (e.format.abbrNumber(available_scans, 2)));// + '/' + e.format.abbrNumber(scan_credit, 2)));
				repository_details.append(analysis_label,selected_branch,scan_count,scan_label);

				var scan_history_wrapper = $('<div/>', {
					class: 'scan_history float_left'
				});
				var scan_history_label = $('<div/>', {
					class: 'scan_label float_right color_medium h4'
				}).html(i18next.t('common.run_analysis.scan_history'));
				var scan_history_count = $('<div/>', {
					class: 'scan_count float_right h4 color_dark'
				}).html(available_scan_history); //+'/'+scan_history);
				scan_history_wrapper.append(scan_history_count, scan_history_label);

				//----------------- subsystem name and language info --------------------
				var subsystem_details 	= $('<div/>',{class:'repo_details float_left'});
				var subsystem_type 		= $('<div/>',{class:'repo_type_icon float_left'});

				subsystem_type.addClass(renderIcon(branchDataArray.repoType));

				var subsystem_name 		= $('<div/>',{class:'repo_subsystem_name float_left h3'}).html(branchDataArray.repoName);

				var subsystem_languages = $('<div/>',{class:'subsystem_languages float_right'});
				var color_class = '',subsystem_language;
				if(branchDataArray.repoLanguage !== null && branchDataArray.repoLanguage !== undefined)
				{
					for(var j = 0 ; j < branchDataArray.repoLanguage.length ; j++)
					{
						color_class = 'fill_'+(branchDataArray.repoLanguage[j]).toLowerCase();
						subsystem_language = $('<div/>', { class: 'project_language float_right p language_text ' + color_class }).html(i18next.t("common.languages." + branchDataArray.repoLanguage[j]));
						subsystem_language.attr('data-language_id',(branchDataArray.repoLanguage[j]).toLowerCase());
						subsystem_languages.append(subsystem_language);
				    }
				}
			    subsystem_details.append(subsystem_type,subsystem_name,subsystem_languages);

			// var warningDiv = `<div class="warningPopUp hide">
			// 				<img src="images/warning.svg"></img>
			// 				<p>Your have insufficient balance.</p>
			// 			</div>`
			// popup_data.append(warningDiv);

			repository_outer_wrapper.append(subsystem_details);
		    repository_outer_wrapper.append(repository_details);

            repository_outer_wrapper.append(scan_history_wrapper);
            scan_label.removeClass('hide');
            scan_count.removeClass('hide');
            available_credit.removeClass('hide');

		    popup_data.append(repository_outer_wrapper);

            var no_record_msg = $('<div />', { class: "no_record_msg h4 float_left hide" }).html(i18next.t('admin.no_data_found'));
			var branch_list_wrapper = $('<div/>',{class:'branch_list_wrapper'});
			var commitFieldWrapper = $('<div/>', { class: 'commit-field-wrapper hide inputbox_wraper' });
			var commitField = $('<div/>', { class: 'commit-field inputbox_wraper' });
			var input_error = $('<div/>', { class: 'error-msg p color_bad' });
			var commitInput = $('<input/>', { class: 'commit-input', type:"text", placeholder:"Enter Commit ID (Long Or Short)"});
			commitField.append(commitInput, input_error);
			commitFieldWrapper.append(commitField);
			var incrementalScanWrapper = $('<div/>', { class: 'incremental-scan-wrapper fluid_row_checkbox_container' });
			var scanCheckboxLabel = $('<label/>', { class: 'scan-checkbox-label' });
			var scanCheckboxInput = $('<input/>', { class: "checkbox", type: "checkbox"});
			var scanCheckboxCheckmark = $('<span/>', { class: 'criticality_checkmark scan-checkbox-checkmark checkmark' });
			var scanCheckboxTitle = $('<label/>', { class: 'scan-checkbox-title inline-label' }).text(i18next.t('common.run_analysis.enable_fast_scan'));
			scanCheckboxLabel.append(scanCheckboxInput, scanCheckboxCheckmark);
			var panelTitleInfoIcon = $('<div/>', { class: 'panel_title_info_icon ic-info' });
			incrementalScanWrapper.append(scanCheckboxLabel, scanCheckboxTitle, panelTitleInfoIcon);
			var languageName = (branchDataArray.repoLanguage[0]).trim().toLowerCase();
			var panelTitleInfoContent;
            if($.inArray(branchDataArray.repoType.toLowerCase(), serviceProvider) !== -1)
            {
				var selection_outer_wrapper = $('<div/>',{class:'selection_outer_wrapper'});
				if (analysis_type.toLowerCase() == 'tag') {
					switchButton = new e.switchButton({ width: 17, height: 17, show_tabs: 3, holder: selection_outer_wrapper, is_icons: true, icons: { first: 'ic-tags', second: 'ic-branch', third: 'ic-time' }, class: { first: 'branch_tags', second: 'branches', third: 'branch_commit' }, text: { first: i18next.t('common.run_analysis.tags'), second: i18next.t('common.run_analysis.branches'), third: i18next.t('common.run_analysis.commits') }, notify: { onParameterSelect: 'SWITCHBUTTON_SELECT' } });
				} else if (analysis_type.toLowerCase() == 'branch') {
					switchButton = new e.switchButton({ width: 17, height: 17, show_tabs: 3, holder: selection_outer_wrapper, is_icons: true, icons: { first: 'ic-branch', second: 'ic-tags', third: 'ic-time' }, class: { first: 'branches', second: 'branch_tags', third: 'branch_commit' }, text: { first: i18next.t('common.run_analysis.branches'), second: i18next.t('common.run_analysis.tags'), third: i18next.t('common.run_analysis.commits') }, notify: { onParameterSelect: 'SWITCHBUTTON_SELECT' } });
				} else {
					switchButton = new e.switchButton({ width: 17, height: 17, show_tabs: 3, holder: selection_outer_wrapper, is_icons: true, icons: { first: 'ic-time', second: 'ic-tags', third: 'ic-branch' }, class: { first: 'branch_commit', second: 'branch_tags', third: 'branches' }, text: { first: i18next.t('common.run_analysis.commits'), second: i18next.t('common.run_analysis.tags'), third: i18next.t('common.run_analysis.branches') }, notify: { onParameterSelect: 'SWITCHBUTTON_SELECT' } });
				}

				var search_wrapper 	= $('<div/>',{class:'search_analysis_wrapper'});
				var search_input 	= $('<input/>',{type:'text', class:'search_input p color_medium'});
				if (analysis_type.toLowerCase() == 'tag') {
					search_input.attr('placeholder', i18next.t('common.run_analysis.search_tag'));
				} else if (analysis_type.toLowerCase() == 'branch') {
					search_input.attr('placeholder', i18next.t('common.run_analysis.search_branch'));
				}
				search_wrapper.append(search_input);
				popup_data.append(selection_outer_wrapper);
                popup_data.append(search_wrapper);
                if ((disableFastScan.indexOf(languageName)  > -1)){
					popup_data.append(commitFieldWrapper, no_record_msg, branch_list_wrapper);
				}else{
					popup_data.append(commitFieldWrapper, no_record_msg, branch_list_wrapper, incrementalScanWrapper);
				}
			} else {
                popup_data.append(no_record_msg, branch_list_wrapper);
            }
			$('.incremental-scan-wrapper  .panel_title_info_icon').attr("id", 'fast_scan');

			if (branchDataArray.gitSnapshots > 0) {
				incrementalScanWrapper.find('label').removeClass('disabled');
				panelTitleInfoContent = $('<div/>', { class: 'panel_title_info_content' }).text(i18next.t('common.run_analysis.enable_fast_scan_description'));
			} else {
				incrementalScanWrapper.find('label').addClass('disabled');
				panelTitleInfoContent = $('<div/>', { class: 'panel_title_info_content' }).text(i18next.t('common.run_analysis.enable_fast_scan_description_for_first_scan'));
			}
			// (branchDataArray.snapshots[0].count > 0) ? incrementalScanWrapper.find('label').removeClass('disabled') : incrementalScanWrapper.find('label').addClass('disabled');
			if (branchDataArray.repoType.toLowerCase() == 'zip' || branchDataArray.repoType.toLowerCase() == 'svn' || branchDataArray.repoType.toLowerCase() == 'manual' || branchDataArray.repoType.toLowerCase() == 'tfs' || branchDataArray.repoType.toLowerCase() == 'remote'){
				branch_list_wrapper.css('border-color','white');
				branch_list_wrapper.css('max-height','235px');
				branch_list_wrapper.css('min-height','235px');
				//analysis_label.html('');
				selected_snapshot_input.val('');
			}

			if (languageName == 'cpp' || languageName == 'objective_c') {
				popup_height = 530;
			}

			if (branchDataArray.repoType.toLowerCase() == 'zip' || branchDataArray.repoType.toLowerCase() == 'remote' || branchDataArray.repoType.toLowerCase() == 'svn' || branchDataArray.repoType.toLowerCase() == 'tfs') {
				popup_height = 275;
				branch_list_wrapper.addClass('hide');
				repository_outer_wrapper.css({ 'height': '7.5em' });
			}
			else{
				repository_outer_wrapper.css({ 'border-bottom': '1px solid #E7E8EC' });
			}

			var button_wrapper 				= $('<div/>',{class:'popup_button_wrapper'});
			var cancel_button 				= $('<button/>',{type:'button', class:'analysis_cancel_button button_small button_ternary float_right'}).html(i18next.t('admin.cancel'));
			var run_analysis_button_wrapper = $('<button/>',{type:'button', class:'run_analysis_button_wrapper button_primary float_right'});
			var run_analysis_icon 			= $('<div/>',{class:'ic-run-analysis analysis_button_icon float_left'});
			var run_analysis_text 			= $('<div/>',{class:'analysis_button_text float_left'}).html(i18next.t('common.run_analysis.run_analysis_title'));
			run_analysis_button_wrapper.append(run_analysis_icon,run_analysis_text);

			// var keep_this_snapshot_wrapper = $('<div/>',{class:'keep_this_snapshot_wrapper float_left'});
			// 	var option_checkbox = $('<div/>',{class:'option_checkbox float_left'});
			// 	var snapshot_checkbox = new e.checkbox({width:16,height:16,current_state:0,notify:{onParameterCheck:'SNAPSHOT_CHEKBOX'}});
			// 	snapshot_checkbox.addTo(option_checkbox);
			// 	var keep_this_snapshot = $('<div/>',{class:'keep_this_snapshot float_left p'}).html(i18next.t('common.run_analysis.keep_this_snapshot'));
			// keep_this_snapshot_wrapper.append(option_checkbox, keep_this_snapshot);

			// button_wrapper.append(keep_this_snapshot_wrapper, run_analysis_button_wrapper, cancel_button);
			button_wrapper.append(run_analysis_button_wrapper, cancel_button);

			if (branchDataArray.repoType.toLowerCase() === 'remote'){
				run_analysis_button_wrapper.addClass('disabled');
				run_analysis_button_wrapper.attr('disabled','disabled');
			}

			popup_data.append(button_wrapper);

			run_analysis_popup = new e.popup({ width: popup_width, height: popup_height, default_state: 1, style: { popup_content: { 'padding': 28 } }, notify: { onPopupClose: 'RUN_ANALYSIS_POPUP_CLOSE' } });
		    run_analysis_popup.addTitle(popup_title_data);
		    run_analysis_popup.addContent(popup_data);
			run_analysis_popup.openPopup();

			// if (available_scans <= 0) {
			// 	$('.run_analysis_popup .popup_button_wrapper .run_analysis_button_wrapper').addClass('disabled');
			// 	$('.warningPopUp').removeClass('hide');
			// }
		    if($.inArray(branchDataArray.repoType.toLowerCase(), serviceProvider) !== -1)
			{
		    	if(analysis_type == 'tag'){
					$('.run_analysis_popup').find('.search_analysis_wrapper, .branch_list_wrapper').removeClass('hide');
					$('.run_analysis_popup .commit-field-wrapper').addClass('hide');
					dataUpdate(branchDataArray.tags,branch_list_wrapper,'tags');
				} else if (analysis_type == 'branch'){
					$('.run_analysis_popup').find('.search_analysis_wrapper, .branch_list_wrapper').removeClass('hide');
					$('.run_analysis_popup .commit-field-wrapper').addClass('hide');
					dataUpdate(branchDataArray.branches, branch_list_wrapper,'heads');
				} else{
					$('.run_analysis_popup').find('.search_analysis_wrapper, .branch_list_wrapper').addClass('hide');
					$('.run_analysis_popup .commit-field-wrapper').removeClass('hide');
				}


				if ($('.selected_list_item').length > 0) {
					setTimeout(function () {
						branch_list_wrapper.animate({ scrollTop: $('.selected_list_item').position().top }, 1000);
					}, 250);
				}

		    }else {
                run_analysis_popup.height = 300;
            }

			cancel_button.on('click',function() {
				$('header .run_analysis .analysis_button_text').html('Scan');
				run_analysis_popup.closePopup();
	    	});

			$('.incremental-scan-wrapper .scan-checkbox-title').on('click',function () {
				var incrementalCheckbox = $('.incremental-scan-wrapper').find('.checkbox');
				if (incrementalCheckbox.is(":checked")) {
					incrementalCheckbox.attr("checked", false);
				} else {
					incrementalCheckbox.prop("checked", true);
				}
			});

	    	$('.search_input').on('keyup',function(event) {
				event.stopPropagation();
				var search_results = '';
				var selected_type = '';
				if(switchButton.getSelection() == 'Branches'){
					selected_type = branchDataArray.branches;
				}else{
					selected_type = branchDataArray.tags;
				}

				if (($('.search_input').val()).trim() !== '') {
                    search_results = createSearchData(selected_type,($('.search_input').val()).trim());
                }
				else {
                    search_results = selected_type;
                }

				if (switchButton.getSelection() == 'Branches') {
					dataUpdate(search_results, branch_list_wrapper, 'heads');
				} else {
					dataUpdate(search_results, branch_list_wrapper,'tags');
				}

			});
			$('.run_analysis_popup .selected_snapshot_input').on('keypress', function (event) {
				return (g.application.repository.repository_snapshots.restrictOnKeyPress(event))
			});
			$(document).on("focus", '.selected_branch input.selected_snapshot_input',function(){
				$(this).css("border-color", '#CCCCCC');
				$(".inputbox_wraper").removeClass("input-error");
				$('.selected_branch .error-msg').css('display', 'none');
			});

			$('.run_analysis_popup .switch_menu[data-tab="branch_commit"]').on('click', function () {
				$('.run_analysis_popup .selected_branch .selected_snapshot_input').val("");
			});

			$('.run_analysis_popup .commit-input').keyup(function () {
				$(this).css("border-color", '#CCCCCC');
				$(".commit-field.inputbox_wraper").removeClass("input-error");
				$('.commit-field .error-msg').css('display', 'none');
			});

			$('.incremental-scan-wrapper .panel_title_info_icon').webuiPopover('destroy');
			$('.incremental-scan-wrapper .panel_title_info_icon').webuiPopover({ content: panelTitleInfoContent, placement: "right-bottom", trigger: 'hover', animation: 'pop', width: 200 });

			$('.run_analysis_button_wrapper').on('click',function(event) {
				event.stopPropagation();
				gamma.project_language = $('.popup_container .subsystem_languages .project_language').attr('data-language_id');
				if (available_scans > 0 || scan_credit == -1){

					if($.inArray(branchDataArray.repoType.toLowerCase(), serviceProvider) !== -1){
						var commitIdField = $(this).parents('.run_analysis_popup').find('.commit-input');
						(commitIdField.val().trim() != "") ? commitId = commitIdField.val().trim() : commitId = "";
					}

					if (parseInt(branchDataArray.totalSnapshots) > 0) {
						var incrementalScanCheckox = $(this).parents('.run_analysis_popup').find('.incremental-scan-wrapper .checkbox');
						(incrementalScanCheckox.is(":checked")) ? fastScan = true : fastScan = false;
					}else{
						fastScan = false;
					}
					if ((available_scan_history > 0 || available_scan_history == 'Unlimited') || ( actualAvailableSnapshots > 0 || actualAvailableSnapshots == 'Unlimited')){
						if ($('.selected_snapshot_input').val().trim() != '') {
							if ($('.selected_snapshot_input').val().trim().length <= 20) {
								if ($('.run_analysis_popup .branch_commit').hasClass('switch_button_selection')){
									if (commitIdField.val().trim() != '') {
										runAnalysis(branchDataArray);
									} else {
										var revisionField = $('.run_analysis_popup .commit-field');
										revisionField.find('.error-msg').css('display', 'block');
										revisionField.find('.error-msg').text(i18next.t('common.run_analysis.enter_commit_id'));
										revisionField.addClass("input-error");
									}
								}else{
									runAnalysis(branchDataArray);
								}
							}else{
								$('.selected_branch .error-msg').css('display', 'block');
								$('.selected_branch .error-msg').text(i18next.t('common.run_analysis.label_chatacters_exceeds'));
								$(".inputbox_wraper").addClass("input-error");
								$('.selected_branch input').css({ "border-color": 'rgb(242, 108, 105)' });
							}

						} else {
							$('.selected_branch .error-msg').css('display', 'block');
							$('.selected_branch .error-msg').text(i18next.t('common.run_analysis.enter_label'));
							$(".inputbox_wraper").addClass("input-error");
							$('.selected_branch input').css({ "border-color": 'rgb(242, 108, 105)' });
						}

					}else{
						var errorData = {"error":{
							"code": 1765,
							"name": "licenseScansLimitError",
							"message": "Please consider buying scan credit packs or upgrade your license."
						}};
						g.addErrorAlert(errorData);
					}
				}
				else{
					//add class disabled
					// $('.run_analysis_popup .popup_button_wrapper .run_analysis_button_wrapper').addClass('disabled')
					// $('.warningPopUp').removeClass('hide');
					// $('popup_container').addClass("warningboxPopupHt");
					// var success_msg = { status: 'error', message: i18next.t('common.run_analysis.insufficient_scan_credit'), details: i18next.t('common.run_analysis.insufficient_scan_credit_details') };
					// gamma.sendErrorNotification(success_msg, '/gamma/api/analysis/analysesubsystem', '', '');
					var errorData = {"error":{
						"code": 1765,
						"name": "licenseScansLimitError",
						"message": "Please consider buying scan credit packs or upgrade your license."
					}};
					g.addErrorAlert(errorData);
				}
			});
		}

		gamma.admin.utils.bindInputEvents();
	}

	function runAnalysis(branchTagData) {
		//Run Analysis
		function subsystemAddedToQueue(data, status) {
			var inputboxWrapper = $('.repository_outer_wrapper');
			//mix panel event
			var eventObj = {
				profile_properties: {},
				event_properties: {
					'Language': gamma.project_language,
					'Type': analysis_type
				}
			};
			gamma.set_mixpanel_event("Run scan", gamma.mixpanel_uid, eventObj);

			$(".analysis_anime_icon").addClass('animate_analysis_icon');
			setTimeout(function () { $(".analysis_anime_icon").removeClass('animate_analysis_icon'); }, 1200);
			g.getCurrentAnalysis();
			/* if (status == 'success') {
				var success_msg = { status: 'success', message: i18next.t('common.run_analysis.repository_added_to_queue'), details: '' };
				gamma.sendErrorNotification(success_msg, '/gamma/api/analysis/analysesubsystem', '', '');
			}
			else {
                gamma.sendErrorNotification(data, '', '');
			} */
			if(status == "error"){
				if(data.responseJSON.error.code == 1922){
					gamma.admin.utils.showErrors(inputboxWrapper,'inputbox_wraper', '', data.responseJSON.error.message);
					$('.selected_branch .error-msg').show();
				}
			}else {
				run_analysis_popup.closePopup();
				g.admin.analysis.analysis_queue.loadAnalysisQueue();

			}
		}
		var settings = { 'repoBranchOrTag': ($('.selected_branch').attr('data-actual')).trim(), 'snapshotLabel': ($('.selected_branch .selected_snapshot_input').val()).trim(), 'fastScan': fastScan, 'commitId': commitId, 'precheck': true };

        var customResponse = {
            success: {
                isCustom: true,
                message: i18next.t('admin.analysis_view.scan_page.started_successfully',{"repoName":branchDataArray.repoName})
            },
            error: {
                isCustom: false
            }
        };
		e.postData('POST', `/repositories/${branchTagData.repoUid}/scan`, subsystemAddedToQueue, settings, customResponse);
	}

	function createSearchData(data, stringValue) { // utility function that takes data array and search strinf and returns matched records
		var dataArray = [];
		for (var i = 0; i < data.length; i++) {
			if ((data[i].toLowerCase()).indexOf(stringValue.toLowerCase()) != -1){
				dataArray.push(data[i]);
			}
		}
		return dataArray;
	}

	function renderIcon(dataArray){
		if(dataArray.toLowerCase() == 'git') {
            return 'ic-github';
        }
		if (dataArray.toLowerCase() == 'remote') {
            return 'ic-website';
        }
		else {
            return 'ic-'+dataArray.toLowerCase();
        }
	}

	function dataUpdate(data,holder,type) {
		holder.html('');
		if (branchDataArray.branches.length == 0){
			holder.parent().find('.popup_button_wrapper .run_analysis_button_wrapper').addClass('disabled');
		}
		if(data.length > 0){
			holder.removeClass('hide');
			holder.parent().find('.no_record_msg').addClass('hide');
			var branch_ul = $('<ul/>',{class:'branch_ul'});
			for (var i = 0; i < data.length; i++) {
				var branch_list_item 	= $('<li/>',{class:'list_item_wrapper non_selected_list_item'});
				var branch_split_array = [];
				if (type == 'tags'){
					branch_split_array = data[i].split('refs/tags/');
				} else if (type == 'heads'){
					branch_split_array = data[i].split('refs/heads/');
				}

				branch_list_item.attr('data-value', branch_split_array[1]);
				branch_list_item.attr('data-actual', data[i]);
				var list_item = $('<a/>', { class: 'branch_list_item p color_medium' }).html(branch_split_array[1]);
				list_item.attr('data-value', (type === 'tags' ? (data[i].split('refs/tags/')[1]) : (data[i].split('refs/heads/')[1])));
				branch_list_item.append(list_item);
				branch_ul.append(branch_list_item);

				var default_branch_selection = '';
				if (branchDataArray.repoBranchOrTag.includes('tags')){
					default_branch_selection = (((branchDataArray.repoBranchOrTag.split('/')).length > 1) ? (branchDataArray.repoBranchOrTag.split('refs/tags/')[1]) : (data[0].split('refs/tags/')[1]));
				} else if (branchDataArray.repoBranchOrTag.includes('heads')){
					default_branch_selection = (((branchDataArray.repoBranchOrTag.split('/')).length > 1) ? (branchDataArray.repoBranchOrTag.split('refs/heads/')[1]) : (data[0].split('refs/heads/')[1]));
				}
				if (((branch_split_array[1]).toLowerCase() == default_branch_selection.toLowerCase()) && branchDataArray.repoBranchOrTag.split('/')[1] == type){
					branch_list_item.addClass('list_selection');
					branch_list_item.removeClass('non_selected_list_item');
					branch_list_item.addClass('selected_list_item');
				}

				if(i == 0){
					if (branchDataArray.repoBranchOrTag.split('/')[1] != type){
						branch_list_item.addClass('list_selection');
						branch_list_item.removeClass('non_selected_list_item');
						branch_list_item.addClass('selected_list_item');
					}

					if (!_.contains(branchDataArray.branches, branchDataArray.repoBranchOrTag) && analysis_type.toLowerCase() == 'branch'){
						branch_list_item.addClass('list_selection');
						branch_list_item.removeClass('non_selected_list_item');
						branch_list_item.addClass('selected_list_item');
					}

					if (!_.contains(branchDataArray.tags, branchDataArray.repoBranchOrTag) && analysis_type.toLowerCase() == 'tag') {
						branch_list_item.addClass('list_selection');
						branch_list_item.removeClass('non_selected_list_item');
						branch_list_item.addClass('selected_list_item');
					}
				}
			}
			holder.append(branch_ul);

			$('.list_item_wrapper').on('click', function(){
				$('.list_item_wrapper.list_selection').removeClass('list_selection');
				$('.list_item_wrapper').addClass('non_selected_list_item');
				$('.list_item_wrapper').removeClass('list_selection, selected_list_item');

				$(this).addClass('list_selection');
				$(this).removeClass('non_selected_list_item');
				$(this).addClass('selected_list_item');
				$('.selected_branch').attr('data-actual', $(this).attr('data-actual')).find('.selected_snapshot_input').val($(this).attr('data-value'));
			});
		}else{
			holder.addClass('hide');
			holder.parent().find('.no_record_msg').removeClass('hide');
		}
	}

	gamma.abortAnalysis = function(event,analysis_details) {
		event.stopPropagation();
		e.subscribe('CONFIRM_POPUP_CLOSE',gamma.admin.utils.onConfirmPopupClose);

		function onSubsystemRemovedFromQueue(data,status) {
			if(status == 'success')
	    	{
	    		/*gamma.pushHistory('admin_details','','',{'default_parameter':'analysis_queue','breadcrumb':'analysis_queue'},'management');
	    		gamma.admin.analysis.analysis_queue.loadAnalysisQueueList(true);*/
	    	}
	    	/* else if(status == 'error')
	    	{
	            gamma.sendErrorNotification(data, `/repositories/${analysis_details.subsystemId}/scans/${analysis_details.sessionId}/abort`, '');
	    	} */
		}
		var subsystem_name = ((analysis_details.projectName === undefined || analysis_details.projectName === null)?analysis_details.subsystem_name:analysis_details.projectName);

        var confirm_message= '';
        if(analysis_details.status != 'QUEUED') {
			confirm_message = i18next.t('common.run_analysis.confirm_message_abort',{'subsystem_name':subsystem_name});
		}
		else {
			confirm_message = i18next.t('common.run_analysis.confirm_message_cancel',{'subsystem_name':subsystem_name});
		}
		var confirm_alert = gamma.admin.utils.confirmPopup(confirm_message,'warning',true,false,false);
		 $('.no_button').on('click',function() {
			confirm_alert.closePopup();
		});

		$('.yes_button').on('click',function(){
			$(event.currentTarget).find('.btn-text').html('ABORTING');
			$(event.currentTarget).addClass('disabled');
            confirm_alert.closePopup();
            var customResponse = {
                success: {
                    isCustom: true,
                    message: null//i18next.t('admin.analysis_view.scan_page.aborted_successfully')
                },
                error: {
                    isCustom: false
                }
            };
            e.postData('POST', `/repositories/${analysis_details.subsystemId}/scans/${analysis_details.sessionId}/abort`, onSubsystemRemovedFromQueue, {}, customResponse);
        });
	},

	// get list of branches & tags before opening popup
	gamma.openRunAnalysisPopup = function (subsystem_uid) {
		e.loadJSON(`/repositories/${subsystem_uid}/scandetails`, createPopup, {'get_loc': true}, true);
	},

	// set subsystem uid to the run-analysis button for which analysis is running(used while aborting analysis & handling socket updates)
	gamma.setAnalysisSubsystemUid = function (subsystem_uid) {
		$('header .run_analysis').attr('data-subsystem_uid',subsystem_uid);
		if (g.checkRoleOnSubsystem(subsystem_uid,'RUN_SCAN'))
		{
			$("header .run_analysis[data-subsystem_uid=" + subsystem_uid + "]").show();
			e.unSubscribe('SOCKET_UPDATE');
			e.subscribe('SOCKET_UPDATE',updateAnalysisButtonState);
		}
		else
		{
			$("header .run_analysis[data-subsystem_uid=" + subsystem_uid + "]").hide();
		}
	},

	// Start blinking of button n change text from run->abort
	gamma.startAnalysisAnimation = function(analysis_details,target_btn) {
        if(!target_btn)
		{
			// it means analysis run in subsystem list
			if(historyManager.get('currentContext') == 'systems') {
                target_btn = $(".plugin_container .subsystem_list_container .run_analysis[data-subsystem_uid='" + analysis_details.subsystemId + "']");
            }
			else { //it means run analysis is called inside subsystem/module/component scope
                target_btn = $("header .run_analysis[data-subsystem_uid='" + analysis_details.subsystemId + "']");
            }
		}
		if(target_btn)
		{
			target_btn.data('analysis_details',analysis_details);
			/*if((analysis_details.percentage < 20 || analysis_details.status_message == 'UPDATING_SOURCES') && analysis_details.message != 'QUEUED')
				target_btn.addClass('disabled').attr('title', 'Abort will be enabled only after checkout is complete.');
			else
				target_btn.removeClass('disabled').removeAttr( "title" );*/
			if(blincking_object[analysis_details.subsystemId])
			{
				gamma.stopAnalysisAnimation(analysis_details.subsystemId, target_btn);
			}
			if (analysis_details.status == 'ABORTING')
			{
				target_btn.find('.btn-text').html('ABORTING');
				target_btn.addClass('disabled');
			}
			else {
				target_btn.find('.btn-text').html('Abort Scan');
			}
			blincking_object[analysis_details.subsystemId] = setInterval(function() {
				target_btn.find('.icon-container').toggleClass('analysis_button_icon_blinked');
			},500);
		}
	},

	// Stop blinking of button n change text from abort->run
	gamma.stopAnalysisAnimation = function (subsystemId,target_btn) {
		clearInterval(blincking_object[subsystemId]);
		delete blincking_object[subsystemId];
		if(target_btn)
		{
			target_btn.find('.btn-text').html('Scan');
			target_btn.find('.icon-container').removeClass('analysis_button_icon_blinked');
		}
		target_btn = $("header .run_analysis[data-subsystem_uid=" + subsystemId + "]");
		target_btn.find('.btn-text').html('Scan');
		target_btn.find('.icon-container').removeClass('analysis_button_icon_blinked');
	},

	// Clear all the intervals if analysis queue is empty
	gamma.clearAnimationIntervals = function() {
		$.each(blincking_object,d=>{
			gamma.stopAnalysisAnimation(d);
		});
	},

	gamma.setAnalysisState = function(analysis_details) {
		$('header .run_analysis').data('analysis_details',analysis_details);
	}
	return gamma;
}(g));
