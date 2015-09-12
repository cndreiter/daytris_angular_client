'use strict'

module.exports = 'controllers/comments/comment-rest'
var dependencies = [
  'ngResource'
]

angular.module(module.exports, dependencies).factory('Comment', ['$resource', function($resource) {
  return $resource('/prot/api/comments/:id', {
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
