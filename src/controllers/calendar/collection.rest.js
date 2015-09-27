'use strict'

module.exports = 'controllers/calendar/collection-rest'
var dependencies = [
  'ngResource'
]

angular.module(module.exports, dependencies).factory('Collection', ['$resource', function($resource) {
  return $resource('/prot/api/collections/:id', {
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

angular.module(module.exports).factory('CollectionCollection', ['$resource', function($resource) {
  return $resource('/prot/api/collectionCollections/:id', {
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

angular.module(module.exports).factory('SubCollectionFactory', ['$resource', function($resource) {
  return function(parentId) {
    return $resource('/prot/api/collections/:parentId/collections/:id', {
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
