'use strict'

module.exports = 'controllers/daytris-main'
var dependencies = [
  require('../page.js'),
  require('../lib/color.js'),
  require('../lib/translator.js')
]

var translations = require('./main.translations.js')

angular.module(module.exports, dependencies).controller('MainCtrl', [
        'page', '$scope', '$state', 't',
function(page,   $scope,   $state,   t) {
  var me = this
  
  translations(t) // use translations from main.translations.js
  
  $scope.getPageControllerName = function() {
    var result = false
    var current = $state.current
    if(current) {
      return current.controller
    }
  }
  
  me.pageCtrlEquals = function(controllerName) {
    var pageControllerName = me.pageControllerName || ''
    var result = pageControllerName == controllerName
    return result
  }
  
  $scope.$on('$locationChangeSuccess', function(event) {
    var watcher = {}
    watcher.unwatch = $scope.$watch('getPageControllerName()', function(value) {
      if(value) {
        watcher.unwatch()
        me.pageControllerName = $scope.getPageControllerName()
      }
    })
  })
  
  me.username = page.username
  me.usernameDirty = function() {
    return me.username != page.username
  }
  me.updateUsername = function() {
    page.setUserColor(null) // reset user color
    page.setUsername(me.username)
  }
  
  $scope.chooseColor = function(color) {
    page.setUserColor(color)
    me.palette = false
  }
  $scope.chosenColor = function() {
    return page.userColor
  }
  me.togglePalette = function() {
    me.palette = !me.palette
  }
  
}])
