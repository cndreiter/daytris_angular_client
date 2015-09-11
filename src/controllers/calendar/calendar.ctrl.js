'use strict'

module.exports = 'controllers/calendar/daytris-calendar'
var dependencies = [
  require('../events/event.ctrl.js'),
  require('../../lib/color.js'),
  'ui.calendar'
]

angular.module(module.exports, dependencies).controller('CalendarCtrl', [
        '$state', '$stateParams', 'uiCalendarConfig', 'Event',
function($state,   $stateParams,   uiCalendarConfig,   Event) {
  
  var view = 'agendaWeek'
  switch($stateParams.resolution) {
    case 'day': view = 'agendaDay'; break
    case 'week': view = 'agendaWeek'; break
    case 'month': view = 'month'; break
  }
  
  this.config = {
    lang: 'de',
    defaultView: view,
    columnFormat: 'dd D.M.',
    eventClick: function(event) {
      $state.go('event', { eventUrl: event.eventUrl })
    }
  }
  
  var moment = $.fullCalendar.moment;
  
  this.eventSources = [function(start, end, timezone, callback) {
    Event.get({}, function(records) {
      var mapped = records.map(function(record) {
        return {
          eventUrl: record.url,
          title: record.text,
          start: moment(record.startDate + 'T' + record.startTime).toDate(),
          end: moment(record.endDate + 'T' + record.endTime).toDate()
        }
      })
      callback(mapped)
    })
  }]

}])
