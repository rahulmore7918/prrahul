var g = (function(gamma) {
    //----------------- Private Variables ----------------
    var nodeSummaryplugins = {
        "repository_dashboard": { pluginIcon: "ic-repository-dashboard", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Repository Dashboard', tooltipText: 'Repository Dashboard' },
        "commit_history": { pluginIcon: "ic-pull-request", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Commit History', tooltipText: 'Development History' },
        "code_editor": { pluginIcon: "ic-loc", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Code Editor', tooltipText: 'Code Editor' },
        "kpi_dashboard": { pluginIcon: "ic-kpis", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'KPI', tooltipText: 'KPI Dashboard' },
        "repository_overview": { pluginIcon: "ic-repository", fileSummary: false, componentSummary: true, showIcon: false, showRating: true, showValue: false, showLabel: true, hasPopover: true, labelText: 'Overall Rating', tooltipText: 'Overall Rating' },
        "hotspot_distribution": { pluginIcon: "ic-hotspot-distribution", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: true, showLabel: true, hasPopover: true, labelText: 'Hotspots', tooltipText: 'Total Hotspots' },
        "code_issues_details": { pluginIcon: "ic-code-quality", fileSummary: true, componentSummary: true, showIcon: true, showRating: true, showValue: true, showLabel: true, hasPopover: true, labelText: 'Code Issues', tooltipText: 'Code Issues' },
        "duplication_details": { pluginIcon: "ic-duplication", fileSummary: false, componentSummary: true, showIcon: true, showRating: true, showValue: true, showLabel: true, hasPopover: true, labelText: 'Duplication', tooltipText: 'Duplication Rating' },
        "metrics_details": { pluginIcon: "ic-metrics", fileSummary: true, componentSummary: true, showIcon: true, showRating: true, showValue: false, showLabel: true, hasPopover: true, labelText: 'Metrics', tooltipText: 'Metrics Rating ' },
        "design_issue_details": { pluginIcon: "ic-design-issues", fileSummary: false, componentSummary: true, showIcon: true, showRating: true, showValue: true, showLabel: true, hasPopover: true, labelText: 'Design Issues', tooltipText: 'Design Issues Rating' },
        "coverage_distribution": { pluginIcon: "ic-coverage", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Coverage Distribution', tooltipText: 'Coverage Distribution' },
        "coverage_component_list": { pluginIcon: "ic-coverage", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Coverage by Components', tooltipText: 'Coverage by Components' },
        "complex_method_list": { pluginIcon: "ic-test-hungry-methods", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Test Hungry Methods', tooltipText: 'Test Hungry Methods' },
        "unit_tests": { pluginIcon: "ic-unit-test", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: true, showLabel: false, hasPopover: false, labelText: 'Unit Tests', tooltipText: 'Unit Tests' },
        "change_overview": { pluginIcon: "ic-change-overview", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Changes', tooltipText: 'Changes' },
        "change_list": { pluginIcon: "ic-change-overview-component", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Changed Components', tooltipText: 'Changed Components' },
        "component_list": { pluginIcon: "ic-components", fileSummary: true, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: true, labelText: 'Component List', tooltipText: 'Component List' },
        "city_view": { pluginIcon: "ic-city-view", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'City View', tooltipText: 'City View' },
        "heatmap": { pluginIcon: "ic-heatmap", fileSummary: false, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Heatmap', tooltipText: 'Heatmap' },
        "issues": { pluginIcon: "ic-issues", fileSummary: true, componentSummary: true, showIcon: true, showRating: false, showValue: true, showLabel: false, hasPopover: false, labelText: 'Issues', tooltipText: 'Issues' },
        "tasks": { pluginIcon: "ic-tasks", fileSummary: false, componentSummary: true, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Tasks', tooltipText: 'Tasks' },
        "component_explorer": { pluginIcon: "ic-component-explorer", fileSummary: false, componentSummary: true, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Component Explorer', tooltipText: 'Component Explorer' },
        "file_explorer": { pluginIcon: "ic-document", fileSummary: true, componentSummary: false, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'File Explorer', tooltipText: 'File Explorer' },
        "dependency_plot": { pluginIcon: "ic-dependency", fileSummary: false, componentSummary: true, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Dependency Plot', tooltipText: 'Dependency Plot' },
        "partitions": { pluginIcon: "ic-partition", fileSummary: false, componentSummary: true, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Partitions', tooltipText: 'Partitions' },
        "node_tagging": { pluginIcon: "ic-tags", fileSummary: false, componentSummary: true, showIcon: true, showRating: false, showValue: false, showLabel: false, hasPopover: false, labelText: 'Tags', tooltipText: 'Tags' },
        "node_risk": { pluginIcon: "ic-risk", fileSummary: false, componentSummary: true, showIcon: false, showRating: true, showValue: true, showLabel: true, hasPopover: false, labelText: 'RISK', tooltipText: 'RISK' }
    };
	let partialMetricsList = ['LOC_Comments','NOS','LOC'];
    var excludablePlugins = ["Design Issues Distribution", "Dependency", "Partitions"];
    var nodeSummary, componentSummary, fileSummary, popoverInnerContent;
    var PATH_NODESUMMARY = '/views/repositories/',
        hasError;
    var PATH_ACTIVELANGUAGE = '/views/repositories/';
    var PATH_COMPONENTSUMMARY = '/views/repositories/';
    var PATH_FILESUMMARY = '/views/repositories/';
    popoverInnerContent = $('<div/>', { class: "popover_inner_content" });
    var moreItemEnabled = false,
        popoverTimer;
    //----------------- Private Methods ----------------
    function init() {
        $(document).off('click', ".node_plugin_item:not(.component_not_clickable)");
        //getNodeSummaryData();
        getActivelanguageData();
        handleEvents();
    }

    function loadNodeSummary() {
        moreItemEnabled = false;
        var pluginList = gamma.getPluginList();
        var plugins = gamma.plugins;
        var plugin_selector = $('#plugin_selector');
        plugin_selector.html('');
        var history_plugin = historyManager.get('currentPlugin');
        var plugin_id, plugin_group;
        var node_summary_bar = $('<div/>', { class: 'node_summary_bar float_left' });
        $('.more_plugin_items').remove();
        var repositoryOnModules = false;
        nodeSummaryplugins.component_list.hasPopover = false;
        nodeSummaryplugins.code_issues_details.hasPopover = true;
        for (var i = 0; i < plugins.length; i++) {
            if (g.isPartialLanguage()) {
                //console.log("<<<<<<< PARTIAL LANGUAGE >>>>>>>");
                //console.log(plugins[i]);
                if (excludablePlugins.includes(plugins[i].name)) {
                    // console.log("EXCLUDE :"+plugins[i].name);
                }
            }

            if (!(g.isPartialLanguage() && excludablePlugins.includes(plugins[i].name))) {
                plugin_id = plugins[i].id;
                repositoryOnModules = false;
                repositoryOnModules = (plugin_id == "repository_overview" && historyManager.get('currentContext') == "modules");
                plugin_group = plugins[i].plugin_group;
                var nodeSummaryDataItem = nodeSummaryplugins[plugin_id];
                if ((pluginList.indexOf(plugin_id) != -1 && gamma.isContextPlugin(plugin_id) && gamma.getPluginMetadata(plugin_id, 'showPlugin') || repositoryOnModules) && nodeSummaryDataItem) {

                    var pluginItem = $('<a/>', { class: 'node_plugin_item', id: plugin_id, tabindex: '0' });
                    if (nodeSummaryDataItem.showIcon) {
                        var pluginItemIcon = $('<i/>', { class: 'node_plugin_item_icon color_dark ' + gamma.getPluginMetadata(plugin_id, 'pluginIcon') });
                        pluginItem.append(pluginItemIcon);
                    }
                    if (repositoryOnModules) {
                        pluginItem.addClass("component_not_clickable");
                    }
                    if (nodeSummaryDataItem.showRating) {
                        var nodeRatingValue = getNodeRating(plugin_id);
                        var nodeRatingValueForColor = '';
                        if (nodeRatingValue != 'NA') {
                            nodeRatingValueForColor = nodeRatingValue + 5;
                            nodeRatingValue = nodeRatingValue.toFixed(2);
                            nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
                        }
                        var pluginItemRating = $('<div/>', { class: 'node_plugin_item_rating float_left ' }).html(nodeRatingValue);
                        if (nodeRatingValue == 'NA') {
                            pluginItemRating.addClass('na_class');
                        } else {
                            pluginItemRating.css("background-color", nodeRatingValueForColor);
                        }
                        if (historyManager.get('currentContext') != 'files') {
                            pluginItem.append(pluginItemRating);
                        }
                    }
                    if (nodeSummaryDataItem.showValue) {
                        var nodeDataValue = getNodeValue(plugin_id);
                        var pluginItemValue = $('<div/>', { class: 'node_plugin_item_value float_left color_medium' }).html(e.format.numberFormat(nodeDataValue) + " ");
                        pluginItem.append(pluginItemValue);
                    }
                    var pluginItemLabel = $('<div/>', { class: 'node_plugin_item_label float_left color_medium ' }).html(nodeSummaryDataItem.labelText);
                    pluginItem.append(pluginItemLabel);
                    if (!nodeSummaryDataItem.showLabel) {
                        pluginItemLabel.addClass('hide');
                    }

                    if (nodeSummaryDataItem.hasPopover) {
                        addPopovercontent(pluginItem);
                    } else {
                        pluginItem.attr("title", nodeSummaryDataItem.tooltipText)
                    }
                    pluginItem.attr('plugin_data-id', plugins[i].id).attr('plugin_data-name', plugins[i].name);

                    if (node_summary_bar.find('.' + plugin_group).length > 0) {
                        var plugin_separator = $('<div/>', { class: 'plugin_separator float_left stroke_left stroke_light ' });

                        if( plugins[i].id == "commit_history" ){

                            let repoPREnable = false;
                            let repoREEnable = false;

                            repoPREnable  = historyManager.get('currentRepoMetaData').prEnable;
                            repoREEnable  = historyManager.get('currentRepoMetaData').reEnable;

                            if (((g.enablePRScan == true || g.enablePRScan == 'true') && repoPREnable) || (repoREEnable && (g.enableREScan == true || g.enableREScan == 'true'))) {
                                node_summary_bar.find('.' + plugin_group).append(plugin_separator);
                                node_summary_bar.find('.' + plugin_group).append(pluginItem);
                            }
                        } else {
                            node_summary_bar.find('.' + plugin_group).append(plugin_separator);
                            node_summary_bar.find('.' + plugin_group).append(pluginItem);
                        }
                    } else {
                        var plugin_group_item = $('<div/>', { class: 'plugin_group float_left stroke_left stroke_medium ' + plugin_group });
                        node_summary_bar.append(plugin_group_item);
                        plugin_group_item.append(pluginItem);
                    }
                    if (plugin_id == history_plugin.id) {
                        node_summary_bar.find("#" + plugin_id).addClass('selected_node_plugin');
                    }
                }
            }

        }
        addTagIcon(node_summary_bar);
        setTimeout(function() {
            manipulatePLuginSelection(node_summary_bar);
            //handleEvents();
        }, 100);
        plugin_selector.append(node_summary_bar);


    }

    function addBrittleness(node_summary_bar) {

        var pluginItem = $('<a/>', { class: 'node_plugin_item float_left component_not_clickable', id: 'node_risk' });

        /*var pluginItemIcon = $('<div/>', { class: 'node_plugin_item_icon float_left color_dark tag_click ic-tags' });
        pluginItem.append(pluginItemIcon);*/
        var pluginItemLabel = $('<div/>', { class: 'node_plugin_item_label float_left color_medium ' }).html(i18next.t('component_list.risk'));
        var pluginItemRisk = $('<div/>', { class: 'node_plugin_item_risk float_left p' });

        var riskBackground = $('<span/>', { class: 'node_plugin_item_risk_background float_left p' });
        var riskText = $('<span/>', { class: 'node_plugin_item_risk_text float_left p' }).html(componentSummary.risk);
        if (componentSummary.risk == 'NA') {
            riskBackground.addClass('fill_light');
            riskText.css('color', '#3b434c');
        } else {
            riskBackground.css({ 'background-color': '#0066b1', 'opacity': (parseInt(componentSummary.risk) * 2) / 10 });
        }

        pluginItemRisk.append(riskBackground, riskText);
        pluginItem.append(pluginItemLabel, pluginItemRisk);

        var plugin_group_item = $('<div/>', { class: 'plugin_group float_left stroke_left stroke_medium risk_group', title: 'Risk' });
        node_summary_bar.prepend(plugin_group_item);
        plugin_group_item.append(pluginItem);
        if (componentSummary.synopsis != '') {
            addRiskTooltip($.parseJSON(componentSummary.synopsis), plugin_group_item);
        } else {
            pluginItem.css('pointer-events', 'none');
        }
    }

    function addTagIcon(node_summary_bar) {
        var pluginItem = $('<a/>', { class: 'node_plugin_item float_left ', id: 'node_tagging' });

        var pluginItemIcon = $('<div/>', { class: 'node_plugin_item_icon float_left color_dark tag_click ic-tags' });
        pluginItem.append(pluginItemIcon);
        var pluginItemLabel = $('<div/>', { class: 'node_plugin_item_label float_left color_medium ' }).html("Tags");
        pluginItem.append(pluginItemLabel);
        if (!nodeSummaryplugins.node_tagging.showLabel) {
            pluginItemLabel.addClass('hide');
        }
        var plugin_group_item = $('<div/>', { class: 'plugin_group float_left stroke_left stroke_medium tagging_group' });
        if (historyManager.get('currentContext') != 'files') {
            node_summary_bar.append(plugin_group_item);
        }
        plugin_group_item.append(pluginItem);
    }

    function addTagsData() {
        var popoverId = "node_tagging";
        var popoverContent = $('<div/>', { class: 'popover_content ' + popoverId + '_popover' });

        addTagContentData(popoverContent);
        $("#node_tagging").webuiPopover('destroy');
        //$("#node_tagging").append(nodeItemTags);
        $("#node_tagging").webuiPopover({
            content: popoverContent,
            placement: "bottom-left",
            trigger: 'hover',
            animation: 'pop',
            onShow: function($element) {
                $(".webui-popover-title").remove();
                popoverOnShow($element, popoverId);
            }
        });
    }

    function addTagContentData(popoverContent) {
        popoverContent.html('');
        var tagsDataToGet;
        if (historyManager.get('currentContext') != 'components' && historyManager.get('currentContext') != 'systems' && historyManager.get('currentContext') != 'root' && nodeSummary) {
            tagsDataToGet = nodeSummary.tags_data;
        } else if (historyManager.get('currentContext') == 'components') {
            tagsDataToGet = componentSummary.tags_data;
        }
        var tagsData = _.pluck(tagsDataToGet, "allocated_tags");

        var itemIcon = $('<div/>', { class: 'popover_title_icon ic-tags' });

        var popoverTitle = $('<div/>', { class: 'popover_title' });
        var popoverMainContent = $('<div/>', { class: 'popover_main_content stroke_top stroke_light ' });

        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Tags");

        var coloredTags = $('<div/>', { class: 'colored_tags' });
        $("#node_tagging").find('.colored_tags').remove();
        var nodeItemTags = $('<div/>', { class: 'colored_tags' }).html('');
        popoverTitle.append(itemIcon, itemTitle, coloredTags);
        popoverContent.append(popoverTitle);

        var contentItem, contentItemLabel, contentItemTagColor, contentItemLabelDetail, coloredItem, coloredItemNodeBar;
        var tempTagArr, tempTagName, tempTagColor;
        var tagLeftPos = 0,
            tagLeftPosNode = 0;
        for (var i = 0; i < tagsData.length; i++) {
            if (tagsData[i].length) {
                tempTagArr = tagsData[i].split(":");
                tempTagName = tempTagArr[1];
                tempTagColor = tempTagArr[2];
                contentItem = $('<div/>', { class: 'popover_content_item' });
                contentItemLabel = $('<div/>', { class: 'popover_content_item_label' });
                contentItemTagColor = $('<span/>', { class: 'tag_color' }).css("background-color", tempTagColor);
                if (i < 5) {
                    coloredItem = $('<span/>', { class: 'colored_tag_item' }).css({ "background-color": tempTagColor, "left": "-" + tagLeftPos + "em", "z-index": tagsData.length - tagLeftPos });
                    coloredItemNodeBar = $('<span/>', { class: 'colored_tag_item' }).css({ "background-color": tempTagColor, "left": "-" + tagLeftPosNode + "em", "z-index": tagsData.length - tagLeftPos });
                    coloredTags.css("right", "-" + tagLeftPos + "em");
                    // nodeItemTags.css("left","-"+(tagLeftPos-0.5)+"em");
                }
                contentItemLabelDetail = $('<div/>', { class: 'popover_content_item_desc float_left' }).html(tempTagName);
                contentItemLabel.append(contentItemTagColor, contentItemLabelDetail)
                contentItem.append(contentItemLabel);
                popoverMainContent.append(contentItem);
                nodeItemTags.append(coloredItemNodeBar);
                coloredTags.append(coloredItem);
                tagLeftPos++;
                tagLeftPosNode += 0.75;
            }
        }
        var addTagButton = $('<a/>', { class: 'manage_tag_button button_primary' }).html("MANAGE TAGS");
        popoverMainContent.append(addTagButton);

        popoverContent.append(popoverMainContent);
    }

    function addRiskTooltip(relevence_data, selector) {
        var contentItem, contentItemLabel, contentItemValue;
        var issue_icon_json = {
            "blocker": "ic-issue-blocker",
            "major": "ic-issue-major",
            "critical": "ic-issue-critical",
            "minor": "ic-issue-minor",
            "trivial": "ic-arrow-down-filled"
        };

        var popoverContent = $('<div/>', { class: 'popover_content' });
        if (relevence_data.commits) {
            contentItem = $('<div/>', { class: 'popover_content_item' });
            contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html(i18next.t('component_list.commits'));
            contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(relevence_data.commits);
            contentItem.append(contentItemLabel, contentItemValue);
            popoverContent.append(contentItem);
        }

        if (relevence_data.last_commit) {
            contentItem = $('<div/>', { class: 'popover_content_item last_commit' });
            contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html(i18next.t('component_list.last_commit'));
            contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(g.difference(Date.parse(new Date()), Date.parse(relevence_data.last_commit)));
            contentItem.append(contentItemLabel, contentItemValue);
            popoverContent.append(contentItem);
        }

        var non_zero = false;
        if (relevence_data.changes_for_bugs.length) {
            _.each(relevence_data.changes_for_bugs, function(value, key) {
                _.each(value, function(object_val, object_key) {
                    if (parseInt(object_val) > 0) {
                        non_zero = true;
                    }
                });
            });
        }
        if (relevence_data.changes_for_bugs.length && non_zero) {
            var popoverChangesContent = $('<div/>', { class: 'popover_change_content stroke_top stroke_light' });
            _.each(relevence_data.changes_for_bugs, function(value, key) {
                _.each(value, function(object_val, object_key) {
                    if (parseInt(object_val) > 0) {
                        contentItem = $('<div/>', { class: 'popover_content_item change_for_logs' });
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label' });
                        var item_icon = $('<div/>', { class: 'item_icon float_left ' + issue_icon_json[object_key.toLowerCase()] + ' issue_' + object_key.toLowerCase() });
                        var code_issues_label = $('<div/>', { class: 'code_issues_label float_left' }).html(i18next.t("task_list." + object_key));
                        contentItemLabel.append(item_icon, code_issues_label);
                        contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(object_val));
                        contentItem.append(contentItemLabel, contentItemValue);
                        popoverChangesContent.append(contentItem);
                    }
                });
            });
            popoverContent.append(popoverChangesContent);
        }
        selector.webuiPopover({
            content: popoverContent,
            placement: "bottom-right",
            trigger: 'hover',
            animation: 'pop',
            style: 'item-tooltip',
            onShow: function() {
                $(".webui-popover-title").remove();
            }
        });
    }


    function manipulatePLuginSelection(node_summary_bar) {
        var otherWidths = $('.left-menu-bar').width() + $('.tree-panel-container').width();
        var pluginItem;
        var node_bar_width = $('.node_summary_bar').width();
        var total_width = $(window).width() - otherWidths;
        if (node_bar_width > total_width) {
            pluginItem = $('<div/>', { class: 'node_plugin_item float_left more_plugin_items' });
            var plugin_group = $('<div/>', { class: 'plugin_group float_left stroke_left stroke_medium ' });

            if (!$('.more_plugin_items').length) {
                node_summary_bar.append(plugin_group);
            }
            plugin_group.append(pluginItem);
            var popoverContent;
            if ((!$('.popover_content_more').length || !$('.more_plugin_items').length) && !moreItemEnabled) {
                popoverContent = $('<div/>', { class: 'popover_content popover_content_more ' });
                moreItemEnabled = true;
            } else {
                popoverContent = $('.popover_content_more');
            }
            var pluginItemIcon = $('<div/>', { class: 'node_plugin_item_icon float_left ic-more-filled' });
            pluginItem.append(pluginItemIcon);

            $.each($(".node_summary_bar .plugin_group"), function() {
                if ($('.node_summary_bar').width() > $(window).width() - otherWidths) {
                    popoverInnerContent.prepend($(".node_summary_bar .plugin_group:nth-last-child(2)").clone());
                    $(".node_summary_bar .plugin_group:nth-last-child(2)").remove();
                }
            });
            popoverContent.html(popoverInnerContent);
            pluginItem.webuiPopover('destroy').webuiPopover({ content: popoverContent, placement: "bottom-left", trigger: 'hover', animation: 'pop' }).on("shown.webui.popover", function() {

                var tagRightPos = 0;
                $('.popover_content_more .colored_tags .colored_tag_item').each(function() {
                    tagRightPos += 0.25
                })
                if (tagRightPos != 0.25) {
                    $('.popover_content_more .colored_tags').css("right", "-" + tagRightPos + "em");
                }
            });

            var tempContent = popoverInnerContent.clone();
            $('#plugin_selector .popover_inner_content').remove();
            $('#plugin_selector').append(tempContent);
        } else if ($('.node_summary_bar').width() < $(window).width() - otherWidths) {
            var counter = 0;
            var totalItem = popoverInnerContent.find('.plugin_group').length;
            popoverInnerContent.find('.plugin_group').each(function() {
                if (getPluginItemWidth()) {
                    counter++;
                    node_summary_bar.find('.more_plugin_items').parent().before(popoverInnerContent.find($(this)));
                } else {
                    return false;
                }
            });
            if (counter == totalItem) {
                $(".node_summary_bar .more_plugin_items").parent().remove();
                addTagsData();
            }
            $('.plugin_group .node_plugin_item:not(.more_plugin_items)').each(function() {
                if (!nodeSummaryplugins[$(this).attr('id')]['hasPopover']) {
                    $(this).attr('title', nodeSummaryplugins[$(this).attr('id')]['tooltipText']);
                }
            });
            $('.plugin_group .node_plugin_item:not(.more_plugin_items)[title]').tooltipster();
        }
    }

    function getPluginItemWidth() {
        var elementWidth = 0,
            itemId = "",
            item;
        $('#plugin_selector .popover_inner_content .node_plugin_item').each(function() {
            itemId = "";
            item = $(this);
            itemId = item.prop("id");
            if (nodeSummaryplugins[itemId].showIcon) {
                elementWidth += item.find('.node_plugin_item_icon').outerWidth();
            }
            if (nodeSummaryplugins[itemId].showRating) {
                elementWidth += item.find('.node_plugin_item_rating').outerWidth();
            }
            if (nodeSummaryplugins[itemId].showValue) {
                elementWidth += item.find('.node_plugin_item_value').outerWidth();
            }
            if (nodeSummaryplugins[itemId].showLabel) {
                elementWidth += item.find('.node_plugin_item_label').outerWidth();
            }
        });
        var avaliableWidth = $(".emulsion_panel").width() - $(".node_summary_bar").width();
        if (elementWidth < avaliableWidth) {
            return true;
        } else {
            return false;
        }
    }

    function getNodeValue(plugin_id) {
        var nodeValue = 0;
        switch (plugin_id) {
            case "issues":
                if (historyManager.get('currentContext') == 'components') {
                    nodeValue = parseInt(componentSummary.issues);
                } else if (historyManager.get('currentContext') == 'files') {
                    nodeValue = parseInt(fileSummary.issues);
                } else {
                    nodeValue = parseInt(nodeSummary.issues);
                }
                break;
            case "unit_tests":
                if (historyManager.get('currentContext') == 'components') {
                    nodeValue = parseInt(componentSummary.unit_tests);
                } else {
                    nodeValue = parseInt(nodeSummary.unit_tests);
                }
                break;
            case "code_issues_details":
                if (historyManager.get('currentContext') == 'components') {
                    nodeValue = parseInt(componentSummary.code_issues_count);
                } else if (historyManager.get('currentContext') == 'files') {
                    nodeValue = parseInt(fileSummary.code_issues_count);
                } else {
                    nodeValue = parseInt(nodeSummary.code_issues_count);
                }
                break;
            case "design_issue_details":

                if (historyManager.get('currentContext') == 'components') {
                    nodeValue = (componentSummary.antipatterns.filter(d => d.classification == 'COMPONENTS')).length //parseInt(componentSummary.design_issues_count);
                } else {
                    nodeValue = parseInt(nodeSummary.design_issues_count);
                }
                break;
            case "metrics_details":
                var nodeValueArray = [];

                if (historyManager.get('currentContext') == 'components') {
                    nodeValue = 0;
                    _.map(_.filter(componentSummary.metrics, function(item) {
                        return _.indexOf(g.metrics_list, item.metricName) != -1;
                    }), function(num) {
                        if (num.value > num.threshold) {
                            nodeValue++;
                        }
                    });
                } else {
                    var metrics_array = g.metrics_list;
                    nodeValueArray = _.pluck(((nodeSummary.metrics).filter(d => metrics_array.indexOf(d.type) > -1)), 'value');
                    _.map(nodeValueArray, function(num) {
                        nodeValue += parseInt(num);
                    });
                }
                break;
            case "duplication_details":

                if (historyManager.get('currentContext') == 'components') {
                    /* if(componentSummary.duplication.duplicate_loc != ''){
					nodeValue=parseInt(componentSummary.duplication.duplicate_loc)/parseInt(componentSummary.loc_details.total_loc)*100;
					if (nodeValue > 100)	{
						nodeValue = 100;
					}
					nodeValue=nodeValue.toFixed(2)+"%";
				}else{
					nodeValue=0;
                } */
                    if (parseInt(componentSummary.duplicationPercentage)) {
                        nodeValue = componentSummary.duplicationPercentage;
                        nodeValue = nodeValue + "%";
                    } else {
                        nodeValue = 0;
                    }
                } else if (parseInt(nodeSummary.duplication)) {
                    /* nodeValue = parseInt(nodeSummary.duplicate_loc) / parseInt(nodeSummary.statistics.total_loc)*100;
				if (nodeValue > 100)	{
					nodeValue = 100;
                } */
                    nodeValue = nodeSummary.duplication;
                    nodeValue = nodeValue + "%";
                } else {
                    nodeValue = 0;
                }
                break;
            case "hotspot_distribution":
                nodeValue = parseInt(nodeSummary.hotspot_count);
                break;
            default:
                break;
        }
        return nodeValue;
    }

    function getNodeRating(plugin_id) {
        var nodeRating;
        //if (historyManager.get('currentContext') != 'components'){
        switch (plugin_id) {
            case "repository_overview":
                nodeRating = (historyManager.get('currentContext') != 'components') ? nodeSummary.ratings["overallRating"] : componentSummary.ratings["overallRating"];
                break;
            case "code_issues_details":
                nodeRating = (historyManager.get('currentContext') != 'components') ? nodeSummary.ratings["codeQualityRating"] : componentSummary.ratings["codeQualityRating"]; //_.pluck(_.where(nodeSummary.ratings, {rating: "codeQualityRating"}), "rating_value");
                break;
            case "design_issue_details":
                nodeRating = (historyManager.get('currentContext') != 'components') ? nodeSummary.ratings["antiPatternRating"] : componentSummary.ratings["antiPatternRating"]; //_.pluck(_.where(nodeSummary.ratings, {rating: "antiPatternRating"}), 'rating_value');
                break;
            case "metrics_details":
                nodeRating = (historyManager.get('currentContext') != 'components') ? nodeSummary.ratings["metricRating"] : componentSummary.ratings["metricRating"]; //_.pluck(_.where(nodeSummary.ratings, {rating: "metricRating"}), 'rating_value');
                break;
            case "duplication_details":
                nodeRating = (historyManager.get('currentContext') != 'components') ? nodeSummary.ratings["cloneRating"] : componentSummary.ratings["cloneRating"]; //_.pluck(_.where(nodeSummary.ratings, {rating: "cloneRating"}), 'rating_value');
                break;
            default:
                break;
        }
        /* }else{
        	switch(plugin_id){
        	case "repository_overview":
        		nodeRating=_.filter(componentSummary.rating, function(item){
        			return item.name=='overallRating';
        		})[0].rating-5;
        		break;
        	case "code_issues_details":
        		nodeRating=_.filter(componentSummary.rating, function(item){
        			return item.name=='codeQualityRating';
        		})[0].rating-5;
        		break;
        	case "design_issue_details":
        		nodeRating=_.filter(componentSummary.rating, function(item){
        			return item.name=='antiPatternRating';
        		})[0].rating-5;
        		break;
        	case "metrics_details":
        		nodeRating=_.filter(componentSummary.rating, function(item){
        			return item.name=='metricRating';
        		})[0].rating-5;
        		break;
        	case "duplication_details":
        		nodeRating=_.filter(componentSummary.rating, function(item){
        			return item.name=='cloneRating';
        		})[0].rating-5;
        		break;
        	default:
        		break;
        	}
        } */
        nodeRating = (nodeRating == -99 || nodeRating == undefined) ? 'NA' : parseFloat(nodeRating);
        return nodeRating;
    }

    function addPopovercontent(holder) {
        var popoverId = holder.attr('id');
        var popoverContent = $('<div/>', { class: 'popover_content ' + popoverId + '_popover' });
        var popoverTitle = $('<div/>', { class: 'popover_title' });
        var popoverMainContent = $('<div/>', { class: 'popover_main_content stroke_top stroke_light ' });
        popoverContent.append(popoverTitle, popoverMainContent);
        switch (popoverId) {
            case "repository_overview":
                if (historyManager.get('currentContext') == 'components') {
                    getRepositoryContent(popoverContent, popoverId);
                }
                break;
            case "code_issues_details":
                getCodeIssuesContent(popoverContent, popoverId);
                break;
            case "design_issue_details":
                getDesignIssuesContent(popoverContent, popoverId);
                break;
            case "metrics_details":
                getMetricsContent(popoverContent, popoverId);
                break;
            case "duplication_details":
                getDuplicationContent(popoverContent, popoverId);
                break;
            case "hotspot_distribution":
                getHotspotContent(popoverContent, popoverId);
                break;
            case "component_list":
                getComponentListContent(popoverContent, popoverId);
                break;
            default:
                break;
        }

        holder.webuiPopover({
            content: popoverContent,
            placement: "bottom-right",
            trigger: 'hover',
            animation: 'pop',
            "context": popoverId,
            onShow: function($element) {
                popoverTimer = setTimeout(() => {
                    popoverOnShow($element, popoverId);
                }, 300);
            },
            onHide: function() {
                clearTimeout(popoverTimer);
            }
        });

    }

    function popoverOnShow($element, popoverId) {
        if (historyManager.get('currentContext') != 'components' && historyManager.get('currentContext') != 'files') {
            try {
                var loading_wrapper;
                var popoverTempId = $element['0'].id;
                //if ($('#' + popoverTempId).find('.loading_wrapper').length>0){
                loading_wrapper = $('<div />', { class: 'loading_wrapper' });
                var loadingDiv = $('<div />', { class: 'loading' });
                loading_wrapper.append(loadingDiv);
                $('#' + popoverTempId + ' .webui-popover-content ').append(loading_wrapper);
                loading_wrapper.show();

                function renderPopoverData(data, status) {
                    loading_wrapper.remove();
                    if (status == 'success') {
                        var popover_content_selector = $('#' + popoverTempId + ' .webui-popover-content .popover_content');

                        switch (popoverId) {
                            case "repository_overview":
                                if (nodeSummary.statistics.loc == undefined && nodeSummary.statistics.components == undefined) {
                                    nodeSummary.statistics.total_loc = data.total_loc;
                                    nodeSummary.statistics.loc = data.loc;
                                    nodeSummary.statistics.components = data.components;
                                    getRepositoryContent(popover_content_selector, popoverId);
                                }
                                break;
                            case "code_issues_details":
                                if (!nodeSummary.code_issues_severity.length) {
                                    nodeSummary.code_issues_severity = data.codeIssues;
                                    getCodeIssuesContent(popover_content_selector, popoverId);
                                }
                                break;
                            case "component_list":
                                getComponentListContent(popover_content_selector, popoverId);
                                break;
                            case "design_issue_details":
                                if (!nodeSummary.design_issues.length) {
                                    nodeSummary.design_issues = data.designIssues;
                                    getDesignIssuesContent(popover_content_selector, popoverId);
                                }
                                break;
                            case "metrics_details":
                                if (!nodeSummary.metrics.length) {
                                    nodeSummary.metrics = data.metricViolations;
                                    getMetricsContent(popover_content_selector, popoverId);
                                }
                                break;
                            case "duplication_details":
                                if (nodeSummary.clones == null && nodeSummary.occurences == null) {
                                    nodeSummary.duplicateLoc = data.duplicate_loc;
                                    nodeSummary.clones = data.clones;
                                    nodeSummary.occurences = data.occurences;
                                    getDuplicationContent(popover_content_selector, popoverId);
                                }
                                break;
                            case "hotspot_distribution":
                                if (!nodeSummary.hotspot.length) {
                                    nodeSummary.hotspot = data.hotspots;
                                    getHotspotContent(popover_content_selector, popoverId);
                                }
                                break;
                            case "node_tagging":
                                if (!nodeSummary.tags_data.length) {
                                    nodeSummary.tags_data = data;
                                    addTagContentData(popover_content_selector);
                                }
                                break;
                            default:
                                break;
                        }

                        if (data.hasOwnProperty("message")) {
                            hasError = true;
                            g.sendErrorNotification(data, PATH_ACTIVELANGUAGE, $('.plugin_nodeSummary'));
                        } else {
                            hasError = false;

                        }
                        //e.notify('LOAD_ISSUES_ON_REFRESH');
                    } else if (status == 'error') {
                        hasError = true;
                        g.sendErrorNotification(data, PATH_ACTIVELANGUAGE, $('.plugin_nodeSummary'));
                        //e.notify(e.notifications.DATA_LOADED);
                    }
                }
                var settings = {
                    repositoryId: historyManager.get('currentSubSystem'),
                    nodeId: historyManager.get('currentBreadcrumb').id,
                    snapshotId: historyManager.get('selectedSnapshots')[0].id
                };
                switch (popoverId) {
                    case "repository_overview":
                        if (nodeSummary.statistics.loc == undefined && nodeSummary.statistics.components == undefined) {
                            e.loadJSON(`/views/repositories/${historyManager.get('currentSubSystemUid')}/summary/locandcomponents`, renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }
                        break;
                    case "code_issues_details":
                        if (!nodeSummary.code_issues_severity.length) {
                            e.loadJSON(`/repositories/${historyManager.get('currentSubSystemUid')}/codeissues`, renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }
                        break;
                    case "design_issue_details":
                        if (!nodeSummary.design_issues.length) {
                            e.loadJSON(`/repositories/${historyManager.get('currentSubSystemUid')}/designissues`, renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }
                        break;
                    case "metrics_details":
                        if (!nodeSummary.metrics.length) {
                            e.loadJSON(`/repositories/${historyManager.get('currentSubSystemUid')}/metrics/violations`, renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }
                        break;
                    case "duplication_details":
                        if (nodeSummary.clones == null && nodeSummary.occurences == null) {
                            e.loadJSON(`/repositories/${historyManager.get('currentSubSystemUid')}/duplication`, renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }
                        break;
                    case "hotspot_distribution":
                        if (!nodeSummary.hotspot.length) {
                            e.loadJSON(`/repositories/${historyManager.get('currentSubSystemUid')}/hotspots`, renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }
                        break;
                    case "node_tagging":
                        if (!nodeSummary.tags_data.length) {
                            e.loadJSON('/tags/tagcategories/tagdetails', renderPopoverData, settings, true);
                        } else {
                            loading_wrapper.remove();
                        }

                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error("failed to set popover contents : " + error);
            }
        }
    }

    function getRatingTitle(popoverId) {
        return nodeSummaryplugins[popoverId].tooltipText;
    }

    function getRepositoryContent(holder, popoverId) {
        var nodeNameTextMaxLenth = 30;
        var nodeNameText = historyManager.get('currentBreadcrumb').name;
        if (nodeNameText.length > nodeNameTextMaxLenth) {
            var nodeNameTextTemp = "...";
            nodeNameTextTemp += nodeNameText.substring((nodeNameText.length - nodeNameTextMaxLenth), nodeNameText.length);
            nodeNameText = nodeNameTextTemp;
        }
        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html('Overall rating');
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').html('');

        var nodeRatingValue = getNodeRating(popoverId);
        var nodeRatingValueForColor = '';
        if (nodeRatingValue != 'NA') {
            nodeRatingValueForColor = nodeRatingValue + 5;
            nodeRatingValue = nodeRatingValue.toFixed(2);
            nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
        }
        var pluginItemRating = $('<div/>', { class: 'popover_title_rating float_right ', title: getRatingTitle(popoverId) }).html(nodeRatingValue);
        if (nodeRatingValue == 'NA') {
            pluginItemRating.addClass('na_class');
        } else {
            pluginItemRating.css("background-color", nodeRatingValueForColor);
        }
        popoverTitle.append( /*itemIcon,*/ itemTitle, pluginItemRating);

        var contentItem, contentItemLabel, contentItemValue;
        contentItem = $('<div/>', { class: 'popover_content_item' });
        contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html("Total LOC:");
        contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(nodeSummary['statistics']['total_loc']));
        contentItem.append(contentItemLabel, contentItemValue);
        popoverMainContent.append(contentItem);

        contentItem = $('<div/>', { class: 'popover_content_item' });
        contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html("Executable LOC:");
        contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(nodeSummary['statistics']['loc']));
        contentItem.append(contentItemLabel, contentItemValue);
        popoverMainContent.append(contentItem);

        contentItem = $('<div/>', { class: 'popover_content_item' });
        contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html("Components:");;
        contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(nodeSummary['statistics']['components']));
        contentItem.append(contentItemLabel, contentItemValue);
        popoverMainContent.append(contentItem);
    }

    function getDesignIssuesContent(holder, popoverId) {
        var itemIcon = $('<div/>', { class: 'popover_title_icon ' + nodeSummaryplugins[popoverId].pluginIcon });

        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Design Issues");
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').html('');

        var nodeRatingValue = getNodeRating(popoverId);
        var nodeRatingValueForColor = '';
        if (nodeRatingValue != 'NA') {
            nodeRatingValueForColor = nodeRatingValue + 5;
            nodeRatingValue = nodeRatingValue.toFixed(2);
            nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
        }
        var pluginItemRating = $('<div/>', { class: 'popover_title_rating float_right ', title: getRatingTitle(popoverId) }).html(nodeRatingValue);
        if (nodeRatingValue == 'NA') {
            pluginItemRating.addClass('na_class');
        } else {
            pluginItemRating.css("background-color", nodeRatingValueForColor);
        }
        popoverTitle.append(itemIcon, itemTitle, pluginItemRating);

        var contentItem, contentItemLabel, contentItemValue;
        contentItem = $('<div/>', { class: 'popover_content_item popover_content_item_title' });
        contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html('Component Level');
        var designArray = [],
            totalDesignIssue = 0;
        if (historyManager.get('currentContext') == 'components') {
            totalDesignIssue = (componentSummary.antipatterns.filter(d => d.classification == 'COMPONENTS')).length; //componentSummary.design_issues_count;
        } else {
            designArray = _.pluck(nodeSummary.design_issues, 'value');
            _.map(designArray, function(num) {
                if (num) {
                    totalDesignIssue += parseInt(num);
                }
            });
        }
        contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(totalDesignIssue));
        contentItem.append(contentItemLabel, contentItemValue);
        var contentItemLabelDetail;
        popoverMainContent.append(contentItem);
        if (historyManager.get('currentContext') != 'components') {
            for (var i = 0; i < nodeSummary['design_issues'].length; i++) {
                contentItem = $('<div/>', { class: 'popover_content_item' });
                contentItem.attr('data-ruletypeid', nodeSummary['design_issues'][i]['id']);
                contentItemLabel = $('<div/>', { class: 'popover_content_item_label anti_pattern' });
                let triangle_left = $('<div/>', { class: 'triangle_left float_left' });
                let square_middle = $('<div/>', { class: 'square_middle float_left text_allign_center note semibold color_base' }).html(nodeSummary['design_issues'][i]['category']);
                let triangle_right = $('<div/>', {
                    class: 'triangle_right float_left'
                });
                contentItemLabel.append(triangle_left, square_middle, triangle_right);
                contentItemLabelDetail = $('<div/>', { class: 'popover_content_item_desc float_left' }).html(i18next.t("node_summary." + nodeSummary['design_issues'][i]['category']));
                contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(nodeSummary['design_issues'][i]['value']));
                contentItem.append(contentItemLabel, contentItemLabelDetail, contentItemValue);
                popoverMainContent.append(contentItem);
            }
            // Adding subcomponent level design issue count
            if (nodeSummary.subcomponent_design_issues_count) {
                contentItem = $('<div/>', { class: 'popover_content_item popover_content_item_title' });
                contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html('Subcomponent Level');
                contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(nodeSummary.subcomponent_design_issues_count));
                contentItem.append(contentItemLabel, contentItemValue);
                popoverMainContent.append(contentItem);
            }

        } else {
            var component_design_issues_unique = _.uniq(componentSummary['antipatterns'], function(item) {
                return item.name;
            });

            _.each(component_design_issues_unique, function(item) {
                /* var itemCount =(_.countBy(componentSummary['antipatterns'], function(innerItem) {
                	return innerItem.name==item.name;
                })).true; */
                if (item.classification == 'COMPONENTS') {
                    contentItem = $('<div/>', { class: 'popover_content_item' /* , title: g.formatSynopsys(item.synopsis) */ });
                    contentItemLabel = $('<div/>', { class: 'popover_content_item_label anti_pattern' });
                    let triangle_left = $('<div/>', {
                        class: 'triangle_left float_left'
                    });
                    let square_middle = $('<div/>', {
                        class: 'square_middle float_left text_allign_center note semibold color_base'
                    }).html(item.category);
                    let triangle_right = $('<div/>', {
                        class: 'triangle_right float_left'
                    });
                    contentItemLabel.append(triangle_left, square_middle, triangle_right);
                    contentItemLabelDetail = $('<div/>', { class: 'popover_content_item_desc float_left' }).html(i18next.t("node_summary." + item.category));
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(item.value));
                    contentItem.append(contentItemLabel, contentItemLabelDetail, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            });
        }
    }

    function getCodeIssuesContent(holder, popoverId) {
        var itemIcon = $('<div/>', { class: 'popover_title_icon ' + nodeSummaryplugins[popoverId].pluginIcon });
        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Code Issues");
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').html('');
        popoverTitle.append(itemIcon, itemTitle);
        if (historyManager.get('currentContext') != 'files') {
            var nodeRatingValue = getNodeRating(popoverId);
            var nodeRatingValueForColor = '';
            if (nodeRatingValue != 'NA') {
                nodeRatingValueForColor = nodeRatingValue + 5;
                nodeRatingValue = nodeRatingValue.toFixed(2);
                nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
            }
            var pluginItemRating = $('<div/>', { class: 'popover_title_rating float_right ', title: getRatingTitle(popoverId) }).html(nodeRatingValue);
            if (nodeRatingValue == 'NA') {
                pluginItemRating.addClass('na_class');
            } else {
                pluginItemRating.css("background-color", nodeRatingValueForColor);
            }
            popoverTitle.append(pluginItemRating);
        }

        var contentItem, contentItemLabel, contentItemValue;
        if (historyManager.get('currentContext') == 'components') {
            var componentSummaryCodeIssues = componentSummary.code_issues;
            for (var i = 0; i < componentSummaryCodeIssues.length; i++) {
                if(componentSummaryCodeIssues[i].value > 0){
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    contentItemLabel = $('<div/>', { class: 'popover_content_item_label popover_code_issues' });
                    var filled_circle = $('<div/>', { class: 'filled_circle float_left' }).css("background-color", e.gradient.getCategoryColor('gradient_rating', componentSummaryCodeIssues[i].criticality));
                    var code_issues_label = $('<div/>', { class: 'code_issues_label float_left' }).html(i18next.t("node_summary." + componentSummaryCodeIssues[i].criticality));
                    contentItemLabel.append(filled_circle, code_issues_label);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(parseInt(componentSummaryCodeIssues[i].value)));
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            }
            if (_.isEmpty(componentSummaryCodeIssues)) {
                popoverMainContent.remove();
            }
        } else if (historyManager.get('currentContext') == 'files') {
            var componentSummaryCodeIssues = fileSummary.code_issues;
            for (var i = 0; i < componentSummaryCodeIssues.length; i++) {
                if(componentSummaryCodeIssues[i].value > 0){
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    contentItemLabel = $('<div/>', { class: 'popover_content_item_label popover_code_issues' });
                    var filled_circle = $('<div/>', { class: 'filled_circle float_left' }).css("background-color", e.gradient.getCategoryColor('gradient_rating', componentSummaryCodeIssues[i].criticality));
                    var code_issues_label = $('<div/>', { class: 'code_issues_label float_left' }).html(i18next.t("node_summary." + componentSummaryCodeIssues[i].criticality));
                    contentItemLabel.append(filled_circle, code_issues_label);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(parseInt(componentSummaryCodeIssues[i].value)));
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            }
            if (_.isEmpty(componentSummaryCodeIssues)) {
                popoverMainContent.remove();
            }
        } else {
            for (var i = 0; i < nodeSummary['code_issues_severity'].length; i++) {
                if(nodeSummary['code_issues_severity'][i]['value'] > 0){
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    contentItemLabel = $('<div/>', { class: 'popover_content_item_label popover_code_issues' });
                    var filled_circle = $('<div/>', { class: 'filled_circle float_left' }).css("background-color", e.gradient.getCategoryColor('gradient_rating', nodeSummary['code_issues_severity'][i]['criticality']));
                    var code_issues_label = $('<div/>', { class: 'code_issues_label float_left' }).html(nodeSummary['code_issues_severity'][i]['criticality']);
                    contentItemLabel.append(filled_circle, code_issues_label);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(parseInt(nodeSummary['code_issues_severity'][i]['value'])));
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            }
            // if(!nodeSummary['code_issues_severity'].length)
            //     popoverMainContent.remove();
        }
    }


    function getComponentListContent(holder, popoverId) {
        var itemIcon = $('<div/>', { class: 'popover_title_icon ' + nodeSummaryplugins[popoverId].pluginIcon });
        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Component List");
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').html('');

        var contentItem, contentItemLabel, contentItemIcon;
        popoverTitle.append(itemIcon, itemTitle);
        for (var i = 0; i < fileSummary.component_details.length; i++) {
            contentItem = $('<div/>', { class: 'popover_content_item' });
            contentItemIcon = $('<div/>', { class: 'content_item_icon ic-sq-component float_left' });
            contentItemLabel = $('<div/>', { class: 'popover_content_item_label float_left' }).html(fileSummary.component_details[i].displayname);
            contentItemLabel.attr({ 'data-id': fileSummary.component_details[i].id, 'data-type': fileSummary.component_details[i].kind, 'data-name': fileSummary.component_details[i].displayname, 'data-sig': fileSummary.component_details[i].signature, 'title': fileSummary.component_details[i].signature });
            contentItem.append(contentItemIcon, contentItemLabel);
            popoverMainContent.append(contentItem);
        }
    }


    function getMetricsContent(holder, popoverId) {

        var itemIcon = $('<div/>', { class: 'popover_title_icon ' + nodeSummaryplugins[popoverId].pluginIcon });

        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Metrics");
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').html('');
        popoverTitle.append(itemIcon, itemTitle);
        if (historyManager.get('currentContext') != 'files') {
            var nodeRatingValue = getNodeRating(popoverId);
            var nodeRatingValueForColor = '';
            if (nodeRatingValue != 'NA') {
                nodeRatingValueForColor = nodeRatingValue + 5;
                nodeRatingValue = nodeRatingValue.toFixed(2);
                nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
            }
            var pluginItemRating = $('<div/>', { class: 'popover_title_rating float_right ', title: getRatingTitle(popoverId) }).html(nodeRatingValue);
            if (nodeRatingValue == 'NA') {
                pluginItemRating.addClass('na_class');
            } else {
                pluginItemRating.css("background-color", nodeRatingValueForColor);
            }
            popoverTitle.append(pluginItemRating);
        }

        var contentItem, contentItemLabel, contentItemValue, contentItemTitle, contentItemLabelLink;

        var metricsArray = [],
            totalMetrics = 0;

        if (historyManager.get('currentContext') == 'components') {
            totalMetrics = 0;
            _.map(_.filter(componentSummary.metrics, function(item) {
                // .sortBy("name");
                return _.indexOf(g.metrics_list, item.metricName) != -1;

            }), function(num) {
                if (num.value > num.threshold) {
                    totalMetrics++;
                }
            });

            holder.find('.popover_main_content').addClass('component_metric_popover_main_content');
        } else if (historyManager.get('currentContext') == 'files') {
            totalMetrics = 0;
            _.map(_.filter(fileSummary.metrics, function(item) {
                return _.indexOf(g.metrics_list, item.metricName) != -1;
            }), function(num) {
                if (num.value > num.threshold) {
                    totalMetrics++;
                }
            });
        } else {
            var filter_array = (nodeSummary.metrics).filter(d => {
                return true;
            });
            metricsArray = _.pluck(_.filter(filter_array, function(item) {
                return _.indexOf(g.metrics_list, item.type) != -1;
            }), 'value');
            _.map(metricsArray, function(num) {
                if (num) {
                    totalMetrics += parseInt(num);
                }
            });
        }

        if (historyManager.get('currentContext') != 'files') {
            contentItemTitle = $('<div/>', { class: 'popover_content_item popover_content_item_title' });
            contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html('Component Level Violations');
            contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(totalMetrics));
            contentItemTitle.append(contentItemLabel, contentItemValue);
            popoverMainContent.append(contentItemTitle);
        }

        contentItem = $('<div/>', { class: 'popover_content_item popover_content_item_title metrics_popover_sub_main stroke_top stroke_light' });
        contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html('Critical Violations');

        contentItem.append(contentItemLabel);

        var d, sortMetricsArray;
        var decimalKeyToConvert = ["LCOM", "CR"],
            metricsValue = 0;
        if (historyManager.get('currentContext') == 'components') {
            popoverMainContent.append(contentItem);
            sortMetricsArray = _.sortBy(componentSummary.metrics, "type");
            contentItemLabel.html('Values');
            if (g.isPartialLanguage()){
				sortMetricsArray = _.filter(sortMetricsArray, function (item) {
					return _.lastIndexOf(_.intersection(partialMetricsList, _.pluck(sortMetricsArray, "metricName")), item.metricName) > -1;
				});
            }
            for (var i = 0; i < sortMetricsArray.length; i++) {
                d = sortMetricsArray[i];
                if (_.indexOf(g.metrics_list, d.metricName) != -1) {
                    metricsValue = 0;
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    if (decimalKeyToConvert.indexOf(d.metricName) >= 0) {
                        metricsValue = d.value;
                    } else {
                        metricsValue = e.format.numberFormat(Math.round(d.value));
                    }
                    if (d.metricName == 'NOS' || d.metricName == 'LOC_Comments') {
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label content_item', title: i18next.t('change_list.change_abbrivation.' + d.metricName) });
                    } else {
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label content_item', title: d.metricName });
                    }
                    contentItemLabelLink = $('<a/>', { class: 'popover_content_item_link', href: "https://help.mygamma.io/documentation/metrics/#" + g.application.metricsDetails.getMetricsURL(d.metricName), target: "_blank" }).html(i18next.t('change_list.title.' + d.metricName));
                    contentItemLabel.append(contentItemLabelLink);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light', title: "threshold :" + d.threshold }).html(metricsValue);

                    if (d.value > d.threshold) {
                        contentItemValue.addClass("metrics_violated");
                    }
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            }
        } else if (historyManager.get('currentContext') == 'files') {
            popoverMainContent.append(contentItem);
            contentItem.removeClass('stroke_top');
            contentItemLabel.html('Values');
            for (var i = 0; i < fileSummary.metrics.length; i++) {
                d = fileSummary.metrics[i];
                if (_.indexOf(g.metrics_list, d.metricName) != -1) {

                    metricsValue = 0;
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    if (decimalKeyToConvert.indexOf(d.metricName) >= 0) {
                        metricsValue = d.value;
                    } else {
                        metricsValue = e.format.numberFormat(Math.round(d.value));
                    }
                    if (d.metricName == 'NOS' || d.metricName == 'LOC_Comments') {
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label content_item', title: i18next.t('change_list.change_abbrivation.' + d.metricName) });
                    } else {
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label content_item', title: d.metricName });
                    }
                    contentItemLabelLink = $('<a/>', { class: 'popover_content_item_link', href: "https://help.mygamma.io/documentation/metrics/#" + g.application.metricsDetails.getMetricsURL(d.metricName), target: "_blank" }).html(i18next.t('change_list.title.' + d.metricName));
                    contentItemLabel.append(contentItemLabelLink);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(metricsValue);

                    if (d.value > d.threshold) {
                        contentItemValue.addClass("metrics_violated");
                    }
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            }
        } else {
            /* if (totalMetrics > 1) {
                popoverMainContent.append(contentItem);
            } */
            filter_array.forEach(dItem => {
                if (parseInt(dItem.value) != 0 && (_.indexOf(g.metrics_list, dItem.type) != -1)) {
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    if (dItem.type == 'NOS' || dItem.type == 'LOC_Comments') {
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label content_item', title: i18next.t('change_list.change_abbrivation.' + dItem.type) });
                    } else {
                        contentItemLabel = $('<div/>', { class: 'popover_content_item_label content_item', title: dItem.type });
                    }
                    contentItemLabelLink = $('<a/>', { class: 'popover_content_item_link', href: "https://help.mygamma.io/documentation/metrics/#" + g.application.metricsDetails.getMetricsURL(dItem.type), target: "_blank" }).html(i18next.t('change_list.title.' + dItem.type));
                    contentItemLabel.append(contentItemLabelLink);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(dItem.value));
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            });
        }
    }

    function getDuplicationContent(holder, popoverId) {
        var itemIcon = $('<div/>', { class: 'popover_title_icon ' + nodeSummaryplugins[popoverId].pluginIcon });

        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Duplication");
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').html('');

        var nodeRatingValue = getNodeRating(popoverId);
        var nodeRatingValueForColor = '';
        if (nodeRatingValue != 'NA') {
            nodeRatingValueForColor = nodeRatingValue + 5;
            nodeRatingValue = nodeRatingValue.toFixed(2);
            nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
        }
        var pluginItemRating = $('<div/>', { class: 'popover_title_rating float_right ', title: getRatingTitle(popoverId) }).html(nodeRatingValue);
        if (nodeRatingValue == 'NA') {
            pluginItemRating.addClass('na_class');
        } else {
            pluginItemRating.css("background-color", nodeRatingValueForColor);
        }
        popoverTitle.append(itemIcon, itemTitle, pluginItemRating);
        var percentage_value, itemToPick;
        if (historyManager.get('currentContext') == 'components') {
            percentage_value = componentSummary.duplicationPercentage; //(componentSummary.duplication.duplicate_loc) != '' ? e.math.round((componentSummary.duplication.duplicate_loc / componentSummary.loc_details.total_loc) * 100):0;
            itemToPick = componentSummary.duplication;
        } else {
            itemToPick = nodeSummary;
            percentage_value = nodeSummary.duplication; //(parseInt(nodeSummary.duplicate_loc))?e.math.round((nodeSummary.duplicate_loc / nodeSummary.statistics.total_loc) * 100):0;
        }
        /* if (percentage_value > 100)	{
        	percentage_value = 100;
        } */
        var duplication_graph = $('<div/>', { class: 'duplication_graph stroke_light stroke_top' }).html('');
        var duplication_graph_ring = new e.ringgraph({ width: 84, height: 84, bgring_thickness: 10, value_thickness: 10, holder: duplication_graph, value: percentage_value, showText: true, value_radius: 35, text_size: 22, rating_range: 'range_1', fill_color: 'none', value_colour: '#8f9a9e', bgring_colour: '#d5dadd', font_size: '12px', font_weight: 'bold', circumference: percentage_value });
        popoverMainContent.siblings('.duplication_graph').remove();
        popoverMainContent.before(duplication_graph);
        var contentItem, contentItemLabel, contentItemValue;
        if (historyManager.get('currentContext') == 'components') {}
        var duplication_pick_data = ["duplicateLoc", "clones", "occurences"],
            itemValue;
        $.each(duplication_pick_data, function(i, item) {
            itemValue = itemToPick[item];
            if (itemValue == "") {
                itemValue = 0;
            }
            contentItem = $('<div/>', { class: 'popover_content_item' });
            contentItemLabel = $('<div/>', { class: 'popover_content_item_label' }).html(i18next.t('node_summary.' + item));
            contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(itemValue));
            contentItem.append(contentItemLabel, contentItemValue);
            popoverMainContent.append(contentItem);
        });
    }

    function getHotspotContent(holder, popoverId) {
        var itemIcon = $('<div/>', { class: 'popover_title_icon ' + nodeSummaryplugins[popoverId].pluginIcon });

        var itemTitle = $('<div/>', { class: 'popover_title_label color_medium' }).html("Hotspots");
        var popoverTitle = holder.find('.popover_title').html('');
        var popoverMainContent = holder.find('.popover_main_content').show().html('');

        var nodeRatingValue = getNodeValue(popoverId);
        var pluginItemRating = $('<div/>', { class: 'popover_title_rating float_right fill_light popover_no_border', title: getRatingTitle(popoverId) }).html(nodeRatingValue);
        popoverTitle.append(itemIcon, itemTitle, pluginItemRating);

        var contentItem, contentItemLabel, contentItemValue;
        var hasData = false;
        for (var i = 0; i < nodeSummary['hotspot'].length; i++) {
            //if (nodeSummary['hotspot'][i]['category'] != 'notHotspots') {
                if (nodeSummary['hotspot'][i]['value']) {
                    hasData = true
                    contentItem = $('<div/>', { class: 'popover_content_item' });
                    contentItemLabel = $('<div/>', { class: 'popover_content_item_label popover_code_issues' });
                    var filled_circle = $('<div/>', { class: 'filled_circle float_left' }).css("background-color", e.gradient.getCategoryColor('gradient_rating', i18next.t("node_summary." + nodeSummary['hotspot'][i]['criticality'])));
                    var code_issues_label = $('<div/>', { class: 'code_issues_label float_left' }).html(i18next.t("node_summary." + nodeSummary['hotspot'][i]['criticality']));
                    contentItemLabel.append(filled_circle, code_issues_label);
                    contentItemValue = $('<div/>', { class: 'popover_content_item_value fill_light' }).html(e.format.numberFormat(nodeSummary['hotspot'][i]['value']));
                    contentItem.append(contentItemLabel, contentItemValue);
                    popoverMainContent.append(contentItem);
                }
            //}

        }
        if (!hasData) {
            popoverMainContent.hide();
        }
    }

    function handleEvents() {
        $(document).off('click', '.component_list_popover .popover_content_item_label');
        $(document).on('click', '.component_list_popover .popover_content_item_label', function() {
            historyManager.set('currentContext', 'components');
            g.setPluginHistory('component_explorer');
            historyManager.set('currentBreadcrumb', { "id": $(this).attr('data-id'), "name": $(this).attr('data-name') });

            e.notify(g.notifications.PLUGIN_UPDATE);
        });

        $(".more_plugin_items, .componentSummary .dashboard .node_plugin_item,componentSummary .issue_distribution .node_plugin_item").on('click', function(eve) {
            eve.stopImmediatePropagation();
        });
        $(".node_plugin_item:not(.component_not_clickable)").off("click");
        $(document).on('click', ".more_plugin_items", function(eve) {
            eve.stopImmediatePropagation();
        });
        $(document).on("click", "#node_tagging, .manage_tag_button", function(event) {
            if (($(this).attr("id") == "node_tagging" && $(this).hasClass('tooltipstered')) || $(this).hasClass('manage_tag_button')) {
                $("#node_tagging").webuiPopover('hide');
            } else {
                $(".more_plugin_items").webuiPopover('hide');
            }
            event.stopImmediatePropagation();
            event.stopPropagation();
            gamma.openTagPopup();
        });
        $(document).on('click', ".node_plugin_item:not(.component_not_clickable)", function() {
            $('.webui-popover').hide();
            historyManager.set('currentOldPlugin', historyManager.get('currentPlugin'));

            var previous_selection = $('.selected_node_plugin');
            var current_selction = $(this);
            previous_selection.removeClass('selected_node_plugin');
            current_selction.addClass('selected_node_plugin');

            //setting plugin history
            historyManager.set('currentPlugin', { 'id': $(this).attr('plugin_data-id'), 'name': $(this).attr('plugin_data-name') });
            if (historyManager.get('currentContext') == 'root' || historyManager.get('currentContext') == 'systems') {
                $('#breadcrumb').addClass('hide');
            } else {
                $('#breadcrumb').removeClass('hide');
            }
            gamma.loadPlugin((e.panelsManager.panels[0].panel).find('.content_holder'), historyManager.get('currentPlugin'), true);
            var current_plugin = historyManager.get('currentPlugin').name;

            //mix panel event
            var eventObj = {
                profile_properties: {},
                event_properties: {
                    'Plugin': current_plugin
                }
            }
            gamma.set_mixpanel_event("Navigates with node", gamma.mixpanel_uid, eventObj);

        });
        $(window).resize(function() {
            if (historyManager.get('currentContext') != 'components' && historyManager.get('currentContext') != 'systems' && historyManager.get('currentContext') != 'root' && historyManager.get('currentContext') != 'files') {
                manipulatePLuginSelection($('.node_summary_bar'));
            }
        });
    }
    //-------------- GET OVERVIEW DATA ---------------------
    function getActivelanguageData() {
        var settings = { snapshotId: historyManager.get('selectedSnapshots')[0].id };
        e.loadJSON(`${PATH_ACTIVELANGUAGE}${historyManager.get('currentSubSystemUid')}/language`, setActiveLanguage, settings, true);
    }

    function setActiveLanguage(data = ["JAVA"], status = 'success') {
        g.setActiveLanguage();
        if (status == 'success') {
            g.setActiveLanguage(data[0].toLowerCase());
            if (data.hasOwnProperty("message")) {
                hasError = true;
                g.sendErrorNotification(data, PATH_ACTIVELANGUAGE, $('.plugin_nodeSummary'));
            } else {
                hasError = false;
                //if(historyManager.get('currentPlugin').id == 'node_summary')
                // renderPluginData();

            }
            e.notify('LOAD_ISSUES_ON_REFRESH');
        } else if (status == 'error') {
            hasError = true;
            g.sendErrorNotification(data, PATH_ACTIVELANGUAGE, $('.plugin_nodeSummary'));
            //e.notify(e.notifications.DATA_LOADED);
        }
        getNodeSummaryData();
    }


    function getNodeSummaryData() {
        if (historyManager.get("currentContext") != "systems" && historyManager.get("currentContext") != "root") {
            popoverInnerContent.html('');
            /*   if (g.getPluginMetadata('node_summary', 'plugin_option_update'))
                  console.log('error message');
              else { */
            if (historyManager.get('currentContext') == 'components') {
                getComponentSummaryData();
            } else if (historyManager.get('currentContext') == 'files') {
                getFileSummaryData();
            } else if (historyManager.get("currentContext") != "systems") {
                var settings = { repositoryId: historyManager.get('currentSubSystem'), nodeId: historyManager.get('currentBreadcrumb').id };
                if (historyManager.get('selectedSnapshots').length > 0) {
                    settings.snapshotId = historyManager.get('selectedSnapshots')[0].id;
                }
                //g.pushHistory('node_summary',historyManager.get('currentContext'),plugin_options,settings);
                e.loadJSON(`${PATH_NODESUMMARY}${historyManager.get('currentSubSystemUid')}/summary`, renderer, settings, true);
            }
            setTimeout(function() {
                $('[title]').tooltipster();
            }, 500);
            /*  } */
        }
    }

    function renderer(data, status) {
        if (status == 'success') {
            nodeSummary = data;
            if (data.hasOwnProperty("message")) {
                hasError = true;
                g.sendErrorNotification(data, PATH_NODESUMMARY, $('.plugin_nodeSummary'));
            } else {
                hasError = false;
                //if(historyManager.get('currentPlugin').id == 'node_summary')
                renderPluginData();
            }
        } else if (status == 'error') {
            hasError = true;
            g.sendErrorNotification(data, PATH_NODESUMMARY, $('.plugin_nodeSummary'));

            // this is temporary fix to remove loadin message
            /*if(e.request_register.indexOf(g.DOMAIN_NAME + PATH_NODESUMMARY) != -1)
                e.request_register.splice(e.request_register.indexOf(g.DOMAIN_NAME + PATH_NODESUMMARY),1);*/
            e.notify(e.notifications.DATA_LOADED);
        }
    }

    function renderPluginData() {
        if ($.isEmptyObject(nodeSummary)) {
            hasError = true;

            var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.oops_no_data'), details: i18next.t('common.info_description.no_content'), is_add_button: false, button_text: '', is_task_management_button: false, task_management_text: '' };
            g.error_message_view(data, $('.plugin_nodeSummary'));

            if (historyManager.get('currentBreadcrumb').id != $('#breadcrumb .header_item:last').attr('nodeid')) {
                e.notify(g.notifications.PLUGIN_LOADED);
            }
        } else if (!hasError && nodeSummary) {
            renderNodeSummaryData();
            e.notify(g.notifications.RENDERING_COMPLETE);
        }
    }

    function getComponentSummaryData() {
        if (historyManager.get('selectedSnapshots').length !== 0) {

            var max_snapshotid1 = historyManager.get('selectedSnapshots')[0].id;
            e.loadJSON(`${PATH_COMPONENTSUMMARY}${historyManager.get('currentSubSystemUid')}/componentsummary`, componentRenderer, {
                repositoryId: historyManager.get('currentSubSystem'),
                nodeId: historyManager.get('currentBreadcrumb').id,
                snapshotId: max_snapshotid1
            });
            //e.loadJSON(gamma.DOMAIN_NAME + PATH_COMPONENTSUMMARY,componentRenderer,{repositoryId:historyManager.get('currentSubSystem'),nodeId:historyManager.get('currentBreadcrumb').id,snapshotId:max_snapshotid1});
        }
    }

    function componentRenderer(data, status) {
        if (status == 'success') {
            componentSummary = data;
            if (componentSummary.hasOwnProperty("message")) {
                gamma.sendErrorNotification(data, PATH_COMPONENTSUMMARY, '');
            } else {
                renderCodeSummaryData('component');
                addTagsData();
            }
        } else if (status == 'error') {
            gamma.sendErrorNotification(data, PATH_COMPONENTSUMMARY, '');
        }
    }

    function getFileSummaryData() {
        nodeSummaryplugins.component_list.hasPopover = true;
        if (historyManager.get('selectedSnapshots').length !== 0) {

            var max_snapshotid1 = historyManager.get('selectedSnapshots')[0].id;
            e.loadJSON(`${PATH_FILESUMMARY}${historyManager.get('currentSubSystemUid')}/filesummary`, fileRenderer, {
                repositoryId: historyManager.get('currentSubSystem'),
                nodeId: historyManager.get('currentBreadcrumb').id,
                snapshotId: max_snapshotid1
            });
            //e.loadJSON(gamma.DOMAIN_NAME + PATH_FILESUMMARY, fileRenderer, { project_id: historyManager.get('currentSubSystem'), node_id: historyManager.get('currentBreadcrumb').id, snapshot_id: max_snapshotid1 });
        }
    }

    function fileRenderer(data, status) {
        if (status == 'success') {
            fileSummary = data;
            if (fileSummary.hasOwnProperty("message")) {
                gamma.sendErrorNotification(data, PATH_FILESUMMARY, '');
            } else {
                renderCodeSummaryData('file');
            }
        } else if (status == 'error') {
            gamma.sendErrorNotification(data, PATH_FILESUMMARY, '');
        }
    }

    function renderCodeSummaryData(type) {
        $('.webui-popover').remove();

        var pluginList = gamma.getPluginList();
        var plugins = gamma.plugins;
        var plugin_selector = $('#plugin_selector');
        plugin_selector.html('');
        var history_plugin = historyManager.get('currentPlugin');
        var plugin_id, plugin_group;
        var node_summary_bar = $('<div/>', { class: 'node_summary_bar componentSummary float_left' });
        $('.more_plugin_items').remove();
        for (var i = 0; i < plugins.length; i++) {
            
            if (!(g.isPartialLanguage() && excludablePlugins.includes(plugins[i].name))) {
                plugin_id = plugins[i].id
                plugin_group = plugins[i].plugin_group;
                var nodeSummaryDataItem = nodeSummaryplugins[plugin_id];
                if (nodeSummaryDataItem) {
                    if (nodeSummaryDataItem[type == 'file' ? 'fileSummary' : 'componentSummary'] && pluginList.indexOf(plugin_id) != -1 /*&& gamma.isContextPlugin(plugin_id) && gamma.getPluginMetadata(plugin_id, 'showPlugin')*/ && nodeSummaryDataItem) {

                        var pluginItem = $('<a/>', { class: 'node_plugin_item float_left ', id: plugin_id });
                        if (nodeSummaryDataItem.showIcon) {
                            var pluginItemIcon = $('<div/>', { class: 'node_plugin_item_icon float_left color_dark ' + nodeSummaryDataItem.pluginIcon });
                            pluginItem.append(pluginItemIcon);
                        }
                        if ((plugin_id != 'file_explorer' && plugin_id != 'issues' && type == 'file') || (!gamma.isContextPlugin(plugin_id) && type == 'component')) {
                            pluginItem.addClass("component_not_clickable");
                        }
                        if (nodeSummaryDataItem.showRating && type == 'component') {
                            var nodeRatingValue = getNodeRating(plugin_id);
                            var nodeRatingValueForColor = '';
                            if (nodeRatingValue != 'NA') {
                                nodeRatingValueForColor = nodeRatingValue + 5;
                                nodeRatingValue = nodeRatingValue.toFixed(2);
                                nodeRatingValueForColor = e.gradient.getColor('gradient_rating', nodeRatingValueForColor / 10);
                            }
                            var pluginItemRating = $('<div/>', { class: 'node_plugin_item_rating float_left ' }).html(nodeRatingValue);
                            if (nodeRatingValue == 'NA') {
                                pluginItemRating.addClass('na_class');
                            } else {
                                pluginItemRating.css("background-color", nodeRatingValueForColor);
                            }
                            pluginItem.append(pluginItemRating);
                        }
                        if (nodeSummaryDataItem.showValue) {
                            var nodeDataValue = e.format.numberFormat(getNodeValue(plugin_id));
                            if (plugin_id == "unit_tests") {
                                nodeDataValue = nodeSummary.unit_tests;
                                if (nodeDataValue == null) {
                                    nodeDataValue = "0/0";
                                }
                            }
                            var pluginItemValue = $('<div/>', { class: 'node_plugin_item_value float_left color_medium' }).html(nodeDataValue + " ");
                            pluginItem.append(pluginItemValue);
                        }
                        var pluginItemLabel = $('<div/>', { class: 'node_plugin_item_label float_left color_medium ' }).html(nodeSummaryDataItem.labelText);
                        pluginItem.append(pluginItemLabel);
                        if (!nodeSummaryDataItem.showLabel) {
                            pluginItemLabel.addClass('hide');
                        }
                        if (nodeSummaryDataItem.hasPopover) {
                            if (plugin_id != 'repository_overview') {
                                addPopovercontent(pluginItem);
                            }
                        } else {
                            pluginItem.attr("title", nodeSummaryDataItem.tooltipText)
                        }
                        pluginItem.attr('plugin_data-id', plugins[i].id).attr('plugin_data-name', plugins[i].name);

                        if (node_summary_bar.find('.' + plugin_group).length > 0) {
                            var plugin_separator = $('<div/>', { class: 'plugin_separator float_left stroke_left stroke_light ' });
                            node_summary_bar.find('.' + plugin_group).append(plugin_separator);
                            node_summary_bar.find('.' + plugin_group).append(pluginItem);
                        } else {
                            var plugin_group_item = $('<div/>', { class: 'plugin_group float_left stroke_left stroke_medium ' + plugin_group });
                            node_summary_bar.append(plugin_group_item);
                            if (plugin_group == 'dashboard') {
                                plugin_group_item.attr("title", nodeSummaryDataItem.tooltipText);
                            }
                            plugin_group_item.append(pluginItem);
                        }
                        if (plugin_id == history_plugin.id) {
                            node_summary_bar.find("#" + plugin_id).addClass('selected_node_plugin');
                        }
                    }
                }
            }
        }
        if (type == 'component') {
            addTagIcon(node_summary_bar);
            addBrittleness(node_summary_bar);
        }
        plugin_selector.append(node_summary_bar);
    }
    /*=================== RENDER NODE SUMMARY ========================*/
    function renderNodeSummaryData() {
        $('.webui-popover').remove();
        loadNodeSummary();
        //addTagsData();
    }

    //---------------- Public methods -----------------

    gamma.handleEvents = function() {
        handleEvents();
    }
    gamma.nodeSummaryInit = function() {
        init();
    }
    return gamma;
}(g));