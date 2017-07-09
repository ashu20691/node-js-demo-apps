'use strict';

angular.module('yapp')
    .controller('ProfileCtrl', function ($scope, $state, $http, $cookies, toastr, LinksharingResource) {
        $scope.editable = true;
        $scope.editablePass = true;
        $scope.showSaveProfile = false;
        $scope.showSavePassword = false;
        $scope.imageUploadUrl = "http://localhost:8080/user/uploadProfileImage/" + $cookies["userId"];

        LinksharingResource.profile(function (response) {
            $scope.username = response.username;
            $scope.firstname = response.firstName;
            $scope.lastname = response.lastName;
            $scope.email = response.email;
        });
        $scope.edit = function () {
            $scope.editable = false;
            $scope.showSaveProfile = true;
        };
        $scope.save = function () {
            $scope.editable = true;
            $scope.showSaveProfile = false;
            LinksharingResource.update({
                firstName: $scope.firstname,
                lastName: $scope.lastname,
                email: $scope.email
            }, function (response) {
                if (response.status == "ok") {
                    window.location.reload();
                    toastr.success(response.message);
                }
                else
                    toastr.error(response.message);
            });
        };
        $scope.savePassword = function () {
            $scope.editablePass = true;
            $scope.showSavePassword = false;
            LinksharingResource.updatePassword({password: $scope.password},
                function (response) {
                    if (response.status == "ok") {
                        $state.reload();
                        toastr.success(response.message);
                    }
                    else
                        toastr.error(response.message);
                });
        };
        $scope.editPassword = function () {
            $scope.editablePass = false;
            $scope.showSavePassword = true;

        };
    });
