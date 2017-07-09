'use strict';

angular.module('yapp')
    .controller('DashboardCtrl', function ($scope, $state, $cookies) {

        $scope.$state = $state;
        $scope.imageId = $cookies["userId"];
    });
