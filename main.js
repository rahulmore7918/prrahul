 

(function (emulsion) {
	var dependencies = ['js/external/jquery.tooltipster.js', 'js/external/foundation/foundation.js', 'js/external/vendor/modernizr.js', 'js/external/jquery.transit.min.js', 'js/external/raphael.min.js', 'js/external/snap.svg-min.js', 'js/external/rainbowvis.min.js'];
	var dep_storageapi = ["js/external/jquery.storageapi.min.js"];
	var dep_history = ["js/history.js"];
	var admin_dependencies = ['js/admin/utils.js', 'js/admin/left_menu.js', 'js/admin/breadcrumb.js', 'js/admin/users/user_list.js', 'js/admin/users/add_user.js', 'js/admin/users/user_details.js', 'js/admin/users/change_password.js', 'js/admin/users/edit_user.js', 'js/admin/teams/add_team.js', 'js/admin/teams/edit_team.js', 'js/admin/teams/left_menu.js', 'js/admin/teams/team_details.js', 'js/admin/teams/team_list.js', 'js/admin/teams/team_users.js', 'js/admin/projects/project_list.js', 'js/admin/projects/add_project.js', 'js/admin/projects/left_menu.js', 'js/admin/projects/project_details.js', 'js/admin/projects/edit_project.js', 'js/admin/projects/project_subsystems.js', 'js/admin/projects/project_users.js', 'js/admin/roles/global_roles.js', 'js/admin/subsystems/left_menu.js', 'js/admin/subsystems/subsystem_list.js', 'js/admin/subsystems/add_subsystem.js', 'js/admin/subsystems/edit_subsystem.js', 'js/admin/subsystems/subsystem_details.js', 'js/admin/subsystems/subsystem_snapshots.js', 'js/admin/subsystems/linked_projects.js', 'js/admin/version_control/version_control_account_list.js', 'js/admin/version_control/add_version_control_account.js', 'js/admin/version_control/edit_version_control_account.js', 'js/admin/version_control/version_control_account_details.js', 'js/admin/account/account_details.js', 'js/admin/account/edit_account.js', 'js/admin/tags/tag_list.js', 'js/admin/tags/tag_popup.js', 'js/admin/analysis/analysis_queue.js', 'js/admin/analysis/analysis_history.js', 'js/admin/analysis/analysis_details.js', 'js/admin/kpi/kpi_list.js', 'js/admin/kpi/kpi_popup.js'];
	var default_plugins = "color";
	//var gradient;

	//------------ PRIVATE METHODS ---------------
	function sendToLogin() {
		window.location.replace(g.paths.PAGE_LOGIN);
	}

	emulsion.gradient = new e.color();
	emulsion.gradient.defineGradient(emulsion.gradient_rating.colors, emulsion.gradient_rating.name);


	//--------- ON admin dependenies loaded - render icons -----------
	function onAdminLoaded(svg_icons, tree_icons) {
		emulsion.setIcons(svg_icons);
		emulsion.setTreeIcons(tree_icons);
		renderIcons();
		}

	//--------- render basic icons that are static --------------
	function renderIcons() {
		e.renderIcon('#logo', 'logo');
		//e.renderIcon('#loading_msglogo','logo');
		e.renderIcon('.menu_icon', 'user_management');
		e.renderIcon('.menu_click', 'user_management');
		e.renderIcon('.notification', 'notification');
		e.renderIcon('header .analysis_status .analysis_icon', 'analysis');
		e.renderFontIcon('.input_clear_icon', 'ic-close-sm');
		e.renderFontIcon('.search_icon', 'ic-search');
		e.renderIcon('#add_bookmark', 'bookmarks');
		e.renderIcon('#add_bookmark1', 'bookmarks');
		e.renderFontIcon('.tag_icon', 'ic-tags');
		$(document).foundation();
		g.init();
	}

	//---------------- Init method - actual flow starts here-----------------
	// public method

	emulsion.init = function (svg_icons, tree_icons) {
		if (!window.location.origin)
			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

		emulsion.subscribe('401', sendToLogin);
		emulsion.loadTheme('sunny');
		onAdminLoaded(svg_icons, tree_icons);
		//emulsion.loadDependencies(dependencies,onDependenciesLoaded);
	};
	emulsion.i18nextInit = function () {
		i18next.use(i18nextXHRBackend);
		i18next.init({
			'lng': 'en',
			'fallbackLng': 'en',
			backend: {
				// loadPath: 'locales/{{ns}}.{{lng}}.json'
				loadPath: 'locales/{{lng}}/translation.json?timestamp=' + new Date().getTime()
			}
		}, function () {
			jqueryI18next.init(i18next, $);
			$('body').localize();
			loadSvgIcons();
		});
	};
	return emulsion;
}(e));
function loadTreeSvgIcons(svg_icons) {
	Snap.load('images/tree_icons.svg', function (tree_icons) {
		e.init(svg_icons, tree_icons);
	});
}
function loadSvgIcons() {
	Snap.load('images/icons.svg', function (f) {
		loadTreeSvgIcons(f);
	});
}

//========== INITIALISE ===========
$(document).ready(function () {
	e.i18nextInit();
	addUserAgentClass();
});
function addUserAgentClass() {
	if (navigator.userAgent.indexOf('Mac') > 0)
		$('body').addClass('mac-os');
}
(function ($) {
	$.fn.hasScrollBar = function () {
		return this.get(0).scrollHeight > this.height();
	}
	$.fn.hasHorizontalScrollBar = function () {
		return this.get(0) ? this.get(0).scrollWidth > this.innerWidth() : false;
	}

})(jQuery);

/*e.activateModule('jquery',jqueryActivated);
function jqueryActivated(){
	e.activateModule('jquery_ui',jqueryUIActivated);
}
function jqueryUIActivated(){
	$(document).ready(function() {
		e.init();
	});
}*/