'use strict';

angular.module('yapp')
    .controller('ResourceCtrl', function($scope, $state,LinksharingResource) {
        $scope.$state = $state;
        $scope.types=["Link Resource","Document Resource"];
        $scope.saveDesc=function (id,val) {
            LinksharingResource.resourceEdit({id:id,description:val},function (response) {
                $scope.list = response;
            });
        };
        LinksharingResource.resourceList(function (response) {
            $scope.list = response;
        });
        LinksharingResource.topicNameList(function (response) {
            $scope.topics = response;
        });
        

    });
