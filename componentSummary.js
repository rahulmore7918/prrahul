
var g = (function(gamma) {
	 
	var componentSummary_holder;
	var PATH_COMPONENTSUMMARY   = '/gamma/api/projects/getcomponentsummary';
	var PATH_TREND 				= '/gamma/api/projects/getcomponentgraphdetails';
	var amcharts_dependencies 	= ['js/external/amcharts/amcharts.min.js','js/external/amcharts/serial.min.js'];
	var trendList,current_type='overallRating';
	var max_snapshotid1 = 0,componentSummary,i,len,hasError=false;
	function getComponentSummaryData() {
		if(historyManager.get('selectedSnapshots').length !== 0 )
        {
           
            max_snapshotid1 = historyManager.get('selectedSnapshots')[0].id;
            e.loadJSON(gamma.DOMAIN_NAME + PATH_COMPONENTSUMMARY,componentRenderer,{project_id:historyManager.get('currentSubSystem'),component_id:historyManager.get('currentBreadcrumb').id,snapshot_id:max_snapshotid1});
        }
	}

	function componentRenderer(data,status) {
		if(status == 'success')
		{
			componentSummary = data;
			if(componentSummary.hasOwnProperty("message"))
			{
				data.holder = componentSummary_holder;
				data.requestURL = gamma.DOMAIN_NAME + PATH_COMPONENTSUMMARY;
				gamma.sendErrorNotification(data,PATH_COMPONENTSUMMARY,componentSummary_holder);
			}
			else
			{
				renderComponentSummaryData();	
			}
		}
		else if(status == 'error')
		{
			data.holder = componentSummary_holder;
			data.requestURL = gamma.DOMAIN_NAME + PATH_COMPONENTSUMMARY;
			gamma.sendErrorNotification(data,PATH_COMPONENTSUMMARY,componentSummary_holder);
		}
	}

	/*
 *  Render Component Summary node 
 *
 * */
 function renderComponentSummaryData() {

 	var nodeNameTextMaxLenth =30;
	var nodeNameText		= componentSummary.component_name;
	if(nodeNameText.length > nodeNameTextMaxLenth){
		var nodeNameTextTemp="...";
		nodeNameTextTemp += nodeNameText.substring((nodeNameText.length-nodeNameTextMaxLenth), nodeNameText.length);
		nodeNameText =nodeNameTextTemp;
	}
 	componentSummary_holder.html('');
 	var plugin_container 	= $('<div/>',{class:'plugin_container plugin_nodeSummary float_left'});
 	componentSummary_holder.append(plugin_container);
 	var component_summary 	= $('<div/>',{class:'component_summary stroke_light stroke_all'});
	plugin_container.append(component_summary);
 	//componentSummary_holder.append(component_summary);

 	var data_wrapper;
 	var rowComponentDetails     = $('<div/>',{class:'row_85 float_left stroke_bottom fill_light stroke_medium rowComponentDetails'});
 	data_wrapper            	= $('<div/>',{class:'data_wrapper float_left'});
 	var column_70               = $('<div/>',{class:'column_70 padding float_left'});
 	var component_title         = $('<div/>',{class:'graph_row float_left'});
 	var component_name          = $('<div/>',{class:'component_name semibold float_left h4 margin_top_2','title':componentSummary.component_name}).html(nodeNameText);

 	component_title.append(component_name);

 	column_70.append(component_title);
 	var column_30           = $('<div/>',{class:'column_30 float_left'});
 	var component_rating   	=  $('<div/>',{class:'note semibold health float_right range_change color_base margin_right_10'}).html(g.formatRating(getRatingValue('overallRating').rating));
	component_rating.css('background-color',e.gradient.getColor('gradient_rating',getRatingValue('overallRating').rating/10))
	component_rating.attr('data-rating_value',getRatingValue('overallRating').rating);
 	column_30.append(component_rating);
 	data_wrapper.append(column_70);
 	rowComponentDetails.append(data_wrapper);

 	component_summary.append(rowComponentDetails);
 	data_wrapper.append(column_30);

 	var rowRatings          = $('<div/>',{class:'row_90 float_left rowDetails stroke_bottom stroke_medium ellipsis'});
 	var temp_count = 0;
 	for(i=0;i<componentSummary['rating'].length;i++) {
 		if(componentSummary['rating'][i].name != 'overallRating')
 		{
 			var column_class = 'column_50 float_left padding_top_10 padding_bottom_10 h4';
			if(temp_count === 0)
			{
				column_class = column_class + ' stroke_bottom stroke_right stroke_light';
			}
		    else if(temp_count == 1)
			{
				column_class = column_class + ' stroke_bottom stroke_light';
			}	
			else if(temp_count == 2)
			{
				column_class = column_class + ' stroke_right stroke_light';
			}

 			var other_rating    = $('<div/>',{class:column_class});
 			var rating_title    = $('<div/>',{class:'rating_title float_left padding_left_15 padding_right_15'});
 			var rating_icon     = $('<div/>',{class:'rating_icon float_left'});
 			var icon_name       = componentSummary['rating'][i].name;
			 if(icon_name == 'cloneRating')
			 {
				icon_name = icon_name+'1';
			 }	
 			e.renderIcon(rating_icon,icon_name);
 			var rating_name     = $('<div/>',{class:'rating_name padding_left_5 text_transform_capitalize text_allign_center ellipsis',title:g.print(componentSummary['rating'][i].name)}).html(g.print(componentSummary['rating'][i].name));
 			rating_name.attr('data-language_id',componentSummary['rating'][i].name);
 			rating_title.append(rating_icon,rating_name);
 			var rating_health    = $('<div/>',{class:'note semibold rating_health range_change margin_auto margin_top_30'}).html(g.formatRating(componentSummary['rating'][i].rating));
 			rating_health.css('border-color',e.gradient.getColor('gradient_rating',componentSummary['rating'][i].rating/10))
 			rating_health.attr('data-value',componentSummary['rating'][i].rating);
 			rating_health.attr('data-rating_value',componentSummary['rating'][i].rating);
 			other_rating.append(rating_title,rating_health);
 			rowRatings.append(other_rating);
 			temp_count++;
 		}
 	}
 	component_summary.append(rowRatings);

 	if(componentSummary['antipatterns'].length > 0)
 	{
	 	var rowDesignIssues     	= $('<div/>',{class:'rowDesignIssues float_left stroke_bottom stroke_medium fill_light'});
	 	data_wrapper                = $('<div/>',{class:'data_wrapper float_left'});
	 	var designissue_title       = $('<div/>',{class:'metrics_row h4 semibold float_left text_transform language_text'}).html(g.print('designIssues'));
	 	designissue_title.attr('data-language_id','designIssues');
	 	var designissue_content     = $('<div/>',{class:'metrics_row float_left'});
	 	data_wrapper.append(designissue_title,designissue_content);
	 	rowDesignIssues.append(data_wrapper);
	 	var i;

	 	for(i = 0 ,len = componentSummary['antipatterns'].length ; i < len ; i++)
	 	{
	 		if(componentSummary['antipatterns'][i].name !== null)
	 		{
	 			var anti_pattern        = $('<div/>',{title:g.print(componentSummary['antipatterns'][i].name)+' : \n'+g.formatSynopsys(componentSummary['antipatterns'][i].synopsis),class:'anti_pattern float_left padding_3 text_allign_center margin_right_3 margin_top_8'});
	 			var triangle_left       = $('<div/>',{class:'triangle_left float_left'});
	 			var square_middle       = $('<div/>',{class:'square_middle float_left note semibold text_allign_center color_base'}).html(componentSummary['antipatterns'][i].name);
	 			var triangle_right      = $('<div/>',{class:'triangle_right float_left'});
	 			anti_pattern.append(triangle_left,square_middle,triangle_right);
	 			designissue_content.append(anti_pattern);
	 		}
	 	}
	 	component_summary.append(rowDesignIssues);
	 }
 	

 	var rowComponentMetrics     = $('<div/>',{class:'rowComponentMetrics float_left stroke_bottom stroke_medium fill_light'});
 	data_wrapper                = $('<div/>',{class:'data_wrapper float_left padding_bottom_20'});
 	var metrics_title           = $('<div/>',{class:'metrics_row float_left margin_10'});
 	var metrics_text            = $('<div/>',{class:'text float_left h4 semibold padding_top_3 text_transform language_text margin_top_negative_5'}).html(g.print('metrics'));
 	metrics_text.attr('data-language_id','metrics');
 	metrics_title.append(metrics_text);
 	rowComponentMetrics.append(metrics_title);
 	var row_count = 0;
 	for(i = 0 ,len = componentSummary['metrics'].length ; i < len ; i++)
 	{
 		if((componentSummary['metrics'][i].type !== null) && (componentSummary['metrics'][i].value !== null))
 		{
 			row_count++;
 			var metrics_row         = $('<div/>',{class:'metrics_row float_left margin_left_10 margin_right_10 stroke_bottom stroke_light'});
 			var text                = $('<div/>',{class:'text float_left p text_transform language_text',title:g.print('title.'+componentSummary['metrics'][i].type)}).html(g.print(componentSummary['metrics'][i].type));
 			text.attr('data-language_id',componentSummary['metrics'][i].type);
 			var temp_value          = ((componentSummary['metrics'][i].value)%1 === 0)?parseInt(componentSummary['metrics'][i].value):e.math.round(componentSummary['metrics'][i].value);
 			var value_class = 'color_highlight';
 			var threshold = '';
 			if(componentSummary['metrics'][i].type != 'CR')
 			{
 				threshold = componentSummary['metrics'][i].threshold;
				 if(temp_value < componentSummary['metrics'][i].threshold)
				 {
					value_class = 'color_good';
				 }	
				 else if(temp_value > componentSummary['metrics'][i].threshold)
				 {
					value_class = 'color_bad';
				 }	
 			}
 			else
 			{
 				threshold = e.math.round(componentSummary['metrics'][i].threshold/100);
				 if(temp_value < (componentSummary['metrics'][i].threshold/100))
				 {
					value_class = 'color_bad';
				 }	
				 else if(temp_value > (componentSummary['metrics'][i].threshold/100))
				 {
					value_class = 'color_good';
				 }
 			}   
 			var value               = $('<div/>',{class:'value float_right p '+value_class,title:'Threshold : '+threshold}).html(temp_value);
 			metrics_row.append(text,value);
 			data_wrapper.append(metrics_row);      
 		}
 	}
 	rowComponentMetrics.append(data_wrapper);
	 if(row_count > 0)
	 {
		component_summary.append(rowComponentMetrics);
	 }
 	rowComponentMetrics=null;data_wrapper=null;metrics_title=null;metrics_text=null;row_count=null;

 	var rowComponentDuplication         = $('<div/>',{class:'rowComponentDuplication float_left stroke_bottom stroke_medium'});
 	data_wrapper                        = $('<div/>',{class:'data_wrapper float_left'});
	var exec_loc = getLoc('LOC');
 	if(exec_loc !== '')
 	{
 		var duplication_text_container      = $('<div/>',{class:'metrics_row ellipsis h4 semibold text_transform language_text'}).html(g.print("codeDuplication"));
 		duplication_text_container.attr('data-language_id',"codeDuplication" );
		var percentage_value
		if (parseInt(exec_loc.value) === 0)
		{
			percentage_value = 0;
		}
		else
		{
			percentage_value  = e.math.round((componentSummary['duplication']['duplicate_loc']/parseInt(exec_loc.value))*100);
		}
		if (percentage_value > 100)
		{
			percentage_value = 100;
		}
 		var duplication_graph_container     = $('<div/>',{class:'column_50 padding float_left'});
 		var duplication_graph 			 	= $('<div/>',{class:'duplication_graph'});
		duplication_graph_container.append(duplication_graph);

		var duplication_details_container     = $('<div/>',{class:'column_50 padding float_left'});
		var duplicate_count = 0;
 		var margin_top = 'margin_top_5'; 
		$.each(componentSummary['duplication'],function(key,value)
	 	{
			 if((value === null) || (value === ''))
			 {
				value = 0;
			 }
			 if(duplicate_count == 0)
			 {
				margin_top = 'margin_top_8'; 
			 }
	 		var duplication_wrapper                 = $('<div/>',{class:'duplication_wrapper margin_left_10 margin_bottom_5 margin_right_10 float_left '+margin_top});
	 		var duplication_text        = $('<div/>',{class:'text float_left p text_transform language_text'}).html(g.print(key));
	 		duplication_text.attr('data-language_id',key);
	 		var colon                   = $('<div/>',{class:'colon float_left p margin_left_5 margin_right_5'}).html(':');
				var duplication_value = $('<div/>', { class: 'duplication float_left p color_base text_allign_center padding_3 text_transform fill_medium' }).html(e.format.numberFormat(value));
	 		duplication_wrapper.append(duplication_text,colon,duplication_value);
	 		duplication_details_container.append(duplication_wrapper);
	 		duplicate_count++;
	 	});
 		data_wrapper.append(duplication_text_container,duplication_graph_container,duplication_details_container);
 		rowComponentDuplication.append(data_wrapper);
		 component_summary.append(rowComponentDuplication);
		 var duplication_graph_ring = new e.ringgraph({bgring_thickness:10,value_thickness:10,holder:duplication_graph,value:percentage_value,showText:true,value_radius:35,text_size:22,rating_range:'range_1',fill_color:'none',value_colour:'#8f9a9e',bgring_colour:'#d5dadd',font_size:'12px',font_weight:'bold',circumference:percentage_value});

 	}

 	if((componentSummary['issues_count'] !== '') && (componentSummary['issues_count'] !== null))
 	{
 		var rowIssueDetails         = $('<div/>',{class:'row_85 float_left margin_bottom_10 rowIssueCount'});
 		data_wrapper                = $('<div/>',{class:'data_wrapper float_left'});
 		var component_issue_count   = $('<div/>',{class:'row_30 float_left margin_top_30 margin_left_10 fill_6 hand_cursor'});
 		var component_issue_value   = $('<div/>',{class:'value p margin_left_10 float_left'}).html(componentSummary['issues_count']);
 		var component_issue_text    = $('<div/>',{class:'text margin_left_5 float_left language_text'}).html(g.print('issues'));
 		component_issue_text.attr('data-language_id','issues');
 		var component_issue_arrow   = $('<div/>',{class:'component_issue_arrow float_right margin_right_10'});
 		e.renderIcon(component_issue_arrow,'previous');
 		component_issue_arrow.children().children().attr({'transform':'translate(33,32) rotate(180,0,0)'});
 		component_issue_count.append(component_issue_value,component_issue_text,component_issue_arrow);
 		data_wrapper.append(component_issue_count);
 		rowIssueDetails.append(data_wrapper);
 		component_summary.append(rowIssueDetails);
 	}    

 	componentSummary_holder.css("overflow","auto");
 }

 function getRatingValue(rating_name) {
 	var obj = {};
 	for(let i = 0 , len = componentSummary.rating.length ; i < len ; i++)
 	{
 		if(componentSummary.rating[i].name == rating_name)
 		{
 			obj = componentSummary.rating[i];
 			break;
 		}
 	}
 	return obj;
 }

 function getLoc(loc_type) {
 	var obj = '';
 	for(let i = 0 , len = componentSummary.metrics.length ; i < len ; i++)
 	{
		if (componentSummary.metrics[i].type == loc_type)
 		{
 			obj = componentSummary.metrics[i];
 			break;
 		}
 	}
 	return obj;
 }
 

 function getTrendData(parameter_type,parameter_id) {
 	e.loadJSON(gamma.DOMAIN_NAME + PATH_TREND,trendRenderer,{project_id:historyManager.get('currentSubSystem'),component_id:historyManager.get('currentBreadcrumb').id,parameter_type:parameter_type,parameter_id:parameter_id});
 }

 function trendRenderer(data,status) {
 	if(status == 'success') {
 		trendList = data;
 		if(trendList.hasOwnProperty("message"))
 		{
 			hasError = true;
 			g.sendErrorNotification(data,PATH_TREND,'');
 		}
 		else
 		{
 			hasError = false;
 			e.activateModule('amchart',onAmchartLoaded);
 		}
 	}
 	else if(status == 'error') {
 		hasError = true;
 		g.sendErrorNotification(data,PATH_TREND,'');
 	}
 }

 function onAmchartLoaded() {
 	e.activateModule('amchartSerial',onAmchartSerialLoaded);
 }

 function onAmchartSerialLoaded() {
 	e.enablePlugin('popup',popupPluginEnabled);   
 }

 function popupPluginEnabled() {
 	e.enablePlugin('dropDown',dropDownPluginEnabled);
 }

 function  dropDownPluginEnabled() {
	 if($('.trend_dropdown_container').length === 0)
	 {
		renderTrendData();
	 }
 	renderTrendGraph();
 }

 function renderTrendData() {
 	function popupClosed() {
		trend_popup.closePopup();
 		trend_popup.clearMemory();
 		trend_popup = null;
 		e.unSubscribe('COMPONENT_POPUP_CLOSE');
 		e.unSubscribe('DROPDOWN_CLICK');
 		/*----------- REMOVING AMCHARTS DEPENDENCIES -------------*/
 		e.deActivateModule(amcharts_dependencies);
 		e.disablePlugin(['dropDown','popup']);
 	}
 	e.subscribe('COMPONENT_POPUP_CLOSE',popupClosed);
 	e.subscribe('DROPDOWN_CLICK',onDropdownItemClick);
 	var trend_popup     	= new e.popup({width:650,height:400,default_state:1,style:{popup_content:{padding:28}},notify:{onPopupClose:'COMPONENT_POPUP_CLOSE'}});
 	var popup_title_data 	= $('<div/>',{class:'popup_title_data float_left'});
 	var list_array = [];
 	var parameterOptionList = gamma.getParameterList();
 	for(i = 0 ,len = parameterOptionList.ratings.length ; i < len ; i++)
 	{
 		list_array.push(parameterOptionList.ratings[i].name);  
 	} 
 	for(i = 0 ,len = parameterOptionList.metrics.length ; i < len ; i++)
 	{
 		if(metricExists(parameterOptionList.metrics[i].name))
 		{
 			list_array.push(parameterOptionList.metrics[i].name); 
 		}
 	} 
	var dropdown_container  = $('<div/>',{class:'trend_dropdown_container unselectable'}).html('');
	var trend_dropdown   = new e.dropDown({'holder':dropdown_container,'default_selection':current_type,'dropDownTitle':'ratings','dropDownLabel':'trend','dropDownData':list_array,'multipleDropdown':false,'notify':{onDropdownItemClick:'DROPDOWN_CLICK'}});
 	var trend_graph_container = $('<div/>',{id:'trend_graph',class:'trend_graph_container float_left'}).html('');
 	trend_graph_container.width(594+'px');
 	trend_graph_container.height(264+'px');
 	popup_title_data.append(dropdown_container);
 	trend_popup.addTitle(popup_title_data);
 	trend_popup.addContent(trend_graph_container);
	trend_popup.openPopup();

 	//trend_dropdown.handleEvents();
 }

 function renderTrendGraph() {
 	var data = [];
 	var lineColor;
 	var trend_date;
 	current_type = $('.trend_dropdown_container .dropdown').attr('data-type');
 	var current_selection;
	 if(gamma.getParameterObjectByName(current_type,'ratings').id === undefined)
	 {
		current_selection = 'metrics';
	 }
	 else
	 {
		current_selection = 'ratings';
	 }
 	var rating_val;
 	for(i = 0 ,len = (trendList.snapshotList).length; i < len ; i++)
 	{
 		if(!$.isEmptyObject(trendList.snapshotList[i].parameter))
 		{
 			if(current_selection == 'ratings')
 			{
 				lineColor 	= e.gradient.getColor('gradient_rating',trendList.snapshotList[i].parameter.value/10);
 				rating_val 	= g.formatRating(trendList.snapshotList[i].parameter.value);
 			}
 			else
 			{
 				lineColor  = '#29bdef';
 				rating_val = trendList.snapshotList[i].parameter.value;
 			}
 			trend_date= trendList.snapshotList[i].ts;
 			var ms = moment(trend_date);
			trend_date = ms.format("DD-MM-YYYY HH:mm");
			trend_date =AmCharts.stringToDate(trend_date, "DD-MM-YYYY HH:NN");
 			data.push({
 				"date"  : trend_date,
 				"value" : rating_val,
 				"lineColor":lineColor
 			});
 		}
 	}
 	var component_trend = data;
 	createChart(component_trend);
 }

 function createChart(component_trend) {
 	var bullet = 'none';
	 if((trendList.snapshotList).length == 1)
	 {
		bullet = 'round';
	 }	

 	$('.popup_container').find('#trend_graph').html('');
 	var chart = AmCharts.makeChart("trend_graph", {
 		"type": "serial",
 		"theme": "none",
 		"autoDisplay":true,
 		"autoMargins":true,
 		"pathToImages": "images/amchart/",
	        //"dataDateFormat": "YYYY-MM-DD,JJ:SS",
	        "valueAxes": [{
	        	"id":"v1",
	        	"axisAlpha": 1,
	        	"axisColor"  : '#dbdada',
	        	"position": "left",
	        }],
	        "graphs": [{
	        	"id": "g1",
				"bullet"      : bullet,
				"bulletAlpha"  : 1,
				"bulletSize"   : 1,
				"valueField"   : "value",
				"lineColorField": "lineColor",
				"lineThickness":2,
				"dashLength": 1,
				"useLineColorForBulletBorder":true
			}],
			"chartScrollbar": {
				"graph": "g1",
				"scrollbarHeight": 30
			},
			"chartCursor": {
	            //"cursorPosition": "mouse",
	            "cursorAlpha":1,
	            "pan": true,
	            "valueLineEnabled":false,
	            "valueLineBalloonEnabled":false,
	            "cursorColor":"#8b8b8b",
	            "categoryBalloonDateFormat":'DD-MMM-YYYY , JJ:NN:SS'
	        },
	        "categoryField": "date",
	        "fontFamily"     : "ubuntu_regular",
	        "fontSize"        : 12,
	        "categoryAxis": {
	        	"parseDates": true,
	            //"equalSpacing":true,
	            "autoWrap":true,
	            "dashLength": 1,
	            "minorGridEnabled": true,
	            "position": "bottom",
	            "minPeriod":"ss",
	            "axisAlpha"	 : 1,
	            "axisColor"  : '#dbdada',
	            //"dateFormats":[{"period":'fff',"format":'JJ:NN:SS'},{"period":'ss',"format":'JJ:NN:SS'},{"period":'mm',"format":'JJ:NN'},{"period":'hh',"format":'JJ:NN'},{"period":'DD',"format":'DD-MMM-YYYY'},{"period":'WW',"format":'DD-MMM-YYYY'},{"period":'MM',"format":'DD-MMM-YYYY'},{"period":'YYYY',"format":'DD-MMM-YYYY'}]
	        },
	        "dataProvider": component_trend
	    });

		setTimeout(function() {
			chart.write("trend_graph");
			chart.invalidateSize();

			chart.addListener("rendered", zoomChart);
			zoomChart();
			function zoomChart(){
				chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
			}
		},50);
		
	}

	function onDropdownItemClick(selected_item) {
		current_type = selected_item.selection;
		var parameter_type,parameter_id;
		if(gamma.getParameterObjectByName(current_type,'ratings').id === undefined)
		{
			parameter_type = 'metrics';
		}
		else
		{
			parameter_type = 'ratings';
		}
		parameter_id = gamma.getParameterObjectByName(current_type,parameter_type).id;
		getTrendData(parameter_type,parameter_id);
	}

	function metricExists(metricName) {
		for(i = 0 , len = componentSummary.metrics.length ; i < len ; i++)
		{
			if((componentSummary.metrics[i].type).toLowerCase() == metricName.toLowerCase())
			{
				return true;
			}
		}
		return false;
	}

	//---------- PUBLIC METHODS --------------
	gamma.getComponentSummaryData = function(holder) {
		componentSummary_holder = holder;
		getComponentSummaryData();
	};
	gamma.getTreeSelection = function() {
		return currentSelection;
	};
	return gamma;
}(g));