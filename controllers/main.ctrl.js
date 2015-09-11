'use strict'

module.exports = 'controllers/daytris-main'
var dependencies = [
  require('../page.js'),
  require('../lib/color.js'),
  require('../lib/translator.js'),
  'ngRoute'
]

var translations = require('./main.translations.js')

angular.module(module.exports, dependencies).controller('MainCtrl', [
        'page', '$scope', '$route', '$routeParams', '$location', 't',
function(page,   $scope,   $route,   $routeParams,   $location,   t) {
  var me = this
  
  translations(t) // use translations from main.translations.js
  console.log(t)
  
  me.getPageControllerName = function() {
    var result = false
    var current = $route.current
    if(current) {
      var route = current.$$route
      if(route) {
        return route.controller
      }
    }
  }
  
  me.pageCtrlMatches = function(controllerName) {
    var pageControllerName = me.pageControllerName || ''
    var result = pageControllerName.indexOf(controllerName) == 0
    return result
  }
  
  $scope.$on('$locationChangeSuccess', function() {
    me.pageControllerName = me.getPageControllerName()
  })
  
  me.username = page.username
  me.usernameDirty = function() {
    return me.username != page.username
  }
  me.updateUsername = function() {
    page.setUsername(me.username)
  }
  
  $scope.chooseColor = function(color) {
    page.userColor = color
    me.palette = false
  }
  $scope.chosenColor = function() {
    return page.userColor
  }
  me.togglePalette = function() {
    me.palette = !me.palette
  }
  
}])
