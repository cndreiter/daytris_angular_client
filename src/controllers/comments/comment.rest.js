/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'controllers/comments/comment-rest'
var dependencies = [
  'ngResource',
  require('../../lib/resource.js')
]

angular.module(module.exports, dependencies).factory('Comment', ['$resource', 'resource', function($resource, resource) {
  return $resource(resource.restApiRoot + '/comments/:id', {
    filter: '@filter'
  }, {
    'get': {
      isArray: false
    },
    'update': {
      method: 'PUT'
    }
  })
}])
