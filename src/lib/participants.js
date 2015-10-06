/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

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
  participants.forAController = function(modalCallback, emailAddressModalCallback, listeners) {
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
    me.decline = function(participants, eventUrl) {
      var participant = me.findAnonymousUserParticipant(participants)
      me.removeParticipant(participant.id, participant.eventId, eventUrl, participant.name, participant.color)
    }
    
    me.addParticipant = function(eventId, eventUrl) {
      if(page.username && page.userColor) {
        var addParticipant = function() {
          var record = new Participant({})
          record.name = page.username
          record.emailAddress = page.userEmailAddress
          record.color = page.userColor
          record.participation = 'yes'
          record.eventId = eventId
          record.eventUrl = eventUrl // for authorization
          record.$save(listeners.add || function() {})
        }
        // email address modal
        if(!page.userEmailAddress) {
          var mt = t.allTranslations.emailAddressModal
          emailAddressModalCallback({
            message: mt['Provide your e-mail address to stay informed about changes.'],
            okFunc: addParticipant
          })
        } else {
          addParticipant()
        }
      }
    }
    
    me.removeParticipant = function(participantId, eventId, eventUrl, name, color) {
      var deleteParticipant = function() {
        Participant.delete({
          id: participantId,
          eventId: eventId,
          eventUrl: eventUrl // for authorization
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
