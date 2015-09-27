'use strict'

module.exports = 'controllers/events/event-rest'
var dependencies = [
  'ngResource'
]

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

angular.module(module.exports).factory('EventInCollectionFactory', ['$resource', function($resource) {
  return function(collectionId) {
    return $resource('/prot/api/collections/:collectionId/events/:id', {
      collectionId: collectionId,
      filter: '@filter'
    }, {
      'get': {
        isArray: true
      },
      'update': {
        method: 'PUT'
      }
    })
  }
}])
