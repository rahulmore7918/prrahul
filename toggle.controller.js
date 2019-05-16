'use strict';

class ToggleController {
    token;
    type;
    constructor(Auth, $state, toastr, $cookies, $gammaAnalytics, appConfig, User, $window) {
        let self = this;
        this.Auth = Auth;
        this.$state = $state;
        this.User = User;
        this.$cookies = $cookies;
        this.token = $state.params.token;
        this.type = $state.params.type;
        this.$gammaAnalytics = $gammaAnalytics;
        this.gamma_ui = appConfig.gamma_ui;
        this.gamma_ui_env = appConfig.gamma_ui_env;
        this.subdomain = "";
        this.cloud_login_url = "";

        if (typeof self.type != undefined || self.type != '') {
            // get logged in user info from db
            this.Auth.getCurrentUser(function (data) {
                // response
                self.currentUser = data;
                // check
                self.Auth.account_toggle_check(self.currentUser.email, self.type)
                    .then((res) => {
                        // set locals
                        localStorage.setItem('is_trial', self.currentUser.is_trial);
                        // set client cookie
                        var now = new $window.Date(),
                                expiry = new $window.Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                        $cookies.put('token', res.tmp_data, { expires: expiry });
                        // get current user
                        // self.currentUser = self.User.get();
                        // redirect
                        window.location.href = '/account';
                    });
            });
        } else {
            this.$state.go('account');
        }
    }
}

angular.module('gammawebsiteApp')
    .controller('ToggleController', ToggleController);
