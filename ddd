g.admin.left_menu = function (gamma) {
    //----- private variables --------
    var default_menu, leftMenuData;
    e.unSubscribe('MENU_ITEM_CLICKED');
    e.subscribe('MENU_ITEM_CLICKED', onMenuItemClicked);

    function addViewInfoContent(id) {
        if (id == "analysis_queue") {
            $('#content .left_container').hide();
        } else {
            $('#content .left_container').show();
        }
        $('.admin_panel_header .license_expiry_holder').remove();
        $('.admin_panel_header .panel_title_info_icon').webuiPopover('destroy');
        $('admin_panel_header .panel_title_info_icon').attr("id", id);
        var panel_title_info_content = $('<div/>', {
            class: 'panel_title_info_content '
        });
        var panel_inner_info_icon = $('<div/>', {
            class: 'panel_inner_info_icon ic-info '
        });
        var panel_inner_info_content = $('<div/>', {
            class: 'panel_inner_info_content'
        }).html(i18next.t("common.plugin_info." + id));
        panel_title_info_content.append(panel_inner_info_icon, panel_inner_info_content);
        $('.admin_panel_header .panel_title_info_icon').webuiPopover({
            content: panel_title_info_content,
            style: 'gamma-popover',
            placement: "right-bottom",
            trigger: 'hover',
            animation: 'pop'
        });
    }
    //------------- private functions --------------------
    function onMenuItemClicked(clicked_item) {
        switch (clicked_item.attr('data-owner')) {
            case 'admin_details':
                gamma.pushHistory('admin_details', '', '', {
                    'default_parameter': clicked_item.attr('data-id'),
                    'data_owner': clicked_item.attr('data-id'),
                    'breadcrumb': g.print(clicked_item.attr('data-id'))
                }, 'management');
                gamma.admin.left_menu.loadAdminDetails(clicked_item.attr('data-id'), false);
                break;
        }
        $('[title]').tooltipster();
        $(document).attr('title', 'Embold - ' + clicked_item.text());
    }

    return {
        loadAdminDetails: function (selected_parameter, enableLeftMenu) { //------------ admin page left menu events handled here -------------
            addViewInfoContent(selected_parameter);

            $('#content .right_container .header_container .add_search_button').off('click');
            $('.notification-wrapper').remove();
            switch (selected_parameter) {
                case 'users':
                    gamma.admin.users.user_list.loadUsersList(enableLeftMenu);
                    break;
                case 'teams':
                    gamma.admin.teams.team_list.loadTeamList(enableLeftMenu);
                    break;
                case 'projects':
                    gamma.admin.projects.project_list.loadProjectsList(enableLeftMenu);
                    break;
                case 'global_permissions':
                    gamma.admin.roles.global_roles.loadGlobalRolesList(enableLeftMenu);
                    break;
                case 'tags':
                    gamma.admin.tags.tag_list.loadTagList(enableLeftMenu);
                    break;
                case 'kpis':
                    gamma.admin.kpis.kpi_list.loadKpisList(enableLeftMenu);
                    break;
                case 'repositories':
                    gamma.admin.subsystems.subsystem_list.loadSubsystemsList(enableLeftMenu);
                    break;
                case 'version_control':
                    gamma.admin.version_control.version_control_account_list.loadVersionControlAccountsList(enableLeftMenu);
                    break;
                case 'analysis_queue':
                    gamma.admin.analysis.analysis_queue.loadAnalysisQueueList(enableLeftMenu);
                    break;
                case 'import_subsystem':
                    gamma.admin.subsystems.import_subsystem.loadAnalyticsSubsystemList(enableLeftMenu);
                    break;
                case 'license':
                    gamma.admin.license.agent.loadAgent(enableLeftMenu);
                    break;
                case 're_settings':
                    gamma.admin.re.settings.loadSettings(enableLeftMenu);
                    break;

                case 'quality_profile':
                    gamma.admin.quality_profile.quality_profile_list.loadProfile(enableLeftMenu);
                    break;
                case 'notifications':
                    gamma.admin.notifications.notification_list.loadNotificationList(enableLeftMenu);
                    break;
                case 'access_tokens':
                    gamma.admin.access_tokens.gat.loadGat(enableLeftMenu);
                    break;
                case 'public_url':
                    gamma.admin.public_url.webhook_config.webhookConfig(enableLeftMenu);
                    break;

                case 'userDirectories':
                    gamma.admin.userDirectories.directoryList.loadDirectoryData(enableLeftMenu);
                    break;
                case 'sso':
                    gamma.admin.sso.ssoSettings.loadSsoSettings(enableLeftMenu);
                    break;
            }
        },
        loadAdminLeftMenu: function (data, default_selection, owner) { // utility function for rendering data of left menu
            //------------- enabling left menu emulsion plugin for loading left menu bar
            default_menu = default_selection;
            leftMenuData = data;
            gamma.leftMenuItem = leftMenuData;
            new e.leftMenu({
                holder: '#content .left_container',
                data: leftMenuData,
                menuOwner: owner,
                defaultSelection: default_menu,
                notify: {
                    onMenuItemClick: 'MENU_ITEM_CLICKED'
                },
                title: i18next.t("admin.panel_title")
            });
        },
    }
}(g);
