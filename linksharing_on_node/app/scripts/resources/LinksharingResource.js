(function () {
    'use strict';
    angular.module('yapp')
        .factory('LinksharingResource', ["$resource", "Configuration", function ($resource, Configuration) {
            return $resource(Configuration.API + "/:controller/:action", {}, {
                    login: {method: 'POST', params: {controller: 'user', action: 'login'}},
                register: {method: 'POST', params: {controller: 'user', action: 'register'}},
                profile: {method: 'GET', params: {controller: 'user', action: 'profile'}},
                update: {method: 'POST', params: {controller: 'user', action: 'update'}},
                updatePassword: {method: 'POST', params: {controller: 'user', action: 'updatePassword'}},
                topicList: {method: 'GET', params: {controller: 'topic', action: 'list'},isArray:true},
                topicCreate: {method: 'POST', params: {controller: 'topic', action: 'create'},isArray:true},
                topicDelete: {method: 'POST', params: {controller: 'topic', action: 'delete'},isArray:true},
                topicNameList: {method: 'GET', params: {controller: 'topic', action: 'namelist'},isArray:true},
                resourceList: {method: 'GET', params: {controller: 'resource', action: 'list'},isArray:true},
                resourceEdit: {method: 'POST', params: {controller: 'resource', action: 'edit'},isArray:true}
            });
        }
        ]);
})();