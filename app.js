'use strict';

angular.module('gammawebsiteApp', ['gammawebsiteApp.adminauth', 'pascalprecht.translate', 'FileManagerApp',
    'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io',
    'ui.router', 'ui.bootstrap', 'validation.match', 'ngAnimate', 'toastr', 'ui.date', 'cp.ngConfirm', 'ui.bootstrap.datetimepicker', 'angularUtils.directives.dirPagination', 'angular-md5', 'iso-3166-country-codes', 'angularMoment'
])
    .config(function ($urlRouterProvider, $locationProvider, toastrConfig, fileManagerConfigProvider) {
        // $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

        // toastr config settings
        angular.extend(toastrConfig, {
            newestOnTop: true,
            positionClass: 'toast-top-center',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });

    })
    .filter('mixpanelanalytics', ['appConfig', function (appConfig) {
        return function (text) {
            return String(text).replace(/\%MIXPANEL_TRACKING_ID\%/mg, appConfig.mixpanel_tracking_id);
        };
    }])
    .config(function (fileManagerConfigProvider, appConfig) {
        var defaults = fileManagerConfigProvider.$get();
        var control_panel_url = "control_panel."
        var protocal = (appConfig.gamma_ui_env == "local" || appConfig.gamma_ui_env == "test") ? "http://" : "https://";
        var base_url = protocal + control_panel_url + appConfig.gamma_site_url;

        fileManagerConfigProvider.set({
            appName: 'Release Docs',
            defaultLang: 'en',
            listUrl: base_url + '/api/files/list',
            downloadFileUrl: base_url + '/api/files/download',
            uploadUrl: base_url + '/api/files/upload',
            removeUrl: base_url + '/api/explorer/remove',
            createFolderUrl: base_url + '/api/files/createFolder',
            renameUrl: base_url + '/api/files/rename',
            copyUrl: base_url + '/api/files/copy',
            // moveUrl: base_url +'/api/files/createFolder',
            searchForm: false,
            multiLang: false,
            allowedActions: {
                upload: true,
                rename: true,
                move: false,
                copy: true,
                edit: true,
                changePermissions: false,
                compress: false,
                compressChooseName: false,
                extract: false,
                download: true,
                downloadMultiple: false,
                preview: true,
                remove: true,
                createFolder: true,
                pickFiles: false,
                pickFolders: false
            }
        });
    });
