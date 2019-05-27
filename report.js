
var g = (function (gamma) {


    $('header .download-pdf-report').on('click', function (event) {
        event.stopPropagation();
        $("body").css("cursor", "progress");
        $('.download-pdf-report').hide();
        $('.loading-indicator').show();

        var subSystemNodeId = $('#breadcrumb [nodetype_name="Subsystem"]').attr('nodeid');
        var subsystemUID = historyManager.get('currentSubSystemUid');

        var snapshots = historyManager.get('selectedSnapshots');
        var snapshot_id = snapshots[0].id;
        var snapshot_id_old = '';
        if (snapshots.length > 1) {
            if (snapshots[0].id < snapshots[1].id) {
                snapshot_id_old = snapshots[0].id;
                snapshot_id = snapshots[1].id;
            }
            else {
                snapshot_id_old = snapshots[1].id;
                snapshot_id = snapshots[0].id;
            }
        }

        var xhr = new XMLHttpRequest();
        var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var params = 'project_id=' + historyManager.get('currentSubSystem') + '&snapshot_id=' + snapshot_id + '&node_id=' + subSystemNodeId + '&snapshot_id_old=' + snapshot_id_old + '&time_zone=' + timeZone;
        xhr.open('GET', `${g.DOMAIN_NAME}/api/views/repositories/${subsystemUID}/pdf/download?${params}`, true);
        xhr.responseType = 'blob';

        xhr.onload = function (e) {
            $("body").css("cursor", "auto");
            $('.download-pdf-report').show();
            $('.loading-indicator').hide();
            if (this.status == 200) {
                // get binary data as a response
                var data = this.response;
                var file = new Blob([data], { type: data.type });
                if (file.size == 57) {
                    var module_error = { 'status': 'error', 'code': 500, 'message': 'This repository is no more available.', 'details': "This repository has been deleted." };
                    g.sendErrorNotification(module_error, '', $(''));
                }
                else {
                    var fileName = xhr.getResponseHeader("content-disposition");

                    var isChrome = !!window.chrome && !!window.chrome.webstore;

                    var isIE = /*@cc_on!@*/false || !!document.documentMode;
                    var isEdge = !isIE && !!window.StyleMedia;

                    var ua = navigator.userAgent.toLowerCase();
                    if (isChrome || (ua.indexOf('safari') != -1)) {
                        var url = window.URL || window.webkitURL;

                        var downloadLink = document.createElement('a');
                        downloadLink.href = url.createObjectURL(data);
                        downloadLink.setAttribute('target', '_self');
                        downloadLink.setAttribute('download', fileName);
                        downloadLink.click();
                    }
                    else if (isEdge || isIE) {
                        window.navigator.msSaveOrOpenBlob(file, fileName);
                    }
                    else {
                        // var fileURL = URL.createObjectURL(file);
                        // window.open(fileURL);

                        var downloadLink = document.createElement('a');

                        downloadLink.target = '_blank';
                        downloadLink.download = fileName;

                        var url = window.URL || window.webkitURL;
                        var downloadUrl = url.createObjectURL(file);

                        downloadLink.href = downloadUrl;

                        document.body.append(downloadLink);
                        downloadLink.click();

                        document.body.removeChild(downloadLink);
                        url.revokeObjectURL(downloadUrl);
                    }

                    var current_date = new Date();
                    var ms = moment(current_date);
                    var date = ms.format('YYYY-MM-DDTHH:MM:SS');

                    //mix panel event
                    var eventObj = {
                        profile_properties: {},
                        event_properties: {
                            'Date': date
                        }
                    }
                    gamma.set_mixpanel_event("Downloaded report", gamma.mixpanel_uid, eventObj);
                }
            }
        };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('auth_token'));
        xhr.send();
    });
    return gamma;
}(g));
