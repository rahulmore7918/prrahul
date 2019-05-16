'use strict';

angular.module('gammawebsiteApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('applications', {
                url: '',
                template: '<ui-view/>',
                abstract: true
            })
            .state('applications.login', {
                url: '/',
                templateUrl: 'control_panel/login/login.html',
                controller: 'AdminLoginController',
                controllerAs: 'ctrl',
                resolve: {
                    isLoggedIn: function (Adminauth, $state) {
                        Adminauth.isLoggedIn(function (data) {
                            if (data) {
                                $state.go('applications.dashboard');
                            }
                        });
                    }
                }
            })
            .state('applications.logout', {
                url: '/logout?referrer',
                referrer: 'site',
                template: '',
                controller: function ($state, Adminauth) {
                    var referrer = $state.params.referrer || $state.current.referrer || 'site';
                    Adminauth.logout();
                    $state.go('applications.login');
                }
            })
            .state('applications.dashboard', {
                url: '/dashboard',
                templateUrl: 'control_panel/applications/dashboard.html',
                controller: 'ApplicationsComponent',
                controllerAs: 'ctrl',
                resolve: {
                    isLoggedIn: function (Adminauth, $state) {
                        Adminauth.isLoggedIn(function (data) {
                            if (!data) {
                                Adminauth.logout();
                                $state.go('applications.login');
                            }
                        });
                    }
                }
            })
            .state('applications.list', {
                url: '/list',
                templateUrl: 'control_panel/applications/applications.html',
                controller: 'ApplicationsComponent',
                controllerAs: 'ctrl',
                resolve: {
                    isLoggedIn: function (Adminauth, $state) {
                        Adminauth.isLoggedIn(function (data) {
                            if (!data) {
                                Adminauth.logout();
                                $state.go('applications.login');
                            }
                        });
                    }
                }
            })

            .state('applications.create', {
                url: '/create',
                templateUrl: 'control_panel/applications/create/create.html',
                controller: 'CreateApplicationController',
                controllerAs: 'ctrl',
                resolve: {
                    isLoggedIn: function (Adminauth, $state) {
                        Adminauth.isLoggedIn(function (data) {
                            if (!data) {
                                Adminauth.logout();
                                $state.go('applications.login');
                            }
                        });
                    }
                }
            })
            .state('applications.edit', {
                url: '/edit/:id',
                templateUrl: 'control_panel/applications/create/create.html',
                controller: 'CreateApplicationController',
                controllerAs: 'ctrl',
                resolve: {
                    isLoggedIn: function (Adminauth, $state) {
                        Adminauth.isLoggedIn(function (data) {
                            if (!data) {
                                Adminauth.logout();
                                $state.go('applications.login');
                            }
                        });
                    }
                }
            });

    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
            if (next.name === 'logout' && current && current.name && !current.authenticate) {
                next.referrer = current.name;
            }
        });
    });