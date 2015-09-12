'use strict'

module.exports = 'controllers/participants/participant-rest'
var dependencies = [
  'ngResource'
]

angular.module(module.exports, dependencies).factory('Participant', ['$resource', function($resource) {
  return $resource('/prot/api/participants/:id', {
    filter: '@filter'
  }, {
    'get': {
      isArray: true
    },
    'update': {
      method: 'PUT'
    }
  })
}])
