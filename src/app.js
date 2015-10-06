/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

var dependencies = [
  'ui.router',
  'ngCookies',
  'ui.calendar',
  'monospaced.elastic',
  'zeroclipboard',
  require('./controllers/main.ctrl.js'),
  require('./controllers/calendar/calendar.ctrl.js'),
  require('./controllers/calendar/calendar.form.ctrl.js'),
  require('./controllers/events/event.ctrl.js')
]

var daytrisApp = angular.module('daytris', dependencies)

// routes
daytrisApp.config(require('./routes.js'))

// clipboard
daytrisApp.config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {
  uiZeroclipConfigProvider.setZcConf({
    swfPath: 'bower_components/zeroclipboard/dist/ZeroClipboard.swf'
  })
}])
