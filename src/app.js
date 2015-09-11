'use strict'

var dependencies = [
  'ui.router',
  'ngResource',
  'ngCookies',
  'ui.calendar',
  require('./controllers/main.ctrl.js'),
  require('./controllers/calendar/calendar.ctrl.js'),
  require('./controllers/events/event.ctrl.js')
]

var daytrisApp = angular.module('daytris', dependencies)

// routes
daytrisApp.config(require('./routes.js'))
