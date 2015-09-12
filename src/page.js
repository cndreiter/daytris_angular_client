'use strict'

module.exports = 'daytris-page'
var dependencies = [
  'ngCookies'
]

angular.module(module.exports, dependencies).factory('page', ['$cookies', function($cookies) {
  var page = {}
  
  // initialization: retrieve user cookie
  var userCookie = $cookies.getObject('anonymousUser') || {}
  page.username = userCookie.username
  page.userColor = userCookie.color
  
  // save user to cookie
  page.saveUser = function() {
    $cookies.putObject('anonymousUser', {
      username: page.username,
      color: page.userColor
    })
  }
  page.setUsername = function(username) {
    page.username = username
    page.saveUser()
  }
  page.setUserColor = function(color) {
    page.userColor = color
    page.saveUser()
  }
  
  return page
}])
