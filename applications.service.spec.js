'use strict';

describe('Service: applications', function () {

    // load the service's module
    beforeEach(module('gammawebsiteApp'));

    // instantiate service
    var applications;
    beforeEach(inject(function (_applications_) {
        applications = _applications_;
    }));

    it('should do something', function () {
        expect(!!applications).to.be.true;
    });

});
