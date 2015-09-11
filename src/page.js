'use strict'

module.exports = 'daytris-page'
var dependencies = [
  'ngCookies'
]

angular.module(module.exports, dependencies).factory('page', ['$cookies', function($cookies) {
  var page = {}
  page.username = $cookies.get('anonymousUsername')
  page.setUsername = function(username) {
    page.username = username
    $cookies.put('anonymousUsername', username)
  }
  return page
}])
