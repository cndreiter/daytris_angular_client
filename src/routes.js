'use strict'

module.exports = ['$urlRouterProvider', '$locationProvider', '$stateProvider',
  function($urlRouterProvider, $locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true)
    $stateProvider.
      state('event', {
        url: '/events/:eventUrl',
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        controllerAs: 'event'
      }).
      state('newEvent', {
        url: '/event',
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        controllerAs: 'event'
      }).
      state('calendarView', {
        url: '/calendar/:resolution',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        controllerAs: 'calendar'
      }).
      state('calendarDefaultView', {
        url: '/calendar',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        controllerAs: 'calendar'
      })
    $urlRouterProvider.otherwise('/calendar')
  }
]
