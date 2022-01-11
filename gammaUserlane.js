var g = (function(gamma){
    gamma.userlaneTrigger = function() {
        (function (i, s, o, g, r, a, m) { i['UserlaneCommandObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }; a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', 'https://cdn.userlane.com/userlane.js', 'Userlane');  
    };
    gamma.userRoleBasedLanes = function(scanPresent) {
        var hasScanned = gamma.has_scanned; 
        Userlane('identify', gamma.user_uid, {firstscandone:hasScanned});
        if(!gamma.has_scanned) {
            var scanAccess = $('.left-menu-icon-inner.ic-scan').length;
            var hasAdminAccess = $('.left-menu-icon-inner.ic-admin').length;
            if(!scanAccess || !hasAdminAccess) {
                Userlane('identify',gamma.user_uid,{feature:['','']});
                if(scanPresent) {
                    Userlane('identify', gamma.user_uid, {scanpresent:true});
                } else {
                    Userlane('identify', gamma.user_uid, {scanpresent:false});
                }
            }
            else if (scanAccess && hasAdminAccess) {
                if(!$('.new_project_list').length && $('.add_project_btn').length) {
                    Userlane('identify', gamma.user_uid, {projectadded:true});
                }
                Userlane('identify', gamma.user_uid, {feature:['scanAccess','hasAdminAccess']});
            }            
        };
    };
    gamma.userLaneInit = function(scanPresent) {
        return new Promise(function(resolve, reject){
            Userlane('user', gamma.user_uid);
            gamma.userRoleBasedLanes(scanPresent);
            // initialize Userlane
            Userlane('init', 32603);
            resolve();
        });
    };
    return gamma;
}(g));

