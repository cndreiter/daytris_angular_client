'use strict'

module.exports = 'controllers/events/daytris-event'
var dependencies = [
  require('./event.rest.js'),
  require('../comments/comment.rest.js'),
  require('../../lib/date.js'),
  require('../../lib/translator.js'),
  'ui.router'
]

var translations = require('./event.translations.js')

angular.module(module.exports, dependencies).controller('EventCtrl', [
        'page', '$state', '$stateParams', 'Event', 'Comment', 'date', 't',
function(page,   $state,   $stateParams,   Event,   Comment,   date,   t) {
  var me = this
  
  translations(t) // use translations from event.translations.js
  
  var initNew = function() {
    me.record = new Event({})
    
    var today = new Date()

    me.record.startDate = date.stringify('date', today)
    me.record.startTime = '08:00'

    me.record.endDate = date.stringify('date', today)
    me.record.endTime = '10:00'

    me.submit = function() {
      me.record.$save(function() {
        $state.go('event', { eventUrl: me.record.url })
      })
      $state.go('calendarDefaultView')
    }
  }
  
  var initExisting = function() {
    me.submit = function() {
      Event.update({ id: me.record.id }, me.record )
    }
    me.delete = function() {
      Event.delete({ id: me.record.id }, function() {
        $state.go('calendarDefaultView')
      })
    }
  }
  
  var url = $stateParams.eventUrl
  if(url) {
    // UPDATE and DELETE
    Event.get({
      filter: JSON.stringify({
        where: {
          url: $stateParams.eventUrl
        },
        include: 'participants'
      })
    }, function(records) {
      me.record = records[0]
      if(me.record) {
        initExisting()
        me.initComments()
      } else {
        $state.go('newEvent')
      }
    })
  } else {
    // CREATE
    initNew()
  }
  
  // COMMENTS
  me.comment = {}
  me.markedComments = function() {
    if(me.comments) {
      return me.comments.filter(function(comment) {
        return comment.marked
      })
    }
    return []
  }
  me.deleteMarkedComments = function() {
    var comments = me.markedComments()
    var n = comments.length
    var done = { count: 0 }
    comments.forEach(function(comment) {
      Comment.delete({ id: comment.id, eventUrl: me.record.url }, function() {
        done.count += 1
        if(done.count >= n) {
          me.initComments()
        }
      })
    })
  }
  me.initComments = function() {
    me.submitComment = function() {
      var comment = new Comment({})
      comment.eventId = me.record.id
      comment.eventUrl = me.record.url
      comment.name = page.username
      comment.color = page.userColor
      comment.message = me.comment.message
      comment.$save(function() {
        me.comment = {}
        me.initComments()
      })
    }
    Comment.get({
      filter: JSON.stringify({
        eventUrl: me.record.url,
        where: {
          eventId: me.record.id
        }
      })
    }, function(response) {
      me.comments = response.data
      $('.dt-message-input')[0].focus() // FIXME make this independent of the REST response
    })
  }
  
}])
