'use strict';

function applicationsService($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource(`/api/applications/:_id/:_action`, { _id: '@_id', _action: '@_action' })
}

angular.module('gammawebsiteApp')
    .service('$applications', applicationsService);
