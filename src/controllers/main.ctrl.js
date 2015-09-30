'use strict'

module.exports = 'controllers/daytris-main'
var dependencies = [
  require('../page.js'),
  require('../lib/color.js'),
  require('../lib/translator.js')
]

var translations = require('./main.translations.js')

angular.module(module.exports, dependencies).controller('MainCtrl', [
        'page', '$scope', '$state', '$stateParams', 'colors', 't',
function(page,   $scope,   $state,   $stateParams ,  colors,   t) {
  var me = this
  
  me.showMessage = function(message) {
    /*
     * example for message variable:
     *
     *    var mt = t.allTranslations.messageModal
     *    message = {
     *      message: mt['Remove participant '] + name + mt['?'],
     *      okButtonText: mt['Yes, remove participant'],
     *      cancelButtonText: mt['Cancel'],
     *      okFunc: deleteParticipant
     *    }
     */
    me.messageModal = message
    UIkit.modal('#messageModal').show()
  }
  
  me.showEmailAddressModal = function(message) {
   /*
    * example for message variable:
    *
    *    var mt = t.allTranslations.emailAddressModal
    *    message = {
    *      message: mt['Provide your e-mail address to stay informed.'],
    *      okFunc: deleteParticipant
    *    }
    */
    var modalId = '#emailAddressModal'
    me.emailAddressModal = message
    me.emailAddressModal.emailAddressValid = function() {
      return me.emailAddressModal.emailAddress && $scope.emailAddressForm.$valid
    }
    me.emailAddressModal.setAnonymousUserEmailAddressFunc = function() {
      if(me.emailAddressModal.emailAddressValid()) {
        page.setUserEmailAddress(me.emailAddressModal.emailAddress)
        me.emailAddressModal.okFunc()
        UIkit.modal(modalId).hide()
      }
    }
    UIkit.modal(modalId).show()
    $('#emailAddressModal form input')[0].focus()
  }
  
  me.getUserEmailAddress = function() {
    return page.userEmailAddress
  }
  
  $scope.niceColors = colors.niceColors
  $scope.nicePaleColors = colors.nicePaleColors
  translations(t) // use translations from main.translations.js
  
  $scope.getPageControllerName = function() {
    var result = false
    var current = $state.current
    if(current) {
      return current.controller
    }
  }
  
  $scope.pageCtrlEquals = function(controllerName) {
    var pageControllerName = me.pageControllerName || ''
    var result = pageControllerName == controllerName
    return result
  }
  
  $scope.getPage = function() {
    return page
  }
  
  $scope.existingCalendarEditMode = null
  $scope.calendarEditMode = function() {
    if($stateParams.collectionUrl) {
      return $scope.existingCalendarEditMode
    } else {
      return 'new'
    }
  }
  $scope.setCalendarEditMode = function(mode) {
    var goToCalendar = function() {
      if(!$scope.pageCtrlEquals('CalendarCtrl')) {
        $state.go('calendar', { collectionUrl: page.collectionUrl });
      }
    }
    if(!mode) {
      $scope.existingCalendarEditMode = null;
    } else {
      switch(mode) {
        case 'new':
          $state.go('newCalendar')
          $scope.$broadcast('edit-mode-new')
          break
        case 'form':
          goToCalendar()
          $scope.existingCalendarEditMode = 'form'
          $scope.$broadcast('edit-mode-form')
          break
        case 'grid':
          goToCalendar()
          $scope.existingCalendarEditMode = 'grid'
          $scope.$broadcast('edit-mode-grid')
          break
        case 'children':
          goToCalendar()
          $scope.existingCalendarEditMode = 'children'
          $scope.$broadcast('edit-mode-children')
          break
      }
    }
  }
  
  
  $scope.$on('$locationChangeSuccess', function(event) {
    var watcher = {}
    watcher.unwatch = $scope.$watch('getPageControllerName()', function(value) {
      if(value) {
        watcher.unwatch()
        me.pageControllerName = $scope.getPageControllerName()
        if((me.pageControllerName == 'CalendarCtrl') && (!$scope.calendarEditMode())) {
          $scope.setCalendarEditMode('grid')
        }
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
  
  me.logoClick = function() {
    if($scope.calendarEditMode() == 'grid') {
      $state.go('newCalendar')
    } else {
      $scope.setCalendarEditMode('grid')
    }
  }
  
}])
