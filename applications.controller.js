'use strict';

(function () {

    class ApplicationsComponent {
        constructor($applications, $state) {
            this.state = $state;
            this.$applications = $applications;
            this.applicationsList = [];
            this.$applications.query().$promise.then(data => {
                this.applicationsList = data;
                if (data.length == 0) {
                    this.noApplications = true;
                }
            });
            this.noApplications = false;
            //console.log($state);
        }

        removeApplication(index) {
            var application = this.applicationsList[index];
            this.$applications.delete({ '_id': application._id }).$promise.then(() => this.applicationsList.splice(index, 1));

        }

        createApplication() {
            this.state.go('applications.create');
        }

        editApplication(index) {
            var application = this.applicationsList[index];
            this.state.go("applications.edit", {
                id: application._id
            });


        }
    }

    angular.module('gammawebsiteApp')
        .controller('ApplicationsComponent', ApplicationsComponent);

})();
