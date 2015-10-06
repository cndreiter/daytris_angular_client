/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'controllers/participants/participant-rest'
var dependencies = [
  'ngResource',
  require('../../lib/resource.js')
]

angular.module(module.exports, dependencies).factory('Participant', ['$resource', 'resource', function($resource, resource) {
  return $resource(resource.restApiRoot + '/participants/:id', {
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
