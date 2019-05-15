'use strict';

class SignupController {
    //start-non-standard
    cart = {};
    os = {};
    user = {};
    billing = {};
    card = {};
    payment = {};
    currentsubscription = {};
    errors = {};
    submitted = false;

    step1Flag = true;
    step2Flag = false;
    step3Flag = false;
    step4Flag = false;
    step5Flag = false;

    cartToggle = false;
    accountToggle = false;
    billingToggle = false;
    paymentToggle = false;
    previewToggle = false;

    defaultplan = true;
    cardBrandToPfClass = {
        'visa': 'pf-visa',
        'mastercard': 'pf-mastercard',
        'amex': 'pf-american-express',
        // 'discover': 'pf-discover',
        // 'diners': 'pf-diners',
        // 'jcb': 'pf-jcb',
        'unknown': 'pf-credit-card',
    };

    packages = [];
    all_packages = [];
    monthlypackages = [];
    yearlypackages = [];
    packageoptions = {};
    metrics = [];
    i = 0;

    licenceDetail = {};
    features = [];
    selectedMetrics = {};
    licenseData = {};
    gammaUser = {};
    emailContent = {};

    //end-non-standard

    constructor(Auth, $state, $http, $location, $scope, User, toastr, $filter, $timeout, TenantLicense, $gammaAnalytics, appConfig, md5, ISO3166, $window, $cookies, $intercom) {
        let self = this;
        self.currentUser = {};

        this.Auth = Auth;
        this.state = $state;
        this.$http = $http;
        this.$location = $location;
        this.$scope = $scope;
        this.filter = $filter;
        this.UserService = User;
        this.TenantLicenseResource = TenantLicense;
        this.md5 = md5;
        this.ISO3166 = ISO3166;
        this.$window = $window;
        this.$cookies = $cookies;

        this.toastr = toastr;
        this.$timeout = $timeout;
        this.showSpinner = false;
        this.showSpinnerPrice = true;
        this.showSpinnerSubtotal = true;
        this.showSpinnerTotal = false;
        this.showSpinnerDueNow = false;
        this.showSpinnerPayment = false;
        this.cart.addons = [];
        this.cart.summary_addons = [];
        this.cart.total_addon_summary = [];
        this.cart.chargebeeaddons = {};
        this.cart.old_addons = [];

        this.cart.license_detail = {};
        this.cart.license_detail.package_json = {};
        this.cart.license_detail.package_json.packagemetrics = [];
        this.cart.license_detail.package_json.addonmetrics = [];

        this.os.license_detail = {};
        this.os.license_detail.package_json = {};
        this.os.license_detail.package_json.packagemetrics = [];
        this.os.license_detail.package_json.addonmetrics = [];

        this.default_tax_name = "TAX";
        this.cart.tax_name = this.default_tax_name;
        this.cart.vat_rate = 0;
        this.cart.vat_amount = 0;
        this.cart.totalexclvat = 0;
        this.cart.tax_flag = false;
        this.cart.disable_billing_fields = false;

        this.tenantlicense = {};
        this.tenantlicense.tenant_id = "";
        this.tenantlicense.license_detail = "";
        this.tenantlicense.plan_id = "";
        this.tenantlicense.subscription_id = "";
        this.tenantlicense.is_active = false;
        this.tenantlicense.created_dt = "";

        this.cardNumberError = "";
        this.cardExpiryError = "";
        this.cardCvcError = "";
        this.editPayment = false;
        this.displayPayment = true;
        this.isTrial = false;
        this.emailMetric = [];
        this.$gammaAnalytics = $gammaAnalytics;
        this.stripeKey = appConfig.stripeKey;
        this.email_pattern = new RegExp(appConfig.email_pattern);
        this.gamma_ui = appConfig.gamma_ui;
        this.gamma_ui_env = appConfig.gamma_ui_env;
        this.gamma_os_postfix = appConfig.gamma_os_postfix;
        this.isCurrentPlanFlag = true;
        this.logdata = {};
        this.cart.purchase_type = "individual";
        this.cart.country_type = "";
        this.$intercom = $intercom;

        // base url with port
        this.baseUrl = $location.protocol() + '://' + location.host;

        // plan interval options
        this.cart.planintervals = ["3", "12"];

        // default static values
        this.default_plan_interval = "3";
        this.default_plan_name = "Startup";

        // addon quantity threshold
        this.threshold = {
            users: 50,
            scans: 120,
            scan_history: 20
        };

        // get current state
        this.currentstate = this.state.current.name;

        // persist account info and billing info data
        this.user = (typeof this.UserService.user != "undefined") ? this.UserService.user : {};
        this.billing = (typeof this.UserService.billing != "undefined") ? this.UserService.billing : {};

        // stripe card hosted fields
        this.prepareCardElements();

        // set default credits
        this.cart.metricstotal = 0;
        this.cart.packagetotal = 0;
        this.cart.credits_applied = 0;
        this.cart.amount_due = 0;
        this.cart.has_scheduled_changes = false;
        this.cart.end_of_term = false;
        this.cart.credits_total = 0;
        this.cart.prorated_packageprice = 0;
        this.cart.credits_packageprice = 0;
        this.cart.next_billing_estimate = 0;
        this.cart.next_billing_estimate_date = "";
        this.cart.tax_format_placeholder = "";

        // old package object values
        this.cart.old_package = undefined;
        this.cart.totaladdons = [];

        this.cart.packagebaseprice_incl_tax = 0;
        this.cart.packageprice = 0;
        this.cart.packageprice_per_month = 0;

        // if local storage value not set
        if (localStorage.getItem('default_country_code') == null || typeof localStorage.getItem('default_country_code') == "undefined" || localStorage.getItem('default_country_code') == "") {
            // get client ip country
            $.getJSON('//ipinfo.io/json', function (data) {
                self.cart.default_country = (typeof data.country != "undefined") ? data.country : "";
                self.cart.default_country_name = self.ISO3166.getCountryName(self.cart.default_country);
                // new addition: set locals
                localStorage.setItem('default_country_code', self.cart.default_country);
            }).fail(function () {
                // if something fails then default country
                self.cart.default_country = "DE";
                self.cart.default_country_name = self.ISO3166.getCountryName(self.cart.default_country);
                // new addition: set locals
                localStorage.setItem('default_country_code', self.cart.default_country);
            });
        } else {
            // if local storage value set
            self.cart.default_country = localStorage.getItem('default_country_code');
            self.cart.default_country_name = self.ISO3166.getCountryName(self.cart.default_country);
            self.billing.country = localStorage.getItem('default_country_code');
        }

        // check if user is logged in
        this.Auth.isLoggedIn(function (data) {
            self.isLoggedIn = data;
        });

        if (this.currentstate == "signup" || this.currentstate == "dualaccount") {
            // flags
            this.isTrial = true;
            this.editPayment = true;
            this.displayPayment = false;
            this.isCurrentPlanFlag = false;
        }

        if (this.currentstate == 'signup') {
            if (this.UserService.pricing_plan_interval) {
                // pricing page
                this.cart.planduration = this.UserService.pricing_plan_interval.toString();
            } else if (this.UserService.configurator) {
                // configurator page
                this.cart.planduration = this.UserService.configurator.interval.toString();
            } else {
                // default interval
                this.cart.planduration = this.default_plan_interval;
            }
            this.getAllPackages();
        } else {
            this.getCurrentUserInfo();
        }

        // browser refresh warning
        // $window.onbeforeunload = function (event) {

        //     // Check if there was any change, if no changes, then simply let the user leave
        //     if (typeof this.form != "undefined" && !this.form.$dirty) {
        //         return;
        //     }
        //     var message = 'Are you sure you want to leave this page?';
        //     if (typeof event == 'undefined') {
        //         event = $window.event;
        //     }
        //     if ((event.target.URL == $location.protocol() + '://' + location.host + "/" + "signup")) {
        //         event.returnValue = message;
        //     } else {
        //         return;
        //     }
        //     return message;
        // }

        // browser back warning
        // $scope.$on('$locationChangeStart', function (event, next, current) {
        //     if ((next != $location.protocol() + '://' + location.host + "/" + "modifypackage") && (next != $location.protocol() + '://' + location.host + "/" + "signup") && (next != $location.protocol() + '://' + location.host + "/" + "changeplan")) {
        //         var answer = confirm('Changes that you made may not be saved.');
        //         if (!answer) {
        //             event.preventDefault();
        //         }
        //     }
        // });

        // get vat format data from json
        this.all_countries, this.eu_countries, this.non_eu_countries = [];
        this.$http.get('/assets/json/tax-info.pug.json')
            .then(response => {
                self.eu_countries = response.data.eu_countries;
                self.non_eu_countries = response.data.non_eu_countries;
                self.all_countries = self.eu_countries.concat(self.non_eu_countries);
                self.tax_format_countries = self.all_countries;
                // vat number placeholder text
                self.cart.tax_format_country = self.tax_format_countries.filter(function (i) {
                    return (i.country_code == self.cart.default_country);
                });
                self.cart.tax_format_placeholder = (self.cart.tax_format_country.length > 0) ? "Ex: " + self.cart.tax_format_country[0].format : "";
                self.cart.country_type = (self.cart.tax_format_country.length > 0) ? self.cart.tax_format_country[0].type : "";
            });
    }

    // get all packages from db
    getAllPackages() {
        let self = this;
        // from db
        this.$http({
            method: 'GET',
            url: this.baseUrl + '/api/1/packages'
        }).success(function (data) {
            // response
            data = data.filter(function (i) {
                return i.is_local == false;
            });
            self.packages = data;

            // toggle by plan interval
            self.togglePackageOptions(self.cart.planduration);

            // find plan index based on pricing or configurator values
            if (typeof self.UserService.pricing_package_id != 'undefined' && self.UserService.pricing_package_id != null) {
                var index = self.Auth.findIndex(self.packageoptions, '_id', self.UserService.pricing_package_id);
            } else if (self.UserService.configurator) {
                var index = self.Auth.findIndex(self.packageoptions, '_id', self.UserService.configurator._id);
            } else {
                // default value
                if (self.currentstate == "signup" || self.currentstate == "dualaccount") {
                    var index = self.Auth.findIndex(self.packageoptions, "name", self.default_plan_name);
                } else {
                    // changeplan
                    var index = self.Auth.findIndex(self.packageoptions, '_id', self.cart.package_id);
                }
            }

            // set cart obj values
            self.cart.packageindex = index;
            self.cart.package_id = typeof self.packageoptions[self.cart.packageindex] !== 'undefined' ? self.packageoptions[self.cart.packageindex]._id : "";
            self.cart.package_name = typeof self.packageoptions[self.cart.packageindex] !== 'undefined' ? self.packageoptions[self.cart.packageindex].name : "";

            // new addition base price incl tax
            self.cart.packagebaseprice_incl_tax = typeof self.packageoptions[self.cart.packageindex] !== 'undefined' ? self.packageoptions[self.cart.packageindex].base_price : 0;
            self.cart.packagebaseprice_incl_tax_pm = typeof self.packageoptions[self.cart.packageindex] !== 'undefined' ? (self.cart.packagebaseprice_incl_tax / self.cart.planduration) : 0;

            self.resetMetricValues();

            if (self.currentstate != "signup") {
                self.UserService.configurator = null;
                self.isCurrentPlanFlag = (self.cart.package_id == self.cart.old_package_id) ? true : false;
            }

            // Filter
            var emptyaddons = self.packageoptions[self.cart.packageindex].Metrics.filter(function (i) {
                return (i.is_selected && i.quantity > 0);
            });

            // cancelled state handling
            if (typeof self.currentUser.tenant_license != "undefined" && !self.currentUser.tenant_license.is_active) {
                self.getReactivateEstimates(self.cart.package_id, self.user.subscription_id);
            } else if (self.currentstate == 'changeplan' && !self.isCurrentPlanFlag && typeof self.currentUser.tenant_license != "undefined" && self.currentUser.tenant_license.is_active) {
                // modify plan case
                self.showSpinnerPrice = true;
                self.getPackageEstimates(self.cart.package_id, self.user.subscription_id);
            } else if (self.currentstate == 'changeplan' && self.isCurrentPlanFlag && emptyaddons.length > 0 && typeof self.currentUser.tenant_license != "undefined" && self.currentUser.tenant_license.is_active) {
                // add extras case
                self.getAddonEstimates(self.cart.old_package_id, self.user.subscription_id);
            } else {
                // call create estimate api
                if (self.currentstate == "signup" || self.currentstate == "dualaccount") {
                    self.showSpinnerPrice = true;
                    self.$timeout(function () {
                        self.getCreateEstimates();
                    }, 1000);
                } else {
                    // change plan
                    self.showSpinnerPrice = true;
                    self.$timeout(function () {
                        self.getDefaultEstimates();
                    }, 1000);
                }
            }
        });
    }

    // get logged in user and subscription info
    getCurrentUserInfo() {
        let self = this;

        // get logged in user info from db
        this.Auth.getCurrentUser(function (data) {
            // response
            self.currentUser = data;
            if (self.currentstate == 'dualaccount') {
                if (self.UserService.returning_from == 'login') {
                    // returning user via login
                    self.step1Flag = false;
                    self.step2Flag = true;
                } else {
                    // via page refresh or browser back
                    if (self.currentUser.is_trial) {
                        self.step1Flag = true;
                        self.step2Flag = false;
                    } else {
                        // via add account link
                        self.step1Flag = false;
                        self.step2Flag = true;
                    }
                }
                // self.step1Flag = (self.UserService.returning_from == 'login') ? false : true;
                // self.step2Flag = (self.UserService.returning_from == 'login') ? true : false;
                self.step3Flag = false;
                self.step4Flag = false;
                self.step5Flag = false;
            }
            // check logged in account is trial or not
            if (self.currentstate == 'dualaccount' && !self.currentUser.is_trial) {
                // set required fields
                self.user.subdomain = data.subdomain;
                self.user.email = data.email;
                self.user.first_name = data.first_name;
                self.user.last_name = data.last_name;
                self.user.company = data.company;
                self.user.password = data.password;
                self.user.status = data.status;

                self.getFreePackageInfo();
            } else {
                // prefill billing info job title field
                self.billing.job_title = (typeof self.currentUser.job_title != "undefined") ? self.currentUser.job_title : "";
                // set default billing info purchase type param
                self.cart.purchase_type = (typeof self.currentUser.purchase_type != "undefined") ? self.currentUser.purchase_type : self.cart.purchase_type;
                // set old license data for event log
                self.cart.old_license_data = self.currentUser.tenant_license;

                // by default show current account info
                if(self.currentstate == 'dualaccount') {
                    self.billing.first_name = data.first_name;
                    self.billing.last_name = data.last_name;
                }

                // set current user db values
                var currentUserInterval = (self.currentUser.tenant_license.license_detail.package_json.plan_interval) ? self.currentUser.tenant_license.license_detail.package_json.plan_interval : self.default_plan_interval;
                var currentUserSubscriptionId = self.currentUser.tenant_license.subscription_id;
                // extract id from string
                var currentUserPlanId = self.currentUser.tenant_license.plan_id.match(/\d+$/)[0];

                // set user obj values
                self.user.customer_id = self.currentUser.customer_id;
                self.user.tenant_id = self.currentUser._id;
                self.user.subscription_id = self.currentUser.tenant_license.subscription_id;
                self.user.tenant_license_id = self.currentUser.tenant_license._id;
                self.user.email = self.currentUser.email;
                self.user.subdomain = angular.lowercase(self.currentUser.subdomain);

                // set cart package id for further use
                self.cart.package_id = currentUserPlanId;

                // save old package data for comparison
                if (self.currentstate != "signup") {
                    self.cart.old_package_id = currentUserPlanId;
                    self.getPackageById(currentUserPlanId);
                }

                // set interval based on pricing or configurator or logged user plan interval
                if (self.UserService.pricing_plan_interval) {
                    self.cart.planduration = self.UserService.pricing_plan_interval.toString();
                } else if (self.UserService.configurator) {
                    self.cart.planduration = self.UserService.configurator.interval.toString();
                } else {
                    self.cart.planduration = currentUserInterval;
                }

                self.getAllPackages();

                if (!self.currentUser.is_trial) {
                    // save old plan data
                    self.getCurrentSubscriptionById(currentUserSubscriptionId);
                }

            }
        });
    }

    // new addition: get free open source package info
    getFreePackageInfo() {
        let self = this;

        // open source: get package info
        this.$http({
            method: 'GET',
            url: this.baseUrl + '/api/1/packages'
        }).success(function (data) {
            // response
            data = data.filter(function (i) {
                return i.is_local == false;
            });
            self.all_packages = angular.copy(data);
            // filter open source package only
            self.os.packages = self.all_packages.filter(function (i) {
                return (i.is_trial === true && i.active === 'active');
            });
            // open source package object
            self.os.package = self.os.packages[0];
            var os_metrics = (typeof self.os.package.Metrics != 'undefined') ? self.os.package.Metrics : [];
            self.os.package_json = [];
            angular.forEach(os_metrics, function (value, index) {
                self.os.package_json.push({
                    'id': value._id,
                    'key': value.key,
                    'name': value.name,
                    'default_value': value.package_metric.default_value,
                    'checkby': value.checkby
                });
            });
            // assign cart values
            self.os.license_detail.package_json.packagemetrics = self.os.package_json;
            self.os.license_detail.package_json.addonmetrics = [];
            self.os.license_detail.package_json.plan_name = (self.os.package.name) ? self.os.package.name : "Open source";
            self.os.license_detail.package_json.plan_interval = "";
            self.os.package_name = (self.os.package.name) ? self.os.package.name : "";
            self.os.package_id = (self.os.package._id) ? self.os.package._id : "";
            // current package features
            self.os.features = jQuery.map(self.os.package.Features, function (feature, i) {
                return feature.key;
            });
        });
    }

    // get current package info from db against static application id
    getPackageById(plan_id) {
        let self = this;
        self.$http({
            method: 'GET',
            url: self.baseUrl + '/api/1/packages/' + plan_id
        }).success(function (data) {
            // response
            var old_plan_data = data;
            // set old values
            if (old_plan_data.period.period == 3 && old_plan_data.period.period_unit == "month") {
                // monthly
                self.cart.old_package_interval = 3;
            } else if (old_plan_data.period.period == 1 && old_plan_data.period.period_unit == "year") {
                // yearly
                self.cart.old_package_interval = 12;
            } else {
                // trial or default
                self.cart.old_package_interval = 1;
            }
            self.cart.old_packageprice = (old_plan_data.base_price) ? old_plan_data.base_price : "";
            self.cart.old_package_name = (old_plan_data.name) ? old_plan_data.name : "";
            self.cart.is_trial = old_plan_data.is_trial;

            // Prepare addon metrics with name
            self.licensedetails = (typeof self.cart.old_license_data.license_detail.package_json != 'undefined') ? self.cart.old_license_data.license_detail.package_json : {};
            if (self.licensedetails.addonmetrics) {
                angular.forEach(self.licensedetails.addonmetrics, function (value, index) {
                    var metricId = value.id.match(/\d+$/)[0];
                    var index = self.Auth.findIndex(old_plan_data.Metrics, '_id', metricId);
                    if (index != -1) {
                        value.name = old_plan_data.Metrics[index].name;
                        value.label_name = (old_plan_data.Metrics[index].addon.label_name != "") ? old_plan_data.Metrics[index].addon.label_name : old_plan_data.Metrics[index].name;
                        value.price = old_plan_data.Metrics[index].addon.price;
                        value.bundle_type = old_plan_data.Metrics[index].addon.bundle_type;
                        value.charge_type = old_plan_data.Metrics[index].addon.charge_type;
                        // value.subtotal = (value.bundle_type == "bound") ? (parseFloat(value.price) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(value.price) * parseInt(value.quantity));
                        value.subtotal = 0;
                        // prepare addons for default estimates
                        if (value.charge_type == "recurring") {
                            self.cart.old_addons.push({
                                id: value.id,
                                quantity: value.quantity
                            });
                        }
                    } else {
                        value.name = value.id;
                        value.label_name = value.name;
                    }
                });
            }
        });
    }

    // get current subscription by chargebee api
    getCurrentSubscriptionById(subscription_id) {
        let self = this;
        this.$http({
            method: 'POST',
            url: self.baseUrl + '/api/v1/retrievesubscription'
        }).success(function (data) {
            // response
            self.currentsubscription = (data.result) ? data.result : {};

            // subscription billing info
            var BillingAddress = data.result.customer.billing_address;
            self.billing.first_name = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.first_name : BillingAddress.first_name;
            self.billing.last_name = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.last_name : BillingAddress.last_name;
            self.billing.company = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.company : BillingAddress.company;
            self.billing.street_address = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.street_address : BillingAddress.line1;
            self.billing.street_address_line2 = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.street_address_line2 : BillingAddress.line2;
            self.billing.city = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.city : BillingAddress.city;
            self.billing.zip = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.zip : BillingAddress.zip;
            self.billing.country = (typeof localStorage.getItem('default_country_code') != "undefined" || localStorage.getItem('default_country_code') != null || localStorage.getItem('default_country_code') != "") ? localStorage.getItem('default_country_code') : BillingAddress.country;
            self.billing.vat_number = (typeof self.UserService.billing != "undefined") ? self.UserService.billing.vat_number : data.result.customer.vat_number;

            // subscription card info
            self.card = data.result.card;
            if (self.card === undefined) {
                self.isTrial = true;
                self.editPayment = true;
                self.displayPayment = false;
            }
        });
    }

    // filter packages based on interval selection
    togglePackageOptions(planduration) {
        let self = this;
        var periodUnit = (planduration == 12) ? "year" : "month";
        var periodValue = (planduration == 12) ? 1 : planduration;
        // filter by plan interval
        this.packageoptions = this.packages.filter(function (i) {
            return (i.is_trial === false && (i.period.period == periodValue && i.period.period_unit == periodUnit));
        });

        if (self.isLoggedIn) {
            // only quarter
            this.quarterpackageoptions = this.packages.filter(function (i) {
                return (i.is_trial === false && (i.period.period == 3 && i.period.period_unit == "month"));
            });
            // only year
            this.yearpackageoptions = this.packages.filter(function (i) {
                return (i.is_trial === false && (i.period.period == 1 && i.period.period_unit == "year"));
            });
            // find old plan index by old plan id
            if (typeof self.filter_old_index === "undefined") {
                self.filter_old_index = self.Auth.findIndex(self.packageoptions, '_id', self.cart.old_package_id);
            }
            // check old plan is trial or not
            self.oldpackage = self.packages.filter(function (i) {
                return i._id == self.old_package_id;
            });
            var filter_is_trial = (self.oldpackage.length) ? self.oldpackage[0].is_trial : false;
            var filter_with_same_plan = (parseInt(self.cart.old_package_interval) < parseInt(self.cart.planduration)) ? true : false;

            // find plan name to filter
            var pricing_package_id = (typeof self.UserService.pricing_package_id != "undefined") ? self.UserService.pricing_package_id : undefined;
            if (typeof pricing_package_id != "undefined" && self.cart.old_package_id != pricing_package_id) {
                var filter_index = (typeof self.UserService.pricing_packageindex != "undefined") ? self.UserService.pricing_packageindex : self.filter_old_index;
            } else {
                var filter_index = self.filter_old_index;
            }
            var tmp_index = self.Auth.findIndex(this.packages, '_id', self.UserService.pricing_package_id);
            var tmp_plan_name = (tmp_index != -1) ? this.packages[tmp_index].name : self.cart.old_package_name;
            var filter_plan_name = (!filter_is_trial) ? tmp_plan_name : "";

            // set default value
            self.hide_interval = undefined;
            if (self.cart.planduration == 3) {
                // find in yearly
                if (filter_index != -1) {
                    var filter_plan_id = (!filter_is_trial) ? self.yearpackageoptions[filter_index]._id : 0;
                    var filter_base_price = (!filter_is_trial) ? self.yearpackageoptions[filter_index].base_price : 0;
                    // filter yearly options
                    this.yearpackageoptions = this.yearpackageoptions.filter(function (i) {
                        return (!filter_with_same_plan) ? i.base_price >= filter_base_price : i.base_price >= filter_base_price;
                    });
                    // find by plan name
                    var ispresent = self.Auth.findIndex(this.yearpackageoptions, 'name', filter_plan_name);
                    // hide interval if plan not found
                    if (ispresent == -1) {
                        self.hide_interval = 12;
                    }
                } else {
                    self.hide_interval = 12;
                }
            } else if (self.cart.planduration == 12) {
                // find in paid quarterly
                if (filter_index != -1) {
                    var filter_plan_id = (!filter_is_trial) ? self.quarterpackageoptions[filter_index]._id : 0;
                    var filter_base_price = (!filter_is_trial) ? self.quarterpackageoptions[filter_index].base_price : 0;
                    // filter yearly options
                    this.quarterpackageoptions = this.quarterpackageoptions.filter(function (i) {
                        return (!filter_with_same_plan) ? i.base_price > filter_base_price : i.base_price >= filter_base_price;
                    });
                    // find by plan name
                    var ispresent = self.Auth.findIndex(this.quarterpackageoptions, 'name', filter_plan_name);
                    // hide interval if plan not found
                    if (ispresent == -1) {
                        self.hide_interval = 3;
                    }
                } else {
                    self.hide_interval = 3;
                }
            }
        }
    }

    // trigger on change event
    resetMetricValues() {
        let self = this;
        var metricsTotal = 0;

        // loop
        var metricsObj = (this.packageoptions[this.cart.packageindex]) ? this.packageoptions[this.cart.packageindex].Metrics : {};
        angular.forEach(metricsObj, function (value, index) {
            if (value.addon) {
                // quantity threshold value
                if (value.key == "users") {
                    var threshold = self.threshold.users;
                } else if (value.key == "scans") {
                    var threshold = self.threshold.scans;
                } else if (value.key == "scan_history") {
                    var threshold = self.threshold.scan_history;
                } else {
                    var threshold = 10;
                }
                // prepare bundle options
                value.bundle_options = [];
                for (var i = 1; i <= threshold; i++) {
                    var opt_value = (i * value.addon.bundle_size) + " " + value.name;
                    value.bundle_options.push(opt_value);
                }

                // configurator
                if (self.currentstate == 'signup' && self.UserService.configurator) {
                    if (self.UserService.configurator.Metrics.length > 0) {
                        // find metric
                        var i = self.Auth.findIndex(self.UserService.configurator.Metrics, '_id', value._id);
                        var qty = (i != -1) ? self.UserService.configurator.Metrics[i].quantity : "1";
                        value.is_selected = (i != -1 && qty > 0) ? true : false;
                        value.extras = (qty > 0) ? qty : 1;
                        value.quantity = (qty > 0) ? value.extras : value.extras;
                    } else {
                        value.is_selected = false;
                        value.extras = 1;
                        value.quantity = "1";
                    }
                    value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(value.addon.price) * parseInt(value.extras));
                    // new addition display subtotal base price incl tax
                    value.addon.subtotal_incl_tax = 0;
                } else if (typeof self.cart.old_package != "undefined" || typeof self.UserService.old_package != "undefined") {
                    // retain selected addon quantity from old package on interval change
                    if (typeof self.UserService.old_package != 'undefined') {
                        var i = self.Auth.findIndex(self.UserService.old_package.Metrics, '_id', value._id);
                        value.is_selected = self.UserService.old_package.Metrics[i].is_selected;
                        var qty = self.UserService.old_package.Metrics[i].quantity;
                    } else {
                        var i = self.Auth.findIndex(self.cart.old_package.Metrics, '_id', value._id);
                        value.is_selected = self.cart.old_package.Metrics[i].is_selected;
                        var qty = self.cart.old_package.Metrics[i].quantity;
                    }
                    value.extras = qty;
                    value.quantity = qty;
                    // new addition display subtotal base price incl tax
                    var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                    var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                    value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                    // set default subtotal incl tax
                    value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                } else {
                    // is addon selected param
                    value.is_selected = false;
                    // quantity as integer for calculation
                    value.extras = 1;
                    // quantity as string for dropdown option selection
                    value.quantity = "1";
                    // new addition display subtotal base price incl tax
                    var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                    var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                    value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                    // set default subtotal incl tax
                    value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                }

                // add to total if checked
                if (value.is_selected) {
                    // sum of
                    metricsTotal = (metricsTotal + value.addon.subtotal);
                }
            }
        });
        // override metrics total
        self.cart.metricstotal = metricsTotal;

        // reset is current plan flag
        this.isCurrentPlanFlag = (this.cart.package_id == this.cart.old_package_id) ? true : false;
        if (!self.isCurrentPlanFlag) {
            // store old package to retain selected addon quantity
            self.cart.old_package = self.packageoptions[self.cart.packageindex];
            // store for dualaccount purpose
            self.UserService.old_package = self.cart.old_package;
        }
    }

    // estimate based on interval selection
    changeinterval(planduration) {
        // reset errors
        this.errors.validpackageflag = false;
        this.errors.emptyaddonflag = false;
        // override interval
        this.cart.planduration = planduration;

        this.togglePackageOptions(planduration);
        this.resetMetricValues();

        // override cart obj values
        this.cart.package_id = typeof this.packageoptions[this.cart.packageindex] !== 'undefined' ? this.packageoptions[this.cart.packageindex]._id : "";
        // this.cart.packageprice = (typeof this.packageoptions[this.cart.packageindex] !== 'undefined' ? this.packageoptions[this.cart.packageindex].base_price : 0);
        // this.cart.packageprice_per_month = (typeof this.packageoptions[this.cart.packageindex] !== 'undefined' ? (this.packageoptions[this.cart.packageindex].base_price / this.cart.planduration) : 0);
        this.cart.package_name = typeof this.packageoptions[this.cart.packageindex] !== 'undefined' ? this.packageoptions[this.cart.packageindex].name : "";

        // new addition base price incl tax
        this.cart.packagebaseprice_incl_tax = typeof this.packageoptions[this.cart.packageindex] !== 'undefined' ? this.packageoptions[this.cart.packageindex].base_price : 0;
        this.cart.packagebaseprice_incl_tax_pm = typeof this.packageoptions[this.cart.packageindex] !== 'undefined' ? (this.cart.packagebaseprice_incl_tax / this.cart.planduration) : 0;

        if (this.currentstate == "signup" || this.currentstate == "dualaccount") {
            // first-time signup case
            this.showSpinnerPrice = true;
            this.getCreateEstimates();
        } else if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
            // cancel or reactivate state case
            this.doMetricsTotal(this.packageoptions[this.cart.packageindex]);
            this.doPackageEstimates(this.cart.metricstotal);
        } else {
            // otherwise
            this.isCurrentPlanFlag = (this.cart.package_id == this.cart.old_package_id) ? true : false;
            this.showSpinnerPrice = true;
            this.getPackageEstimates(this.cart.package_id, this.user.subscription_id);
        }

        // estimate next billing amount
        this.getNextBillingAmount();
    }

    addonselected(metrics, index) {
        let self = this;
        // reset errors
        this.errors.emptyaddonflag = false;
        // reset metric values to zero, if uncheck
        if (!metrics.is_selected) {
            metrics.extras = 1;
            metrics.quantity = "1";
            // set default subtotal incl tax
            var taxIncl = (self.cart.vat_rate > 0) ? ((metrics.addon.price * self.cart.vat_rate) / 100) : 0;
            var addon_price_incl_tax = (parseFloat(metrics.addon.price) + parseFloat(taxIncl));
            metrics.addon.subtotal = (metrics.addon.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(metrics.extras) * this.cart.planduration) : (parseFloat(addon_price_incl_tax) * parseInt(metrics.extras));
        }

        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });

        // store old package to retain selected addon quantity
        self.cart.old_package = self.packageoptions[self.cart.packageindex];
        // store for dualaccount purpose
        self.UserService.old_package = self.cart.old_package;

        if (this.currentstate == "signup" || this.currentstate == "dualaccount") {
            // first-time signup
            this.getCreateEstimates();
        } else if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
            // cancel or reactivate case
            this.doMetricsTotal(this.packageoptions[this.cart.packageindex]);
            this.doPackageEstimates(this.cart.metricstotal);
        } else {
            // change plan
            if (this.isCurrentPlanFlag && emptyaddons.length == 0) {
                // default addon deselected case
                this.doMetricsTotal(this.packageoptions[this.cart.packageindex]);
                this.doPackageEstimates(this.cart.metricstotal);
            } else if (this.isCurrentPlanFlag && emptyaddons.length > 0) {
                // add extras case
                this.getAddonEstimates(this.cart.old_package_id, this.user.subscription_id);
            } else {
                // modify plan case
                this.getPackageEstimates(this.cart.package_id, this.user.subscription_id);
            }
        }
    }

    // estimate based on addon selection
    changeaddon(metrics, index) {
        let self = this;
        // reset errors
        this.errors.emptyaddonflag = false;

        // set selected metric quantity
        this.packageoptions[this.cart.packageindex].Metrics[index].extras = metrics.quantity;
        this.packageoptions[this.cart.packageindex].Metrics[index].qunaity = metrics.quantity;

        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });

        // store old package to retain selected addon quantity
        self.cart.old_package = self.packageoptions[self.cart.packageindex];
        // store for dualaccount purpose
        self.UserService.old_package = self.cart.old_package;

        if (this.currentstate == "signup" || this.currentstate == "dualaccount") {
            // first-time signup
            this.getCreateEstimates();
        } else if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
            // cancel or reactivate case
            this.doMetricsTotal(this.packageoptions[this.cart.packageindex]);
            this.doPackageEstimates(this.cart.metricstotal);
        } else {
            // change plan
            if (this.isCurrentPlanFlag && emptyaddons.length > 0) {
                // add extras case
                this.getAddonEstimates(this.cart.old_package_id, this.user.subscription_id);
            } else if (!this.isCurrentPlanFlag) {
                // modify plan case
                this.getPackageEstimates(this.cart.package_id, this.user.subscription_id);
            }
        }
    }

    // sum of all selected metrics
    doMetricsTotal(selectedPackageObj) {
        let self = this;
        var metricsTotal = 0;
        // loop
        angular.forEach(selectedPackageObj.Metrics, function (value, index) {
            if (value.addon) {
                if (value.is_selected) {
                    // find base price based on interval
                    var addonBasePrice = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * self.cart.planduration) : (parseFloat(value.addon.price));
                    // calculate metric subtotal
                    var addonSubtotal = (addonBasePrice * value.extras);
                    value.addon.subtotal = addonSubtotal;
                    // sum of
                    metricsTotal = (metricsTotal + value.addon.subtotal);
                }
            }
        });
        // reassign metric total
        this.cart.metricstotal = metricsTotal;
    }

    // estimate selected package items
    doPackageEstimates(metricstotal) {
        let self = this;
        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });

        // override metrics total value
        this.cart.metricstotal = metricstotal;

        // old addons total
        var old_addonmetrics_total = 0;
        if (typeof this.currentUser.tenant_license != "undefined") {
            if (self.cart.old_license_data) {
                angular.forEach(self.cart.old_license_data.license_detail.package_json.addonmetrics, function (value, index) {
                    if (value.bundle_type == "bound") {
                        old_addonmetrics_total = (old_addonmetrics_total + value.subtotal);
                    }
                });
            }
        }

        // sum of plan base price and metrics total
        if (this.isCurrentPlanFlag && emptyaddons.length == 0 && typeof this.currentUser.tenant_license != "undefined" && this.currentUser.tenant_license.is_active) {
            // default case
            this.cart.credits_applied = 0;
            this.cart.packagetotal = 0;
            this.cart.amount_due = 0;
            this.cart.vat_amount = 0;
            this.cart.totalexclvat = 0;
            // cancelled state handling
            if (!this.currentUser.tenant_license.is_active) {
                this.cart.packagetotal = (this.cart.packageprice + old_addonmetrics_total);
            }
        } else if (this.isCurrentPlanFlag && emptyaddons.length > 0 && typeof this.currentUser.tenant_license != "undefined" && this.currentUser.tenant_license.is_active) {
            // cancelled state handling
            if (!this.currentUser.tenant_license.is_active) {
                this.cart.packagetotal = (this.cart.packageprice + this.cart.metricstotal);
            }
        } else {
            // cancelled state handling
            if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
                self.getReactivateEstimates(self.cart.package_id, self.user.subscription_id);
            }
        }

        if (this.currentstate != "signup") {
            // reset taxes
            self.cart.totalexclvat = 0;
            self.cart.totalexclvat = (parseFloat(self.cart.packagetotal).toFixed(2) - parseFloat(self.cart.vat_amount).toFixed(2));
        }

        // estimate next billing amount
        this.getNextBillingAmount();
    }

    // default estimates
    getDefaultEstimates() {
        let self = this;
        // new addition: get locals
        this.cart.default_country = (typeof localStorage.getItem('default_country_code') != "undefined" || localStorage.getItem('default_country_code') != null || localStorage.getItem('default_country_code') != "") ? localStorage.getItem('default_country_code') : this.cart.default_country;
        this.cart.default_country_name = this.ISO3166.getCountryName(this.cart.default_country);
        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });
        var plan_id = "plan" + this.cart.package_id;
        var params = {
            plan_id: plan_id,
            addons: self.cart.old_addons,
            billing_country: this.cart.default_country
        };
        // cancel state handling
        if (typeof this.currentsubscription.subscription != "undefined" && this.currentsubscription.subscription.status == "cancelled") {
            params.reactivate = true;
        }
        // new addition spinner circle show
        // this.showSpinnerPrice = true;
        this.showSpinnerSubtotal = true;
        this.showSpinnerTotal = false;
        this.showSpinnerDueNow = false;
        // request api
        this.$http({
            method: 'POST',
            url: this.baseUrl + '/api/v1/update_subscription_estimate',
            data: params
        }).success(function (data) {
            var line_items = [];
            if (typeof data.result.estimate.invoice_estimate != "undefined") {
                line_items = data.result.estimate.invoice_estimate.line_items;
                var taxes = data.result.estimate.invoice_estimate.taxes;
                var line_item_taxes = data.result.estimate.invoice_estimate.line_item_taxes;
                var total = (data.result.estimate.invoice_estimate.total / 100);
                var amount_due = (data.result.estimate.invoice_estimate.amount_due / 100);
            } else if (typeof data.result.estimate.next_invoice_estimate != "undefined") {
                line_items = data.result.estimate.next_invoice_estimate.line_items;
                var taxes = data.result.estimate.next_invoice_estimate.taxes;
                var line_item_taxes = data.result.estimate.next_invoice_estimate.line_item_taxes;
                var total = (data.result.estimate.next_invoice_estimate.total / 100);
                var amount_due = (data.result.estimate.next_invoice_estimate.amount_due / 100);
            }

            // vat rate and amount
            self.cart.vat_rate = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_rate : 0;
            self.cart.tax_name = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_name : self.default_tax_name;
            self.cart.vat_amount = 0;
            // collect no tax for eu region but not Germany
            if (self.cart.purchase_type == 'company' && typeof self.billing.vat_number != "undefined" && self.billing.vat_number != '' && self.cart.country_type == "eu" && self.cart.default_country != "DE") {
                // unset tax rate and amount
                self.cart.vat_rate = 0;
            }

            // new addition base price incl tax
            var tax_amount = (self.packageoptions[self.cart.packageindex].base_price > 0) ? ((self.packageoptions[self.cart.packageindex].base_price * self.cart.vat_rate) / 100) : 0;
            self.cart.packagebaseprice_incl_tax = (self.packageoptions[self.cart.packageindex].base_price + tax_amount);
            self.cart.packagebaseprice_incl_tax_pm = (self.cart.packagebaseprice_incl_tax / self.cart.planduration);

            // new addition: set locals
            localStorage.setItem('default_country_code_old', self.cart.default_country);
            localStorage.setItem('default_tax_rate', self.cart.vat_rate);
            localStorage.setItem('default_tax_name', self.cart.tax_name);
            // console.log("get-default-estimates: vat_rate: " + self.cart.vat_rate + " - country_code: " + self.cart.default_country + " - country_name: " + self.cart.default_country_name + " - isCurrentPlanFlag: " + self.isCurrentPlanFlag);

            var metricsTotal = 0;
            if (line_items.length) {
                // plan prorated amount
                var isPlanInLineItem = line_items.filter(function (i) {
                    return i.entity_id === plan_id;
                });

                if (isPlanInLineItem.length) {
                    // prorated prices incl tax
                    var plan_amount = (isPlanInLineItem[0].amount / 100);
                    var tax_amount = (isPlanInLineItem[0].tax_amount / 100);
                    self.cart.packageprice = (plan_amount + tax_amount);
                } else {
                    // otherwise
                    self.cart.packageprice = 0;
                }

                // calculate default metrics subtotal incl tax
                if (self.licensedetails.addonmetrics) {
                    angular.forEach(self.licensedetails.addonmetrics, function (value, index) {
                        // set old addon subtotal incl tax
                        var taxIncl = (self.cart.vat_rate > 0) ? ((value.price * self.cart.vat_rate) / 100) : 0;
                        var addon_price_incl_tax = (parseFloat(value.price) + parseFloat(taxIncl));
                        value.subtotal = (value.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                    });
                }

                // set default subtotal incl tax
                angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
                    if (value.addon) {
                        // new addition display subtotal base price incl tax
                        var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                        var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                        value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                        // set default subtotal incl tax
                        value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                    }
                });
            }

            // default metrics total
            self.cart.metricstotal = metricsTotal;


            if (self.isCurrentPlanFlag && emptyaddons.length == 0 && typeof self.currentUser.tenant_license != "undefined" && self.currentUser.tenant_license.is_active) {
                // calculate
                self.cart.packagetotal = 0;
                self.cart.totalexclvat = 0;
                self.cart.amount_due = 0;
            }

            // new addition spinner circle hide
            self.showSpinnerPrice = false;
            self.showSpinnerSubtotal = false;
            self.showSpinnerTotal = false;
            self.showSpinnerDueNow = false;

            // Recalculate
            self.$timeout(function () {
                self.doPackageEstimates(self.cart.metricstotal);
            });
        });
    }

    // create estimates for first-time signup
    getCreateEstimates() {
        let self = this;
        var plan_id = "plan" + this.cart.package_id;
        // prepare selected addons
        this.getAddons(this.packageoptions[this.cart.packageindex]);
        // new addition spinner circle show
        // this.showSpinnerPrice = true;
        this.showSpinnerSubtotal = true;
        this.showSpinnerTotal = true;
        this.showSpinnerDueNow = true;
        // new addition: get locals
        this.cart.default_country = (typeof localStorage.getItem('default_country_code') != "undefined" || localStorage.getItem('default_country_code') != null || localStorage.getItem('default_country_code') != "") ? localStorage.getItem('default_country_code') : this.cart.default_country;
        this.cart.default_country_name = this.ISO3166.getCountryName(this.cart.default_country);
        // request api
        this.$http({
            method: 'POST',
            url: this.baseUrl + '/api/v1/create_subscription_estimate',
            data: {
                plan_id: plan_id,
                billing_address: {
                    country: this.cart.default_country
                },
                addons: this.cart.chargebeeaddons
            }
        }).success(function (data) {
            var line_items = [];
            if (typeof data.result.estimate.invoice_estimate != "undefined") {
                line_items = data.result.estimate.invoice_estimate.line_items;
                var taxes = data.result.estimate.invoice_estimate.taxes;
                var line_item_taxes = data.result.estimate.invoice_estimate.line_item_taxes;
                var total = (data.result.estimate.invoice_estimate.total / 100);
                var amount_due = (data.result.estimate.invoice_estimate.amount_due / 100);
            } else if (typeof data.result.estimate.next_invoice_estimate != "undefined") {
                line_items = data.result.estimate.next_invoice_estimate.line_items;
                var taxes = data.result.estimate.next_invoice_estimate.taxes;
                var line_item_taxes = data.result.estimate.next_invoice_estimate.line_item_taxes;
                var total = (data.result.estimate.next_invoice_estimate.total / 100);
                var amount_due = (data.result.estimate.next_invoice_estimate.amount_due / 100);
            }

            // vat rate and amount
            self.cart.vat_rate = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_rate : 0;
            self.cart.tax_name = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_name : self.default_tax_name;
            self.cart.vat_amount = (taxes.length > 0) ? (taxes[0].amount / 100) : 0;
            // collect no tax for eu region but not Germany
            if (self.cart.purchase_type == 'company' && typeof self.billing.vat_number != "undefined" && self.billing.vat_number != '' && self.cart.country_type == "eu" && self.cart.default_country != "DE") {
                // exclude vat amount
                total = (parseFloat(total) - parseFloat(self.cart.vat_amount));
                amount_due = (parseFloat(amount_due) - parseFloat(self.cart.vat_amount));
                // unset tax rate and amount
                self.cart.vat_rate = 0;
                self.cart.vat_amount = 0;
            }

            // new addition base price incl tax
            var tax_amount = (self.packageoptions[self.cart.packageindex].base_price > 0) ? ((self.packageoptions[self.cart.packageindex].base_price * self.cart.vat_rate) / 100) : 0;
            self.cart.packagebaseprice_incl_tax = (self.packageoptions[self.cart.packageindex].base_price + tax_amount);
            self.cart.packagebaseprice_incl_tax_pm = (self.cart.packagebaseprice_incl_tax / self.cart.planduration);

            // new addition: set locals
            localStorage.setItem('default_country_code_old', self.cart.default_country);
            localStorage.setItem('default_tax_rate', self.cart.vat_rate);
            localStorage.setItem('default_tax_name', self.cart.tax_name);
            // console.log("get-create-estimates: vat_rate: " + self.cart.vat_rate + " - country_code: " + self.cart.default_country + " - country_name: " + self.cart.default_country_name + " - isCurrentPlanFlag: " + self.isCurrentPlanFlag);

            var metricsTotal = 0;
            if (line_items.length) {
                // plan prorated amount
                var isPlanInLineItem = line_items.filter(function (i) {
                    return i.entity_id === plan_id;
                });

                if (isPlanInLineItem.length) {
                    // prorated prices incl tax
                    var plan_amount = (isPlanInLineItem[0].amount / 100);
                    var tax_amount = (isPlanInLineItem[0].tax_amount / 100);
                    self.cart.packageprice = (plan_amount + tax_amount);
                } else {
                    // otherwise
                    self.cart.packageprice = 0;
                }

                // metrics prices
                angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
                    if (value.addon) {
                        // new addition display subtotal base price incl tax
                        var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                        var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                        value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                        // set default subtotal incl tax
                        value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));

                        var isItemExist = line_items.filter(function (i) {
                            return i.entity_id === "metric" + value._id;
                        });
                        if (isItemExist.length) {
                            // store prorated subtotal
                            // value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(value.addon.price) * parseInt(value.quantity));

                            // new addition prorated subtotal incl tax
                            var amt = (isItemExist[0].amount / 100);
                            var tax_amt = (isItemExist[0].tax_amount / 100);
                            var addon_amt_incl_tax = (amt + tax_amt);
                            // override estimate prices
                            value.addon.subtotal = addon_amt_incl_tax;

                            if (value.is_selected) {
                                // Addition
                                metricsTotal = (metricsTotal + value.addon.subtotal);
                            }
                        }
                    }
                });
            }

            // default metrics total
            self.cart.metricstotal = metricsTotal;

            // calculate
            self.cart.packagetotal = total;
            self.cart.totalexclvat = (parseFloat(self.cart.packagetotal).toFixed(2) - parseFloat(self.cart.vat_amount).toFixed(2));
            self.cart.amount_due = amount_due;

            // new addition spinner circle hide
            self.showSpinnerPrice = false;
            self.showSpinnerSubtotal = false;
            self.showSpinnerTotal = false;
            self.showSpinnerDueNow = false;

            // Recalculate
            self.$timeout(function () {
                self.doPackageEstimates(self.cart.metricstotal);
            });
        });
    }

    // estimate selected package items by chargebee api
    getPackageEstimates(plan_id, subscription_id) {
        let self = this;
        var params = {};
        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });

        if (this.isCurrentPlanFlag && emptyaddons.length == 0) {
            // new addition base price incl tax
            var tax_amount = (typeof this.cart.vat_rate != "undefined" && this.cart.vat_rate > 0) ? ((this.packageoptions[this.cart.packageindex].base_price * this.cart.vat_rate) / 100) : 0;
            this.cart.packagebaseprice_incl_tax = (this.packageoptions[this.cart.packageindex].base_price + tax_amount);
            this.cart.packagebaseprice_incl_tax_pm = (this.cart.packagebaseprice_incl_tax / this.cart.planduration);
            // set current package totals
            this.cart.packageprice = this.cart.packagebaseprice_incl_tax;
            this.cart.metricstotal = 0;
            this.cart.packagetotal = 0;
            this.cart.credits_applied = 0;
            this.cart.amount_due = 0;
            this.cart.vat_amount = 0;
            this.cart.totalexclvat = 0;
            // new addition spinner circle hide
            self.showSpinnerPrice = false;
            self.showSpinnerSubtotal = false;
            self.showSpinnerTotal = false;
            self.showSpinnerDueNow = false;
        } else {
            this.errors.validpackageflag = false;
            this.errors.validpackage = "";

            // Apply changes immediately or on renewal based on upgrade or downgrade
            // var end_of_term = (this.cart.packageprice < this.cart.old_packageprice) ? true : false;
            var end_of_term = false;

            // set replace addon param based on plan interval
            var replace_addon_list = (this.cart.planduration == this.cart.old_package_interval) ? false : true;

            // prepare addons array
            var tmpAddons = [];
            this.cart.totaladdons = [];
            this.cart.total_addonmetrics = [];
            angular.forEach(this.packageoptions[this.cart.packageindex].Metrics, function (value, index) {
                var isPresentMetricQty = 0;
                var isPresentMetric = self.currentUser.tenant_license.license_detail.package_json.addonmetrics.filter(function (i) {
                    return i.id === "metric" + value._id;
                });

                if (isPresentMetric.length) {
                    isPresentMetricQty = isPresentMetric[0].quantity;
                }

                // only addons with checkbox checked
                if (value.addon && value.extras > 0 && value.is_selected) {
                    if (self.cart.planduration != self.cart.old_package_interval) {
                        // Downgrade or reactivate or different interval case
                        var estimateMetricQty = value.extras;
                        var totalAddonMetricQty = value.extras;
                    } else {
                        // Upgrade case send old + new qty
                        var estimateMetricQty = (value.addon.bundle_type == "bound") ? (parseInt(value.extras) + parseInt(isPresentMetricQty)) : parseInt(value.extras);
                        var totalAddonMetricQty = (parseInt(value.extras) + parseInt(isPresentMetricQty));
                    }
                    // prepare
                    tmpAddons.push({
                        'id': "metric" + value._id,
                        'quantity': estimateMetricQty
                    });
                    // prepare cart addons obj
                    self.cart.totaladdons.push({
                        'id': "metric" + value._id,
                        'quantity': estimateMetricQty,
                        'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                    });
                    // prepare total addon metrics
                    self.cart.total_addonmetrics.push({
                        'id': "metric" + value._id,
                        'quantity': totalAddonMetricQty,
                        'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                    });
                } else {
                    // prepare total addon metrics
                    if (self.cart.planduration == self.cart.old_package_interval) {
                        // push old addonmetric even if unchecked
                        self.cart.total_addonmetrics.push({
                            'id': "metric" + value._id,
                            'quantity': isPresentMetricQty,
                            'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                        });
                    }
                }
            });

            // Filter addons
            this.cart.totaladdons = this.cart.totaladdons.filter(function (i) {
                return i.quantity > 0;
            });

            // Filter addons
            this.cart.total_addonmetrics = this.cart.total_addonmetrics.filter(function (i) {
                return i.quantity > 0;
            });

            // new addition: get locals
            this.cart.default_country = (typeof localStorage.getItem('default_country_code') != "undefined" || localStorage.getItem('default_country_code') != null || localStorage.getItem('default_country_code') != "") ? localStorage.getItem('default_country_code') : this.cart.default_country;
            this.cart.default_country_name = this.ISO3166.getCountryName(this.cart.default_country);

            var plan_id = "plan" + plan_id;
            var params = {
                plan_id: plan_id,
                subscription_params: params,
                addons: tmpAddons,
                replace_addon_list: replace_addon_list,
                end_of_term: end_of_term,
                billing_country: this.cart.default_country
            };
            // apply only in trial to paid plan case
            if (this.cart.is_trial) {
                params.prorate = false;
            }
            // new addition spinner circle show
            // this.showSpinnerPrice = true;
            this.showSpinnerSubtotal = true;
            this.showSpinnerTotal = true;
            this.showSpinnerDueNow = true;
            // request api
            this.$http({
                method: 'POST',
                url: this.baseUrl + '/api/v1/update_subscription_estimate',
                data: params
            }).success(function (data) {
                var credits_applied = 0;
                var line_items = [];
                if (typeof data.result.estimate.invoice_estimate != "undefined") {
                    credits_applied = data.result.estimate.invoice_estimate.credits_applied;
                    line_items = data.result.estimate.invoice_estimate.line_items;
                    var taxes = data.result.estimate.invoice_estimate.taxes;
                    var line_item_taxes = data.result.estimate.invoice_estimate.line_item_taxes;
                    var total = (data.result.estimate.invoice_estimate.total / 100);
                    var amount_due = (data.result.estimate.invoice_estimate.amount_due / 100);
                } else if (typeof data.result.estimate.next_invoice_estimate != "undefined") {
                    credits_applied = data.result.estimate.next_invoice_estimate.credits_applied;
                    line_items = data.result.estimate.next_invoice_estimate.line_items;
                    var taxes = data.result.estimate.next_invoice_estimate.taxes;
                    var line_item_taxes = data.result.estimate.next_invoice_estimate.line_item_taxes;
                    var total = (data.result.estimate.next_invoice_estimate.total / 100);
                    var amount_due = (data.result.estimate.next_invoice_estimate.amount_due / 100);
                }

                // vat rate and amount
                self.cart.vat_rate = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_rate : 0;
                self.cart.tax_name = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_name : self.default_tax_name;
                self.cart.vat_amount = (taxes.length > 0) ? (taxes[0].amount / 100) : 0;
                // collect no tax for eu region but not Germany
                if (self.cart.purchase_type == 'company' && typeof self.billing.vat_number != "undefined" && self.billing.vat_number != '' && self.cart.country_type == "eu" && self.cart.default_country != "DE") {
                    // exclude vat amount
                    total = (parseFloat(total) - parseFloat(self.cart.vat_amount));
                    amount_due = (parseFloat(amount_due) - parseFloat(self.cart.vat_amount));
                    // unset tax rate and amount
                    self.cart.vat_rate = 0;
                    self.cart.vat_amount = 0;
                }

                // new addition base price incl tax
                var tax_amount = (self.packageoptions[self.cart.packageindex].base_price > 0) ? ((self.packageoptions[self.cart.packageindex].base_price * self.cart.vat_rate) / 100) : 0;
                self.cart.packagebaseprice_incl_tax = (self.packageoptions[self.cart.packageindex].base_price + tax_amount);
                self.cart.packagebaseprice_incl_tax_pm = (self.cart.packagebaseprice_incl_tax / self.cart.planduration);

                // new addition: set locals
                localStorage.setItem('default_country_code_old', self.cart.default_country);
                localStorage.setItem('default_tax_rate', self.cart.vat_rate);
                localStorage.setItem('default_tax_name', self.cart.tax_name);
                // console.log("get-package-estimates: vat_rate: " + self.cart.vat_rate + " - country_code: " + self.cart.default_country + " - country_name: " + self.cart.default_country_name + " - isCurrentPlanFlag: " + self.isCurrentPlanFlag);

                credits_applied = (credits_applied / 100);

                // calculate default metrics subtotal incl tax
                if (self.licensedetails.addonmetrics) {
                    angular.forEach(self.licensedetails.addonmetrics, function (value, index) {
                        // set old addon subtotal incl tax
                        var taxIncl = (self.cart.vat_rate > 0) ? ((value.price * self.cart.vat_rate) / 100) : 0;
                        var addon_price_incl_tax = (parseFloat(value.price) + parseFloat(taxIncl));
                        value.subtotal = (value.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                    });
                }

                var metricsTotal = 0;
                var creditsTotal = 0;
                // Show estimates prorated amount instead of manual calculated subtotal
                if (line_items.length) {
                    // plan prorated amount
                    var isPlanInLineItem = line_items.filter(function (i) {
                        return i.entity_id === plan_id;
                    });

                    if (isPlanInLineItem.length) {
                        // prorated prices incl tax
                        var plan_amount = (isPlanInLineItem[0].amount / 100);
                        var tax_amount = (isPlanInLineItem[0].tax_amount / 100);
                        self.cart.packageprice = (plan_amount + tax_amount);
                        // override prorated package price
                        self.cart.prorated_packageprice = (isPlanInLineItem[0].amount / 100);
                        self.cart.credits_packageprice = (parseFloat(self.cart.packageprice) - parseFloat(self.cart.prorated_packageprice));
                    } else {
                        // otherwise
                        self.cart.packageprice = self.packageoptions[self.cart.packageindex].base_price;
                    }

                    // metrics prorated amount
                    angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
                        if (value.addon) {
                            // new addition display subtotal base price incl tax
                            var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                            var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                            value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                            // set default subtotal incl tax
                            value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));

                            var isItemExist = line_items.filter(function (i) {
                                return i.entity_id === "metric" + value._id;
                            });
                            if (isItemExist.length) {
                                // store prorated subtotal
                                value.addon.prorated_subtotal = (isItemExist[0].amount / 100);
                                // value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(value.addon.price) * parseInt(value.quantity));
                                value.addon.credits_subtotal = (parseFloat(value.addon.subtotal) - parseFloat(value.addon.prorated_subtotal));

                                // new addition prorated subtotal incl tax
                                var amt = (isItemExist[0].amount / 100);
                                var tax_amt = (isItemExist[0].tax_amount / 100);
                                var addon_amt_incl_tax = (amt + tax_amt);
                                // override estimate prices
                                value.addon.subtotal = addon_amt_incl_tax;

                                if (value.is_selected) {
                                    // Addition
                                    metricsTotal = (metricsTotal + value.addon.subtotal);
                                    creditsTotal = (creditsTotal + value.addon.credits_subtotal);
                                }
                            }
                        }
                    });
                }

                // default metrics total
                self.cart.metricstotal = metricsTotal;

                // sum of credits applied and prorated credits metrics total
                // credits_applied = (credits_applied + creditsTotal + self.cart.credits_packageprice);

                // prorated credits metrics total
                self.cart.credits_total = creditsTotal;

                var totalamount = (parseFloat(self.cart.packageprice) + parseFloat(self.cart.metricstotal));

                // adjust credit based on plan base price and metrics total
                self.cart.credits_applied = (parseFloat(credits_applied) > parseFloat(totalamount)) ? totalamount : credits_applied;

                // override package total
                self.cart.packagetotal = total;
                // override amount due
                self.cart.amount_due = amount_due;

                // new addition spinner circle hide
                self.showSpinnerPrice = false;
                self.showSpinnerSubtotal = false;
                self.showSpinnerTotal = false;
                self.showSpinnerDueNow = false;

                // Recalculate
                self.$timeout(function () {
                    self.doPackageEstimates(self.cart.metricstotal);
                });
            });
        }
    }

    // estimate selected extra addons by chargebee api
    getAddonEstimates(plan_id, subscription_id) {
        let self = this;
        var params = {};
        // prepare addons array
        var tmpAddons = [];
        this.cart.totaladdons = [];
        this.cart.total_addonmetrics = [];
        angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
            var isPresentMetricQty = 0;
            var isOldAddon = false;
            var isPresentMetric = self.currentUser.tenant_license.license_detail.package_json.addonmetrics.filter(function (i) {
                return i.id === "metric" + value._id;
            });
            if (isPresentMetric.length) {
                isPresentMetricQty = isPresentMetric[0].quantity;
                isOldAddon = true;
            }
            // only addons with checkbox checked
            if (value.addon && value.extras > 0 && value.is_selected) {
                // estimate api quantity equals to sum of existing and new quantity
                var estimateMetricQty = (value.addon.bundle_type == "bound") ? (parseInt(value.extras) + parseInt(isPresentMetricQty)) : parseInt(value.extras);
                var totalAddonMetricQty = (parseInt(value.extras) + parseInt(isPresentMetricQty));
                // prepare
                tmpAddons.push({
                    'id': "metric" + value._id,
                    'quantity': estimateMetricQty
                });
                // prepare cart addons obj
                self.cart.totaladdons.push({
                    'id': "metric" + value._id,
                    'quantity': estimateMetricQty,
                    'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                });
                // prepare total addon metrics
                self.cart.total_addonmetrics.push({
                    'id': "metric" + value._id,
                    'quantity': totalAddonMetricQty,
                    'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                });
            } else {
                // prepare total addon metrics
                // push old addonmetric even if unchecked
                self.cart.total_addonmetrics.push({
                    'id': "metric" + value._id,
                    'quantity': isPresentMetricQty,
                    'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                });
            }

        });
        // Filter addons
        this.cart.totaladdons = this.cart.totaladdons.filter(function (i) {
            return i.quantity > 0;
        });
        // Filter addons
        this.cart.total_addonmetrics = this.cart.total_addonmetrics.filter(function (i) {
            return i.quantity > 0;
        });

        var plan_id = "plan" + plan_id;
        if (tmpAddons.length > 0) {
            // new addition spinner circle show
            this.showSpinnerSubtotal = true;
            this.showSpinnerTotal = true;
            this.showSpinnerDueNow = true;
            // new addition: get locals
            this.cart.default_country = (typeof localStorage.getItem('default_country_code') != "undefined" || localStorage.getItem('default_country_code') != null || localStorage.getItem('default_country_code') != "") ? localStorage.getItem('default_country_code') : this.cart.default_country;
            this.cart.default_country_name = this.ISO3166.getCountryName(this.cart.default_country);
            // request api
            this.$http({
                method: 'POST',
                url: this.baseUrl + '/api/v1/update_subscription_estimate',
                data: {
                    subscription_params: params,
                    addons: tmpAddons,
                    billing_country: this.cart.default_country
                }
            }).success(function (data) {
                var credits_applied = 0;
                var line_items = [];
                if (typeof data.result.estimate.invoice_estimate != "undefined") {
                    credits_applied = data.result.estimate.invoice_estimate.credits_applied;
                    line_items = data.result.estimate.invoice_estimate.line_items;
                    var taxes = data.result.estimate.invoice_estimate.taxes;
                    var line_item_taxes = data.result.estimate.invoice_estimate.line_item_taxes;
                    var total = (data.result.estimate.invoice_estimate.total / 100);
                    var amount_due = (data.result.estimate.invoice_estimate.amount_due / 100);
                } else if (typeof data.result.estimate.next_invoice_estimate != "undefined") {
                    credits_applied = data.result.estimate.next_invoice_estimate.credits_applied;
                    line_items = data.result.estimate.next_invoice_estimate.line_items;
                    var taxes = data.result.estimate.next_invoice_estimate.taxes;
                    var line_item_taxes = data.result.estimate.next_invoice_estimate.line_item_taxes;
                    var total = (data.result.estimate.next_invoice_estimate.total / 100);
                    var amount_due = (data.result.estimate.next_invoice_estimate.amount_due / 100);
                }

                // vat rate and amount
                self.cart.vat_rate = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_rate : 0;
                self.cart.tax_name = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_name : self.default_tax_name;
                self.cart.vat_amount = (taxes.length > 0) ? (taxes[0].amount / 100) : 0;
                // collect no tax for eu region but not Germany
                if (self.cart.purchase_type == 'company' && typeof self.billing.vat_number != "undefined" && self.billing.vat_number != '' && self.cart.country_type == "eu" && self.cart.default_country != "DE") {
                    // exclude vat amount
                    total = (parseFloat(total) - parseFloat(self.cart.vat_amount));
                    amount_due = (parseFloat(amount_due) - parseFloat(self.cart.vat_amount));
                    // unset tax rate and amount
                    self.cart.vat_rate = 0;
                    self.cart.vat_amount = 0;
                }

                // new addition base price incl tax
                var tax_amount = (self.packageoptions[self.cart.packageindex].base_price > 0) ? ((self.packageoptions[self.cart.packageindex].base_price * self.cart.vat_rate) / 100) : 0;
                self.cart.packagebaseprice_incl_tax = (self.packageoptions[self.cart.packageindex].base_price + tax_amount);
                self.cart.packagebaseprice_incl_tax_pm = (self.cart.packagebaseprice_incl_tax / self.cart.planduration);
                // new addition: set locals
                localStorage.setItem('default_country_code_old', self.cart.default_country);
                localStorage.setItem('default_tax_rate', self.cart.vat_rate);
                localStorage.setItem('default_tax_name', self.cart.tax_name);
                // console.log("get-addon-estimates: vat_rate: " + self.cart.vat_rate + " - country_code: " + self.cart.default_country + " - country_name: " + self.cart.default_country_name + " - isCurrentPlanFlag: " + self.isCurrentPlanFlag);

                credits_applied = (credits_applied / 100);

                // calculate default metrics subtotal incl tax
                if (self.licensedetails.addonmetrics) {
                    angular.forEach(self.licensedetails.addonmetrics, function (value, index) {
                        // set old addon subtotal incl tax
                        var taxIncl = (self.cart.vat_rate > 0) ? ((value.price * self.cart.vat_rate) / 100) : 0;
                        var addon_price_incl_tax = (parseFloat(value.price) + parseFloat(taxIncl));
                        value.subtotal = (value.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                    });
                }

                var metricsTotal = 0;
                var creditsTotal = 0;
                // Show estimates prorated amount instead of manual calculated subtotal
                if (line_items.length) {
                    angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
                        if (value.addon) {
                            // new addition display subtotal base price incl tax
                            var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                            var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                            value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                            // set default subtotal incl tax
                            value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));

                            var isItemExist = line_items.filter(function (i) {
                                return i.entity_id === "metric" + value._id;
                            });
                            if (isItemExist.length) {
                                // store prorated subtotal
                                value.addon.prorated_subtotal = (isItemExist[0].amount / 100);
                                // value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(value.addon.price) * parseInt(value.quantity));
                                value.addon.credits_subtotal = (parseFloat(value.addon.subtotal) - parseFloat(value.addon.prorated_subtotal));

                                // new addition prorated subtotal incl tax
                                var amt = (isItemExist[0].amount / 100);
                                var tax_amt = (isItemExist[0].tax_amount / 100);
                                var addon_amt_incl_tax = (amt + tax_amt);
                                // override estimate prices
                                value.addon.subtotal = addon_amt_incl_tax;

                                if (value.is_selected) {
                                    // Addition
                                    metricsTotal = (metricsTotal + value.addon.subtotal);
                                    creditsTotal = (creditsTotal + value.addon.credits_subtotal);
                                }
                            }
                        }
                    });
                }

                // default metrics total
                self.cart.metricstotal = metricsTotal;

                // prorated credits metrics total
                self.cart.credits_total = creditsTotal;

                // adjust credit based on plan base price and metrics total
                self.cart.credits_applied = (parseFloat(credits_applied) > parseFloat(self.cart.metricstotal)) ? self.cart.metricstotal : credits_applied;

                // override package total
                self.cart.packagetotal = total;
                // override amount due
                self.cart.amount_due = amount_due;

                // new addition spinner circle hide
                self.showSpinnerSubtotal = false;
                self.showSpinnerTotal = false;
                self.showSpinnerDueNow = false;

                // Recalculate
                self.$timeout(function () {
                    self.doPackageEstimates(self.cart.metricstotal);
                });
            });
        } else {
            self.cart.packagetotal = 0;
            self.cart.amount_due = 0;
            self.cart.credits_applied = 0;
            self.cart.vat_amount = 0;
            self.cart.totalexclvat = 0;
        }
    }

    // reactivate package estimate by chargebee api
    getReactivateEstimates(plan_id, subscription_id) {
        let self = this;
        var params = {};

        // get old and new selected addons
        self.getTotalAddons();

        // Apply changes immediately or on renewal based on upgrade or downgrade
        var end_of_term = false;

        // set replace addon param based on plan interval
        var replace_addon_list = (this.cart.planduration == this.cart.old_package_interval) ? false : true;

        // new addition: get locals
        this.cart.default_country = (typeof localStorage.getItem('default_country_code') != "undefined" || localStorage.getItem('default_country_code') != null || localStorage.getItem('default_country_code') != "") ? localStorage.getItem('default_country_code') : this.cart.default_country;
        this.cart.default_country_name = this.ISO3166.getCountryName(this.cart.default_country);

        var plan_id = "plan" + this.cart.package_id;
        var params = {
            plan_id: plan_id,
            addons: this.cart.totaladdons,
            replace_addon_list: true,
            end_of_term: end_of_term,
            billing_country: this.cart.default_country,
            reactivate: true
        };
        // apply only in trial to paid plan case
        if (this.cart.is_trial) {
            params.prorate = false;
        }
        // new addition spinner circle show
        this.showSpinnerPrice = true;
        this.showSpinnerSubtotal = true;
        this.showSpinnerTotal = true;
        this.showSpinnerDueNow = true;
        // request api
        this.$http({
            method: 'POST',
            url: this.baseUrl + '/api/v1/update_subscription_estimate',
            data: params
        }).success(function (data) {
            var credits_applied = 0;
            var line_items = [];
            if (typeof data.result.estimate.invoice_estimate != "undefined") {
                credits_applied = data.result.estimate.invoice_estimate.credits_applied;
                line_items = data.result.estimate.invoice_estimate.line_items;
                var taxes = data.result.estimate.invoice_estimate.taxes;
                var line_item_taxes = data.result.estimate.invoice_estimate.line_item_taxes;
                var total = (data.result.estimate.invoice_estimate.total / 100);
                var amount_due = (data.result.estimate.invoice_estimate.amount_due / 100);
            } else if (typeof data.result.estimate.next_invoice_estimate != "undefined") {
                credits_applied = data.result.estimate.next_invoice_estimate.credits_applied;
                line_items = data.result.estimate.next_invoice_estimate.line_items;
                var taxes = data.result.estimate.next_invoice_estimate.taxes;
                var line_item_taxes = data.result.estimate.next_invoice_estimate.line_item_taxes;
                var total = (data.result.estimate.next_invoice_estimate.total / 100);
                var amount_due = (data.result.estimate.next_invoice_estimate.amount_due / 100);
            }

            // vat rate and amount
            self.cart.vat_rate = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_rate : 0;
            self.cart.tax_name = (line_item_taxes.length > 0) ? line_item_taxes[0].tax_name : self.default_tax_name;
            self.cart.vat_amount = (taxes.length > 0) ? (taxes[0].amount / 100) : 0;
            // collect no tax for eu region but not Germany
            if (self.cart.purchase_type == 'company' && typeof self.billing.vat_number != "undefined" && self.billing.vat_number != '' && self.cart.country_type == "eu" && self.cart.default_country != "DE") {
                // exclude vat amount
                total = (parseFloat(total) - parseFloat(self.cart.vat_amount));
                amount_due = (parseFloat(amount_due) - parseFloat(self.cart.vat_amount));
                // unset tax rate and amount
                self.cart.vat_rate = 0;
                self.cart.vat_amount = 0;
            }

            // new addition base price incl tax
            var tax_amount = (self.packageoptions[self.cart.packageindex].base_price > 0) ? ((self.packageoptions[self.cart.packageindex].base_price * self.cart.vat_rate) / 100) : 0;
            self.cart.packagebaseprice_incl_tax = (self.packageoptions[self.cart.packageindex].base_price + tax_amount);
            self.cart.packagebaseprice_incl_tax_pm = (self.cart.packagebaseprice_incl_tax / self.cart.planduration);

            // new addition: set locals
            localStorage.setItem('default_country_code_old', self.cart.default_country);
            localStorage.setItem('default_tax_rate', self.cart.vat_rate);
            localStorage.setItem('default_tax_name', self.cart.tax_name);
            // console.log("get-reactivate-estimates: vat_rate: " + self.cart.vat_rate + " - country_code: " + self.cart.default_country + " - country_name: " + self.cart.default_country_name + " - isCurrentPlanFlag: " + self.isCurrentPlanFlag);

            credits_applied = (credits_applied / 100);

            // calculate default metrics subtotal incl tax
            if (self.licensedetails.addonmetrics) {
                angular.forEach(self.licensedetails.addonmetrics, function (value, index) {
                    // set old addon subtotal incl tax
                    var taxIncl = (self.cart.vat_rate > 0) ? ((value.price * self.cart.vat_rate) / 100) : 0;
                    var addon_price_incl_tax = (parseFloat(value.price) + parseFloat(taxIncl));
                    value.subtotal_incl_tax = (value.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                    value.subtotal = (value.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                });
            }

            // calculate total metrics subtotal incl tax
            if (typeof self.cart.total_addon_summary != "undefined" && self.cart.total_addon_summary.length > 0) {
                angular.forEach(self.cart.total_addon_summary, function (value, index) {
                    // set old addon subtotal incl tax
                    var taxIncl = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                    var addon_price_incl_tax = (parseFloat(value.addon.price) + parseFloat(taxIncl));
                    value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                    value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_price_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(addon_price_incl_tax) * parseInt(value.quantity));
                });
                // filter recurring items
                self.cart.recurring_addons = self.cart.total_addon_summary.filter(function (i) {
                    return (i.addon && i.addon.charge_type == "recurring" && i.quantity > 0);
                });
                // filter non-recurring items
                self.cart.non_recurring_addons = self.cart.total_addon_summary.filter(function (i) {
                    return (i.addon && i.addon.charge_type == "non_recurring" && i.quantity > 0);
                });
            }

            var metricsTotal = 0;
            var creditsTotal = 0;
            // Show estimates prorated amount instead of manual calculated subtotal
            if (line_items.length) {
                // plan prorated amount
                var isPlanInLineItem = line_items.filter(function (i) {
                    return i.entity_id === plan_id;
                });

                if (isPlanInLineItem.length) {
                    // prorated prices incl tax
                    var plan_amount = (isPlanInLineItem[0].amount / 100);
                    var tax_amount = (isPlanInLineItem[0].tax_amount / 100);
                    self.cart.packageprice = (plan_amount + tax_amount);
                    // override prorated package price
                    self.cart.prorated_packageprice = (isPlanInLineItem[0].amount / 100);
                    self.cart.credits_packageprice = (parseFloat(self.cart.packageprice) - parseFloat(self.cart.prorated_packageprice));
                } else {
                    // otherwise
                    self.cart.packageprice = self.packageoptions[self.cart.packageindex].base_price;
                }

                // metrics prorated amount
                angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
                    if (value.addon) {
                        // new addition display subtotal base price incl tax
                        var addon_tax_amt = (self.cart.vat_rate > 0) ? ((value.addon.price * self.cart.vat_rate) / 100) : 0;
                        var addon_base_amt_incl_tax = (parseFloat(value.addon.price) + parseFloat(addon_tax_amt));
                        value.addon.subtotal_incl_tax = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));
                        // set default subtotal incl tax
                        value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(addon_base_amt_incl_tax) * parseInt(self.cart.planduration) * parseInt(value.extras)) : (parseFloat(addon_base_amt_incl_tax) * parseInt(value.extras));

                        var isItemExist = line_items.filter(function (i) {
                            return i.entity_id === "metric" + value._id;
                        });
                        if (isItemExist.length) {
                            // store prorated subtotal
                            value.addon.prorated_subtotal = (isItemExist[0].amount / 100);
                            // value.addon.subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(value.quantity)) : (parseFloat(value.addon.price) * parseInt(value.quantity));
                            value.addon.credits_subtotal = (parseFloat(value.addon.subtotal) - parseFloat(value.addon.prorated_subtotal));

                            // new addition prorated subtotal incl tax
                            var amt = (isItemExist[0].amount / 100);
                            var tax_amt = (isItemExist[0].tax_amount / 100);
                            var addon_amt_incl_tax = (amt + tax_amt);
                            // override estimate prices
                            value.addon.subtotal = addon_amt_incl_tax;

                            if (value.is_selected) {
                                // Addition
                                metricsTotal = (metricsTotal + value.addon.subtotal);
                                creditsTotal = (creditsTotal + value.addon.credits_subtotal);
                            }
                        }
                    }
                });
            }

            // default metrics total
            self.cart.metricstotal = metricsTotal;

            // prorated credits metrics total
            self.cart.credits_total = creditsTotal;

            var totalamount = (parseFloat(self.cart.packageprice) + parseFloat(self.cart.metricstotal));

            // adjust credit based on plan base price and metrics total
            self.cart.credits_applied = (parseFloat(credits_applied) > parseFloat(totalamount)) ? totalamount : credits_applied;

            // override package total
            self.cart.packagetotal = total;
            // override amount due
            self.cart.amount_due = amount_due;

            // new addition spinner circle hide
            self.showSpinnerPrice = false;
            self.showSpinnerSubtotal = false;
            self.showSpinnerTotal = false;
            self.showSpinnerDueNow = false;

            // taxes
            self.cart.totalexclvat = 0;
            self.cart.totalexclvat = (parseFloat(self.cart.packagetotal).toFixed(2) - parseFloat(self.cart.vat_amount).toFixed(2));

            // estimate next billing amount
            self.getNextBillingAmount();
        });
    }

    // step1 : cart info submitted
    cartinfo(currentPackageObj) {
        let self = this;
        this.submitted = true;
        this.errors = {};

        // new addition: disable billing info address fields
        this.cart.disable_billing_fields = (this.currentstate == 'changeplan' && this.cart.purchase_type == 'company' && !this.cart.is_trial) ? true : false;

        // Selected package custom data
        currentPackageObj = currentPackageObj;

        // Filter
        var emptyaddons = currentPackageObj.Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });

        // Cart data
        this.cart = this.cart;

        // apply changes immediately or on renewal based on upgrade or downgrade
        if (this.currentstate == "changeplan") {
            // this.cart.has_scheduled_changes = (this.cart.packageprice < this.cart.old_packageprice) ? true : false;
            // this.cart.end_of_term = (this.cart.packageprice < this.cart.old_packageprice) ? true : false;
            this.cart.has_scheduled_changes = false;
            this.cart.end_of_term = false;
        }

        if (!this.cart.is_trial && typeof this.currentsubscription.subscription != "undefined" && this.currentsubscription.subscription.status != "cancelled" && this.currentstate == "changeplan" && this.currentUser && (this.currentUser.tenant_license.plan_id == 'plan' + this.cart.package_id && emptyaddons.length == 0)) {
            this.toastr.error("Modify plan and/or choose add-on(s) before continuing.");
        } else if (this.currentstate == "changeplan" && this.cart.is_trial && currentPackageObj.is_trial) {
            this.toastr.error("Please modify your current plan.");
        } else {
            // new addition: filter current selected addons by recurring and non recurring type
            this.filterAddons(currentPackageObj);

            // Prepare chargebee addons obj
            this.getAddons(currentPackageObj);

            // Next step: Account information
            this.accountToggle = true;
            this.step1Flag = false;
            this.step2Flag = (self.currentstate == "changeplan") ? false : true;
            this.step3Flag = (self.currentstate == "changeplan") ? true : false;
            this.step4Flag = false;
            this.step5Flag = false;

            // self.$timeout(function () {
            //     $('form[name="step2form"] input').first().focus();
            // });

            // Next step: Billing information
            if (self.currentstate != "signup") {
                this.billingToggle = true;
            }
        }
    }

    // new addition: filter current selected addons by recurring and non recurring type
    filterAddons(currentPackageObj) {
        let self = this;
        // objects
        this.cart.recurring_addons = [];
        this.cart.non_recurring_addons = [];
        // cancelled state handling
        if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
            // prepare
            this.getTotalAddons();
            // filter recurring items
            self.cart.recurring_addons = this.cart.total_addon_summary.filter(function (i) {
                return (i.addon && i.addon.charge_type == "recurring" && i.quantity > 0);
            });
            // filter non-recurring items
            self.cart.non_recurring_addons = this.cart.total_addon_summary.filter(function (i) {
                return (i.addon && i.addon.charge_type == "non_recurring" && i.quantity > 0);
            });
        } else {
            // filter recurring items
            self.cart.recurring_addons = currentPackageObj.Metrics.filter(function (i) {
                return (i.addon && i.addon.charge_type == "recurring" && i.is_selected && i.quantity > 0);
            });
            // filter non-recurring items
            self.cart.non_recurring_addons = currentPackageObj.Metrics.filter(function (i) {
                return (i.addon && i.addon.charge_type == "non_recurring" && i.is_selected && i.quantity > 0);
            });
        }
    }

    // first-time signup selected addons
    getAddons(currentPackageObj) {
        let self = this;
        this.cart.addons = [];
        angular.forEach(currentPackageObj.Metrics, function (value, index) {
            // only addons with checkbox checked
            if (value.is_selected) {
                self.cart.addons.push({
                    'id': "metric" + value._id,
                    'quantity': value.extras,
                    'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                });
            }
        });
        // filter by quantity
        this.cart.chargebeeaddons = this.cart.addons.filter(function (i) {
            return i.quantity > 0;
        });
    }

    // step2 : account info submitted
    accountinfo(form) {
        let self = this;
        this.submitted = true;
        this.errors = {};

        if (form.$valid) {
            if (this.currentstate == "signup") {
                // persist account info
                this.UserService.user = this.user;
            }
            this.billingToggle = true;
            if (this.currentstate == 'dualaccount') {

                // server validation subdomain
                var signup_type = (self.currentUser.is_trial) ? "signup" : "opensource";
                this.Auth.subdomaincheck(angular.lowercase(this.user.subdomain), angular.lowercase(this.user.email), signup_type)
                    .then((res) => {
                        if (res.flag) {
                            form['subdomain'].$setValidity('mongoose', false);
                        } else {
                            if (!self.currentUser.is_trial) {
                                // paid-to-free where current account is not trial
                                self.totalMetricsCount('os');
                                self.createFreeAccount();
                            } else {
                                // new addition: filter current selected addons by recurring and non recurring type
                                self.filterAddons(self.packageoptions[self.cart.packageindex]);
                                // Next step: Billing information
                                self.step1Flag = false;
                                self.step2Flag = false;
                                self.step3Flag = true;
                                self.step4Flag = false;
                                self.step5Flag = false;

                                self.$timeout(function () {
                                    $('form[name="step3form"] input').first().focus();
                                });
                            }
                        }
                    });
            } else {
                // Subdomain unique validation
                this.Auth.subdomaincheck(angular.lowercase(this.user.subdomain), angular.lowercase(this.user.email), "signup")
                    .then((res) => {
                        if (res.flag) {
                            form['subdomain'].$setValidity('mongoose', false);
                        } else {
                            // Email unique validation
                            this.Auth.emailcheck(this.user.email, false, "signup")
                                .then((res) => {
                                    self.email_error_msg = self.email_error_flag = '';
                                    if (res.flag) {
                                        self.email_error_flag = res.info.type;
                                        if (res.info.type == 'same') {
                                            self.email_error_msg = 'Email already exists.';
                                        } else if (res.info.type == 'different') {
                                            self.email_error_msg = 'This email already exists, please sign in or use a different email.';
                                        }
                                        form['email'].$setValidity('mongoose', false);
                                    } else {

                                        // Next step: Billing information
                                        self.step1Flag = false;
                                        self.step2Flag = false;
                                        self.step3Flag = true;
                                        self.step4Flag = false;
                                        self.step5Flag = false;

                                        self.$timeout(function () {
                                            $('form[name="step3form"] input').first().focus();
                                        });
                                    }
                                });
                        }
                    });
            }
        }
    }

    // new addition: open source account signup
    createFreeAccount() {
        let self = this;
        this.showSpinner = true;
        // set required vars
        var planId = "plan" + this.os.package_id;
        var subdomainName = (typeof this.user.subdomain != 'undefined') ? angular.lowercase(this.user.subdomain) : '';
        var customerEmail = (typeof this.user.email != 'undefined') ? this.user.email.toLowerCase() : '';
        var password = (typeof this.user.password != 'undefined') ? this.user.password : null;
        var firstName = (typeof this.user.first_name != 'undefined') ? this.user.first_name : '';
        var lastName = (typeof this.user.last_name != 'undefined') ? this.user.last_name : '';
        var customerCountry = this.cart.default_country;
        var currentDt = new Date().getTime();
        // set empty vars
        var company, customerId, subscriptionId, expiredDt = null;
        var streetAddress, customerCity, customerZip = "";
        var trialStart, trialEnd, nextBillingAt = "";
        // prepare domain url
        var domain = subdomainName + '.' + this.gamma_os_postfix + '.' + this.gamma_ui;
        var userSubdomain = (this.gamma_ui_env == "local" || this.gamma_ui_env == "test") ? "http://" + domain : "https://" + domain;

        // gamma user: prepare object
        this.gammaUser.company_name = company;
        this.gammaUser.company_address = typeof customerCountry != 'undefined' ? customerCountry : "";
        this.gammaUser.company_website = "";
        this.gammaUser.first_name = firstName;
        this.gammaUser.last_name = lastName;
        this.gammaUser.job_title = "";
        this.gammaUser.email = customerEmail;
        this.gammaUser.password = password;
        this.gammaUser.phone = "";
        this.gammaUser.subdomain = subdomainName;

        // license data: prepare object
        this.licenceDetail.machine_info = '';
        this.licenceDetail.start_date = currentDt;
        this.licenceDetail.expiry_date = expiredDt;
        this.licenceDetail.name = this.os.package_name;
        this.licenceDetail.features = this.os.features;
        this.licenceDetail.metrics = this.selectedMetrics;
        this.licenceDetail.tenant = {
            'tenant_uid': "",
            'email': ""
        };
        this.licenseData.license_detail = this.licenceDetail;
        this.licenseData.tenant_uid = "";

        // event log: prepare object
        this.logdata.tenant_uid = "";
        this.logdata.current_value = '';
        this.logdata.previous_value = '';
        this.logdata.event_type = 'SUBSCRIPTION_CREATED';
        this.logdata.user_type = 'user';
        this.logdata.updated_by = "";

        // deep update: prepare tenant license data
        this.tenantlicense.tenant_id = "";
        this.tenantlicense.license_detail = this.os.license_detail;
        this.tenantlicense.plan_id = planId;
        this.tenantlicense.subscription_id = subscriptionId;
        this.tenantlicense.is_active = true;
        this.tenantlicense.created_dt = currentDt;
        this.tenantlicense.expired_dt = expiredDt;
        this.tenantlicense.license_data = this.licenseData;
        this.tenantlicense.logdata = this.logdata;

        // email template: prepare metrics data
        var locItem = this.os.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "loc";
        });
        var defaultLoc = (locItem.length) ? locItem[0].default_value : "";
        var locValue = this.filter('number')(defaultLoc);
        var usersItem = this.os.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "users";
        });
        var usersValue = (usersItem.length) ? usersItem[0].default_value : "";
        var scansItem = this.os.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "scans";
        });
        var scansValue = (scansItem.length) ? scansItem[0].default_value : "";
        var scan_historyItem = this.os.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "scan_history";
        });
        var scan_historyValue = (scan_historyItem.length) ? scan_historyItem[0].default_value : "";

        var from_type = (self.currentstate == 'dualaccount') ? 'existing' : 'new';
        if (self.currentstate == 'dualaccount') {
            var subject = "Your open source account has been activated now";
        } else {
            var subject = "Activate your Gamma account now";
        }

        // prepare email template content
        var parameters = {
            email_to: customerEmail,
            subject: subject,
            body_content: {
                base_url: this.baseUrl,
                gamma_os_postfix: this.gamma_os_postfix,
                email_type: "trial",
                verify_link: "",
                username: firstName,
                subdomain: userSubdomain,
                package_info: {
                    plan_name: this.os.package_name,
                    plan_quantity: 1,
                    plan_unit_price: 0,
                    billing_period: '',
                    billing_period_unit: '',
                    trial_start: trialStart,
                    trial_end: trialEnd,
                    next_billing_at: nextBillingAt,
                    metrics: {
                        loc: locValue,
                        users: usersValue,
                        scans: scansValue,
                        scan_history: scan_historyValue
                    },
                    total: 0
                },
                is_taxed: false,
                tax_rate: "",
                from_type: from_type
            }
        };

        // create tenant
        this.Auth.createUser({
            tenant_type: 'cloud',
            email: customerEmail,
            password: password,
            first_name: firstName,
            last_name: lastName,
            company: company,
            customer_id: customerId,
            created_dt: currentDt,
            updated_dt: currentDt,
            gamma_user: this.gammaUser,
            subdomain: subdomainName,
            has_support: false,
            deep_update: this.tenantlicense,
            template_data: parameters,
            purchase_type: "individual",
            is_trial: true,
            status: 'active',
            from_type: from_type
        })
            .then((data) => {

                // Update user
                var userId = data.last_insert_id;
                var sessionToken = data.token;
                var mixpanel_id = data.mixpanel_id;
                // var intercom_id = data.intercom_id;

                // // Update intercom
                // var intercomUser = {
                //     name: firstName+" "+lastName,
                //     user_id: intercom_id,
                //     email: customerEmail,
                //     'subdomain': subdomainName,
                //     'company': company
                // };
                // self.$intercom.update(intercomUser);

                // set analytics user start
                self.$gammaAnalytics.setAnalytics('Subscription created', mixpanel_id, {
                    'first_name': firstName,
                    'last_name': lastName,
                    'email': customerEmail,
                    'company': company,
                    'subdomain': subdomainName,
                    'plan': self.os.package_name
                });
                // set analytics user end

                // redirect
                self.showSpinner = false;
                window.location.href = '/result';

            }).catch((err) => {
                // Error
                self.state.go('account');
            });
    }

    // step3 : billing info submitted
    billinginfo(form) {
        let self = this;
        this.submitted = true;
        this.errors = {};

        if (form.$valid) {
            // persist billing info
            this.UserService.billing = this.billing;
            // for reviewinfo display
            this.cart.tax_flag = (this.cart.purchase_type == "company" && typeof this.billing.vat_number != "undefined" && this.billing.vat_number != "") ? true : false;
            // new addition: set locals
            localStorage.setItem('default_country_code', this.billing.country);

            if (this.currentstate == "signup" || this.currentstate == "dualaccount") {
                // call create estimate api
                this.showSpinnerPrice = true;
                this.getCreateEstimates();
            } else {
                // change plan case
                if (typeof self.currentUser.tenant_license != "undefined" && !self.currentUser.tenant_license.is_active) {
                    // cancel state case
                    self.getReactivateEstimates(self.cart.package_id, self.user.subscription_id);
                } else if (!self.isCurrentPlanFlag) {
                    // modify plan case
                    self.showSpinnerPrice = true;
                    self.getPackageEstimates(self.cart.package_id, self.user.subscription_id);
                } else if (self.isCurrentPlanFlag) {
                    // add extras case
                    self.getAddonEstimates(self.cart.old_package_id, self.user.subscription_id);
                }
            }

            this.step1Flag = false;
            this.step2Flag = false;
            this.step3Flag = false;
            self.billing.country_name = $("[name=country] option:selected").text();
            if (self.currentstate != "signup") {
                // Next step: Payment method
                this.paymentToggle = true;
                this.step4Flag = true;
                this.step5Flag = false;

                self.$timeout(function () {
                    $('form[name="step4form"] input').first().focus();
                });

            } else {
                // Next step: Preview method
                if (this.packageoptions[this.cart.packageindex].is_trial) {
                    this.previewToggle = true;
                } else {
                    this.paymentToggle = true;
                }
                this.step4Flag = (this.packageoptions[this.cart.packageindex].is_trial) ? false : true;
                this.step5Flag = (this.packageoptions[this.cart.packageindex].is_trial) ? true : false;
            }
        }
    }

    // step4 : payment info submitted
    paymentmethod(form) {
        let self = this;
        this.submitted = true;

        // display toast if vat rate not 19%
        if (this.cart.vat_rate != 19 || this.cart.vat_rate != "19") {
            this.toastr.warning("The amount of VAT applied has been updated based on your location. See final price for details.", "VAT changed");
        }

        if (this.currentstate == "signup" || this.currentstate == "dualaccount" || this.editPayment) {
            // new addition spinner circle show
            this.showSpinnerPayment = true;
            // stripe create token
            this.stripe.createToken(self.cardNumberElement)
                .then(function (result) {
                    // new addition spinner circle hide
                    self.showSpinnerPayment = false;
                    if (result.token) {
                        self.previewToggle = true;
                        self.payment.nonce = result.token.id;

                        self.payment.lasttwo = result.token.card.last4;
                        self.payment.cardtype = result.token.card.brand;

                        self.$timeout(function () {
                            // Next step: Purchase
                            self.step1Flag = false;
                            self.step2Flag = false;
                            self.step3Flag = false;
                            self.step4Flag = false;
                            self.step5Flag = true;

                            $('form[name="step5form"] input').first().focus();
                        });

                    } else if (result.error) {
                        self.$timeout(() => {
                            // stripe error card Number
                            if (self.cardNumberError == "" && result.error.code == "incomplete_number") {
                                self.cardNumberError = "Card Number can't be empty.";
                            } else if (self.cardNumberError == "" && (result.error.code == "invalid_number" || result.error.code == "incorrect_number")) {
                                self.cardNumberError = "Inavlid Card Number.";
                            } else if (self.cardNumberError == "" && result.error.code == "card_declined") {
                                self.cardNumberError = "Card not supported. " + result.error.message;
                            }

                            // stripe error expiry data
                            if (self.cardExpiryError == "" && result.error.code == "incomplete_expiry") {
                                self.cardExpiryError = "Expiry Date can't be empty.";
                            } else if (self.cardExpiryError == "" && result.error.code == "invalid_expiry_month_past") {
                                self.cardExpiryError = "Card Expiry Date is in past. ";
                            } else if (self.cardExpiryError == "" && result.error.code == "invalid_expiry_year_past") {
                                self.cardExpiryError = "Card Expiry Year is in past. ";
                            } else if (self.cardExpiryError == "" && result.error.code == "expired_card") {
                                self.cardExpiryError = "The card has expired.";
                            }

                            // stripe error cvv data
                            if (self.cardCvcError == "" && result.error.code == "incomplete_cvc") {
                                self.cardCvcError = "Cvv can't be empty.";
                            }
                        });
                    }
                });
        } else {
            self.payment.lasttwo = self.card.last4;
            self.payment.cardtype = self.card.card_type;

            self.previewToggle = true;
            // Next step: Purchase
            self.step1Flag = false;
            self.step2Flag = false;
            self.step3Flag = false;
            self.step4Flag = false;
            self.step5Flag = true;
        }
    }

    // step5 : purchase review info submitted
    purchasereview(form) {
        let self = this;
        this.submitted = true;
        this.previewToggle = true;
        this.errors = {};
        this.isverified = false;

        // Filter addons
        this.cart.chargebeeaddons = this.cart.addons.filter(function (i) {
            return i.quantity > 0;
        });

        // Current package metrics info
        var packageSelected = this.packageoptions[this.cart.packageindex];

        var selectedMetricsObj = packageSelected.Metrics;
        this.extra_addons = [];
        self.cart.selectedpackagejson = [];
        // cancelled state handling
        if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
            this.recalculateAddonMetrics(selectedMetricsObj);
        } else {
            angular.forEach(selectedMetricsObj, function (value, index) {
                // only addons with checkbox checked
                if (value.addon && value.is_selected) {
                    self.extra_addons.push({
                        name: value.name,
                        label_name: (typeof value.addon.label_name != "undefined" && value.addon.label_name != "") ? value.addon.label_name : value.name,
                        key: value.key,
                        quantity: value.quantity,
                        price: self.filter('currency')(value.addon.price, '', 2),
                        subtotal: self.filter('currency')(value.addon.subtotal, '', 2)
                    });
                }
                self.cart.selectedpackagejson.push({
                    'id': value._id,
                    'key': value.key,
                    'name': value.name,
                    'default_value': value.package_metric.default_value,
                    'checkby': value.checkby
                });
            });
        }
        // filter by quantity
        self.extra_addons = self.extra_addons.filter(function (i) {
            return i.quantity > 0;
        });

        // Prepare tenant license details i.e. selected package metrics info with addons
        this.cart.license_detail.package_json.packagemetrics = this.cart.selectedpackagejson;
        this.cart.license_detail.package_json.plan_name = (this.cart.package_name) ? this.cart.package_name : this.currentUser.tenant_license.license_detail.package_json.plan_name;
        this.cart.license_detail.package_json.plan_interval = (this.cart.planduration) ? this.cart.planduration : this.currentUser.tenant_license.license_detail.package_json.plan_interval;

        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });

        // db addons metrics json values
        if (typeof this.currentUser.tenant_license != "undefined" && !this.currentUser.tenant_license.is_active) {
            // cancelled state handling
            this.cart.license_detail.package_json.addonmetrics = this.cart.total_addonmetrics;
        } else if (this.cart.planduration == this.cart.old_package_interval && emptyaddons.length >= 0 && typeof this.currentUser.tenant_license != "undefined" && this.currentUser.tenant_license.is_active) {
            // sum existing and newly added addons
            this.cart.license_detail.package_json.addonmetrics = this.cart.total_addonmetrics;
        } else {
            // override existing addons
            this.cart.license_detail.package_json.addonmetrics = this.cart.chargebeeaddons;
        }

        // current package features
        self.features = jQuery.map(packageSelected.Features, function (feature, i) {
            return feature.key;
        });

        // total counts of email metric
        this.totalMetricsCount();

        // Get current user subdomain
        var domain = angular.lowercase(self.user.subdomain) + '.' + self.gamma_ui;

        // set dubdomain url
        var userSubdomain = (self.gamma_ui_env == "local" || self.gamma_ui_env == "test") ? "http://" + domain : "https://" + domain;

        // set expected vat number to pass to chargebee api
        this.billing.vat_number_cb = "";
        if (this.cart.purchase_type == "company" && typeof this.billing.vat_number != "undefined" && this.billing.vat_number != "") {
            // trim unwanted chars like country code, hyphen, spaces etc
            var trim_vat_number = this.billing.vat_number;
            trim_vat_number = trim_vat_number.trim();
            trim_vat_number = trim_vat_number.replace(this.cart.default_country, "");
            trim_vat_number = trim_vat_number.replace("-", "");
            trim_vat_number = trim_vat_number.replace(/ /g, "");
            // expected vat number to pass to chargebee api
            this.billing.vat_number_cb = trim_vat_number;
        }

        // prepare email template content
        var parameters = {
            email_to: self.user.email,
            body_content: {
                base_url: self.baseUrl,
                gamma_os_postfix: self.gamma_os_postfix,
                gamma_ui_base_url: userSubdomain,
                gamma_ui_env: self.gamma_ui_env,
                username: self.billing.first_name,
                subdomain: userSubdomain,
                package_info: {
                    plan_name: self.cart.package_name,
                    plan_quantity: 1,
                    plan_unit_price: self.filter('currency')(self.cart.packageprice, '', 2),
                    extra_addons: self.extra_addons,
                    total: self.filter('currency')(self.cart.packagetotal, '', 2),
                    credits_applied: self.filter('currency')(self.cart.credits_applied, '', 2),
                    amount_due: self.filter('currency')(self.cart.amount_due, '', 2)
                },
                billing_info: {
                    company: self.billing.company,
                    first_name: self.billing.first_name,
                    last_name: self.billing.last_name,
                    street_address: self.billing.street_address,
                    street_address_line2: self.billing.street_address_line2,
                    city: self.billing.city,
                    zip: self.billing.zip,
                    country_code: self.billing.country,
                    country: self.cart.default_country_name,
                    vat_number: self.billing.vat_number,
                    vat_number_cb: self.billing.vat_number_cb,
                    tax_rate: self.cart.vat_rate,
                    tax_name: self.cart.tax_name,
                    purchase_type: self.cart.purchase_type
                },
                card_info: {
                    card_type: self.payment.cardtype,
                    last4: self.payment.lasttwo
                }
            }
        };

        // Create new subscription
        if (this.currentstate == "signup" || this.currentstate == "dualaccount") {
            self.emailContent = {};
            // Email format validation
            var validFlag = self.validemailcheck(this.user.email);
            // Server side validation
            if (!validFlag) {
                // self.errors.validemailflag = true;
                self.toastr.error("Doesn't look like a valid email.");
            } else {
                if (self.isLoggedIn) {
                    // dualaccount case
                    self.processTransaction(parameters);
                } else {
                    // Email unique validation
                    this.Auth.emailcheck(this.user.email, false, "signup")
                        .then((res) => {
                            if (res.flag) {
                                if (res.info.type == 'different') {
                                    self.toastr.error("This email already exists, please sign in or use a different email.");
                                } else {
                                    self.toastr.error("Email already exists.");
                                }
                            } else {
                                // Subdomain unique validation
                                this.Auth.subdomaincheck(angular.lowercase(this.user.subdomain), angular.lowercase(this.user.email), "signup")
                                    .then((res) => {
                                        if (res.flag) {
                                            self.toastr.error("Site name already exists.");
                                        } else {
                                            self.processTransaction(parameters);
                                        }
                                    });
                            }
                        });
                }
            }
        } else {
            // Update a subscription
            self.emailContent = {};
            // Payment gateway code
            var nonce = (typeof this.payment.nonce != 'undefined') ? this.payment.nonce : '';
            if (this.isCurrentPlanFlag && emptyaddons.length > 0 && this.currentUser.tenant_license.is_active) {
                // add extras case
                var planId = "";
            } else {
                // modify plan case
                var planId = "plan" + this.cart.package_id;
            }

            var subdomainName = angular.lowercase(this.user.subdomain);
            var company = this.billing.company;
            var vat_number = this.billing.vat_number_cb;    // trimmed vat number
            var customerEmail = this.user.email;
            var password = this.user.password;
            var firstName = this.billing.first_name;
            var lastName = this.billing.last_name;
            var streetAddress = this.billing.street_address;
            var streetAddressLine2 = this.billing.street_address_line2;
            var customerCity = this.billing.city;
            var customerZip = this.billing.zip;
            var customerCountry = this.billing.country;
            var currentDt = new Date().getTime();

            // Prepare subscription params
            this.checkout = {
                billing_address: {
                    first_name: firstName,
                    last_name: lastName,
                    line1: streetAddress,
                    line2: streetAddressLine2,
                    city: customerCity,
                    state: "",
                    zip: customerZip,
                    country: customerCountry,
                    company: this.billing.company
                }
            };

            // add job title
            this.checkout.job_title = (this.cart.purchase_type == "company") ? this.billing.job_title : "";

            // if previous plan trial and type company then pass vat number otherwise not
            if (this.cart.purchase_type == "company") {
                this.checkout.customer = {
                    vat_number: vat_number
                };
            }

            // chargebee addons json values i.e. total addons
            if (!this.currentUser.tenant_license.is_active) {
                // cancelled state handling
                this.checkout.plan_id = planId;
                this.checkout.addons = this.cart.totaladdons;
            } else if (this.isCurrentPlanFlag && emptyaddons.length > 0 && this.currentUser.tenant_license.is_active) {
                // add extras case
                this.checkout.addons = this.cart.totaladdons;
            } else {
                // modify plan case
                this.checkout.plan_id = planId;
                this.checkout.addons = this.cart.totaladdons;
            }

            // set replace addon param based on plan interval
            this.checkout.replace_addon_list = (this.cart.planduration == this.cart.old_package_interval) ? false : true;

            // downgrade case: apply changes on renewal
            if (this.cart.end_of_term) {
                this.checkout.end_of_term = this.cart.end_of_term;
            }

            if (nonce != "") {
                var TokenDetails = {
                    tmp_token: nonce
                };
                this.checkout.card = TokenDetails;
            }
            // apply only in trial to paid plan case
            this.checkout.is_trial_to_paid = false;
            if (this.cart.is_trial) {
                this.checkout.prorate = false;
                this.checkout.is_trial_to_paid = true;
            }

            // append purchase type
            this.checkout.purchase_type = this.cart.purchase_type;

            // license agent reset metric param
            this.cart.package_type = "";
            if (!this.isCurrentPlanFlag) {
                this.cart.package_type = "new";
            }

            // reactivate param
            if (this.currentsubscription.subscription.status == "cancelled") {
                this.checkout.reactivate = true;
                // license agent reset metric param
                this.cart.package_type = "new";
            }

            //Update current subscription
            self.showSpinner = true;
            self.$http({
                method: 'POST',
                url: self.baseUrl + '/api/v1/updatesubscription',
                data: {
                    subscription_params: self.checkout
                }
            }).success(function (data) {

                // Chargebee generic error handling
                if (data.error) {
                    self.showSpinner = false;
                    self.toastr.error(data.error.error_msg);
                } else {
                    var cbResponse = data.result;

                    // Taxes VAT
                    var is_taxed = false;
                    var tax_rate = "";
                    var line_items = (typeof cbResponse.invoice != "undefined") ? cbResponse.invoice.line_items : [];
                    if (line_items.length > 0) {
                        is_taxed = (typeof line_items[0].is_taxed != "undefined") ? line_items[0].is_taxed : false;
                        tax_rate = (typeof line_items[0].tax_rate != "undefined") ? line_items[0].tax_rate : "";
                    }
                    // email template params
                    parameters.body_content.is_taxed = is_taxed;
                    parameters.body_content.tax_rate = tax_rate;

                    // license data
                    self.licenceDetail.machine_info = '';
                    self.licenceDetail.start_date = self.currentUser.tenant_license.created_dt;
                    if (self.isCurrentPlanFlag && emptyaddons.length > 0) {
                        // add extras case
                        var expiredDt = self.currentUser.tenant_license.expired_dt;
                    } else {
                        // modify plan case
                        var nextBilling = new Date(cbResponse.subscription.next_billing_at * 1000);
                        var expiredDt = nextBilling.getTime();
                    }
                    self.licenceDetail.expiry_date = expiredDt;
                    self.licenceDetail.name = self.cart.package_name;
                    self.licenceDetail.features = self.features;
                    self.licenceDetail.metrics = self.selectedMetrics;
                    self.licenceDetail.tenant = {
                        'tenant_uid': "",
                        'email': self.user.email
                    };
                    self.licenseData.license_detail = self.licenceDetail;
                    // tenant uid of current user
                    self.licenseData.tenant_uid = "";
                    // license agent reset metric param
                    self.licenseData.package_type = self.cart.package_type;

                    // event log

                    self.logdata.tenant_uid = "";
                    self.logdata.current_value = '';
                    self.logdata.previous_value = self.cart.old_license_data;
                    self.logdata.user_type = 'user';
                    self.logdata.updated_by = self.user.tenant_id;

                    // prepare tenant license columns obj values
                    if (self.currentsubscription.subscription.status == "cancelled") {
                        // reactivate out-term case
                        self.logdata.event_type = 'SUBSCRIPTION_REACTIVATED';
                        parameters.subject = "Your account has been reactivated";
                        parameters.body_content.email_type = "reactivate";
                        parameters.body_content.term_type = "out-term";
                        var columnvalues = { '_id': self.currentUser.tenant_license._id, 'plan_id': planId, 'license_detail': self.cart.license_detail, 'license_data': self.licenseData, 'expired_dt': expiredDt, 'is_active': true, 'canceled_dt': null, 'logdata': self.logdata };
                        self.$gammaAnalytics.setAnalytics('Subscription Reactivated', self.currentUser.mixpanel_id);
                    } else {
                        if (self.isCurrentPlanFlag && emptyaddons.length > 0) {
                            // change subscription with only addons case
                            self.logdata.event_type = 'SUBSCRIPTION_ADDON_ADDED';
                            parameters.subject = "Gamma account modified";
                            parameters.body_content.email_type = "extras";
                            var columnvalues = { '_id': self.currentUser.tenant_license._id, 'license_detail': self.cart.license_detail, 'license_data': self.licenseData, 'logdata': self.logdata };
                            self.$gammaAnalytics.setAnalytics('Subscription addon added', self.currentUser.mixpanel_id);
                        } else {
                            // change subscription with different plan and addons case
                            self.logdata.event_type = 'SUBSCRIPTION_UPDATED';
                            parameters.subject = (self.cart.has_scheduled_changes) ? "Your account has been downgraded" : ((self.cart.is_trial) ? "Thank you for purchasing Gamma" : "Your account has been upgraded");
                            parameters.body_content.email_type = (self.cart.has_scheduled_changes) ? "downgrade" : ((self.cart.is_trial) ? "trial-to-paid" : "upgrade");
                            var columnvalues = { '_id': self.currentUser.tenant_license._id, 'plan_id': planId, 'license_detail': self.cart.license_detail, 'license_data': self.licenseData, 'expired_dt': expiredDt, 'logdata': self.logdata };
                            self.$gammaAnalytics.setAnalytics('Subscription Updated', self.currentUser.mixpanel_id, { 'plan': self.cart.package_name, 'company': self.billing.company });

                            // Update intercom
                            var intercomUser = {
                                user_id: self.currentUser.intercom_id,
                                'company': self.billing.company
                            };
                            self.$intercom.update(intercomUser);
                        }
                    }

                    // date conversion
                    var currentTermStart = self.filter('date')((cbResponse.subscription.current_term_start * 1000), 'dd.MM.yyyy');
                    var currentTermEnd = self.filter('date')((cbResponse.subscription.current_term_end * 1000), 'dd.MM.yyyy');
                    var nextBillingAt = self.filter('date')((cbResponse.subscription.next_billing_at * 1000), 'dd.MM.yyyy');
                    // request body params
                    parameters.body_content.package_info.billing_period = cbResponse.subscription.billing_period;
                    parameters.body_content.package_info.billing_period_unit = cbResponse.subscription.billing_period_unit;
                    parameters.body_content.package_info.current_term_start = currentTermStart;
                    parameters.body_content.package_info.current_term_end = currentTermEnd;
                    parameters.body_content.package_info.next_billing_at = nextBillingAt;
                    // parameters.body_content.verify_link = self.currentUser.hash;

                    // invoice details attached
                    if (cbResponse.invoice != undefined && cbResponse.invoice != "") {
                        parameters.body_content.invoice_id = cbResponse.invoice.id;
                        parameters.body_content.invoice_name = cbResponse.invoice.id;
                    }

                    // additional
                    parameters.shoot_mail = true;
                    columnvalues.template_data = parameters;

                    // downgrade case: apply changes on renewal : not in use
                    if (self.cart.has_scheduled_changes) {
                        // do not update tenant license data
                        // send mail
                        // self.$http({
                        //     method: 'POST',
                        //     url: self.baseUrl + '/shootmail',
                        //     data: parameters
                        // }).success(function (data) {
                        //     // callback
                        //     self.showSpinner = false;
                        //     window.location.href = "account";
                        // });
                    } else {
                        // upgrade case: apply changes immediately
                        // do update tenant license data
                        self.TenantLicenseResource.save(columnvalues).$promise.then(data => {
                            // redirect
                            self.showSpinner = false;
                            window.location.href = "account";
                        });
                    }
                }

            }).catch((err) => {
                // Error
                self.state.go('changeplan');
            });
        }
    }

    processTransaction(parameters) {
        let self = this;
        // Payment gateway code
        var nonce = (typeof this.payment.nonce != 'undefined') ? this.payment.nonce : '';
        var planId = "plan" + this.cart.package_id;
        var subdomainName = angular.lowercase(this.user.subdomain);
        var company = this.billing.company;
        var vat_number = this.billing.vat_number_cb;    // trimmed vat number
        var customerEmail = this.user.email.toLowerCase();
        var password = this.user.password;
        var firstName = this.billing.first_name;
        var lastName = this.billing.last_name;
        var streetAddress = this.billing.street_address;
        var streetAddressLine2 = this.billing.street_address_line2;
        var customerCity = this.billing.city;
        var customerZip = this.billing.zip;
        var customerCountry = this.billing.country;
        var currentDt = new Date().getTime();
        var onpremise = this.user.onpremise;
        // billing purchase type
        var purchase_type = this.cart.purchase_type;
        var job_title = (typeof this.billing.job_title != "undefined") ? this.billing.job_title : "";

        // gamma user
        this.gammaUser.company_name = company;
        this.gammaUser.company_address = typeof customerCountry != 'undefined' ? customerCountry : "";
        this.gammaUser.company_website = "";
        this.gammaUser.first_name = firstName;
        this.gammaUser.last_name = lastName;
        this.gammaUser.job_title = "";
        this.gammaUser.email = customerEmail;
        this.gammaUser.password = password;
        this.gammaUser.phone = "";
        this.gammaUser.subdomain = subdomainName;
        this.gammaUser.is_trial = false;

        // Prepare subscription params
        this.checkout = {
            plan_id: planId,
            customer: {
                company: company,
                email: customerEmail,
                first_name: firstName,
                last_name: lastName,
                locale: "en-US",
                phone: ""
            },
            billing_address: {
                first_name: firstName,
                last_name: lastName,
                line1: streetAddress,
                line2: streetAddressLine2,
                city: customerCity,
                state: "",
                zip: customerZip,
                country: customerCountry,
                company: company
            }
        }
        // chargebee addons json values
        if (!this.packageoptions[this.cart.packageindex].is_trial) {
            this.checkout.addons = this.cart.chargebeeaddons;
            this.checkout.card = {
                tmp_token: nonce
            };
        }

        // based on purchase type pass vat number otherwise not
        if (this.cart.purchase_type == "company") {
            // add vat number
            this.checkout.customer.vat_number = vat_number;
        }

        // Process chargebee transaction
        self.showSpinner = true;
        self.$http({
            method: 'POST',
            url: self.baseUrl + '/api/v1/process',
            data: self.checkout
        }).success(function (data) {

            // Chargebee generic error handling
            if (data.error) {
                self.showSpinner = false;
                self.toastr.error(data.error.error_msg);
            } else {
                var cbResponse = data.result;

                var from_type = (self.currentstate == 'dualaccount') ? 'existing' : 'new';
                var status_type = (self.currentstate == 'dualaccount') ? 'active' : 'pending';

                // Taxes VAT
                var is_taxed = false;
                var tax_rate = "";
                var line_items = (typeof cbResponse.invoice != "undefined") ? cbResponse.invoice.line_items : [];
                if (line_items.length > 0) {
                    is_taxed = (typeof line_items[0].is_taxed != "undefined") ? line_items[0].is_taxed : false;
                    tax_rate = (typeof line_items[0].tax_rate != "undefined") ? line_items[0].tax_rate : "";
                }
                // email template params
                parameters.body_content.is_taxed = is_taxed;
                parameters.body_content.tax_rate = tax_rate;
                parameters.body_content.from_type = from_type;

                // After transaction success
                var customerId = data.result.customer.id;
                var subscriptionId = data.result.subscription.id;
                var nextBilling = new Date(data.result.subscription.next_billing_at * 1000);
                var expiredDt = nextBilling.getTime();
                var expiryDate = self.filter('date')(nextBilling, 'dd-MMM-yyyy');

                // Deep update data start
                self.tenantlicense.tenant_id = "";
                self.tenantlicense.license_detail = self.cart.license_detail;
                self.tenantlicense.plan_id = planId;
                self.tenantlicense.subscription_id = subscriptionId;
                self.tenantlicense.is_active = true;
                self.tenantlicense.created_dt = currentDt;
                self.tenantlicense.expired_dt = expiredDt;

                self.licenceDetail.machine_info = '';
                self.licenceDetail.start_date = currentDt;
                self.licenceDetail.expiry_date = expiredDt;
                self.licenceDetail.name = self.cart.package_name;
                self.licenceDetail.features = self.features;
                self.licenceDetail.metrics = self.selectedMetrics;
                self.licenceDetail.tenant = {
                    'tenant_uid': "",
                    'email': ""
                };
                self.licenseData.license_detail = self.licenceDetail;
                self.licenseData.tenant_uid = "";

                self.tenantlicense.license_data = self.licenseData;

                // event log
                self.logdata.tenant_uid = "";
                self.logdata.current_value = '';
                self.logdata.previous_value = '';
                self.logdata.event_type = 'SUBSCRIPTION_CREATED';
                self.logdata.user_type = 'user';
                self.logdata.updated_by = "";

                self.tenantlicense.logdata = self.logdata;
                // Deep update data end

                // Template data start
                // date conversion
                var currentTermStart = self.filter('date')((cbResponse.subscription.current_term_start * 1000), 'dd.MM.yyyy');
                var currentTermEnd = self.filter('date')((cbResponse.subscription.current_term_end * 1000), 'dd.MM.yyyy');
                var nextBillingAt = self.filter('date')((cbResponse.subscription.next_billing_at * 1000), 'dd.MM.yyyy');
                // request body params
                if (self.currentstate == 'dualaccount') {
                    parameters.subject = "Thank you for purchasing Gamma";
                    parameters.body_content.email_type = "trial-to-paid";
                } else {
                    parameters.subject = "Activate your Gamma account now";
                    parameters.body_content.email_type = "signup";
                }
                parameters.body_content.verify_link = "";
                parameters.body_content.package_info.billing_period = cbResponse.subscription.billing_period;
                parameters.body_content.package_info.billing_period_unit = cbResponse.subscription.billing_period_unit;
                parameters.body_content.package_info.current_term_start = currentTermStart;
                parameters.body_content.package_info.current_term_end = currentTermEnd;
                parameters.body_content.package_info.next_billing_at = nextBillingAt;
                // Template data end

                // invoice details attached
                if (cbResponse.invoice != undefined && cbResponse.invoice != "") {
                    parameters.body_content.invoice_id = cbResponse.invoice.id;
                    parameters.body_content.invoice_name = cbResponse.invoice.id;
                }

                // Save user
                self.Auth.createUser({
                    tenant_type: 'cloud',
                    email: customerEmail,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    company: company,
                    customer_id: customerId,
                    created_dt: currentDt,
                    updated_dt: currentDt,
                    gamma_user: self.gammaUser,
                    subdomain: subdomainName,
                    has_support: false,
                    deep_update: self.tenantlicense,
                    template_data: parameters,
                    purchase_type: purchase_type,
                    job_title: job_title,
                    status: status_type,
                    from_type: from_type,
                    is_trial: false
                })
                    .then((data) => {

                        // Update user
                        var userId = data.last_insert_id;
                        var sessionToken = data.token;
                        var mixpanel_id = data.mixpanel_id;
                        // var intercom_id = data.intercom_id;

                        // // Update intercom
                        // var intercomUser = {
                        //     name: firstName+" "+lastName,
                        //     user_id: intercom_id,
                        //     email: customerEmail,
                        //     'subdomain': subdomainName,
                        //     'company': company
                        // };
                        // self.$intercom.update(intercomUser);

                        // set analytics user start
                        self.$gammaAnalytics.setAnalytics('Subscription created', mixpanel_id, {
                            'first_name': firstName,
                            'last_name': lastName,
                            'email': customerEmail,
                            'company': company,
                            'subdomain': subdomainName,
                            'plan': self.cart.package_name
                        });
                        // set analytics user end

                        // redirect
                        self.showSpinner = false;
                        if (!self.isLoggedIn && self.currentstate == 'signup') {
                            // signup case
                            parameters.body_content.verify_link = sessionToken;
                            self.UserService.emailContent = parameters;
                            self.state.go('emailverification');
                        } else {
                            // dualaccount case
                            window.location.href = '/result';
                        }
                    }).catch((err) => {
                        // Error
                        self.state.go('home');
                    });
            }

        }).catch((err) => {
            // Error
            self.state.go('home');
        });
    }

    // email template : sum of default metrics and addon metrics
    totalMetricsCount(type = '') {
        let self = this;
        self.emailMetric = [];
        // total counts of email metric
        var packageJson = (type == 'os') ? this.os.license_detail.package_json : this.cart.license_detail.package_json;
        angular.forEach(packageJson.packagemetrics, function (value, index) {

            var addonQuatityPrice = 0;

            angular.forEach(packageJson.addonmetrics, function (addon, index) {
                if (addon.id == "metric" + value.id) {
                    addonQuatityPrice = addon.quantity * addon.bundle_size;
                }
            });

            if (value.key == 'loc') {
                self.convertLoc(value, addonQuatityPrice);
            } else {
                self.emailMetric.push({
                    'name': value.name,
                    'final_value': value.default_value + addonQuatityPrice
                });
            }

            self.selectedMetrics[value.key] = {
                'limit': value.default_value + addonQuatityPrice,
                'checkBy': value.checkby
            };
        });
        // end total count of email metric
    }

    // toggle steps
    toggleStep(step) {
        this.step1Flag = (step == 1) ? true : false;
        this.step2Flag = (step == 2) ? true : false;
        this.step3Flag = (step == 3) ? true : false;
        this.step4Flag = (step == 4) ? true : false;
        this.step5Flag = (step == 5) ? true : false;

        this.$timeout(function () {
            $('form[name="step' + step + 'form"] input').first().focus();
        });
    }

    // email format validation
    validemailcheck(email) {
        var regex = this.email_pattern;
        if (!regex.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    // stripe : prepare hosted payment fields
    prepareCardElements() {
        let self = this;
        // stripe initialization start

        // stripe key setup
        this.stripe = Stripe(self.stripeKey); //stripe api key

        // stripe  element inialization
        this.elements = this.stripe.elements();

        // stripe custom styles here
        this.style = {
            base: {
                '::placeholder': {
                    color: '#CFD7E0',
                },
            },
        };

        // stripe card number element create
        this.cardNumberElement = this.elements.create('cardNumber', {
            style: this.style
        });
        this.cardNumberElement.mount('#card-number');

        // stripe card expiry element create
        this.cardExpiryElement = this.elements.create('cardExpiry', {
            style: this.style
        });
        this.cardExpiryElement.mount('#expiration-date');

        // stripe card cvv element create
        this.cardCvcElement = this.elements.create('cardCvc', {
            style: this.style,
            placeholder: '123'
        });
        this.cardCvcElement.mount('#cvv');

        // stripe initialization end

        // stripe  inline errors start
        this.cardNumberElement.on('change', function (event) {
            // stripe set brand icon
            if (event.brand) {
                self.setBrandIcon(event.brand);
            }

            // stripe inline errors
            self.$timeout(() => {
                if (event.error) {
                    self.cardNumberError = "Inavlid Card Number";
                } else {
                    self.cardNumberError = "";
                }
            });
        });

        this.cardExpiryElement.on('change', function (event) {
            self.$timeout(() => {
                if (event.error) {
                    self.cardExpiryError = "Invalid Expiry Date";
                } else {
                    self.cardExpiryError = "";
                }
            });
        });

        this.cardCvcElement.on('change', function (event) {
            self.$timeout(() => {
                if (event.error) {
                    self.cardCvcError = "Inavlid Cvv";
                } else {
                    self.cardCvcError = "";
                }
            });
        });
        // stripe inline errors end
    }

    // stripe set brand icon
    setBrandIcon(brand) {
        let self = this;
        this.brandIconElement = document.getElementById('brand-icon');
        this.pfClass = 'pf-credit-card';
        if (brand in self.cardBrandToPfClass) {
            this.pfClass = self.cardBrandToPfClass[brand];
        }
        for (var i = this.brandIconElement.classList.length - 1; i >= 0; i--) {
            this.brandIconElement.classList.remove(this.brandIconElement.classList[i]);
        }
        this.brandIconElement.classList.add('pf');
        this.brandIconElement.classList.add(this.pfClass);
    }

    // for random subdomain
    stringGen(len) {
        var text = "";
        var charset = "0123456789";
        for (var i = 0; i < len; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return text;
    }

    // metric loc : format conversion
    convertLoc(obj, addonQuatity) {
        let self = this;
        var finalValue = (obj.default_value + addonQuatity) / 1000;
        self.emailMetric.push({
            'name': obj.name,
            'final_value': finalValue + 'k'
        });
    }

    // calculate next billing amount for current selection items
    getNextBillingAmount() {
        let self = this;

        // current plan base price
        var base_price = this.cart.packagebaseprice_incl_tax;

        // old addons total
        var old_addonmetrics_total = 0;
        if (self.cart.old_license_data) {
            angular.forEach(self.cart.old_license_data.license_detail.package_json.addonmetrics, function (value, index) {
                if (value.bundle_type == "bound") {
                    old_addonmetrics_total = (old_addonmetrics_total + value.subtotal);
                }
            });
        }

        // new addons
        var new_addonmetrics_total = 0;
        angular.forEach(self.packageoptions[self.cart.packageindex].Metrics, function (value, index) {
            if (value.addon) {
                if (value.is_selected && value.addon.bundle_type == "bound") {
                    // new_addonmetrics_total = (new_addonmetrics_total + value.addon.subtotal);
                    new_addonmetrics_total = (new_addonmetrics_total + value.addon.subtotal_incl_tax);
                }
            }
        });

        if (this.cart.planduration == this.cart.old_package_interval) {
            this.cart.next_billing_estimate = (base_price + old_addonmetrics_total + new_addonmetrics_total);
        } else {
            this.cart.next_billing_estimate = (base_price + new_addonmetrics_total);
        }

        // display next billing date based on interval
        if (this.cart.is_trial) {
            // if old plan is trial
            if (this.packageoptions[this.cart.packageindex].is_trial) {
                var today = this.currentUser.tenant_license.expired_dt;
                var future = today;
            } else {
                var today = new Date();
                var future = (new Date(today.setMonth(today.getMonth() + parseInt(this.cart.planduration))));
            }
        } else {
            // if old plan is paid
            if (this.cart.planduration == this.cart.old_package_interval) {
                var today = this.currentUser.tenant_license.expired_dt;
                var future = today;
            } else {
                var today = new Date();
                var future = (new Date(today.setMonth(today.getMonth() + parseInt(this.cart.planduration))));
            }
        }
        // date format
        this.cart.next_billing_estimate_date = this.filter('date')((future), 'dd.MM.yyyy');
    }

    // used for cancelled state handling only
    getTotalAddons() {
        let self = this;
        // prepare addons array
        this.cart.totaladdons = [];
        this.cart.total_addonmetrics = [];
        this.cart.total_addon_summary = [];
        // loop
        angular.forEach(this.packageoptions[this.cart.packageindex].Metrics, function (value, index) {
            // find old addon metric
            var isPresentMetric = self.currentUser.tenant_license.license_detail.package_json.addonmetrics.filter(function (i) {
                return i.id === "metric" + value._id;
            });
            var isPresentMetricQty = (isPresentMetric.length) ? isPresentMetric[0].quantity : 0;
            // checked state
            if (value.addon && value.extras > 0 && value.is_selected) {
                if (self.cart.planduration != self.cart.old_package_interval) {
                    // Downgrade or reactivate or different interval case
                    var estimateMetricQty = value.extras;
                } else {
                    // Upgrade case send old + new qty
                    var estimateMetricQty = (value.addon.charge_type == "recurring") ? (parseInt(value.extras) + parseInt(isPresentMetricQty)) : parseInt(value.extras);
                }
                // prepare chargebee object
                self.cart.totaladdons.push({
                    'id': "metric" + value._id,
                    'quantity': estimateMetricQty,
                    'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                });
                // prepare db object
                self.cart.total_addonmetrics.push({
                    'id': "metric" + value._id,
                    'quantity': estimateMetricQty,
                    'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                });
                // prepare review summary object
                var addon_subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(estimateMetricQty)) : (parseFloat(value.addon.price) * parseInt(estimateMetricQty));
                self.cart.total_addon_summary.push({
                    'id': "metric" + value._id,
                    'name': value.name,
                    'quantity': estimateMetricQty,
                    'extras': estimateMetricQty,
                    'addon': {
                        'price': value.addon.price,
                        'bundle_size': (value.addon) ? value.addon.bundle_size : '',
                        'bundle_type': (value.addon) ? value.addon.bundle_type : '',
                        'charge_type': (value.addon) ? value.addon.charge_type : '',
                        'label_name': (value.addon) ? value.addon.label_name : '',
                        'subtotal_incl_tax': addon_subtotal,
                        'subtotal': addon_subtotal
                    }
                });
            } else {
                // no change state
                if (self.cart.planduration == self.cart.old_package_interval) {
                    // exlcude non_recurring item i.e. scans
                    if (value.addon && value.addon.charge_type == "recurring") {
                        // prepare chargebee object
                        self.cart.totaladdons.push({
                            'id': "metric" + value._id,
                            'quantity': isPresentMetricQty,
                            'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                        });
                        // prepare db object
                        self.cart.total_addonmetrics.push({
                            'id': "metric" + value._id,
                            'quantity': isPresentMetricQty,
                            'bundle_size': (value.addon) ? value.addon.bundle_size : ''
                        });
                        // prepare review summary object
                        var addon_subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(isPresentMetricQty)) : (parseFloat(value.addon.price) * parseInt(isPresentMetricQty));
                        self.cart.total_addon_summary.push({
                            'id': "metric" + value._id,
                            'name': value.name,
                            'quantity': isPresentMetricQty,
                            'extras': isPresentMetricQty,
                            'addon': {
                                'price': value.addon.price,
                                'bundle_size': (value.addon) ? value.addon.bundle_size : '',
                                'bundle_type': (value.addon) ? value.addon.bundle_type : '',
                                'charge_type': (value.addon) ? value.addon.charge_type : '',
                                'label_name': (value.addon) ? value.addon.label_name : '',
                                'subtotal_incl_tax': addon_subtotal,
                                'subtotal': addon_subtotal
                            }
                        });
                    }

                }
            }
        });
        // Filter
        this.cart.totaladdons = this.cart.totaladdons.filter(function (i) {
            return i.quantity > 0;
        });
        // Filter
        this.cart.total_addonmetrics = this.cart.total_addonmetrics.filter(function (i) {
            return i.quantity > 0;
        });
        // Filter
        this.cart.total_addon_summary = this.cart.total_addon_summary.filter(function (i) {
            return i.quantity > 0;
        });
    }

    // used for cancelled state handling only
    recalculateAddonMetrics(selectedMetricsObj) {
        let self = this;
        self.extra_addons = [];
        // loop
        angular.forEach(selectedMetricsObj, function (value, index) {
            // default metric values
            self.cart.selectedpackagejson.push({
                'id': value._id,
                'key': value.key,
                'name': value.name,
                'default_value': value.package_metric.default_value,
                'checkby': value.checkby
            });
            if (value.addon) {
                // find old addon metric
                var isPresentMetric = self.currentUser.tenant_license.license_detail.package_json.addonmetrics.filter(function (i) {
                    return i.id === "metric" + value._id;
                });
                var isPresentMetricQty = (isPresentMetric.length) ? isPresentMetric[0].quantity : 0;
                var addon_quantity = 0;
                var addon_subtotal = 0;
                if (value.extras > 0 && value.is_selected) {
                    // checked state
                    if (self.cart.planduration != self.cart.old_package_interval) {
                        addon_quantity = parseInt(value.extras);
                    } else {
                        addon_quantity = (value.addon.charge_type == "recurring") ? (parseInt(value.extras) + parseInt(isPresentMetricQty)) : parseInt(value.extras);
                    }
                    addon_subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(addon_quantity)) : (parseFloat(value.addon.price) * parseInt(addon_quantity));
                    // push
                    self.extra_addons.push({
                        name: value.name,
                        label_name: (typeof value.addon.label_name != "undefined" && value.addon.label_name != "") ? value.addon.label_name : value.name,
                        key: value.key,
                        quantity: addon_quantity,
                        price: self.filter('currency')(value.addon.price, '', 2),
                        subtotal: self.filter('currency')(addon_subtotal, '', 2)
                    });
                } else {
                    // no change state
                    if (self.cart.planduration == self.cart.old_package_interval) {
                        // exlcude non_recurring item i.e. scans
                        if (value.addon.charge_type == "recurring") {
                            addon_quantity = parseInt(isPresentMetricQty);
                            addon_subtotal = (value.addon.bundle_type == "bound") ? (parseFloat(value.addon.price) * parseInt(self.cart.planduration) * parseInt(addon_quantity)) : (parseFloat(value.addon.price) * parseInt(addon_quantity));
                            // push
                            self.extra_addons.push({
                                name: value.name,
                                label_name: (typeof value.addon.label_name != "undefined" && value.addon.label_name != "") ? value.addon.label_name : value.name,
                                key: value.key,
                                quantity: addon_quantity,
                                price: self.filter('currency')(value.addon.price, '', 2),
                                subtotal: self.filter('currency')(addon_subtotal, '', 2)
                            });
                        }
                    }
                }
            }
        });
        // Filter
        this.extra_addons = this.extra_addons.filter(function (i) {
            return i.quantity > 0;
        });
    }

    // billing info purchase type tab
    togglePurchaseType(type) {
        this.cart.purchase_type = type;
        // new addition: disable billing info address fields
        this.cart.disable_billing_fields = (this.currentstate == 'changeplan' && this.cart.purchase_type == 'company' && !this.cart.is_trial) ? true : false;
    }

    // cartinfo country selection
    getPrices(country_code) {
        let self = this;
        // new addition: set locals
        localStorage.setItem('default_country_code', country_code);
        this.cart.default_country = country_code;
        this.cart.default_country_name = this.ISO3166.getCountryName(country_code);
        this.billing.country = country_code;
        // vat number placeholder text
        this.tax_format_country = self.tax_format_countries.filter(function (i) {
            return (i.country_code == country_code);
        });
        this.cart.tax_format_placeholder = (this.tax_format_country.length > 0) ? "Ex: " + this.tax_format_country[0].format : "";
        this.cart.country_type = (this.tax_format_country.length > 0) ? this.tax_format_country[0].type : "";
        // Filter
        var emptyaddons = this.packageoptions[this.cart.packageindex].Metrics.filter(function (i) {
            return (i.is_selected && i.quantity > 0);
        });
        // cancelled state handling
        if (typeof self.currentUser.tenant_license != "undefined" && !self.currentUser.tenant_license.is_active) {
            self.getReactivateEstimates(self.cart.package_id, self.user.subscription_id);
        } else if (self.currentstate == 'changeplan' && !self.isCurrentPlanFlag && typeof self.currentUser.tenant_license != "undefined" && self.currentUser.tenant_license.is_active) {
            // modify plan case
            self.showSpinnerPrice = true;
            self.getPackageEstimates(self.cart.package_id, self.user.subscription_id);
        } else if (self.currentstate == 'changeplan' && self.isCurrentPlanFlag && emptyaddons.length > 0 && typeof self.currentUser.tenant_license != "undefined" && self.currentUser.tenant_license.is_active) {
            // add extras case
            self.getAddonEstimates(self.cart.old_package_id, self.user.subscription_id);
        } else {
            // call create estimate api
            if (self.currentstate == "signup" || self.currentstate == "dualaccount") {
                self.showSpinnerPrice = true;
                self.showSpinnerSubtotal = true;
                self.showSpinnerTotal = true;
                self.showSpinnerDueNow = true;
                self.$timeout(function () {
                    self.getCreateEstimates();
                }, 500);
            } else {
                // change plan
                self.showSpinnerPrice = true;
                self.showSpinnerSubtotal = true;
                self.showSpinnerTotal = false;
                self.showSpinnerDueNow = false;
                self.$timeout(function () {
                    self.getDefaultEstimates();
                }, 500);
            }
        }
    }
}

angular.module('gammawebsiteApp')
    .controller('SignupController', SignupController);
