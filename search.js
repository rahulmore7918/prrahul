
var g = (function(gamma) {

	//----------------- Private Variables ----------------
	var total_search_results,available_search_height,searchList;
	var $selected_item;
	//----------------- Private Methods ----------------
	var delay = (function() {
		var timer = 0;
	  return function(updateSearchResults,ms){
	    clearTimeout (timer);
	    timer = setTimeout(updateSearchResults,ms);
	  };
	})();

	function updateSearchResults(event) {
		if($('.search_wrapper input').val() !== '')
		{
			var selected_snap 		= historyManager.get('selectedSnapshots');
			e.loadJSON(gamma.paths.PATH_PROJECT_SEARCH + historyManager.get('currentSubSystemUid') + '/search',onSearchDataLoaded,{snapshotId:selected_snap[0].id,nodeId:'',searchString: $('.search_wrapper input').val()});
		}
		else {
            removeSearchResultsList();
        }

		function onSearchDataLoaded(data,status) {
			if(status == 'success')
			{
				searchList = data;
				total_search_results 	= searchList.length;
				available_search_height = $(window).height() - $('header').height() - 50;
				renderSearchResults(event);
				$('.search_loading').css('display', 'none');
			}
			else
			{
				e.log('error');
			}
		}
	}

	function renderSearchResults(event) {

		var keycode;
		var search_data;
		if(g.currentBrowser() === 'Firefox') {
            keycode = (event.charCode ? event.charCode : event.which);
        }
		else {
            keycode = (event.keyCode ? event.keyCode : event.which);
        }

		if (keycode == 38 || keycode == 40 || keycode == 13)
    	{
    		var $results = $('#search_results_list li');
    		var $current,$next;
    		if ($results.hasClass('fill_light'))
    		{
				$current = $results.filter('.fill_light');
    		}
            switch (keycode)
            {
                case 38: // Up
                    $next = $current.prev();
                    break;
                case 40: // Down
                    if (!$results.hasClass('fill_light')) {
                    	$results.first().addClass('fill_light');
                    	$current 	= $results.first();
                    	$next 		= $current;
                    }
                    else {
						   $next = $current.next();
						   
                    }
                    break;
                case 13: // Enter
                    if ($results.hasClass('fill_light'))
                    {
                    	$selected_item 		= $results.filter('.fill_light');
	                    var context 		= gamma.getClassification($selected_item.attr('data-type')).toLowerCase();
	                    historyManager.set('currentContext',context);
	                    gamma.setPluginHistory();
	                    historyManager.set('currentBreadcrumb',{"id":$selected_item.attr('data-id'),"name":search_data});
	                    e.notify(gamma.notifications.SEARCH_UPDATE);
						gamma.closeSearchBox(event);
						
					}
				default :return false; 
				
            }
	        //only check next element if up and down key pressed
	        if ($next.is('li'))
	        {
	            $current.removeClass('fill_light');
	            $next.addClass('fill_light');
	        }

	        //update text in searchbar
	        if ($results.hasClass('fill_light'))
	        {
	           	$selected_item 	= $results.filter('.fill_light');
	        	search_data = $selected_item.find('.component_text').text();
	            if(gamma.getClassification($selected_item.attr('data-type')) == 'MODULES' || gamma.getClassification($selected_item.attr('data-type')) == 'COMPONENTS')
	            {
		            $('.search_wrapper input').val(search_data);
				}
	        }
        }
	    else
	    {
			var targetWidth 	= $('.search_inner_wrapper').outerWidth() + 1;// + $('.search_click').outerWidth(true) - 10;
	    	var targetHeight 	= $('.search_wrapper').outerHeight();
			var pos 			= $('.search_inner_wrapper').offset();

			var ol = $('#search_results_list');
	    	var li;
	    	ol.html('');
	    	//search_current_count = (search_stepper.getValue() - 1) * records_per_page;
	    	for(var i=0 ; i < total_search_results ; i++)
	    	{
	    		li 					= $('<li/>',{class:'result_data ellipsis padding_5',title:gamma.changeSignature(searchList[i].sig)});
		    	var component_icon  = $('<div/>',{class:'component_icon float_left'});
				e.renderIcon(component_icon,gamma.getIcon(searchList[i].type));
				var component_text  = $('<div/>',{class:'component_text float_left ellipsis margin_left_5'}).html(searchList[i].name);
		    	li.attr("data-id",searchList[i].id);
		    	li.attr("data-type",searchList[i].type);
		    	li.append(component_icon,component_text);
		    	ol.append(li);
	    	}
	    	ol.width(targetWidth - 3);
	        ol.css('left',pos.left - 1);
	    	ol.css('top',pos.top+targetHeight);
	    	ol.css('margin-left',0);
	    	ol.css('max-height',available_search_height);

	    	var list_records = $("#search_results_list li").size();
	    	if(list_records === 0)
	    	{
	    		li = $('<li/>',{class:'result_data ellipsis padding_5 padding_left_20 padding_right_20'}).html('No records to display ! ');
	    		ol.append(li);
	    	}
	    	ol.slideDown(300);

			$('#search_results_list .result_data').mouseover(function() {
				if(list_records !== 0)
				{
					if(gamma.available_plugin_contexts.indexOf(gamma.getClassification($(this).attr('data-type')).toLowerCase()) > -1) {
                          $(this).addClass('fill_light hand_cursor');
                    }
				}
			});
			$('#search_results_list .result_data').mouseleave(function() {
				if(list_records !== 0)
				{
					if(gamma.available_plugin_contexts.indexOf(gamma.getClassification($(this).attr('data-type')).toLowerCase()) > -1) {
                        $(this).removeClass('fill_light hand_cursor');
                    }
				}
			});
			$('#search_results_list .result_data').on('click',function(event) {
				if(list_records !== 0)
				{
					if(gamma.available_plugin_contexts.indexOf(gamma.getClassification($(this).attr('data-type')).toLowerCase()) > -1)
					{
						search_data = $(this).find('.component_text').text();
						$('.search_wrapper input').val(search_data);
						gamma.closeSearchBox(event);
						var context 	= gamma.getClassification($(this).attr('data-type')).toLowerCase();
						historyManager.set('currentContext',context);
						gamma.setPluginHistory();
						historyManager.set('currentBreadcrumb',{"id":$(this).attr('data-id'),"name":search_data});
						e.notify(gamma.notifications.SEARCH_UPDATE);
					}
				}
			});
	    }
	}

	function removeSearchResultsList() {
		if($('#search_results_list').length > 0)
		{
			$('#search_results_list').slideUp(300,function() {
				$('.search_wrapper input').val('');
			});
		}
		else {
            $('.search_wrapper input').val('');
        }
	}

	//---------------- Public methods -----------------
	gamma.openSearchBox = function(event) {
		//$('.search_click').addClass('hide');
		$('.search_wrapper').css("border-left-width","1px");
		if($('.right_menu_list').length > 0) {
            gamma.closeRightMenu(event);
        }

		$(event.currentTarget).addClass('search_border');
		var width_options = {'action':'open'};
		$('.search_inner_wrapper').show();
		e.notify(g.notifications.RESIZE_BREADCRUMB,width_options);
		$('.search_wrapper').animate({width: '260px'},function() {
			$('.search_box').focus();
			$('.search_click').css("pointer-events","auto");
		});
		if($('#search_results_list').length > 0) {
            $('#search_results_list').remove();
        }
		var ol = $('<ol/>',{id:'search_results_list',class:'p color_medium padding_1 unselectable padding_top_10 padding_bottom_10 hide'});
		$('body').append(ol);
	};
	gamma.closeSearchBox = function(event) {
		event.stopPropagation();
		$('.search_wrapper').css("border-left-width","0px");
		if($('.search_wrapper').width() > 0)
		{
			removeSearchResultsList();
			$('.search_click').removeClass('search_border');
			$('.search_wrapper').animate({width: '0px'},function() {
				var width_options = {'action':'close'};
				$('.search_inner_wrapper').hide();
				e.notify(g.notifications.RESIZE_BREADCRUMB,width_options);
				$('.search_click').css("pointer-events","auto");
			});
		}
	};
	gamma.handleSearchEvents = function() {
		$(document).on('click',function(event) {
			if($(".search_inner_wrapper").css("display") == "block") {
                gamma.closeSearchBox(event);
            }
		});
		$(".search_inner_wrapper input.search_box").on("click", function(event){
			e.removeComboBox();
            event.stopPropagation();
        });

		$('.search_click').on('click',function(event) {
			e.removeComboBox();
			$("ul.subnav").slideUp('fast');
			$(".BCarrowico").children().children().attr({'transform':'rotate(0, 6, 6)'});
			event.stopPropagation();
			$('.search_click').css("pointer-events","none");
			if($('.search_wrapper').width() > 0) {
                gamma.closeSearchBox(event);
            }
			else {
                gamma.openSearchBox(event);
            }
		});

		/*$('.search_click').on('click',function(event) {
			event.stopPropagation();
			gamma.closeSearchBox(event);
		});*/

		$('.input_clear_icon').on('click',function() {
			// event.stopPropagation();
			removeSearchResultsList();
		});

		$('.search_inner_wrapper input').on('focus',function(event) {
			event.stopPropagation();
		});

		$('.search_inner_wrapper input').on('keyup',function(event) {
			event.stopPropagation();
			if($(this).val() !== ''){
				$('.close_icon').removeClass('hide');
				$('.search_loading').css('display', 'flex');
			}
			else{
				$('.close_icon').addClass('hide');
				$('.search_loading').css('display', 'none');
			}
			var keycode;
			if(g.currentBrowser() === 'Firefox') {
                keycode = event.charCode;
            }
			else {
                keycode = event.keyCode;
            }

			if (keycode == 38 || keycode == 40 || keycode == 13) {
                renderSearchResults(event);
            }
			else
			{
				delay(function(){
			     	updateSearchResults(event);
			    },1000);
			}
		});
	}
	return gamma;
}(g));
