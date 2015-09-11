'use strict'

module.exports = ['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider.
      when('/events/:eventUrl', {
        templateUrl: 'partials/event.html',
        controller: 'EventCtrl as event'
      }).
      when('/event', {
        templateUrl: 'partials/event.html',
        controller: 'EventCtrl as event'
      }).
      when('/calendar/:resolution', {
        templateUrl: 'partials/calendar.html',
        controller: 'CalendarCtrl as calendar'
      }).
      when('/calendar', {
        templateUrl: 'partials/calendar.html',
        controller: 'CalendarCtrl as calendar'
      }).
      otherwise({
        redirectTo: '/calendar'
      })
  }
]
