
var g = (function(gamma) {
    gamma.object_oriented_languages = ['java','cpp','c_sharp','web','fortran'];

    gamma.available_plugin_contexts = ['project','subsystem','modules','components','files'];

    gamma.ldapDirectoryAttributes = [
        {
            name: 'Open LDAP',
            key: 'openldap',
            userSchema: {
                ldapUserObjectclass: 'inetorgperson',
                ldapUserFilter: '(objectclass=inetorgperson)',
                // ldapUserUsername: 'cn',
                // ldapUserUsernameRdn: 'cn',
                ldapUserFirstname: 'givenName',
                ldapUserLastname: 'sn',
                ldapUserEmail: 'mail',
                // ldapUserEncryption: 'sha',
                ldapExternalId: 'entryUUID'
            },
            // groupSchema: {
            //     ldapGroupObjectclass: 'groupOfUniqueNames',
            //     ldapGroupFilter: '(objectclass=groupOfUniqueNames)',
            //     // ldapGroupName: 'cn'
            // }
        },
        {
            name: 'Microsoft Active Directory',
            key: 'msad',
            userSchema: {
                ldapUserObjectclass: 'user',
                ldapUserFilter: '(&(objectCategory=Person)(sAMAccountName=*))',
                // ldapUserUsername: 'cn',
                // ldapUserUsernameRdn: 'cn',
                ldapUserFirstname: 'givenName',
                ldapUserLastname: 'sn',
                ldapUserEmail: 'mail',
                // ldapUserEncryption: 'userPassword',
                ldapExternalId: 'objectGUID'
            },
            // groupSchema: {
            //     ldapGroupObjectclass: 'group',
            //     ldapGroupFilter: '(objectCategory=Group)',
            //     // ldapGroupName: 'cn'
            // }
        }
    ];
    gamma.plugins = [
        {
            "name": "Dashboard",
            "id": "dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/dashboard",
            "plugin_group":"system",
            "details":"Heat distribution in system including summary of system."
        },
        {
            "name": "Project List",
            "id": "project_list",
            "url": "D:\\tea\\tea\\gamma\\plugins/projectList",
            "plugin_group":"system",
            "details":"List of all projects."
        },
        {
            "name": "Team List",
            "id": "team_list",
            "url": "D:\\tea\\tea\\gamma\\plugins/teamList",
            "plugin_group":"system",
            "details":"List of all teams."
        },
        {
            "name": "Issue List",
            "id": "issue_list",
            "url": "D:\\tea\\tea\\gamma\\plugins/issueList",
            "plugin_group":"system",
            "details":"List of all issue list."
        },
        {
            "name": "Subsystem List",
            "id": "subsystem_list",
            "url": "D:\\tea\\tea\\gamma\\plugins/subsystemList",
            "plugin_group":"system",
            "details":"Heat distribution in system including summary of system."
        },
        {
            "name": "System Overview",
            "id": "system_heatmap",
            "url": "D:\\tea\\tea\\gamma\\plugins/heatMap",
            "plugin_group":"overview",
            "details":"Heat distribution in system including summary of system."
        },
        {
            "name": "Repository Dashboard",
            "id": "repository_dashboard",
            "plugin_group":"dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/subsystemDashboard",
            "details":"Basic details of repository."
        },

            "name": "Repository Trends",
            "id": "repository_trends",
            "plugin_group": "dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/repositoryTrends",
            "details": "Trends graphs of repository."
        },
        {
            "name": "Commit History",


            "id": "commit_history",
            "plugin_group": "dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/commitHistory",
            "details": "List of all commits along with files changed for repository."
        }, {
            "name": "Code Editor",
            "id": "code_editor",
            "plugin_group": "dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/codeEditor",
            "details": "In code editor you can edit your code and fix it here on gamma itself."
        },
        {
            "name": "KPI Dashboard",
            "id": "kpi_dashboard",
            "plugin_group":"dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/kpiDashboard",
            "details":"Basic details of KPI."
        },
        {
            "name": "Repository Overview",
            "id": "repository_overview",
            "plugin_group": "dashboard",
            "url": "D:\\tea\\tea\\gamma\\plugins/repositoryOverview",
            "details": "Summary of repositories including list of major hotspots."
        },
        {
            "name": "Design Issues Distribution",
            "id": "design_issue_details",
            "plugin_group":"issue_distribution",
            "url": "D:\\tea\\tea\\gamma\\plugins/designIssueDetails",
            "details":"Design issue details in subsystem ,module."
        },
        {
            "name": "Code Issues Distribution",
            "id": "code_issues_details",
            "plugin_group": "issue_distribution",
            "url": "D:\\tea\\tea\\gamma\\plugins/codeissuesDetails",
            "details": "Code issues in a subsystem or module."
        },
        {
            "name": "Metrics Distribution",
            "id": "metrics_details",
            "plugin_group":"issue_distribution",
            "url": "D:\\tea\\tea\\gamma\\plugins/metricsDetails",
            "details":"Metrics details in subsystem ,module."
        },
        {
            "name": "Duplication Distribution",
            "id": "duplication_details",
            "plugin_group":"issue_distribution",
            "url": "D:\\tea\\tea\\gamma\\plugins/duplicationDetails",
            "details":"Duplication details in subsystem ,module or component."
        },
        {
            "name": "Hotspots Distribution",
            "id": "hotspot_distribution",
            "plugin_group": "issue_distribution",
            "url": "D:\\tea\\tea\\gamma\\plugins/hotspotDistribution",
            "details": "Distribution of hotspots in a subsystem or module."
        },
        {
            "name": "Heatmap",
            "id": "heatmap",
            "plugin_group": "navigate",
            "url": "D:\\tea\\tea\\gamma\\plugins/heatMap",
            "details": "Heat distribution in subsystem or a module.Selectable rating range."
        },
        {
            "name": "Components",
            "id": "component_list",
            "plugin_group": "navigate",
            "url": "D:\\tea\\tea\\gamma\\plugins/componentList",
            "details": "List of all components in subsystem."
        },
        {
            "name": "Changes",
            "id": "change_overview",
            "plugin_group": "navigate",
            "url": "D:\\tea\\tea\\gamma\\plugins/changeOverview",
            "details": "Summary of change between two snapshots."
        },
        {
            "name": "Changed Components",
            "id": "change_list",
            "plugin_group": "navigate",
            "url": "D:\\tea\\tea\\gamma\\plugins/changeList",
            "details": "List of all changed components.Advanced filter allows listing by metrics or ratings."
        },
        {
            "name": "City View",
            "id": "city_view",
            "plugin_group": "navigate",
            "url": "D:\\tea\\tea\\gamma\\plugins/cityView",
            "details": "See the subsystem in 3D.Evaluate dependencies.Isolate a package and examine."
        },
        {
            "name": "Coverage Distribution",
            "id": "coverage_distribution",
            "plugin_group": "coverage",
            "url": "D:\\tea\\tea\\gamma\\plugins/coverageDistribution",
            "details": "Coverage distribution details in subsystem ,module or component."
        },
        {
            "name": "Coverage by Components",
            "id": "coverage_component_list",
            "plugin_group": "coverage",
            "url": "D:\\tea\\tea\\gamma\\plugins/componentCoverageList",
            "details": "List of all coverage components in subsystem."
        },
        {
            "name": "Test Hungry Methods",
            "id": "complex_method_list",
            "plugin_group": "coverage",
            "url": "D:\\tea\\tea\\gamma\\plugins/complexMethodList",
            "details": "List of all test hungry methods in subsystem."
        },
        {
            "name": "Unit Tests",
            "id": "unit_tests",
            "plugin_group": "coverage",
            "url": "D:\\tea\\tea\\gamma\\plugins/unitTests",
            "details": "List of all unit tests in subsystem."
        },
        {
            "name": "Cost Monitor",
            "id": "release_management",
            "url": "D:\\tea\\tea\\gamma\\plugins/releaseManagement",
            "plugin_group":"change",
            "details":"Shows the differences between two releases(essentially snapshots) of a system."
        },
        {
            "name": "Module Dependency",
            "id": "module_dependency",
            "plugin_group":"architecture",
            "url": "D:\\tea\\tea\\gamma\\plugins/modulDependnecy",
            "details":"Shows inter-module dependency."
        },
        {
            "name": "Component Explorer",
            "id": "component_explorer",
            "plugin_group":"explorer",
            "url": "D:\\tea\\tea\\gamma\\plugins/componentExplorer",
            "details":"Everything about component.Antipatterns,code issues and duplication.Integrated code viewer."
        },
        {
            "name": "File Explorer",
            "id": "file_explorer",
            "plugin_group": "explorer",
            "url": "D:\\tea\\tea\\gamma\\plugins/fileExplorer",
            "details": "Everything about component.Antipatterns,code issues and duplication.Integrated code viewer."
        },
        {
            "name": "Dependency",
            "id": "dependency_plot",
            "plugin_group":"explorer",
            "url": "D:\\tea\\tea\\gamma\\plugins/dependencyPlot",
            "details":"Dependency tree of a component.Switchable between incoming and outgoing."
        },
        {
            "name": "Tree",
            "id": "tree",
            "plugin_group":"navigate",
            "url": "D:\\tea\\tea\\gamma\\plugins/tree",
            "details":"Gives tree structure."
        },
        {
            "name": "Issues",
            "id": "issues",
            "plugin_group":"issues",

        },
        {
            "name": "Component Dependency",
            "id": "component_dependency",
            "plugin_group":"architecture",
            "url": "D:\\tea\\tea\\gamma\\plugins/modulDependnecy",
            "details":"Shows inter-compoent dependency."
        },
        {
            "name": "Node Summary",
            "id": "node_summary",
            "plugin_group":"node_summary",
            "url": "D:\\tea\\tea\\gamma\\plugins/nodeSummary",
            "details":"Shows summary of a node."
        }
    ];

    gamma.component_level_antipattern_colors = { 'BC': '#e06270', 'GBR': '#e9d189', 'GBU': '#c1b88d', 'GH': '#feac86', 'GC': '#fccc82', 'LBR': '#94af7b',
                                                'LBU': '#aed592', 'DCD': '#529560', 'RPB': '#ded297', 'TB': '#b3a872', 'HB': '#cba455', 'FIC': '#EE9F9F',
                                                'FI': '#EE9F9F', 'FME': '#B7CEDF', 'SSP':'#BAB2DD', 'MF':'#79bad1', 'FC':'#edec82'};
    gamma.metrics_colors                        = {'NOM':'#4db6ac','NOS':'#cac80a','Complexity':'#90a4ae','CBO':'#8d6e63','RFC':'#ffab91','DOIH':'#f48fb1','LOC':'#ce93d8', 'NOP':'#b0bec5'};
    gamma.method_level_antipattern_colors = { 'BM': '#aa5766', 'DC': '#a6987d', 'FE': '#dcbca6', 'IC': '#d68e6e', 'SS': '#f7e380', 'CSS': '#7bab84',

    gamma.code_issue_colors                     = ['#b64a63','#ffacac','#ff8cb5','#ff7e5f','#ffb09f','#ff2b66','#ff799e','#ff9595','#ffc8b3','#ff7475',
                                                  '#7583fe','#87cbfc','#3cdcfe','#69b6c8','#cdc8ff','#278cff','#4677f0','#daf7ff','#8cbdff','#6284b4',
                                                  '#7ca377','#d6ffd2','#99ff91','#c4df7e','#ceff58','#85be00','#5fff93','#77d797','#04dc61','#529560',
                                                  '#ffe826','#fef6a5','#ffc935','#ffe8a8','#c2aa6a','#a27500','#eee00d','#fffad4','#ffdb49','#f0c787',
                                                  '#4f4f4f','#b9b9b9','#ebebeb','#b8aea2','#828282','#9eb0ba','#c7d2d8','#c8c8c8','#b29a9a','#dad8cc',
                                                  '#a7d1b0','#f1d5a5','#fa9866','#ffd485','#f76379','#debee8','#ffe1bf','#f5bfd0','#a6bd84','#dec183',
                                                  '#6dbfba','#c4c3a3','#eba07a','#f9ffb3','#ffa1ba','#80d2ff','#82ffb4','#f9ffb3','#d78a5e','#c6bfb7',
                                                  '#b87d84','#a6a7a9','#eba07a','#7d8db0','#9ac07e','#9979ad','#a8875a','#c8bf6d','#6e9c8b','#737278',
                                                  '#d4d3d1','#776a63','#91a7d0','#f6cac9','#b6ba99','#af869a','#532d3b','#50574c','#615c60','#807c6f',
                                                  '#a4777e','#ddbf5e','#af9976','#eb9587','#e3eaa5','#d1c3d5','#9f5069','#82677e','#c9b27b','#aaa24c'
                                                ];
    gamma.languages_colors = { 'Java': '#61cae7', 'C': '#d6dbde', 'C++': '#90a4ae', 'JS':'#b2d3ed'};
    gamma.tag_colors = ['#9E3D3A', '#B5895E', '#E54357','#CA62A9', '#B74299', '#EE7C42',
                        '#EEAB42',  '#8053BB','#FFC745','#95CF54', '#6453BB',  '#1D6CC3',
                         '#95CF54',  '#0C9CD7', '#00C390', '#D5CC45','#009789', '#79D8E4', '#5F7D8C'];

    gamma.metrics_list = ["NOS","DOIH","NOM","Complexity","RFC","CBO","LOC","LOC_Comments","NOA","NOPA","ATFD","LCOM","CR","MaxNesting","NOAV","FDP","LAA","NOP"];


    gamma.icon_map = {
        C_Directory:'module',
        C_FileModule:'module',
        SUBSYSTEM:'subsystem',
        SUBSYSTEMS:'subsystem',
        C_FunctionComponent:'function',
        C_Class:'class',
        ProgramUnit:'class',
        C_Struct:'class',
        C_Interface:'class',
        C_TemplateClass:'class',
        SystemLib:'class',
        C_TemplateParameter:'class',
        C_FunctionTemplateComponent:'function',
        C_Function:'function',
        C_Method:'function',
        COMPONENTS:'class',
        SUBCOMPONENTS:'function',
        SYSTEMCOMPONENTS:'class',
        WebFile:"class",
        WebUnnamedFunction:"class",
        WebFunction:"class",
        WebFunctionObject:"class",
        WebMethodFunction:"class",
        FILE:'file',
        FILES:'file',
        PROJECT:'project',
        PROJECTS:'project',
        MODULES:'module',
        File:'class',
        Project:'project',
        Namespace:'module',
        Class:'class',
        ClassDecl:'class',
        EnumDecl:'class',
        PhpFile:'class',
        Struct:'class',
        Interface:'class',
        InterfaceDecl:'class',
        Method:'function',
        Ctor:'function',
        Dtor:'function',
        CsharpProperty:'class',
        plugin:'plugin',
        ATTRIB:'function',
        LOCAL:'function',
        UNKNOWN:'unknown',
        component_explorer:'node_summary_selected',
        file_explorer: 'node_summary_selected'
    };

    /*gamma.classification_map = {
        C_Directory:'MODULES',
        C_FileModule:'MODULES',
        C_FunctionComponent:'COMPONENTS',
        C_Class:'COMPONENTS',
        ProgramUnit:'COMPONENTS',
        C_Struct:'COMPONENTS',
        C_Interface:'COMPONENTS',
        C_TemplateClass:'COMPONENTS',
        SystemLib:'SYSTEMCOMPONENTS',
        C_TemplateParameter:'COMPONENTS',
        C_FunctionTemplateComponent:'COMPONENTS',
        WebFile:"COMPONENTS",
        WebUnnamedFunction:"COMPONENTS",
        WebFunction:"COMPONENTS",
        WebFunctionObject:"COMPONENTS",
        WebMethodFunction:"COMPONENTS",
        C_Function:'SUBCOMPONENTS',
        C_Method:'SUBCOMPONENTS',
        File:'FILES',
        Project:'PROJECT',
        Subsystem:'SUBSYSTEM',
        Namespace:'MODULES',
        Class:'COMPONENTS',
        Struct:'COMPONENTS',
        PhpFile:'COMPONENTS',
        Interface:'COMPONENTS',
        Method:'SUBCOMPONENTS',
        Package:'MODULES',
        Module:'MODULES',
        CsharpProperty:'SUBCOMPONENTS',
        PackageDecl:'MODULES',
        Cu:'FILES',
        Unknown:'UNKNOWN',
        FieldDecl:'ATTRIB',
        Ctor:'SUBCOMPONENTS',
        Parameter:'LOCAL',
        VarDecl:'LOCAL',
        CatchArg:'LOCAL',
        EnumDecl:'COMPONENTS',
        EnumConstantDecl:'ATTRIB',
        InterfaceDecl:'COMPONENTS',
        Initializer:'SUBCOMPONENTS',

    };*/

    gamma.context_register = {
        "companies" :
        {
            "plugins":{}
        },
        "root":
        {
            "plugins":{
                /* "dashboard": { "required_snapshot": 0, "max_snapshot": 0, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": false, "pluginIcon":"ic-home"}, */
                "project_list": { "required_snapshot": 0, "max_snapshot": 0, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": false, "pluginIcon": "ic-projects"},
                "team_list": { "required_snapshot": 0, "max_snapshot": 0, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": false, "pluginIcon": "ic-teams"},
                "issue_list": { "required_snapshot": 0, "max_snapshot": 0, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": false, "pluginIcon": "ic-issues"}
            }
        },
        "systems" :
        {
            "plugins":{
                "subsystem_list": { "required_snapshot": 0, "max_snapshot": 0, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": false, "pluginIcon": "ic-repository"},
                /*"dashboard" : {"required_snapshot":0,"max_snapshot":0,"resetBreadcrumb":false,"createNewInstance":true,"pluginOptions":false,"resetFilters":false,"showPlugin":true,"showSnapshotPanel":false},*/
            }
        },
        "subsystems" :
        {
            "plugins":
            {

                "repository_overview": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": true, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-repository"},
                "kpi_dashboard": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": true, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-kpis"},
                "release_management": { "required_snapshot": 2, "max_snapshot": 1, "resetBreadcrumb": true, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": ""},
                "change_overview": { "required_snapshot": 2, "max_snapshot": 2, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-change-overview"},
                "change_list": { "required_snapshot": 2, "max_snapshot": 2, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-change-overview-component"},

                "commit_history": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-devlopment-history"},
                "code_editor": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-loc" },
                "hotspot_distribution": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-hotspot-distribution-filled"},

                "duplication_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-duplication"},
                "coverage_distribution": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-coverage"},
                "metrics_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-metrics"},
                "design_issue_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-design-issues"},
                "component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-components"},
                "coverage_component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-coverage-by-component"},
                "complex_method_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-test-hungry-methods" },

                "component_dependency": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-dependency"},
                "node_summary": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": ""},
                "city_view": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-city-view"},
                "heatmap": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-heatmap"},
                "tree": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tree"},
                "issues": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-issues"},
                "tasks": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tasks"}
            }
        },
        "modules" :
        {
            "plugins":

              "module_dependency": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-dependency"},
              "design_issue_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-design-issues"},
              "kpi_dashboard": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": true, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-kpis"},
              "code_issues_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-code-issues"},
              "duplication_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-duplication"},
              "metrics_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-metrics"},
              "component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-components"},

              "design_issue_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-design-issues"},
              "kpi_dashboard": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": true, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-kpis"},
              "code_issues_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-code-quality"},
              "duplication_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-duplication"},
              "metrics_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-metrics"},
              "component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-components"},
              "module_dependency": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-dependency"},

              "node_summary": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": ""},
              "heatmap": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-heatmap"},
              "tree": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tree"},
              "issues": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-issues"},
             // "tasks": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tasks"},
              "coverage_distribution": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-coverage"},
              "coverage_component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-coverage-by-component"},
              "complex_method_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-test-hungry-methods" },
              "unit_tests": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-unit-test"}
            }
        },
        "components" :
        {
            "plugins":
            {

                "component_explorer": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-component-explorer"},
              "dependency_plot": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-dependency"},
              "node_summary": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": ""},
              //"heatmap"    : {"required_snapshot":1,"max_snapshot":1,"resetBreadcrumb":false,"createNewInstance":true,"pluginOptions":false,"resetFilters":false,"showPlugin":false,"showSnapshotPanel":true,"pluginIcon":""},
              "tree": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tree"},
              "issues": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-issues"},
              "tasks": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tasks"},
              "partitions": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-partition"}

            }
        },
        "files" :
        {
            "plugins":
            {
              "file_explorer": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-document" },
             // "component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-components" },

             // "code_issues_details": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-code-issues"},

              "issues": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-issues" }
            }
        },
        "other":
        {
            "plugins":
            {
                "component_list": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": true, "showPlugin": true, "showSnapshotPanel": false, "pluginIcon": "ic-components"},
                "tree": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": false, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tree"},
                "issues": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-issues"},
                "tasks": { "required_snapshot": 1, "max_snapshot": 1, "resetBreadcrumb": false, "createNewInstance": true, "pluginOptions": true, "resetFilters": false, "showPlugin": true, "showSnapshotPanel": true, "pluginIcon": "ic-tasks"}
            }
        }
    };

    gamma.adminPlugins={
        "users": { "icon":"ic-profile"},
        "global_permissions": { "icon": "ic-global-roles" },
        "projects": { "icon": "ic-projects" },
        "repositories": { "icon": "ic-repository" },
        "version_control": { "icon": "ic-version-control" },
        "kpis": { "icon": "ic-kpis" },
        "tags": { "icon": "ic-tags" },
        "quality_profile": { "icon": "ic-quality-gate-pass" },
        "license": { "icon": "ic-summary" },
        "notifications": { "icon": "ic-email" },
        "import_subsystem": {
            "icon": ""
        },
        "access_tokens": {
            "icon": "ic-access-token"
        },
        "public_url": {

        }
    };
    gamma.getIcon = function(key) {
        if(key !== null) {
            key.replace("#","sharp");
            var icon = gamma.icon_map[key];
            if(icon) {
                return icon;
            }
            else
            {
                icon = gamma.icon_map[gamma.classification_map[key]];
                if(icon) {
                    return icon;
                }else {
                    return gamma.icon_map['UNKNOWN'];
                }
            }
        }
        else {
            return gamma.icon_map['UNKNOWN'];
        }
    };

    gamma.getClassification = function(key) {
        key.replace("#","sharp");
        return gamma.classification_map[key];
    };
    gamma.getMetadata = function(key) {
        return gamma.context_register[historyManager.get('currentContext')]['plugins'][key];
    };
    gamma.setMetadata = function(key,property,value) {
        gamma.context_register[historyManager.get('currentContext')]['plugins'][key][property] = value;
    };
    gamma.getContextData = function(key) {
        if(!gamma.context_register[key])
        {
            var no_data = $('<div/>',{class:'no_data_exception text_14',title:'Data Unavailable'});
            e.renderIcon(no_data,'data_unavailable');
            $('#content').append(no_data);
            $('#plugin_selector').addClass('hide');
            e.notify(g.notifications.RENDERING_COMPLETE);
            return false;
        }
        else
        {
          return gamma.context_register[key].plugins;
        }
    };
    gamma.isContextPlugin = function(name) {
        var context_plugins = gamma.getContextData(historyManager.get('currentContext'));
        var flag = false;
        $.each(context_plugins,function(key,value) {
            if(key == name)
            {
              if(value.showPlugin)
              {
                flag = true;
                return false;
              }
            }
        });
        return flag;
    };
    gamma.getPluginById = function(plugin_id) {
        for(var i = 0 ; i < gamma.plugins.length ; i++)
        {
            if(plugin_id == gamma.plugins[i].id) {
                return gamma.plugins[i];
            }
        }
    };
    gamma.getPluginMetadata = function(plugin_id,data) {
        var metadata      = gamma.getMetadata(plugin_id);
        if(data == 'snapshot')
        {
            if(plugin_id == 'system_heatmap') {
              return true;
            }
            else
            {
              var max_snap  = metadata.max_snapshot;
              if(max_snap == 0 || (gamma.getSnapshotList()).length >= max_snap) {
                return true;
              }
              else {
                return false;
              }
            }
        }
        if(data == 'plugin_option_update')
        {
            if(plugin_id == 'system_heatmap') {
              return true;
            }
            else {
              var required_snapshot  = metadata.required_snapshot;
              if(historyManager.get("selectedSnapshots").length > 2 ){
                return true;
              }
              else if(historyManager.get("selectedSnapshots").length == required_snapshot){
                return false;
              }
              else{
                return true;
              }
            }
        }
        if (data == 'pluginIcon') {
            return metadata.pluginIcon;
        }
        if( data == 'show_snapshot_panel'){
            return metadata.showSnapshotPanel;
        }
        if(data == 'number_of_snapshot')
        {
            return metadata.required_snapshot;
        }
        else if(data == 'breadcrumb')
        {
            if(metadata.resetBreadcrumb) {
              return true;
            }
            else {
              return false;
            }
        }
        else if(data == 'instance')
        {
            if(metadata.createNewInstance) {
              return true;
            }
            else {
              return false;
            }
        }
        else if(data == 'pluginOptions')
        {
            if(metadata.pluginOptions) {
              return true;
            }
            else {
              return false;
            }
        }
        else if(data == 'showPlugin')
        {
            if(metadata.showPlugin) {
              return true;
            }
            else {
              return false;
            }
        }
    };
    return gamma;
}(g));
