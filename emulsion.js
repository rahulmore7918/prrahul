
// ======== EMULSION ========
//---------now emulsion will be returned to e and all private methods can be acessible using e
var e  = (function() {


	//---------------Private variables-------------
	var notification_register 	= {};
	var request_register		= [];
	var gradient_rating 		= {colors:['#9D3F3D','#f25755','#ea9244','#ffc852','#b3d04f','#00c291'],grad_name:'gradient_rating'};
	var mode = 'explorer';
	var emulsion 				= {};
	var external 				= {};

	var requestArray=[];
	$.ajaxSetup({
		headers: {
			'Authorization': "Bearer " + localStorage.getItem('auth_token')
		}
	});
	$(document)
	.ajaxSend(function(e,r,x) {
		if (x.url.indexOf('gamma/api/nodesummary/lazy') == -1 && x.url.indexOf('gamma/api/treelist/getdata') == -1 && x.url.indexOf('gamma/api/treelist/nodepath') == -1 && x.url.indexOf('gamma/api/repository/uploadcode') == -1 && x.url.indexOf('gamma/api/analysis/uploadmodulefiles') == -1 && x.url.indexOf('commituseravatars') == -1)
		{
			requestArray.push(x.url);
			$("body").css("cursor", "progress");
			$('#loading_overlay,#loading_msg_container').show();
		}
		else {
            return;
        }
	})
	.ajaxComplete(function(e,r,x) {
		if (r.status == 401) {
			g.logout();
		}
		// if(r.status == 500) {

        // }
        if (x.url.indexOf('gamma/api/treelist/getdata') == -1 && x.url.indexOf('gamma/api/treelist/nodepath') == -1 && x.url.indexOf('gamma/api/repository/uploadcode') == -1 && x.url.indexOf('gamma/api/analysis/uploadmodulefiles') == -1 && x.url.indexOf('commituseravatars') == -1) {
			requestArray = _.without(requestArray,x.url);
		}
		if (requestArray.length <= 0)
		{
			//setTimeout(function() {
				$("body").css("cursor", "auto");
				$('#loading_overlay,#loading_msg_container').hide();
			//});
		}
	});

	window.onerror = function() {
		$("body").css("cursor", "auto");
		$('#loading_overlay,#loading_msg_container').hide();
		requestArray = [];
		if (($(".emulsion_panel[data-panel_id='subsystem_list']").length || $(".emulsion_panel[data-panel_id='repository_dashboard']").length) && !$(".sticky_error_wraper").length){
			emulsion.showErrorSticker(i18next.t('common.sticky_header_error'));
		}
	};

	var domainName = window.location.origin;
	var basePathforView = domainName + '/api';
	var errorRoutes = [1760,1762];
	//----------------  Private methods ----------------
	function ajaxLoader(src,onSuccess,params,dataType,async,customResponse) {
		var path;
		var encrypt_url = g.encrypt_url;
		if (src.includes("/views/")){
            path = basePathforView + src;
        }
        else {
            path = g.BASE_URL + src;
        }
		if(encrypt_url) {
			src = src.split('gamma/');
			if(src[1] !== undefined){
				src = src[0] + 'gamma/' + g.encryptURL(src[1])
			};
		}
		var encrypted_params = params;
		if(params !== null && encrypt_url && src[1] !== undefined){
			encrypted_params = {'request_params':g.encryptURL(JSON.stringify(params))};
		}
		$.ajax({
			url: path,
			data:encrypted_params,
			dataType: dataType,
			success: function(data, textStatus, xhr) {
				if(emulsion.request_register.indexOf(src) != -1) {
                    emulsion.request_register.splice(emulsion.request_register.indexOf(src),1);
                }

				e.notify(e.notifications.DATA_LOADED);
				if(xhr.status == '204'){
					onSuccess.call(this,[],'success');
				}else{
					onSuccess.call(this,data,'success');
				}
		    },
		    error: function( data ) {
				var errorData = (typeof data.responseJSON != 'undefined') ? data.responseJSON : data;

				if(data.status == 401)
		    	{
		    		e.log( "401 : ACCESS DENIED : "+src );
					e.notify('401');
					g.logout();
		    	} else if (data.status == 404) {

		    	    window.location.href = g.PAGE_NOT_FOUND;
		    	} else if (errorData.error.code == 1759) {
					// tempered error
					window.location.href = g.PAGE_TEMPERED;
				} else if(errorRoutes.includes(errorData.error.code)){
					// expired error
					window.location.href = g.PAGE_ERROR;
				}else{
					console.log( "AJAX ERROR ! - ERROR CODE - "+data.status);
					if(typeof customResponse === "undefined"){
						g.addErrorAlert(data);
					}else if(!customResponse.error.isCustom || customResponse.error.isCustom === undefined){
						g.addErrorAlert(data);
					}else{
						onSuccess.call(this,data,'error');
					}
				}
		    },
			async:async
	  	});
	}

	function blinkMsg(blinkmsg_holder,message_string) {
		if(!(blinkmsg_holder).find('.blink_msg').length){
			blinkmsg_holder.append(Template.blinkMsg({ 'text': message_string }));
		}
		setTimeout(function() {
			blinkmsg_holder.find('.blink_msg').css('-webkit-animation', 'fadeOut 500ms');
			blinkmsg_holder.find('.blink_msg').bind('webkitAnimationEnd', function () {
				blinkmsg_holder.find('.blink_msg').remove();
			});
		}, 2000);
	}


	//------------------Public scope----------- Used to expose private methods outside------------

	emulsion.external 			= external;
	emulsion.gradient_rating 	= gradient_rating;
	emulsion.gradient 			= '';
	emulsion.mode 				= mode;
	emulsion.request_register 	= request_register;
	emulsion.nextHighestDepth = function () {
	    var maximumZ = Math.max.apply(null,$.map($('body > *'), function(e,n){
                if($(e).css('position')=='absolute') {
                    return parseInt($(e).css('z-index'))||1 ;
                }
	        })
	    );
	    return maximumZ+1;
	};
	Array.prototype.insert = function (index, item) {
		this.splice(index, 0, item);
	};
	Array.prototype.clean = function(deleteValue) {
	  for (var i = 0; i < this.length; i++) {
	    if (this[i] == deleteValue) {
	      this.splice(i, 1);
	      i--;
	    }
	  }
	  return this;
	};
	emulsion.notifications={
		DATA_REQUESTED:"data_requested",
		DATA_LOADED:"data_loaded",
		DATA_LOAD_ERROR:"data_load_error"
	}
	emulsion.setDepth = function(obj,depth) {
		obj.css('z-index',depth);
	};
	emulsion.setX = function(obj,val) {
		obj.css('margin-left',val);
	};
	emulsion.setY =  function(obj,val) {
		obj.css('margin-top',val);
	};
	emulsion.setWidth = function(obj,val) {
		obj.css('width',val);
	};
	emulsion.setHeight = function(obj,val) {
		obj.css('height',val);
	};
	emulsion.showErrorSticker = function(message,isSnapshotUpdate,msg) {
		var sticky_error_wraper ;

		if (!$(".sticky_error_wraper").length){
			sticky_error_wraper	= $('<div/>', { class: 'sticky_error_wraper' });
			$('.gamma-main-wraper').append(sticky_error_wraper);
		}else{
			sticky_error_wraper = $(".sticky_error_wraper").html('');
		}


		var sticky_error_content 	= $('<div/>', { class: 'sticky_error_content' }).html(message);
		var refresh_button 			= $('<button/>', {type:'button', class: 'btn button_primary refresh_button' }).html((isSnapshotUpdate)?'Update':'Refresh');
		var sticky_error_close = $('<div/>', { class: 'sticky_error_close list_item_remove ic-close-sm float_right'});
		sticky_error_wraper.append(sticky_error_content, refresh_button);
		if(isSnapshotUpdate) {
            sticky_error_wraper.append(sticky_error_close);
        }

			refresh_button.on('click', function () {
				if (isSnapshotUpdate && historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'systems' && e.mode == "explorer" && msg.subsystemId == historyManager.get('currentSubSystemUid')) {
					g.getSnapshots();
					g.updateSnapshotAfterAnalysis(true);
					sticky_error_wraper.remove();
				}else{
					location.reload();
				}
			});
			sticky_error_close.on('click', function() {
				sticky_error_wraper.remove();
			});

	}
	//----- LOAD EXTERNAL MODULE -----
	emulsion.activateModule = function(moduleName,callBack) {
		if(callBack !== undefined) {
            callBack.call();
        }
		/*var path = 'js/'+this.external[moduleName].path;
		//loadModule(moduleName,path,callBack);
		require([path], function(util) {
			e.external[moduleName].active = true;
			if(callBack !== undefined){
				callBack.call();
			}
		});*/
	};
	emulsion.deActivateModule = function(modulePath,callBack) {
		if(callBack !== undefined) {
            callBack.call();
        }
		//var path = 'js/'+modulePath;
		// for(var i = 0 ; i < modulePath.length ; i++)
		// {
		// 	requirejs.undef(modulePath[i]);
		// 	$("head script[data-requiremodule|='"+modulePath[i]+"']").remove();
		// }
	};
	emulsion.loadDependencies = function(dependencies,callBack) {
		if(callBack !== undefined) {
            callBack.call();
        }
		/*require(dependencies,callBack);*/
	};
	//---- ACTIVATE PLUGIN ----
	emulsion.enablePlugin = function(name,callBack) {
		if(callBack !== undefined) {
            callBack.call();
        }
		/*var loaded_flag = false;
		if(loaded_plugins[name])
		{
			if(loaded_plugins[name].status == 'active')
			{
				loaded_flag = true;
				callBack.call();
			}
			else
				loaded_flag = false;
		}
		if(!loaded_flag)
		{
			$("head").append("<link>");
			css = $("head").children(":last");
			css.attr({
				rel:  "stylesheet",
				type: "text/css",
				href: "plugins/"+name+"/style.css"
			});
			var path='plugins/'+name+'/plugin.js';
			loadModule(name,path,callBack);
		}*/
	};
	emulsion.disablePlugin = function(name,callBack) {
		if(callBack !== undefined) {
            callBack.call();
        }
		/*if(name != null)
		{
			for(var i = 0 ; i < name.length ; i++)
			{
				if(loaded_plugins[name[i]])
					loaded_plugins[name[i]] = {"status" : "inactive"};
				var js_path 	= 'plugins/'+name[i]+'/plugin.js';
				var css_path 	= 'plugins/'+name[i]+'/style.css';
				requirejs.undef(js_path);
				requirejs.undef(css_path);
				$("head script[data-requiremodule|='"+js_path+"']").remove();
				$("head link[href|='"+css_path+"']").remove();
				e.log('Disabled plugin --> '+name);
			}
			if(callBack !== undefined)
				callBack.call();
		}*/
	};

	emulsion.blinkMsg = function (blinkmsg_holder,message_string) {
		blinkMsg(blinkmsg_holder, message_string);
	}
	emulsion.enableDefaultPlugin = function(name,callBack) {
		if(callBack !== undefined) {
            callBack.call();
        }
		/*if(loaded_plugins[name])
			callBack.call();
		else
		{
			var path='plugins/'+name+'/plugin.js';
			loadModule(name,path,callBack);
		}*/
	};
	//----- LOAD JSON ---
	emulsion.loadJSON = function(src,onSuccess,params,async,customResponse) {
		/*console.log('pushing ro request register '+src);
		emulsion.request_register.push(src);*/
		if (emulsion.isIE()) {
			if (!params) {
				params={};
			}
			params.timestamp = new Date().getTime();
		}
		else if(!params){
			params = null;
		}
		if(!async) {
            async = false;
        }
		else {
            e.notify(e.notifications.DATA_REQUESTED);
        }


		ajaxLoader(src,onSuccess,params,'json',async,customResponse);
	};
	emulsion.postData = function(type,src,onSuccess,params,customResponse,async) {
		e.notify(e.notifications.DATA_REQUESTED);
		var path;
		if(!params){
			params = null
		};
        if(!async){
			async = true
		};
		if (src.includes("/views/")){
            path = basePathforView + src;
        }
        else {
            path = g.BASE_URL + src;
        }
		$.ajax({
            type: type.toUpperCase(),
			url: path,
			dataType: 'json',
            data: params,
            success: function( data ) {

						g.addToast(customResponse.success);
					}
				}else{
					g.addToast(data);
				}
            	e.notify(e.notifications.DATA_LOADED);
				onSuccess.call(this,data,'success');
		    },
		    error: function( data ) {
				e.log( "AJAX ERROR !"  );
				if(!customResponse.error.isCustom || customResponse.error.isCustom === undefined){
					g.addErrorAlert(data);
				}
		      	onSuccess.call(this,data,'error');
		    },
            async:async
        });
	};
	emulsion.load = function(src,onSuccess,params,async) {
		if(!params){
			params = null;
		}
		if(!async){
			async = false;
		}
		ajaxLoader(src,onSuccess,params,'html',async);
	};
	emulsion.loadText = function(src,onSuccess,params,async) {
		if(!params){
			params = null;
		}
		if(!async){
			async = false;
		}
		ajaxLoader(src,onSuccess,params,'text',async);
	};
	emulsion.loadTheme = function (themename) {
		// $("head").append("<link>");
		// var css = $("head").children(":last");
		// css.attr({
		// 	rel:  "stylesheet",
		// 	type: "text/css",
		// 	href: "themes/"+themename+"/theme.css"
		// });
	};
	emulsion.subscribe = function (not,callback) {
		if(notification_register[not]) {
            notification_register[not].subscribers.push(callback);
        }
		else {
            notification_register[not] = {'subscribers':[callback]};
        }
	};
	emulsion.notify = function(not,data) {
		//try{
			if (notification_register[not]) {
				var sub = notification_register[not].subscribers;
				for (var i = 0; i < sub.length; i++) {
					sub[i].call(this, data);
				}
			}
		// }
		// catch(error){
		// 	console.log("Api not available");
		// }
	};
	emulsion.unSubscribe = function(not) {
		$.each(notification_register,function(key,value){
			if(key == not)
			{
				//console.log('deleting '+not);
				delete notification_register[not];
			}
		});
	};
	emulsion.setIcons = function(icons) {
		this.emulsion_icons = icons;
	};
	emulsion.getIcons = function() {
		return this.emulsion_icons;
	};
	emulsion.setTreeIcons = function(icons) {
		this.tree_icons = icons;
	};
	emulsion.getTreeIcons = function() {
		return this.tree_icons;
	};
	emulsion.renderIcon = function(holder,icon_id) {
        try {
            var icons = e.getIcons();
            var selected = icons.select('#'+icon_id);
            var icon_svg;
            if (selected && selected !== null && selected !== undefined) {
                icon_svg = icons.select('#' + icon_id).toString();
            } else {
                icon_svg = icons.select('#unknown').toString();
            }
            if (icon_id != 'close') {
                if (typeof holder == "object") {
                    holder.append(icon_svg);
                } else {
                    $(holder).append(icon_svg);
                }

            } else {
                var icon_font = $('<div/>', {
                    class: 'ic-close-sm'
                });
                $(holder).append(icon_font);
            }
        } catch (error) {
            console.log("Error : Something went wrong");
            console.log(error);
        }
	};
	emulsion.renderTreeIcon = function(holder,icon_id) {
		var icons 		= e.getTreeIcons();
		var selected 	= icons.select('#'+icon_id);
		var icon_svg;
		if(selected !== null && selected !== undefined) {
            icon_svg = icons.select('#'+icon_id).toString();
        }
		else {
            icon_svg = icons.select('#Unknown').toString();
        }
		if(typeof holder == "object") {
            holder.append(icon_svg);
        }
		else {
            $(holder).append(icon_svg);
        }
	};
	emulsion.renderFontIcon = function(holder,icon_class) {
		var  icon_font= $('<div/>',{class:icon_class});
		$(holder).append(icon_font);
	};
	emulsion.disable = function(holder) {
		$(holder).removeClass('hand_cursor').addClass('default_cursor disabled');
	};
	emulsion.enable = function(holder) {
		$(holder).removeClass('default_cursor disabled').addClass('hand_cursor');
	};
	emulsion.math = {
		round: function(value,convertToInt) {
			if(convertToInt)
			{
				if(value === 0 ) {
                    return 0;
                }
				else if(value % 1 === 0) {
                    return parseInt(value);
                }
				else {
                    return parseFloat(value).toFixed(2);
                }
			}
			else {
                return parseFloat(value).toFixed(2);//Math.round(value * 100) / 100;
            }
		},
		convertToRange: function(or,nr,val) {
			var oldRange = (or[1] - or[0]);
			var NewRange = (nr[1] - nr[0]);
			var NewValue = (((val - or[0]) * NewRange) / oldRange) + nr[0];
			return NewValue;
		}
	};
	emulsion.text = {
		getTextWidth:function(input_text,input_font) {
			$.fn.textWidth = function(text,font) {
			    if (!$.fn.textWidth.fakeEl) { $.fn.textWidth.fakeEl = $('<span class="text_width">').hide().appendTo(document.body) };
			    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
			    return $.fn.textWidth.fakeEl.width();
			};
			var current_textWidth 	= $.fn.textWidth(input_text,input_font);
			$('.text_width').remove();
			return current_textWidth;
		},
		unEscapeString:function(input_string) {
			return (input_string)?input_string.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#96;/g, '`'):'';
		},
		escapeString: function (input_string) {
			return (input_string)?input_string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\\/g, '&#x5C;').replace(/`/g, '&#96;'):'';
		}
	};
	emulsion.format = {
		numberFormat : function(num) {
			//var positive  = false;
		    var delimiter = ",";
		    var decimal   = ".";
		    if(historyManager.get('currentLanguage') == 'de'){
		    	delimiter = ".";
		    	decimal   = ",";
		    }
		    if(num === null) {
                return "0";
            }
   			else {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
		},
		signedInt: function(num) {
			return (num>0?'+':'') + num;
		},
		abbrNumber: function (n, d) {
			d = Math.pow(10, d);
			var abbrev = ["K", "M", "B", "T"];
			for (var i = abbrev.length - 1; i >= 0; i--) {
				var size = Math.pow(10, (i + 1) * 3);
				if (size <= n) {
					n = Math.round(n * d / size) / d;
					if ((n == 1000) && (i < abbrev.length - 1)) {
						n = 1;
						i++;
					}
					n += abbrev[i];
					break;
				}
			}
			return n;
		}
	};
	emulsion.log = function(message) {
		//console.log(arguments.callee.caller.name+" SAYS : ");
	};

	emulsion.abbrNum = function(number,decimal){
		var value;
		value = (''+number).length,power = Math.pow,decimal = power(10,decimal);
		value -= value%3;
		return Math.round(number * decimal/power(10,value))/decimal + " kMGTPEZY"[value/3];
	};

	emulsion.changeMode = function(mode) {
		emulsion.mode = mode;
		if(mode == 'explorer')
		{
			g.admin.utils.unSubscribeAdminEvents();
			$('#plugin_selector,#breadcrumb,.search_click,.run_analysis, #view_tab,#snapshot_tab,#add_bookmark').removeClass('hide');
			$('#management_breadcrumb').hide();
			$('#content').hide();
			$('#bottom_container').height(g.contentHeight());
			$('.emulsion_panel').show();
		}
		else if(mode == 'management')
		{
			//g.unloadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'),historyManager.get('currentPlugin').id);
			$('.top_tab').removeClass('active_tab').addClass('color_medium');
			$('#snapshot_selector,#plugin_selector,#breadcrumb,.search_click,.run_analysis, #view_tab,#snapshot_tab,#add_bookmark').addClass('hide');

            $("header").addClass('hide');
			$('.emulsion_panel').hide();
			$(".tag_click").addClass("hide");
			$('#bottom_container').height($(window).height());
			$('#content').show();
		}
	}

	emulsion.removeDropdown = function() {
		$('.dropDown_list').slideUp(300,function() {
			$('.dropDown_list').remove();
	        $('.dropdown_arrow').children().removeClass('ic-chevron-up').addClass('ic-chevron-down');
	        $('.dropdown').removeClass('active_dropdown');
	    });
	}
	emulsion.removeComboBox = function () {
		if ($('.combobox_content').length > 0) {
			$('.combobox_content').slideUp(300, function () {
				$('.combobox_content').remove();
				$('.combobox').removeClass('active_dropdown');
				$('.combobox').find('.dropdown_arrow').removeClass('ic-chevron-up').addClass('ic-chevron-down');
			});
		}
	}
	emulsion.removeSortList = function () {
		$('.sort_list').slideUp(300, function () {
			$('.component_table_header .list_header').removeClass('border-color');
		});
	};

	emulsion.isIE = function () {
		if (navigator.userAgent.match(/Trident\/7\./)) {
			return true;
		}else{
			return false;
		}
	};
	return emulsion;
}());
