'use strict';
angular.module('yapp')
    .controller('SignupCtrl', function ($scope, $http, toastr, $location, LinksharingResource) {



        $scope.submit = function () {
            LinksharingResource.register(
                {
                    firstName: $scope.firstname,
                    lastName: $scope.lastname,
                    username: $scope.username,
                    password: $scope.password,
                    email: $scope.email
                },
                function (response) {
                    if (response.status == "ok") {
                        toastr.success(response.message);
                        $location.path("/login");
                    } else
                        toastr.warning(response.message);
                });
            return false;
        }
    });
