'use strict'

module.exports = 'controllers/events/event.rest.js'
var dependencies = []

angular.module(module.exports, dependencies).factory('Event', ['$resource', function($resource) {
  return $resource('/prot/api/events/:id', {
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
