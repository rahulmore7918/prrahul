'use strict';

class SurveyController {

    constructor(Auth, $state, $location, $http, toastr, $scope) {
        let self = this;
        this.errors = {};
        this.submitted = false;
        this.toastr = toastr;
        this.Auth = Auth;
        this.state = $state;
        this.$http = $http;
        this.baseUrl = $location.protocol() + '://' + location.host;
        this.$scope = $scope;
    }
}

angular.module('gammawebsiteApp')
    .controller('SurveyController', SurveyController);
