/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

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
      state('newCalendarEvent', {
        url: '/calendars/:collectionUrl/event',
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        controllerAs: 'event'
      }).
      state('calendarEvent', {
        url: '/calendars/:collectionUrl/events/:eventUrl',
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        controllerAs: 'event'
      }).
      state('calendarDefaultView', {
        url: '/calendar',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        controllerAs: 'calendarGrid'
      }).
      state('calendar', {
        url: '/calendars/:collectionUrl',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        controllerAs: 'calendarGrid'
      }).
      state('calendarView', {
        url: '/calendars/:collectionUrl/:resolution',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        controllerAs: 'calendarGrid'
      }).
      state('newCalendar', {
        url: '/calendar',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        controllerAs: 'calendarGrid'
      })
    $urlRouterProvider.otherwise('/calendar')
  }
]
