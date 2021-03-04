
var g = (function(gamma) {
	 

	//========== PRIVATE ===========
	var hasError, sendTreeNotification, navigate_tree, treeList, tree_project_id, tree_snaphsot_id, treeComponentId, holder, treeContainer;
	var currentSelection = [];
	var notification = g.notifications.TREE_UPDATE;
	function subscribeTreeEvents() {
		e.subscribe(g.notifications.PLUGIN_LOADED,treeUpdate);
		e.subscribe(g.notifications.BREADCRUMB_UPDATE,treeUpdate);
		e.subscribe(g.notifications.SNAPSHOT_UPDATE,treeUpdate);
		//e.subscribe(g.notifications.DEPENDENCY_LOADED,treeUpdate);
		/*e.subscribe(g.notifications.BREADCRUMB_UPDATE,treeUpdate);
		e.subscribe(g.notifications.SNAPSHOT_UPDATE,treeUpdate);*/
		//e.subscribe(g.notifications.SEARCH_UPDATE,treeUpdate);
		//e.subscribe(g.notifications.BOOKMARK_UPDATE,treeUpdate);
	}

	//------- Update Tree selection or state ----------
	function treeUpdate() {
		if(historyManager.get("currentContext") != "root" && historyManager.get("currentContext") != "systems")
		{
			//=========== this function is used to show/hide tree_title and tree_update button in case of module_dependency plugin ======================
			//this function will be called on DEPENDENCY_LOADED notification
			if(historyManager.get("currentPlugin").id == "module_dependency")
			{
				$('.tree_title,.tree_update').removeClass('hide');
				var height = g.contentHeight() - $(".tab_wraper").height() - $('.tree_title').height() - $('.tree_update').height() - 25;
				$('.tree_content').height(height);
				$('.jstree-container-ul.jstree-children.jstree-striped').css('height',height);
			}
			else
			{
				$('.tree_title,.tree_update').addClass('hide');
				var height = g.contentHeight();
				$('.tree_content').height(height);
				$('.jstree-container-ul.jstree-children.jstree-striped').css('height', height);
			}
			var selected_snap 	= historyManager.get('selectedSnapshots');
			if(selected_snap.length > 0)
			{
				tree_project_id 	= historyManager.get('currentSubSystem');
				tree_snaphsot_id	= selected_snap[0].id;
				if(($('.tree-panel-container .navigate_tree').attr('data-subsystem_id') != historyManager.get('currentSubSystem')) ||
					($('.tree-panel-container .navigate_tree').attr('data-snapshot_id') != tree_snaphsot_id) ||
					($('.tree-panel-container .navigate_tree').attr('data-name') != historyManager.get('currentSubSystemName')))
					loadTreeStructure();
				else
				{
					if ($('#tree-icon-container').hasClass('active'))
						openTree();
				}
			}
		}
	}

	function loadTreeStructure() {
		var tree_container 		= $('<div/>',{class:'filter_data_container float_left'});
		navigate_tree = $('<div/>', { id: '', class:'float_left navigate_tree'});
		navigate_tree.attr('data-subsystem_id',historyManager.get('currentSubSystem'));
		navigate_tree.attr('data-name', historyManager.get('currentSubSystemName'));
		if(historyManager.get('selectedSnapshots').length > 0)
			navigate_tree.attr('data-snapshot_id',historyManager.get('selectedSnapshots')[0].id);
		tree_container.append(navigate_tree);
		holder.find('.filter_container').html('').append(tree_container);

		navigate_tree.jstree('destory');

		hasError 			= false;
		var src = 'api/views/repositories/'+ historyManager.get('currentSubSystemUid') + '/tree';
		if(gamma.encrypt_url)
			src = gamma.encryptURL(src);

		navigate_tree.jstree({
			'core' : {
				'data' : {
					"async":  false,
					'url' : src,
					'data' : function (node) {
						treeList = node;
						if(node.hasOwnProperty('message'))
						{
							hasError = true;
							showNoData();
							return false;
						}
						else
						{
							hasError = false;
							var request_params = {'projectId':tree_project_id,'snapshotId':tree_snaphsot_id,'nodeId':node.id};
							if(gamma.encrypt_url)
							{
								request_params = g.encryptURL(JSON.stringify(request_params));
								return { 'request_params' : request_params};
							}
							else
								return request_params;
						}
					}
				},
				'check_callback' : function(o, n, p, i, m) {
					if(m && m.dnd && m.pos !== 'i') { return false; }
					if(o === "move_node" || o === "copy_node") {
						if(this.get_node(n).parent === this.get_node(p).id) { return false; }
					}
					return true;
				},
				'themes' : {
					'responsive' : false,
					'variant' : 'medium',
					'stripes' : true,
					//"url": "js/external/themes/default/style.css"
				}
			},
			'sort' : function(a, b) {
				return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(b) ? 1 : -1);
			},
			'contextmenu' : { },
			'types' : {
				'default' : { 'icon' : false },
				'file' : { 'valid_children' : [], 'icon' : 'file' }
			},
			'plugins' : ['sort','types','unique']
		}).on('after_open.jstree', function(e, data) {
			//renderArrowIcon();
			renderTreeIcon();

		}).on('before_open.jstree', function(e, data) {
			// disable click
			// select all nodes but type-modules

			$('a.jstree-anchor:not(.type-modules,.type-components,.type-subsystem,.type-files,.type-subcomponents)').each(function() {
			  $(this).click(false);
			  $(this).dblclick(false);
			});

		}).on('select_node.jstree', function(event, data) {
			if(data && data.selected && data.selected.length && data.event !== undefined && sendTreeNotification)
			{
				selectNode(data);
			}
			else if(notification != 'TREE_UPDATE')
			{
				currentSelection = data.selected;
				e.notify(notification,data);
			}
			else
			{
				currentSelection = data.selected;
			}
			setTreeNodeIcon();
			setTimeout(function() {
				if($('.jstree-clicked').offset() !=undefined )
					$('.tree-panel-container .jstree-container-ul').animate({ scrollLeft: $('.jstree-clicked').offset().left -100 , scrollTop: $('.jstree-clicked').offset().top - 100 }, 800);
			},200);

		}).on('hover_node.jstree', function(e, data) {
		}).on('changed.jstree', function (e, data) {
			setTreeNodeIcon();
		}).on("ready.jstree", function(e, data) {
			//renderArrowIcon();
			var height = $('.jstree-container-ul.jstree-children.jstree-striped').parents(".filter_container").parent().height();//$('.tree_content').height();
			//$('.jstree-container-ul.jstree-children.jstree-striped').css('padding-top',35);
			$('.jstree-container-ul.jstree-children.jstree-striped').css('height',((height==0)?'185px':height));
			//$('.jstree-container-ul.jstree-children.jstree-striped').css('min-height',height);
			renderTreeIcon();
			openTree();
		});

		$(window).on("resize", function() {
			//var height = $('.content.line_top_solid.stroke_color_6').height() - 3;

			var height = $('.jstree-container-ul.jstree-children.jstree-striped').parents(".filter_container").parent().height();//$('.tree_content').height();
			//$('.jstree-container-ul.jstree-children.jstree-striped').css('padding-top',35);
			$('.jstree-container-ul.jstree-children.jstree-striped').css('height',height);
			//$('.jstree-container-ul.jstree-children.jstree-striped').css('min-height',height);
		});
	}
	
	// 	open tree level to current breadcrumb level
	function openTree() {
		var selected_node_array = [],tree_node_id,nd;
		navigate_tree.jstree("deselect_all");
		var current_breadcrumb_id = historyManager.get('currentBreadcrumb').id;
		if(historyManager.get('currentPlugin').id == 'module_dependency')
		{
			var checked_params1={};
			var history_depenedency_nodes = historyManager.get('currentDependencyOptionList');
			if(history_depenedency_nodes === '' || history_depenedency_nodes.selected_nodes.length === 0)
	        	checked_params1 = {'selected_nodes':[],'dependnecy_types':[]};
	        else
	        	checked_params1 = historyManager.get('currentDependencyOptionList');

	        tree_node_id 		= current_breadcrumb_id;
			selected_node_array = checked_params1.selected_nodes;
			historyManager.set('currentNode',current_breadcrumb_id);
		}
		else if(historyManager.get('currentContext') == 'root' || historyManager.get('currentContext') == 'systems')
		{
			tree_node_id 		= tree_project_id;
			selected_node_array = [tree_project_id];
		}
		else if(treeComponentId) {
			tree_node_id = treeComponentId;
			selected_node_array = [treeComponentId];
		}
		else
		{
			tree_node_id 		= current_breadcrumb_id;
			selected_node_array = [current_breadcrumb_id];
		}
		nd 	= "#tr-"+tree_node_id;
		/*root 				= $('#breadcrumb .breadmenu .rootBC ul li:last a');
		temp_node_id 		= root.attr('nodeid');
		current_node 		= $('#tr-'+temp_node_id);
		current_node.find('a').css('cursor','pointer');
		navigate_tree.jstree("enable_node",current_node);*/
		for(var i = 0 ; i < selected_node_array.length ; i++)
		{
			var nd 				= "#tr-"+selected_node_array[i];
			var temp_node_id 		= selected_node_array[i];
			var current_node 		= $('#tr-'+temp_node_id);
			//current_node.find('a').css('cursor','pointer');
			navigate_tree.jstree("enable_node",current_node);
			if (!(treeContainer.find(nd).length)) 
			{
				hasError = false;
					// get node path
				var src 	= 'api/views/repositories/'+ historyManager.get('currentSubSystemUid') + '/tree/nodepath';
				var request_params 	= {'nodeId':selected_node_array[i]};
				if(g.encrypt_url)
				{
					src 			= g.encryptURL(src);
					request_params 	= {'request_params':g.encryptURL(JSON.stringify(request_params))};
				}
				$.ajax({
					url: src,
					data:request_params,
					async: false
				}).done(function(data) {
					if(data.hasOwnProperty("message"))
			            hasError = true;
			        else
			        	hasError = false;

			        if(!hasError)
			        {
			        	if(data[0])
			        	{
							if(data[0].path)
							{
								var nodepath = data[0].path.split(".");
								var i = 0;
								if(historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems')
									openNode(i,nodepath);
							}
						}
					}
					else
						showNoData();
				});
			}
			else
			{
				//Default Selection
				historyManager.set('currentNode', temp_node_id);
				if(historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems')
					navigate_tree.jstree("select_node", nd, true);
			}
		}
		setTreeNodeIcon();
	}

	async function openNode(index, node_array) {
		for (let i = 0; i < node_array.length; i++) {
			var x = await matchNode(node_array[i], i, node_array.length);
		}
	}

	function matchNode(open_node, index, array_length) {
		return new Promise(resolve => {
			navigate_tree.jstree('open_node', $('#tr-' + open_node), function (e, data) {
				if (array_length == (index + 1)) {
					historyManager.set('currentNode', open_node);
					navigate_tree.jstree("select_node", '#tr-' + open_node, true);
				}
				resolve(true);
			}, true);
		});
	}


	function selectNode(data) {
		//if(data.node.a_attr['class'] != "type-subcomponents")
		//{
			var treenodeid 		= data.selected[0].substr(3);
			currentSelection 	= data.selected;
			var data_node_text  = data.node.text;

			var context;
			if (data.node.parent == '#')
				context = 'subsystems';
			else
				context = (data.node.a_attr['class']).split('-')[1];

			if(historyManager.get('currentPlugin').id == 'component_list')
			{
				var checked_params = '';
				var currentComponentParameterList = historyManager.get('currentComponentParameterList');
				if(currentComponentParameterList !== '')
					checked_params = currentComponentParameterList;
				checked_params.showAllComponents 		= true;
				checked_params.showImmediateComponents 	= false;
				checked_params.showDuplicateComponents 	= false;
				historyManager.set('currentComponentParameterList',checked_params);
			}
			if (context == 'subcomponents') {
				context = "components";
				treenodeid = (data.node.a_attr['data-parent_id']).split('-')[1];
                var subComponentDataSettings = { 'project_id': tree_project_id, 'snapshotId': tree_snaphsot_id, 'nodeId': data.selected[0].substr(3) };
				e.loadJSON('/views/repositories/'+ historyManager.get('currentSubSystemUid') + '/tree/subcomponents', function (subcomponent_data, status) {
					if (status == 'success') {
						g.line_number = subcomponent_data[0].start_line;
						data_node_text = $("#tr-" + treenodeid + " > a.jstree-anchor").attr('data-name');
						historyManager.set('currentNode', treenodeid);
						historyManager.set('currentBreadcrumb', { "id": treenodeid, "name": data_node_text });
						historyManager.set('currentContext', context);
						gamma.setPluginHistory();
						updateTreeNotify();
					}
					else if (status == 'error') {
						console.log("error");
					}
				}, subComponentDataSettings, true);
			}
			else if(context == 'components')
			{
				//gamma.setMetadata('heatmap','showPlugin',false);
				var src = 'api/views/repositories/'+ historyManager.get('currentSubSystemUid') + '/tree';
				var request_params = {'projectId':tree_project_id,'snapshotId':tree_snaphsot_id,'nodeId':'tr-'+treenodeid};
				if(gamma.encrypt_url)
				{
					src = gamma.encryptURL(src);
					request_params = {'request_params':gamma.encryptURL(JSON.stringify(request_params))};
				}
				$.ajax({
						url: src,
						data:request_params,
						async: false
					}).done(function(data) {
						var component = false;
						/*$(data).each(function(){
							if(this.type == 'COMPONENTS'){
								gamma.setMetadata('heatmap','showPlugin',true);
								component = true;
								return;
							}
						});*/

						if(component === false)
						{
							gamma.setPluginHistory('component_explorer');
						}
				});
				historyManager.set('currentNode', treenodeid);
				historyManager.set('currentBreadcrumb', { "id": treenodeid, "name": data_node_text });
				historyManager.set('currentContext', context);
				gamma.setPluginHistory();
				updateTreeNotify();
			} else if (context == 'files'){
				historyManager.set('currentNode', treenodeid);
				historyManager.set('currentBreadcrumb', { "id": treenodeid, "name": data_node_text });
				historyManager.set('currentContext', 'files');
				gamma.setPluginHistory('file_explorer');
				updateTreeNotify();
			}
			else
			{
				historyManager.set('currentNode', treenodeid);
				historyManager.set('currentBreadcrumb', { "id": treenodeid, "name": data_node_text });
				historyManager.set('currentContext', context);
				gamma.setPluginHistory();
				updateTreeNotify();
			}
		//}
	}

	function updateTreeNotify() {
		e.notify(g.notifications.TREE_UPDATE);
	}

	function renderArrowIcon() {
		var arrow_icon, arrow_wrapper;
		$.each(holder.find('.navigate_tree li'),function(index,value){
			if(!$(this).hasClass('jstree-leaf'))
			{
				arrow_icon = $(this).find('.jstree-icon:first');
				if(arrow_icon.find('.arrow_wrapper').length > 0)
					arrow_icon.find('.arrow_wrapper').remove();
				arrow_wrapper = $('<div/>',{class:'arrow_wrapper float_left'});
				arrow_icon.append(arrow_wrapper);
				e.renderIcon(arrow_wrapper,'triangle_tree');
				if($(this).hasClass('jstree-open'))
					arrow_wrapper.children().children().attr({'transform':'rotate(90, 16, 16)'});
			}
		});
	}

	async function renderTreeIcon() {
		// update arrows
		var i = 0;
		var element = holder.find('.navigate_tree li a');
		for(var i=0;i<element.length;i++){
			var module_icon = $(element[i]).find('.jstree-themeicon:not(.setsvgicon)').css('display', 'inline-block').css('background', 'none').addClass("setsvgicon");
			var node = $(element[i]).attr('data-nodetype');
			var x = await renderTree(module_icon,node);
		}
		//$('.jstree-container-ul.jstree-children.jstree-striped').scrollLeft(1);
	}

	function renderTree(module_icon,node){
		return new Promise(resolve =>{
			// $.each(holder.find('.navigate_tree li a'), function () {
				//e.renderIcon(module_icon,g.getIcon($(this).attr('data-classification')));
				e.renderTreeIcon(module_icon, node);
				resolve(true);
			// });
			setTreeNodeIcon();

		});
		
	}

	function setTreeNodeIcon() {
		// unset all older icon color
		$("a.jstree-anchor svg [fill='#29bdef']").each(function() {
			$(this).attr('fill', '#AEB2BD');
		});
		// set selected icon color
		$("a.jstree-clicked svg [fill='#AEB2BD']").each(function() {
			$(this).attr('fill', '#29bdef');
		});
	}

	function showNoData() {
		var no_data     =  $('<div/>',{class:'no_data text_14',title:'Data Unavailable'});
	    e.renderIcon(no_data,'data_unavailable');
	    $('.filter_data_container').html('');
		$('.filter_data_container').append(no_data);
		e.notify(g.notifications.RENDERING_COMPLETE);
	}

	//========== PUBLIC ===========

	gamma.createTree = function (holderParam, notify, notification_name, tree_params) {
		holder = holderParam;
		setTimeout(function() {
			treeContainer = $('.tree-panel-container');
			subscribeTreeEvents();
			sendTreeNotification 	= notify;
			if(notification_name)
				notification 			= notification_name;
			if(tree_params)
			{
				tree_project_id 	= tree_params.tree_project_id;
				tree_snaphsot_id 	= tree_params.tree_snaphsot_id;
				treeComponentId 	= tree_params.tree_component_id;
				treeContainer 	= tree_params.tree_container;
			}
			else
			{
				var selected_snap 	= historyManager.get('selectedSnapshots');
				tree_project_id 	= historyManager.get('currentSubSystem');
				tree_snaphsot_id	= selected_snap[0].id;
				treeComponentId     = null;
			}
			var filter_container 	= $('<div/>',{class:'filter_container float_left text_8 padding_top_25 unselectable'});
			holder.html('').append(filter_container);
			hasError = false;
			loadTreeStructure();
		}, 10);
	};
	gamma.getTreeSelection = function() {
		return currentSelection;
	};
	gamma.selectTreeNode = function(data) {
		selectNode(data);
	}
	gamma.openTreeInPopup = function (target) {
		//openTreeInPopup(target);
	}
	/**************** New requirement for tree change *******************/
	gamma.setSendTreeNotification = function(notify) {
		sendTreeNotification = notify;
	};
	return gamma;
}(g));
