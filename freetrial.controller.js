'use strict';

class FreetrialController {

    submitted = false;
    errors = {};

    licenceDetail = {};
    selectedMetrics = {};
    licenseData = {};
    gammaUser = {};
    emailContent = {};
    tenantlicense = {};

    features = [];

    constructor(Auth, $state, $http, $location, $scope, User, $filter, $timeout, TenantLicense, $gammaAnalytics, appConfig, md5, $intercom) {
        let self = this;

        this.Auth = Auth;
        this.state = $state;
        this.$http = $http;
        this.$location = $location;
        this.$scope = $scope;
        this.filter = $filter;
        this.UserService = User;
        this.TenantLicenseResource = TenantLicense;
        this.$gammaAnalytics = $gammaAnalytics;
        this.md5 = md5;
        this.$intercom = $intercom;

        this.$timeout = $timeout;
        this.showSpinner = false;

        this.cart = {};
        this.user = {};
        this.selectedMetrics = {};
        this.emailContent = {};

        this.cart.license_detail = {};
        this.cart.license_detail.package_json = {};
        this.cart.license_detail.package_json.packagemetrics = [];
        this.cart.license_detail.package_json.addonmetrics = [];

        this.cart.license_detail = {};
        this.cart.license_detail.package_json = {};
        this.cart.license_detail.package_json.packagemetrics = [];
        this.cart.license_detail.package_json.addonmetrics = [];
        this.logdata = {};
        this.gamma_ui = appConfig.gamma_ui;
        this.gamma_ui_env = appConfig.gamma_ui_env;
        this.gamma_os_postfix = appConfig.gamma_os_postfix;
        this.email_pattern = new RegExp(appConfig.email_pattern);
        // Base url with port
        this.baseUrl = $location.protocol() + '://' + location.host;

        this.user.email = (this.UserService.email) ? this.UserService.email : "";

        // get client ip country
        this.cart.default_country = "";
        $.getJSON('//ipinfo.io/json', function (data) {
            self.cart.default_country = (typeof data.country != "undefined") ? data.country : "";
        });

        // from db
        this.$http({
            method: 'GET',
            url: this.baseUrl + '/api/1/packages'
        }).success(function (data) {
            // response
            data = data.filter(function (i) {
                return i.is_local == false;
            });
            self.packages = angular.copy(data);

            self.packages = self.packages.filter(function (i) {
                return (i.is_trial === true && i.active === 'active');
            });

            var packageSelected = self.packages[0];

            var selectedMetricsObj = packageSelected.Metrics;
            self.cart.selectedpackagejson = [];
            angular.forEach(selectedMetricsObj, function (value, index) {
                self.cart.selectedpackagejson.push({
                    'id': value._id,
                    'key': value.key,
                    'name': value.name,
                    'default_value': value.package_metric.default_value,
                    'checkby': value.checkby
                });
            });

            // assign cart values
            self.cart.license_detail.package_json.packagemetrics = self.cart.selectedpackagejson;
            self.cart.license_detail.package_json.addonmetrics = [];
            self.cart.license_detail.package_json.plan_name = (packageSelected.name) ? packageSelected.name : "Trial";
            self.cart.license_detail.package_json.plan_interval = "";

            self.cart.package_name = (packageSelected.name) ? packageSelected.name : "";
            self.cart.package_id = (packageSelected._id) ? packageSelected._id : "";

            // current package features
            self.features = jQuery.map(packageSelected.Features, function (feature, i) {
                return feature.key;
            });

            // get metrics for email template
            self.totalMetricsCount();

        });
    }

    getstarted(form) {
        let self = this;
        this.submitted = true;
        this.errors = {};

        if (form.$valid) {

            // server validation subdomain
            this.Auth.subdomaincheck(angular.lowercase(this.user.subdomain), angular.lowercase(this.user.email), "opensource")
                .then((res) => {

                    if (res.flag) {
                        // display error msg
                        form['subdomain'].$setValidity('mongoose', false);
                    } else {

                        // server validation email
                        this.Auth.emailcheck(this.user.email, false, "opensource")
                            .then((res) => {
                                self.email_error_msg = self.email_error_flag = '';
                                if (res.flag) {
                                    self.email_error_flag = res.info.type;
                                    if (res.info.type == 'same') {
                                        self.email_error_msg = 'Email already exists.';
                                    } else if (res.info.type == 'different') {
                                        self.email_error_msg = 'This email already exists, please sign in or use a different email.';
                                    }
                                    // display error msg
                                    form['email'].$setValidity('mongoose', false);
                                } else {

                                    self.user.first_name = "";
                                    self.user.last_name = "";
                                    var matches = self.user.name.split(/\s+/);
                                    if (matches.length > 1) {
                                        self.user.last_name = matches.splice((matches.length - 1), 1);
                                        self.user.last_name = self.user.last_name.join("");
                                        self.user.first_name = matches.join(" ");
                                    } else {
                                        self.user.first_name = matches.join("");
                                    }

                                    // chargebee transaction
                                    self.processtransaction();
                                }

                            });
                    }
                });

        }
    }

    // email template : sum of default metrics and addon metrics
    totalMetricsCount() {
        let self = this;
        self.emailMetric = [];

        // total counts of email metric
        var packageJson = this.cart.license_detail.package_json;
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

    // metric loc : format conversion
    convertLoc(obj, addonQuatity) {
        let self = this;
        var finalValue = (obj.default_value + addonQuatity) / 1000;
        self.emailMetric.push({
            'name': obj.name,
            'final_value': finalValue + 'k'
        });
    }

    processtransaction() {
        let self = this;

        // Payment gateway code
        var planId = "plan" + this.cart.package_id;
        var subdomainName = angular.lowercase(this.user.subdomain);
        var company = null;
        var customerEmail = (typeof this.user.email != 'undefined') ? this.user.email.toLowerCase() : '';
        var password = this.user.password;
        var firstName = this.user.first_name;
        var lastName = this.user.last_name;
        var streetAddress = "";
        var customerCity = "";
        var customerZip = "";
        var customerCountry = this.cart.default_country;
        var currentDt = new Date().getTime();

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
        this.gammaUser.is_trial = true;

        // Prepare subscription params
        this.checkout = {
            plan_id: planId,
            customer: {
                company: company,
                email: customerEmail,
                first_name: firstName,
                last_name: lastName,
                locale: "en-US",
                phone: "",
                vat_number: ""
            },
            billing_address: {
                first_name: firstName,
                last_name: lastName,
                line1: streetAddress,
                city: customerCity,
                state: "",
                zip: customerZip,
                country: customerCountry
            }
        }

        // Process chargebee transaction
        this.showSpinner = true;
        // After transaction success
        var customerId = null;
        var subscriptionId = null;
        var nextBilling = '';
        var expiredDt = null;

        // Deep update data start
        this.tenantlicense.tenant_id = "";
        this.tenantlicense.license_detail = this.cart.license_detail;
        this.tenantlicense.plan_id = planId;
        this.tenantlicense.subscription_id = subscriptionId;
        this.tenantlicense.is_active = true;
        this.tenantlicense.created_dt = currentDt;
        this.tenantlicense.expired_dt = expiredDt;

        this.licenceDetail.machine_info = '';
        this.licenceDetail.start_date = currentDt;
        this.licenceDetail.expiry_date = expiredDt;
        this.licenceDetail.name = this.cart.package_name;
        this.licenceDetail.features = this.features;
        this.licenceDetail.metrics = this.selectedMetrics;
        this.licenceDetail.tenant = {
            'tenant_uid': "",
            'email': ""
        };
        this.licenseData.license_detail = this.licenceDetail;
        this.licenseData.tenant_uid = "";

        this.tenantlicense.license_data = this.licenseData;

        // event log
        this.logdata.tenant_uid = "";
        this.logdata.current_value = '';
        this.logdata.previous_value = '';
        this.logdata.event_type = 'SUBSCRIPTION_CREATED';
        this.logdata.user_type = 'user';
        this.logdata.updated_by = "";

        this.tenantlicense.logdata = this.logdata;
        // Deep update data end

        // Template data start
        var locItem = this.cart.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "loc";
        });
        var defaultLoc = (locItem.length) ? locItem[0].default_value : "";
        var locValue = this.filter('number')(defaultLoc);
        var usersItem = this.cart.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "users";
        });
        var usersValue = (usersItem.length) ? usersItem[0].default_value : "";
        var scansItem = this.cart.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "scans";
        });
        var scansValue = (scansItem.length) ? scansItem[0].default_value : "";
        var scan_historyItem = this.cart.license_detail.package_json.packagemetrics.filter(function (i) {
            return i.key === "scan_history";
        });
        var scan_historyValue = (scan_historyItem.length) ? scan_historyItem[0].default_value : "";

        // date conversion
        var trialStart = '';
        var trialEnd = '';
        var nextBillingAt = '';

        // Get current user subdomain
        var domain = subdomainName + '.' + this.gamma_os_postfix + '.' + this.gamma_ui;

        // set dubdomain url
        var userSubdomain = (this.gamma_ui_env == "local" || this.gamma_ui_env == "test") ? "http://" + domain : "https://" + domain;

        // prepare email template content
        var parameters = {
            email_to: this.user.email,
            subject: "Activate your Gamma account now",
            body_content: {
                base_url: this.baseUrl,
                gamma_os_postfix: this.gamma_os_postfix,
                email_type: "trial",
                verify_link: "",
                username: this.user.first_name,
                subdomain: userSubdomain,
                package_info: {
                    plan_name: this.cart.package_name,
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
                }
            }
        };
        // Taxes VAT
        var is_taxed = false;
        var tax_rate = "";
        // email template params
        parameters.body_content.is_taxed = is_taxed;
        parameters.body_content.tax_rate = tax_rate;
        // Template data end

        // Save user
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
            from_type: 'new'
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
                parameters.body_content.verify_link = sessionToken;
                self.UserService.emailContent = parameters;
                self.state.go('emailverification');

            }).catch((err) => {
                // Error
                self.state.go('home');
            });
    }


}
angular.module('gammawebsiteApp')
    .controller('FreetrialController', FreetrialController);
