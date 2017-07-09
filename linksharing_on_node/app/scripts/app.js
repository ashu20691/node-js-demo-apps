'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */


angular
    .module('yapp', [
        'ui.router',
        'ngAnimate',
        'toastr',
        'ngCookies',
        'ngResource',
        'xeditable'
    ])

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider,$resourceProvider) {

        $resourceProvider.defaults.stripTrailingSlashes = false;
        $httpProvider
            .interceptors.push(['$cookies', function ($cookies) {
            return {
                response: function (response) {
                    $httpProvider.defaults.headers.common['userId'] = $cookies['userId'];
                    return response
                }
            }
        }]);

        $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('base', {
                abstract: true,
                url: '',
                templateUrl: 'views/base.html'
            })
            .state('login', {
                url: '/login',
                parent: 'base',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                parent: 'base',
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: 'views/dashboard/overview.html'
            })
            .state('signup', {
                url: '/signup',
                parent: 'base',
                controller: 'SignupCtrl',
                templateUrl: 'views/signup.html'
            })
            .state('profile', {
                url: '/profile',
                parent: 'dashboard',
                controller: 'ProfileCtrl',
                templateUrl: 'views/dashboard/profile.html'
            })
            .state('resource', {
                url: '/resource',
                parent: 'dashboard',
                controller: 'ResourceCtrl',
                templateUrl: 'views/dashboard/resource.html'
            })
            .state('invite', {
                url: '/invite',
                parent: 'dashboard',
                controller: 'InviteCtrl',
                templateUrl: 'views/dashboard/invite.html'
            })
            .state('topic', {
                url: '/topic',
                parent: 'dashboard',
                controller: 'TopicCtrl',
                templateUrl: 'views/dashboard/topic.html'
            });

    })
    .service("Configuration", [function () {
        if (/localhost:9000/.test(window.location.host)) {
            return this.API = 'http://localhost:8080';
        } else {
            return this.API = '';
        }
    }]);
