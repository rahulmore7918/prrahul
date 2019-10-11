
/*
================= Context JS ====================
=================================================
Adds context menu functionality to emulsion.js
..................by Kochumvk....................
=================================================
*/
var context = (function(emulsion){
	 
		// Private
		var target;
		var menuItems;
		var menu;
			
		function drawMenu(){
			menu = $('<div/>',{class:'context_menu p'});
			menu.contextmenu(function() {
  				console.log( "Handler for .contextmenu() called." );
			});
		}
		//Public

		emulsion.context = function(svg){
			var cont  = {}
			cont.menu = function(input){
				target = input.target;
				menuItems = input.items;
			}

		return cont;
	}
		
		
		return emulsion;
	
}(e));