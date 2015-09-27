'use strict'

module.exports = 'daytris-page'
var dependencies = [
  'ngCookies'
]

angular.module(module.exports, dependencies).factory('page', ['$cookies', function($cookies) {
  var page = {
    defaultTitle: 'Daytris Social Organizer'
  }
  
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
  
  page.retrieveVisibleCalendars = function(id) {
    return $cookies.getObject('calendars/visible/' + id) || {}
  }
  page.saveVisibleCalendars = function(id, visibleCalendars) {
    $cookies.putObject('calendars/visible/' + id, visibleCalendars)
  }
  
  page.makeFullUrl = function(tail) {
    var l = window.location
    var windowUrl = l.protocol + '//' + l.host + l.pathname
    var parts = windowUrl.split('/')
    var prefix = parts.slice(0, parts.length - 1).join('/')
    var fullUrl = prefix + '/' + tail
    return fullUrl
  }
  
  return page
}])
