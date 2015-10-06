'use strict'

module.exports = 'controllers/calendar/collection-rest'
var dependencies = [
  'ngResource',
  require('../../lib/resource.js')
]

angular.module(module.exports, dependencies).factory('Collection', ['$resource', 'resource', function($resource, resource) {
  return $resource(resource.restApiRoot + '/collections/:id', {
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

angular.module(module.exports).factory('CollectionCollection', ['$resource', 'resource', function($resource, resource) {
  return $resource(resource.restApiRoot + '/collectionCollections/:id', {
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

angular.module(module.exports).factory('SubCollectionFactory', ['$resource', 'resource', function($resource, resource) {
  return function(parentId) {
    return $resource(resource.restApiRoot + '/collections/:parentId/collections/:id', {
      parentId: parentId,
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
