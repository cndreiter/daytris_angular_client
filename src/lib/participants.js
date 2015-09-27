'use strict'

module.exports = 'lib/daytris-participants'
var dependencies = [
  require('../page.js'),
  require('../controllers/participants/participant.rest.js')
]

angular.module(module.exports, dependencies).factory('participants', [
        'page', 'Participant', 't',
function(page,   Participant,   t) {
  var participants = {}
  participants.forAController = function(modalCallback, listeners) {
    var me = {}
    
    me.userOk = function() {
      // test if the user can be used as valid participant
      return page.username && page.userColor
    }
    
    me.findAnonymousUserParticipant = function(participants) {
      return participants.filter(function(participant) {
        return ((participant.name == page.username) && (participant.color == page.userColor))
      })[0]
    }
    me.participating = function(participants) {
      return !!me.findAnonymousUserParticipant(participants)
    }
    me.decline = function(participants) {
      var participant = me.findAnonymousUserParticipant(participants)
      me.removeParticipant(participant.id, participant.eventId, participant.name, participant.color)
    }
    
    me.addParticipant = function(eventId) {
      var record = new Participant({})
      record.name = page.username
      record.color = page.userColor
      record.participation = 'yes'
      record.eventId = eventId
      record.$save(listeners.add || function() {})
    }
    
    me.removeParticipant = function(participantId, eventId, name, color) {
      var deleteParticipant = function() {
        Participant.delete({
          id: participantId,
          eventId: eventId
        }, listeners.delete || function() {})
      }
      if((name != page.username) || (color != page.userColor)) {
        // configure modal
        var mt = t.allTranslations.participantMessageModal
        modalCallback({
          message: mt['Remove participant '] + name + mt['?'],
          okButtonText: mt['Yes, remove participant'],
          cancelButtonText: mt['Cancel'],
          okFunc: deleteParticipant
        })
      } else {
        deleteParticipant()
      }
    }
    
    return me
  }
  return participants
}])
