'use strict';

class LoginController {
	constructor(Auth, $http, $location, toastr, $state, $gammaAnalytics, $cookies, appConfig, $filter, $rootScope, User, $intercom) {
		let self = this;
		this.user = {};
		this.errors = {};
		this.submitted = false;
		this.Auth = Auth;
		this.$http = $http;
		this.$state = $state;
		this.filter = $filter;
		this.$rootScope = $rootScope;
		this.$gammaAnalytics = $gammaAnalytics;
		this.email_pattern = new RegExp(appConfig.email_pattern);
		if ($cookies.get('rememberMe')) {
			this.user.rememberme = true;
		}
		this.showSpinner = false;
		// Base url with port
		this.baseUrl = $location.protocol() + '://' + location.host;
		this.gamma_ui = appConfig.gamma_ui;
		this.gamma_ui_env = appConfig.gamma_ui_env;
		this.toastr = toastr;
		this.UserService = User;

		this.packagemetrics = [];
		this.addonmetrics = [];
		this.extra_addons = [];
		this.extra_addons_total = 0;
		this.plan_unit_price = 0;
		this.planduration = 0;
        this.$intercom = $intercom;
	}

	login(form) {
		let self = this;
		this.submitted = true;
		var rememberme = typeof this.user.rememberme == 'undefined' ? false : this.user.rememberme;
		if (form.$valid) {
			this.Auth.login({
				email: this.user.email,
				password: this.user.password,
				rememberme: rememberme
			})
				.then((user) => {
                    // Update intercom
                    var intercomUser = {
                        email: user.email,
                        name: user.first_name+" "+user.last_name,
                        user_id: user.intercom_id,
                        // 'subdomain': user.subdomain,
                        'company': user.company
                    };
                    self.$intercom.update(intercomUser);
					// Logged in, redirect
					var mixpanel_id = user.mixpanel_id;

					// set analytics event
					self.$gammaAnalytics.setAnalytics('Logged In', mixpanel_id, {
						'first_name': user.first_name,
						'last_name': user.last_name,
						'company': user.company,
						'email': user.email,
						'subdomain': user.subdomain,
						'plan': user.tenant_license.license_detail.package_json.plan_name
					});

					// new addition: dual account redirection logic
					if (self.$rootScope.previousState == 'opensource' && self.$rootScope.currentState == 'login' && !user.is_trial) {
						// do push to the opposite flow
						self.UserService.returning_from = self.$rootScope.currentState;
						self.$state.transitionTo('dualaccount', null, { reload: true, notify: true });
					} else if (self.$rootScope.previousState == 'signup' && self.$rootScope.currentState == 'login' && user.is_trial) {
						// do push to the opposite flow
						self.UserService.returning_from = self.$rootScope.currentState;
						self.$state.transitionTo('dualaccount', null, { reload: true, notify: true });
					} else {
						// do not push to the opposite flow
						self.$state.transitionTo('account', null, { reload: true, notify: true });
					}
				})
				.catch(err => {
					this.errors.other = err.message;
					this.errors.email = err.email;
					this.errors.resend = err.resend;
				});
		}
	}

	// resend email
	resendEmail() {
		let self = this;
		if (typeof self.errors.email != "undefined") {
			self.showSpinner = true;
			this.Auth.emailcheck(self.errors.email, false, "login")
				.then((res) => {
					if (res.flag) {
						self.toastr.success('Account verification mail sent successfully!');
						self.showSpinner = false;
					}
				})
				.catch(err => {
					self.toastr.error('Error in sending email please contact admin');
				});
		}
	}

	// get current package info from db against static application id
	getPackageById(plan_id) {
		let self = this;
		self.$http({
			method: 'GET',
			url: self.baseUrl + '/api/1/packages/' + plan_id
		}).success(function (data) {
			// response
			self.currentPackage = data;
			// set interval
			if (data.base_price > 0) {
				self.planduration = (data.period.period_unit == "year") ? 12 : data.period.period;
			} else {
				self.planduration = data.period.period;
			}
			// plan base price
			self.plan_unit_price = data.base_price;
			// prepare addon metrics with name
			if (self.addonmetrics) {
				self.extra_addons = [];
				angular.forEach(self.addonmetrics, function (value, index) {
					var metricId = value.id.match(/\d+$/)[0];
					// find metric
					var index = self.currentPackage.Metrics.findIndex(x => x._id == metricId);
					if (index != -1) {
						var unit_price = self.currentPackage.Metrics[index].addon.price;
						var bundle_type = self.currentPackage.Metrics[index].addon.bundle_type;
						var subtotal = (bundle_type == "bound") ? (parseInt(unit_price) * parseInt(self.planduration) * parseInt(value.quantity)) : (parseInt(unit_price) * parseInt(value.quantity));
						self.extra_addons_total = (self.extra_addons_total + subtotal);
						// push
						self.extra_addons.push({
							name: self.currentPackage.Metrics[index].name,
							key: self.currentPackage.Metrics[index].key,
							quantity: value.quantity,
							price: self.filter('currency')(unit_price, '', 2),
							subtotal: self.filter('currency')(subtotal, '', 2)
						});
					}
				});
			}
		});
	}
}

angular.module('gammawebsiteApp')
	.controller('LoginController', LoginController);
