var deactivate = function (g) {
    "use strict";
    var user_roles;
    e.loadJSON('/metadata/user', setEncryptionString, { 'timestamp': new Date().getTime() });
    function setEncryptionString(data) {
        user_roles = data.role;
        if(!hasRole('ACCOUNT_ADMINISTRATOR')){
            window.location.href = '/gamma#';
        }
    }

    $('#proceed-button').on('click', function (event) {
        event.preventDefault();
        $('#login_loading_overlay, #login_loading_msg_container').show();
        $.ajax({
            type: 'post',
            url: g.BASE_URL +'/license/deactivate-license',
            success: function (data) {
                if (data.status == 'success') {
                    window.location.href = '/account-deactivated';
                } else {
                    $('#proceed-button').siblings(".error-msg").removeClass("hide").html(data.message);
                }
                $('#login_loading_overlay, #login_loading_msg_container').hide();
            },
            error: function (data) {
                $('#proceed-button').siblings(".error-msg").removeClass("hide").html(data.responseJSON.message);
                $('#login_loading_overlay, #login_loading_msg_container').hide();
            }
        });
    });

    $("#deactivate-confirm-checkbox").click(function () {
        var checked_status = this.checked;
        if (checked_status == true) {
            $("#proceed-button").removeAttr("disabled");
            $("#proceed-button").removeClass('grey-btn')
        } else {
            $("#proceed-button").attr("disabled", "disabled");
            $("#proceed-button").addClass('grey-btn');
        }
    });

    function hasRole(role_name) {
        if ((user_roles).indexOf(role_name) > -1)
            return true;
        else
            return false;
    }

};


var reallocation = function (g) {
    "use strict";
    var reallocationKey, machineKey;
    // get reallocation key
    $.ajax({
        type: 'get',
        url: g.BASE_URL +'/license/account-deactivated',
        success: function (data) {
            if (typeof data != 'undefined' && typeof data != "" && typeof data.meta != 'undefined'){
                reallocationKey = data.meta.reallocation;
                machineKey = data.machine_key;
                $('#js-machine-key').html(machineKey);

            }else{
                window.location.href = '/login';
            }
        }
    });

    $(".js-download-reallocation-key").click(function (event) {
        var blob = new Blob([reallocationKey], {
            type: "application/json;charset=utf-8;"
        });

        var element = document.createElement("a");
        element.setAttribute("href", window.URL.createObjectURL(blob))
        element.setAttribute("target", "_blank")
        element.setAttribute("download", 'deactivation_' + machineKey + '.txt')
        document.body.appendChild(element);
        element.click();
    });
    $('#deactivate-gamma').css("display", "none");
    $('#proceed-button').click(function () {
        $('#deactivate-gamma').css("display", "block");
        $('#deactivate').css("display", "none");

    });
};
