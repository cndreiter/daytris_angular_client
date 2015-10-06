/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'controllers/events/event-rest'
var dependencies = [
  'ngResource',
  require('../../lib/resource.js')
]

angular.module(module.exports, dependencies).factory('Event', ['$resource', 'resource', function($resource, resource) {
  return $resource(resource.restApiRoot + '/events/:id', {
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

angular.module(module.exports).factory('EventInCollectionFactory', ['$resource', 'resource', function($resource, resource) {
  return function(collectionId) {
    return $resource(resource.restApiRoot + '/collections/:collectionId/events/:id', {
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
