'use strict';

describe('Component: ApplicationsComponent', function () {

    // load the controller's module
    beforeEach(module('gammawebsiteApp'));

    var ApplicationsComponent;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($componentController) {
        ApplicationsComponent = $componentController('applications', {});
    }));

    it('should ...', function () {
        expect(1).to.equal(1);
    });
});
