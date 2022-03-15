'use strict';

class AdminLoginController {
    constructor($state, Adminauth) {
        let self = this;
        this.user = {};
        this.errors = {};
        this.submitted = false;
        this.Adminauth = Adminauth;
        this.$state = $state;
    }

    login(form) {
        let self = this;
        this.submitted = true;
        if (form.$valid) {
            this.Adminauth.login({
                email: this.user.email,
                password: this.user.password
            })
                .then((user) => {
                    // Logged in, redirect
                    //var userId = user._id;
                    // console.log(user);
                    self.$state.go('applications.dashboard');

                })
                .catch(err => {
                    this.errors.other = err.message;
                });
        }
    }
}

angular.module('gammawebsiteApp')
    .controller('AdminLoginController', AdminLoginController);
