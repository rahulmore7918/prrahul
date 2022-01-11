var licenseSummery = function () {
    var licenseData, machineKey;
    var licenseSummaryManager = {
        "users": { icon: "ic-teams", topick: 'users', label: "", hasValue: true, showPercentage: true, tooltiptext: "User(s) used" },
        "loc": { icon: "ic-menu", topick: 'loc', label: "", hasValue: true, showPercentage: true, tooltiptext: "LOC used" },
        "scans": { icon: "ic-scan", topick: 'scans', label: "", hasValue: true, showPercentage: true, tooltiptext: "Scans used" },
        "snapshots": { icon: "ic-snapshot", topick: 'snapshots', label: "", hasValue: true, showPercentage: false, tooltiptext: "Snapshots per repository" }
    }
    var licenseSummaryData = [];

    $('.inputbox_wraper input,.inputbox_wraper textarea, .inputbox_wraper[type="textarea"]').on('focus', function () {
        $(this).parent().removeClass('input-error');
    });

    function addLicenseExpiry() {

        var expiryDate = new Date(licenseData.license_detail.expiry_date);
        expiryDate.toISOString();
        $('.data_container .license_expiry_container').remove();
        var licenseExpiryHolder = $('<div/>', { class: 'license_expiry_container ' });
        $(".data_container .key_details_wrapper").append(licenseExpiryHolder);
        var gammaLogoWrapper = $('<div/>', { class: 'gamma-logo-container' });
        var iconContainer = $('<div/>', { class: 'icon-container' });
        var anchor =$('<a/>', { href: '#' });
        var gammaLogo = $('<i/>', { class: 'ic-gamma-wordmark' });
        var textWrapper = $('<div/>', { class: 'label' });
        // $(".header_container").prepend(gammaLogoWrapper);
        $(gammaLogoWrapper).insertBefore($(".header_container"));
        iconContainer.append(anchor);
        anchor.append(gammaLogo);
        gammaLogoWrapper.append(iconContainer, textWrapper);
        // var protocol = "http://";
        // if (g.gamma_website_env == "live")
        //     protocol = "https://";

        // var manageLicenseBtn = $('<a/>', { class: 'manage_license_btn button_small', href: protocol + g.gamma_website_host + "/account", target: "_blank" }).html(i18next.t('admin.license_page.manage_license'));
        // licenseExpiryHolder.append(manageLicenseBtn);
        var licenseExpiry = $('<div/>', { class: 'license_expiry date-warpper' });
        var icon = $('<i/>', { class: 'ic-alert' });
        var description = $('<h5/>', { class: '' }).html(i18next.t("admin.license_page.expired_on", { date: g.getFormattedDate(expiryDate.toISOString()).slice(0, -6) }));
        licenseExpiry.append(icon,description);
        if (!g.is_trial) {
            licenseExpiryHolder.append(licenseExpiry);
        }

    }

    function loadMachineKey() {
        function machineKeyDataReceived(data, status) {
            if (status == 'success') {
                machineKey = data.machine_key;
            } else if (status == 'error') {
                g.sendErrorNotification(data, '/license/get-machine-key', 'Machine Key');
            }
        }
        e.loadJSON('/license/get-machine-key', machineKeyDataReceived);
    }

    function renderActivationForm() {
        var liceseActivation = {
            title: i18next.t("admin.license_page.form_title"),
            label_machine_key: i18next.t("admin.input_label.machine_key"),
            machine_key: machineKey,
            label_activation_key: i18next.t("admin.input_label.license_key"),
            activation_key_error: i18next.t("admin.license_page.error.require_license"),
            btn_activate: i18next.t('admin.license_page.activate'),
            //btn_deactivate: i18next.t('admin.license_page.deactivate')
        };

        $('#content .data_container').append(Template.licenseActivation(liceseActivation));
        $('.details-wrapper').addClass('license-container');

        g.admin.utils.bindInputEvents();
    }

    function loadlicenseAgent() {
        e.loadJSON('/license/license-details', licenseDataReceived);
    }

    function licenseDataReceived(data, status) {
        if (status == 'success') {
            $('#content .right_container .license_view').remove();
            licenseData = data;

            if (licenseData) {
                loadMachineKey();
                renderActivationForm();
                renderLicenseSummaryData();
                handleEvents();
                $('.searchBox').removeClass('hide');
            }
            else {
                $('.adminlist_pagination').remove(); $('.searchBox').addClass('hide');
                var data = { status: 'info', type: 'warning', is_info: false, message: i18next.t('common.info_title.oops'), details: i18next.t('common.info_description.no_content'), is_add_button: false, button_text: '', is_task_management_button: false, task_management_text: '', button_event: '' };
                g.error_message_view(data, $('#content .right_container .data_container'));
                handleEvents();
            }
        }
        else if (status == 'error') {
            g.sendErrorNotification(data, '/gamma/api/repository/getrepositoryaccountdata', $('#content .right_container .data_container'));
        }
    }

    function renderLicenseSummaryData() {
        addLicenseExpiry();
        var dataItem, topick;
        var actualvalue, totalValue;
        licenseSummaryData = [];

        _.each(licenseSummaryManager, function (item, key) {
            dataItem = _.values(_.pick(licenseData.license_detail.metrics, key))[0];
            topick = _.pick(licenseData.current, item.topick);
            if (_.values(topick)[0] == undefined) {
                actualvalue = 0;
            } else
            {
                actualvalue = parseInt(_.values(topick)[0]);
            }

            if (dataItem != undefined)
            {
                totalValue = parseInt(dataItem.limit);
            }
            else
            {
                totalValue = licenseData.license_detail.metrics.snapshots.limit;
            }

            if (totalValue != -1 && actualvalue > totalValue)
            {
                actualvalue = totalValue;
            }

            if (item.showPercentage)
            {
                var percentage = actualvalue / totalValue * 100;
            }
            if (totalValue == -1) {
                item.showPercentage = false;
            }

            if (key == "snapshots"){
                var licenseSummarytooltip = (totalValue == -1) ? 'Unlimited' : (totalValue + " " + item.tooltiptext);
                var licenseSummaryValue = (totalValue == -1) ? 'Unlimited' : (e.format.abbrNumber(totalValue, 2));
            }else{
                var licenseSummarytooltip = (totalValue == -1) ? 'Unlimited' : (actualvalue + "/" + totalValue + " " + item.tooltiptext);
                var licenseSummaryValue = (totalValue == -1) ? 'Unlimited' : (e.format.abbrNumber(actualvalue, 1) + "/" + e.format.abbrNumber(totalValue, 2));
            }

            licenseSummaryData.push(
                {
                    label: i18next.t("admin.license_page." + key),
                    value: licenseSummaryValue,
                    title: licenseSummarytooltip,
                    value_percentage: percentage,
                    showPercentage: item.showPercentage,
                    icon: item.icon
                }
            );
        });

        var licenseViewWraper = $('<div/>', { class: 'license_view' });
        $('#content .right_container .data_container').append(licenseViewWraper);
        var title = $('<h3/>', {class: 'title'}).html("Usage Summary");
        $(title).insertBefore('.license_view');
        licenseViewWraper.html(Template.licenseSummaryPrimary({
            'licenseSummary': licenseSummaryData
        }));

    }
    function handleEvents() {
        $('.searchBox input').off('keyup');

        $('.inputbox_wraper input,.inputbox_wraper textarea, .inputbox_wraper[type="textarea"]').on('focus', function () {
            $(this).parent().removeClass('input-error');
        });
        $('#license_key').on('click', function () {
            $(this).parent().parent().removeClass('input-error');
            $(this).parent().find('.ic-check-filled').remove();
            $("#browseBtn").click();
        });
        $('#browseBtn').bind('change', function () {
            // $('.activation').removeClass("disabled");
            // var icon = $('<i/>', { class: 'ic-check-filled' });
            // $(icon).css({ "font-weight": "bold", "vertical-align": "middle", "color": "rgb(114, 203, 103)", "font-size": "1.3em" });
            // $('.license_key_wrapper').append(icon);
            var license_key = $('#browseBtn')[0].files[0];
            var formdata = new FormData();
            // //-------------------------- form validations -----------------------
            if ($('#browseBtn')[0].files.length == 0) {
                g.admin.utils.showErrors($('.js-file-wrapper'), 'js-file-wrapper', 'license_key', i18next.t("admin.license_page.error.require_license"));
            } else if (!$(".form_wrapper .input-error").length) {
                formdata.append('license_key', license_key);
                formdata.append('machine_key', machineKey);
                $.ajax({
                    type: 'post',
                    url: g.BASE_URL + '/license/update-account-license',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.status == 'success') {
                            window.location.href = '/gamma';
                        } else {
                            g.admin.utils.showErrors($('.js-file-wrapper'), 'js-file-wrapper', 'license_key', data.responseJSON.error.message);
                        }
                    },
                    error: function (data) {
                        g.admin.utils.showErrors($('.js-file-wrapper'), 'js-file-wrapper', 'license_key', data.responseJSON.error.message);
                    }
                });
            }
        });
        /* Copy to clipboard */
        var copyToClipboard = function (link) {

            // Create an auxiliary hidden input
            var aux = document.createElement("input");

            // Get the text from the element passed into the input
            aux.setAttribute("value", link.trim());

            // Append the aux input to the body
            document.body.appendChild(aux);

            // Highlight the content
            aux.select();

            // Execute the copy command
            document.execCommand("copy");

            // Remove the input from the body
            document.body.removeChild(aux);

            // toastr.success('License key copied!');
        };

        $(".js-copy-link").click(function () {
            var link = $('#machine_key').html();
            copyToClipboard(link);
            var $this = $(this);
            $this.closest(".btn-text").css({
                color: "#72CB67",
                cursor: "pointer",
                padding: "15px",
                fontSize: "1.5em"
            });
        });
    }
    loadlicenseAgent();
};