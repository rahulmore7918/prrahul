'use strict';

class ResetPasswordController {

    constructor(Auth, $state, $location, toastr, $http) {
        let self = this;
        this.errors = {};
        this.submitted = false;
        this.Auth = Auth;
        this.$state = $state;
        this.token = $state.params.token;
        this.from_type = $state.params.from_type;
        this.page_label = (this.from_type == 'control_panel') ? 'Set Password' : 'Reset Password';
        this.toastr = toastr;
        this.$http = $http;
        // Base url with port
        this.baseUrl = $location.protocol() + '://' + location.host;
        this.email = '';
        this.Auth.tokencheck(this.token, 'reset')
            .then((res) => {
                if (res.expired != undefined) {
                    toastr.error('Sorry! Password reset link is expired');
                    self.$state.go('login');
                } else if (!res.flag) {
                    toastr.error('Sorry! Password reset link is expired or invalid');
                    self.$state.go('login');
                } else {
                    self.email = res.email;
                }
            });
    }

    resetpassword(form) {
        let self = this;
        this.submitted = true;
        if (form.$valid) {
            self.showSpinner = true;
            this.Auth.resetPassword(this.user.password, this.token, this.email)
                .then((res) => {
                    self.toastr.success('Your password has been successfully reset.');
                    self.$state.go('login');
                })
                .catch(() => {
                    self.showSpinner = false;
                    this.toastr.error('something went wrong with reset password.');
                    self.$state.go('home');
                });
        }
    }
}

angular.module('gammawebsiteApp')
    .controller('ResetPasswordController', ResetPasswordController);
