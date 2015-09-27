'use strict'

module.exports = 'controllers/calendar/daytris-calendar'
var dependencies = [
  require('../../page.js'),
  require('../events/event.ctrl.js'),
  require('./participants.dom.js'),
  require('../../lib/color.js'),
  require('../../lib/participants.js'),
  require('../../lib/pubsub.js'),
  'ui.calendar'
]

angular.module(module.exports, dependencies).controller('CalendarCtrl', [
        'page', '$scope', '$compile', '$state', '$stateParams', 'uiCalendarConfig', 'Event', 'EventInCollectionFactory', 'participants', 'participantsDom', 't', 'pubsub',
function(page,   $scope,   $compile,   $state,   $stateParams,   uiCalendarConfig,   Event,   EventInCollectionFactory,   participants,   participantsDom,   t,   pubsub) {
  
  var me = this
  
  page.collectionUrl = $stateParams.collectionUrl
  
  me.reloadedEvents = {} // reloaded events contain up-to-date participant lists
  
  me.subCalendars = {}
  
  var resolution = $stateParams.resolution
  var view = 'agendaWeek'
  switch(resolution) {
    case 'day': view = 'agendaDay'; break
    case 'week': view = 'agendaWeek'; break
    case 'month': view = 'month'; break
  }
  
  me.participants = participants.forAController($scope.main.showMessage, {
    // listeners
    'add': function() {
      //uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('refetchEvents')
    },
    'delete': function() {
      //uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('refetchEvents')
    }
  })
  
  me.config = {
    lang: 'de',
    defaultView: view,
    columnFormat: 'dd D.M.',
    eventClick: function(event) {
      $state.go('event', { eventUrl: event.eventUrl })
    },
    eventRender: function(event, element) {
      if(resolution != 'month') {
        console.log('reloaded event', event.id, me.reloadedEvents[event.id])
        var newHtml = participantsDom.makeParticipants(me.reloadedEvents[event.id] || event, 'calendarGrid.participants')
        var compiledNewHtml = $compile(newHtml)($scope)
        element.find('.fc-content').append(compiledNewHtml)
      }
      pubsub.subscribe('events/:id/participants', event.id)
    },
    eventAfterAllRender: function() {
      if(!me.gotoDateDone) {
        if(me.foremostEventTime) {
          me.gotoDateDone = true
          uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('gotoDate', me.foremostEventTime)
        }
      }
    }
  }
  
  var getEventsFunc = function(calendarId) {
    return function(start, end, timezone, callback) {
      var EventInCollection = EventInCollectionFactory(calendarId)
      EventInCollection.get({
        filter: JSON.stringify({
          include: 'participants'
        })
      }, function(records) {
        var mapped = records.map(function(record) {
          var startDate = moment(record.startDate + 'T' + record.startTime).toDate()
          var endDate = moment(record.endDate + 'T' + record.endTime).toDate()
          var time = startDate.getTime()
          if(me.foremostEventTime) {
            if(time < me.foremostEventTime) {
              me.foremostEventTime = time
            }
          } else {
            me.foremostEventTime = time
          }
          return {
            id: record.id,
            eventUrl: record.url,
            title: record.text,
            start: startDate,
            end: endDate,
            participants: record.participants
          }
        })
        callback(mapped)
      })
    }
  }
  
  me.eventSources = []
  me.visibleCalendars = {}
  
  $scope.setParentCalendar = function(calendar) {
    me.visibleCalendars = page.retrieveVisibleCalendars(calendar.id)
    me.parentCalendar = calendar
  }
  
  $scope.addGridEventSource = function(calendar, keepExisting) {
    if(keepExisting) {
      if(me.subCalendars['' + calendar.id]) {
        // already exists => keep it => do nothing and return
        return
      }
    } else {
      $scope.removeGridEventSource(calendar.id)
    }
    var uid = new Date().getMilliseconds() // uid: used for debugging purposes only
    me.subCalendars['' + calendar.id] = {
      events: getEventsFunc(calendar.id),
      color: (calendar.color || 'white'),
      uid: uid
    }
    var eventSource = me.subCalendars['' + calendar.id]
    uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('addEventSource', eventSource)
    //uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('refetchEvents')
  }
  
  $scope.removeGridEventSource = function(calendarId) {
    if(calendarId && me.subCalendars['' + calendarId]) {
      var eventSource = me.subCalendars['' + calendarId]
      uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('removeEventSource', eventSource)
      if($scope.calendarEditMode() == 'grid') {
        me.refetchEvents()
      }
      delete me.subCalendars['' + calendarId]
    }
  }
  
  me.onToggleCalendar = function(calendar, marked) {
    if(marked) {
      $scope.addGridEventSource(calendar, true)
      me.visibleCalendars[calendar.id] = true
    } else {
      $scope.removeGridEventSource(calendar.id)
      me.visibleCalendars[calendar.id] = false
    }
    if(me.parentCalendar && me.parentCalendar.id) {
      page.saveVisibleCalendars(me.parentCalendar.id, me.visibleCalendars)
    }
  }
  
  me.calendarVisible = function(calendarId) {
    return (typeof me.visibleCalendars[calendarId] === 'undefined')? true : me.visibleCalendars[calendarId]
  }
  
  me.goToNewEvent = function(collectionUrl) {
    var url = collectionUrl || $stateParams.collectionUrl
    if(url) {
      $state.go('newCalendarEvent', { collectionUrl: url })
    }
  }
  
  $scope.$on('edit-mode-grid', function() {
    me.refetchEvents()
  })
  
  me.refetchEvents = function() {
    if(uiCalendarConfig.calendars && uiCalendarConfig.calendars.daytrisCalendar) {
      uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('refetchEvents')
    }
  }
  
  // websocket update
  $scope.$on('pubsub-message', function(event, message) {
    var eventId = message.parentId
    Event.get({
      filter: JSON.stringify({
        where: { id: eventId },
        include: 'participants'
      })
    }, function(records) {
      var record = records[0]
      if(record) {
        if(record.id == eventId) {
          me.reloadedEvents[eventId] = record
          uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('rerenderEvents')
        }
      }
    })
    
  })
  
  $scope.$on('$destroy', function() {
    pubsub.unsubscribeAll()
    $scope.setCalendarEditMode(null)
  })
  
}])
