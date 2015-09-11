'use strict'

module.exports = 'controllers/events/daytris-event'
var dependencies = [
  require('./event.rest.js'),
  require('../../lib/date.js'),
  require('../../lib/translator.js'),
  'ui.router'
]

var translations = require('./event.translations.js')

angular.module(module.exports, dependencies).controller('EventCtrl', [
        '$state', '$stateParams', 'Event', 'date', 't',
function($state,   $stateParams,   Event,   date,   t) {
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
        }
      })
    }, function(records) {
      me.record = records[0]
      if(me.record) {
        initExisting()
      } else {
        $state.go('newEvent')
      }
    })
  } else {
    // CREATE
    initNew()
  }
  
}])
