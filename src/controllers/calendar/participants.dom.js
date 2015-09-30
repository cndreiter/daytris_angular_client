'use strict'

module.exports = 'controllers/calendar/participants-dom'
var dependencies = []

angular.module(module.exports, dependencies).factory('participantsDom', [function() {
  var participantsDom = {}
  participantsDom.makeParticipants = function(event, participantsObject) {
    // event is the record which is used to render the event by fullcalendar.io
    // its properties differ slighty from the Event REST model
    
    // participantsObject must be an object accessible from HTML
    // participantsObject must be of type "string", e.g. 'calendarGrid.participants'
    var p = participantsObject
    var qEId = "'"+event.id+"'" // quoted event id for use as function parameter
    var qEUrl = "'"+event.eventUrl+"'" // quoted event url for use as function parameter
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
        return '<a ng-click="'+p+'.removeParticipant('+qId+', '+qEId+', '+qEUrl+', '+qName+', '+qC+'); $event.stopPropagation()" class="dt-color-icon" color-icon="'+c+'" data-uk-tooltip title="'+name+'"></a>'
      }).join('\n')
    }
    return '<div class="dt-color-palette">\
' + s + '\n\
<a ng-cloak ng-show="'+p+'.userOk()" ng-click="'+p+'.addParticipant('+qEId+', '+qEUrl+'); $event.stopPropagation()" class="dt-add-icon">+</a>\
</div>'
  }
  return participantsDom
}])
