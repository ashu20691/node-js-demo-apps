'use strict';
angular.module('yapp')
  .controller('LoginCtrl', function($scope, $location,$http,$rootScope,$cookies,toastr,LinksharingResource) {

      $scope.submit = function () {
          LinksharingResource.login({username: $scope.username, password: $scope.password},function (response) {
              if(response.status=="ok"){
                  $cookies["userId"]=response.message;
                  $rootScope.userid=response.message;
                  $location.path("/dashboard");
                  toastr.success("Successful Login !");
              }
              else
                  toastr.error(response.message);
          });
          return false;
      }
  });
