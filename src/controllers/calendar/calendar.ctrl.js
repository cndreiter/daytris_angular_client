'use strict'

module.exports = 'controllers/calendar/daytris-calendar'
var dependencies = [
  require('../../page.js'),
  require('../events/event.ctrl.js'),
  require('../participants/participant.rest.js'),
  require('../../lib/color.js'),
  'ui.calendar'
]

angular.module(module.exports, dependencies).controller('CalendarCtrl', [
        'page', '$scope', '$compile', '$state', '$stateParams', 'uiCalendarConfig', 'Event', 'Participant',
function(page,   $scope,   $compile,   $state,   $stateParams,   uiCalendarConfig,   Event,   Participant) {
  
  var resolution = $stateParams.resolution
  var view = 'agendaWeek'
  switch(resolution) {
    case 'day': view = 'agendaDay'; break
    case 'week': view = 'agendaWeek'; break
    case 'month': view = 'month'; break
  }
  
  var makeParticipants = function(event) {
    var s = ''
    if(event.participants) {
      s = event.participants.map(function(participant) {
        // FIXME use $sanitize to make name and color safe
        var id = participant.id
        var qId = "'"+id+"'" // quoted id for use as function parameter
        var name = participant.name
        var qName = "'"+name+"'" // quoted name for use as function parameter
        var c = participant.color
        var qC = "'"+c+"'" // quoted color for use as function parameter
        return '<a ng-click="calendar.removeParticipant('+qId+', '+qName+', '+qC+'); $event.stopPropagation()" class="dt-color-icon" color-icon="'+c+'" data-uk-tooltip title="'+name+'"></a>'
      }).join('\n')
    }
    var qEId = "'"+event.id+"'" // quoted event id for use as function parameter
    return '<div class="dt-color-palette">\
' + s + '\
<a ng-cloak ng-show="calendar.userOk()" ng-click="calendar.addParticipant('+qEId+'); $event.stopPropagation()" class="dt-add-icon">+</a>\
</div>'
  }
  
  this.userOk = function() {
    // test if the user can be used as valid participant
    return page.username && page.userColor
  }
  
  this.addParticipant = function(eventId) {
    var record = new Participant({})
    record.name = page.username
    record.color = page.userColor
    record.participation = 'yes'
    record.eventId = eventId
    record.$save(function() {
      uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('refetchEvents')
    })
  }
  this.removeParticipant = function(participantId, name, color) {
    var deleteParticipant = function() {
      Participant.delete({ id: participantId }, function() {
        uiCalendarConfig.calendars.daytrisCalendar.fullCalendar('refetchEvents')
      })
    }
    if((name != page.username) || (color != page.userColor)) {
      $scope.main.messageModal = {
        message: 'Remove participant ' + name + '?',
        okButtonText: 'Yes, remove participant',
        cancelButtonText: 'Cancel',
        okFunc: deleteParticipant
      }
      UIkit.modal('#messageModal').show()
    } else {
      deleteParticipant()
    }
  }
  
  this.config = {
    lang: 'de',
    defaultView: view,
    columnFormat: 'dd D.M.',
    eventClick: function(event) {
      $state.go('event', { eventUrl: event.eventUrl })
    },
    eventRender: function(event, element) {
      if(resolution != 'month') {
        var newHtml = makeParticipants(event)
        var compiledNewHtml = $compile(newHtml)($scope)
        element.find('.fc-content').append(compiledNewHtml)
      }
    }
  }
  
  var moment = $.fullCalendar.moment;
  
  this.eventSources = [function(start, end, timezone, callback) {
    Event.get({
      filter: JSON.stringify({
        include: 'participants'
      })
    }, function(records) {
      var mapped = records.map(function(record) {
        return {
          id: record.id,
          eventUrl: record.url,
          title: record.text,
          start: moment(record.startDate + 'T' + record.startTime).toDate(),
          end: moment(record.endDate + 'T' + record.endTime).toDate(),
          participants: record.participants
        }
      })
      callback(mapped)
    })
  }]

}])
