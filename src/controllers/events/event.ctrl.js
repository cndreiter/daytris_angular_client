'use strict'

module.exports = 'controllers/events/daytris-event'
var dependencies = [
  require('../../page.js'),
  require('../calendar/collection.rest.js'),
  require('./event.rest.js'),
  require('../comments/comment.rest.js'),
  require('../clipboard/clipboard.ctrl.js'),
  require('../../lib/date.js'),
  require('../../lib/participants.js'),
  require('../../lib/comments.js'),
  require('../../lib/translator.js'),
  require('../../lib/pubsub.js'),
  'ui.router'
]

var translations = require('./event.translations.js')

angular.module(module.exports, dependencies).controller('EventCtrl', [
        'page', '$scope', '$state', '$stateParams', 'Event', 'Collection', 'EventInCollectionFactory', 'Participant', 'participants', 'Comment', 'comments', 'date', 't', 'pubsub',
function(page,   $scope,   $state,   $stateParams,   Event,   Collection ,  EventInCollectionFactory,   Participant,   participants,   Comment,   comments,   date,   t,   pubsub) {
  
  var me = this
  
  page.collectionUrl = page.collectionUrl || $stateParams.collectionUrl
  
  me.participants = participants.forAController($scope.main.showMessage, $scope.main.showEmailAddressModal, {})
  
  translations(t) // use translations from event.translations.js
  
  $scope.getRecordUrl = function() {
    if(me.record) {
      return me.record.url
    }
  }
  
  var initNew = function() {
    var collectionUrl = $stateParams.collectionUrl
    Collection.get({
      filter: JSON.stringify({
        where: {
          url: collectionUrl // sufficient for authorization
        }
      })
    }, function(records) {
      me.collections = records
      var collectionRecord = records[0]
      if(collectionRecord) {
        page.title = page.title || collectionRecord.name
        
        var EventInCollection = EventInCollectionFactory(collectionRecord.id)
        me.record = new EventInCollection({
          parentUrl: collectionUrl // for authorization
        })

        var today = new Date()

        me.record.startDate = date.stringify('date', today)
        me.record.startTime = '08:00'

        me.record.endDate = date.stringify('date', today)
        me.record.endTime = '10:00'

        if(me.record.emailAddress) {
          // FIXME query validity from input
          page.setUserEmailAddress(me.record.emailAddress)
        }

        me.submit = function() {
          me.record.$save(function() {
            $scope.setCalendarEditMode('grid')
          })
        }
      }
    })
  }
  
  var initExisting = function() {
    me.submit = function() {
      if(me.record.emailAddress) {
        // FIXME query validity from input
        page.setUserEmailAddress(me.record.emailAddress)
      }
      Event.update({ id: me.record.id }, me.record, function() {
        $scope.setCalendarEditMode('grid')
      })
    }
    me.delete = function() {
      Event.delete({
        id: me.record.id,
        url: me.record.url // for authorization
      }, function() {
        $scope.setCalendarEditMode('grid')
      })
    }
  }
  
  var url = $stateParams.eventUrl
  if(url) {
    // UPDATE and DELETE
    Event.get({
      filter: JSON.stringify({
        where: {
          url: url // for authorization
        },
        include: ['collections', 'participants']
      })
    }, function(records) {
      me.record = records[0]
      if(me.record) {
        me.collections = me.record.collections
        var collectionRecord = me.record.collections[0]
        if(collectionRecord) {
          page.collectionUrl = page.collectionUrl || collectionRecord.url
          page.title = page.title || collectionRecord.name
        }
        initExisting()
        pubsub.subscribe('events/:id/participants', me.record.id)
        me.comments = comments.forParent({
          idName: 'eventId',
          urlName: 'eventUrl',
          record: me.record
        },
        $scope.main.showEmailAddressModal,
        {
          load: function(response, initial) {
            if(initial) {
              $('.dt-message-input')[0].focus() // FIXME make this independent of the REST response
            }
          }
        })
        pubsub.subscribe('events/:id/comments', me.record.id)
      } else {
        $state.go('calendarDefaultView')
      }
    })
  } else {
    // CREATE
    initNew()
  }
  
  // DATE INPUTS
  
  me.setStartToday = function() {
    me.record.startDate = date.stringify('date', new Date())
  }
  me.setEndToday = function() {
    me.startDayIsEndDay = false
    me.record.endDate = date.stringify('date', new Date())
  }
  me.initStartDayIsEndDay = function() {
    if((!me.record.text) || (me.record.startDate == me.record.endDate)) {
      me.startDayIsEndDay = true
      me.updateEndDate()
    }
  }
  
  me.updateEndDate = function() {
    if(me.startDayIsEndDay) {
      me.record.endDate = me.record.startDate
    } else {
      if(me.record.startDate.length == me.record.endDate.length) {
        if(me.record.startDate > me.record.endDate) {
          me.record.endDate = me.record.startDate
        }
      }
    }
  }
  me.updateStartDate = function() {
    if(me.record.startDate.length == me.record.endDate.length) {
      if(me.record.endDate < me.record.startDate) {
        me.record.startDate = me.record.endDate
      }
    }
  }
  
  me.updateEndTime = function() {
    if(me.record.startTime.length == me.record.endTime.length) {
      if(me.record.startTime > me.record.endTime) {
        me.record.endTime = me.record.startTime
      }
    }
  }
  me.updateStartTime = function() {
    if(me.record.startTime.length == me.record.endTime.length) {
      if(me.record.endTime < me.record.startTime) {
        me.record.startTime = me.record.endTime
      }
    }
  }
  
  
  // participants
  var loadParticipants = function() {
    Participant.get({
      filter: JSON.stringify({
        eventUrl: me.record.url, // for authorization
        where: {
          eventId: me.record.id
        }
      })
    }, function(response) {
      me.record.participants = response
    })
  }
  
  // comments
  $scope.getCommentsObject = function() {
    return me.comments
  }
  $scope.getComments = function() {
    if(me.comments) {
      return me.comments.comments
    }
  }
  
  
  // websocket update
  $scope.$on('pubsub-message', function(message) {
    me.comments.loadComments(false)
    loadParticipants()
  })
  
  $scope.$on('$destroy', function() {
    pubsub.unsubscribeAll()
  })
  
}])
