/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'lib/daytris-pubsub'
var dependencies = []

angular.module(module.exports, dependencies).factory('pubsub', ['$rootScope', function($rootScope) {
  var pubsub = {}
  
  var knownSubscriptions = {}
  
  var subscriptionIdString = function(topic, recordId) {
    // replace :id/:recordId by recordId
    return topic.replace(':id', recordId).replace(':recordId', recordId)
  }
  
  var init = function() {
    // this function will be called whenever Primus re-connects (re-opens)
    Object.keys(knownSubscriptions).forEach(function(topic) {
      var topicObject = knownSubscriptions[topic]
      Object.keys(topicObject).forEach(function(recordId) {
        if(knownSubscriptions[topic][recordId]) {
          var subscription = subscriptionIdString(topic, recordId)
          console.log('pubsub: re-subscription after re-connect', subscription)
          pubsub.client.subscribe(subscription)
        }
      })
    })
    pubsub.client.on('message', function(topic, msg) {
      var message = msg.toString() // e.g. "changed"
      console.log("PUBSUB ", topic, message)
      var parts = topic.split('/')
      if(parts.length == 2) {
        $rootScope.$broadcast('pubsub-message', {
          collection: parts[0],
          id: parts[1],
          change: message
        })
      }
      if(parts.length == 3) {
        $rootScope.$broadcast('pubsub-message', {
          parentCollection: parts[0],
          parentId: parts[1],
          collection: parts[2],
          change: message
        })
      }
    })
  }

  var createClient = function createClient() {
    pubsub.client = PUBSUB_CLIENT(window.location.host, window.location.port, createClient)
    init()
  }

  createClient()
  
  pubsub.subscribe = function(topic, recordId) {
    // e.g. topic = 'participants'
    // e.g. recordId = 1
    if(!knownSubscriptions[topic]) {
      knownSubscriptions[topic] = {}
    }
    if(knownSubscriptions[topic][recordId]) {
      //console.log('re-subscription of subscribed topic+recordId', topic, recordId)
      return;
    }
    knownSubscriptions[topic][recordId] = true
    var subscription = subscriptionIdString(topic, recordId)
    pubsub.client.subscribe(subscription)
  }
  
  pubsub.unsubscribe = function(topic, recordId) {
    if(knownSubscriptions[topic]) {
      knownSubscriptions[topic][recordId] = false
    }
    var subscription = subscriptionIdString(topic, recordId)
    pubsub.client.unsubscribe(subscription)
  }
  
  pubsub.unsubscribeTopic = function(topic) {
    var topicObject = knownSubscriptions[topic]
    if(topicObject) {
      Object.keys(topicObject).forEach(function(recordId) {
        pubsub.unsubscribe(topic, recordId)
      })
    }
  }
  
  pubsub.unsubscribeAll = function() {
    Object.keys(knownSubscriptions).forEach(function(topic) {
      pubsub.unsubscribeTopic(topic)
    })
  }
  
  return pubsub
}])
