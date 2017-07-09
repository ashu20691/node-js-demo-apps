'use strict';

angular.module('yapp')
    .controller('TopicCtrl', function ($scope, $state, LinksharingResource, toastr) {
        $scope.$state = $state;
        $scope.showCreateForm = false;
        $scope.showDelete=false;
        $scope.showDeleteButton=true;
        $scope.visibilities = ["PUBLIC", "PRIVATE"];
        $scope.selectedVisibility=$scope.visibilities[0];

        $scope.addTopic = function () {
            $scope.showCreateForm = true;
        };
        $scope.showDeleteFunc=function () {
            $scope.showDeleteButton=true;
            $scope.showDelete=false;
        };
        $scope.showDeleteTopic = function () {
            $scope.showDeleteButton=false;
            $scope.showDelete== true?$scope.showDelete=false:$scope.showDelete=true;
        };
        $scope.cancel = function () {
            $scope.showCreateForm = false;
        };
        $scope.delete = function (id) {
            LinksharingResource.topicDelete({id:id},function (response) {
                $scope.list = response;
            });
        };
        $scope.create = function () {
            $scope.showCreateForm = false;
            LinksharingResource.topicCreate({name: $scope.topicName, visibility: $scope.selectedVisibility},
                function (response) {
                    $scope.list = response;
                   // $state.reload();
                    toastr.success("saved Successfully !");
                });
        };
        LinksharingResource.topicList(function (response) {
            $scope.list = response;
        });
    });
