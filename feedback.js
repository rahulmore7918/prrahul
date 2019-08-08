 

function loadFeedback() {
	$('#slide_panel .content').html('');
	var feedback_title 		= $('<div/>',{class:'feedback_title float_left ellipsis float_left text_16 text_color_1 margin_top_25'});
	feedback_title.html('Please type and submit your feedback below.');
	
	var feedback_wrapper 	= $('<div/>',{class:'feedback_wrapper float_left padding_top_10 padding_bottom_10 margin_top_25 margin_bottom_15 hand_cursor'});
	var feedback_label 		= $('<div/>',{class:'feedback_label float_left text_18 margin_top_5 ellipsis language_text'}).html(g.print('feature'));
	feedback_label.attr('data-language_id','feature');
	var feedback_dropdown 	= $('<div/>',{class:'feedback_dropdown float_left fill_9 margin_left_10 padding_5 fill_9'});
	var feedback_text 		= $('<div/>',{class:'feedback_text ellipsis text_allign_left text_transform_capitalize float_left text_32 text_color_1'}).html('General');
	feedback_text.attr('data-id','general');
	var feedback_arrow 		= $('<div/>',{class:'feedback_arrow float_right margin_top_3'});
	e.renderIcon(feedback_arrow,'triangle');
	feedback_arrow.children().children().attr({'transform':'rotate(90, 16, 16)'});	
	feedback_dropdown.append(feedback_text,feedback_arrow);
	feedback_wrapper.append(feedback_label,feedback_dropdown);

	var feedback_textarea 		= $('<textarea/>',{class:'feedback_textarea float_left text_32 text_color_1 margin_top_25','placeholder':'Type feedback here...'});

	var sending_text  			= $('<div/>',{class:'sending_text text_transform_capitalize float_left text_32 text_color_1 margin_left_20 margin_top_35'}).html('Sending...');
	var feedback_submit_button  = $('<div/>',{class:'feedback_submit_button button_small transition_bcolor margin_top_25 margin_bottom_5 float_right margin_right_20'}).html('Submit');

	$('#slide_panel .content').append(feedback_title,feedback_wrapper,feedback_textarea,sending_text,feedback_submit_button);
	sending_text.hide();
	feedback_textarea.focus();
	e.notify(g.notifications.RENDERING_COMPLETE);

	$('.feedback_dropdown').on('click',function(event){
		event.stopPropagation();
		if($('.feedback_plugin_list').length === 0 || $('.feedback_plugin_list').hasClass('hide'))
		{
			createFeedbackList($(this));
			toggleFeedbackList();
		}
		else
		{
			toggleFeedbackList();
		}
	});

	$(document).on('click',function(){
		if($('.feedback_plugin_list').length > 0)
		{
			$('.feedback_plugin_list').slideUp(animation_speed,function(){
				$(this).remove();
				$('.feedback_dropdown').find('.snapshot_arrow').children().children().attr({'transform':'rotate(90,16,16)'});
			});
		}
	});

	feedback_submit_button.on('click',function(event){
		event.stopPropagation();
		if($('.feedback_textarea').val() == '')
		{
			$('.feedback_textarea').focus();
			$('.sending_text').show().html('Please enter feedback.');
		}
		else
		{
			$('.sending_text').show().html('Sending...');
			setTimeout(function(){
				e.loadJSON(DOMAIN_NAME + '/gamma/api/feedback/submitfeedback',onFeedbackSubmit,{'selected_feature':$('.feedback_dropdown .feedback_text').text(),'feedback_data':$('.feedback_textarea').val()});
			},10);
		}
	});
}

function onFeedbackSubmit(data,status) {
	if(status == 'success')
	{
		showSuccessMessage();
	}
	else if(status == 'error')
	{
		showErrorMessage(data);
	}
}

function showErrorMessage(data) {
	$('#slide_panel .content').html('');
	var feedback_title 		= $('<div/>',{class:'feedback_title float_left ellipsis float_left text_16 text_color_5 margin_top_25'});
	feedback_title.html(data.responseJSON.message);
	var feedback_submit_button  = $('<div/>',{class:'feedback_submit_button button_small transition_bcolor margin_top_25 margin_bottom_5 margin_left_20'}).html('Resubmit');
	$('#slide_panel .content').append(feedback_title,feedback_submit_button);
	feedback_submit_button.on('click',function(){
		feedback_title.removeClass('text_16 text_color_5').addClass('text_32 text_color_1').html('Sending...');
		e.loadJSON(DOMAIN_NAME + '/gamma/api/feedback/submitfeedback',onFeedbackSubmit,{'selected_feature':data.responseJSON.feature_name,'feedback_data':data.responseJSON.feedback_data});
	});
}

function showSuccessMessage() {
	$('#slide_panel .content').html('');
	var feedback_title 		= $('<div/>',{class:'feedback_title float_left ellipsis float_left text_16 text_color_6 margin_top_25'});
	feedback_title.html('Feedback submitted successfully.');
	var feedback_submit_button  = $('<div/>',{class:'feedback_submit_button button_small transition_bcolor margin_top_25 margin_bottom_5 margin_left_20'}).html('Submit another feedback');
	$('#slide_panel .content').append(feedback_title,feedback_submit_button);
	feedback_submit_button.on('click',function(){
		loadFeedback();
	});
}

function createFeedbackList(target) {
	var ol = $('<div/>',{class:'feedback_plugin_list unselectable hide fill_9'}); 
	$('body').append(ol);
	var li 		= $('<li/>',{class:'list_data float_left padding_5 fill_9'});
	var text 	= $('<div/>',{class:'text float_left ellipsis text_32 text_color_1 language_text'}).html('General');
	li.attr('data-id','general');
	li.append(text);
	ol.append(li);	
	for(var i = 0 ; i < plugins.length ; i++)
	{
		li 		= $('<li/>',{class:'list_data float_left padding_5 fill_9'});
		text 	= $('<div/>',{class:'text float_left ellipsis text_32 text_color_1 language_text'}).html(plugins[i].name);
		li.attr("data-id",plugins[i].id);
		li.append(text);
		ol.append(li);	
	}			
	
	$('.feedback_plugin_list .list_data').hover(function() {
		$(this).addClass('hand_cursor');			
		$(this).toggleClass('fill_2 text_color_4');
	});

	$('.feedback_plugin_list .list_data').on('click',function(event) {
		event.stopPropagation();
		var current_dropdown = $('.feedback_dropdown');
		current_dropdown.attr('data-id',$(this).attr('data-id'));
		var temp = current_dropdown.find('.feedback_text');
		temp.text($(this).text());
		temp.attr('data-id',$(this).attr('data-id'));
		$('.feedback_plugin_list').slideUp(animation_speed,function(){
			$('.feedback_plugin_list').remove();
			current_dropdown.find('.snapshot_arrow').children().children().attr({'transform':'rotate(90,16,16)'});
		});
	});
}

function toggleFeedbackList() {
	var current_dropdown 		= $('.feedback_dropdown');
	var targetWidth      		= current_dropdown.outerWidth();
	var targetHeight     		= current_dropdown.outerHeight();
	var pos              		= current_dropdown.offset(); 
	var feedback_plugin_list 	= $('.feedback_plugin_list');
	feedback_plugin_list.width(targetWidth);
	var available_height = $('#slide_panel .content').height() - (70+$('.feedback_title').outerHeight()+$('.feedback_wrapper').outerHeight());
	feedback_plugin_list.height(available_height);
	feedback_plugin_list.css('left',pos.left);   
	feedback_plugin_list.css('top',pos.top + targetHeight);
	feedback_plugin_list.css('z-index',e.prototype.nextHighestDepth); 
	if(feedback_plugin_list.hasClass('hide'))
	{
		current_dropdown.find('.snapshot_arrow').children().children().attr({'transform':'rotate(270,14,14)'});
		feedback_plugin_list.slideDown(animation_speed,function(){
			feedback_plugin_list.removeClass('hide');
		});
	}
	else
	{
		feedback_plugin_list.slideUp(animation_speed,function(){
			$('.feedback_plugin_list').remove();
			current_dropdown.find('.snapshot_arrow').children().children().attr({'transform':'rotate(90,16,16)'});
		});
	}
}