'use strict'

module.exports = 'lib/daytris-pubsub'
var dependencies = []

angular.module(module.exports, dependencies).factory('pubsub', ['$rootScope', function($rootScope) {
  var pubsub = {}
  
  var knownSubscriptions = {}

  var init = function() {
    // this function will be called whenever Primus re-connects (re-opens)
    Object.keys(knownSubscriptions).forEach(function(topic) {
      var topicObject = knownSubscriptions[topic]
      Object.keys(topicObject).forEach(function(parentId) {
        if(knownSubscriptions[topic][parentId]) {
          var subscription = topic + '/' + parentId
          console.log('pubsub: re-subscription after re-connect', subscription)
          pubsub.client.subscribe(subscription)
        }
      })
    })
    pubsub.client.on('message', function(topic, msg) {
      console.log('topic, message ', topic, msg)
      var parts = topic.split('/');
      if(parts.length == 2) {
        if(parts[0] == 'comments') {
          if(msg.toString() == 'changed') {
            // parts[1] is the comment list's eventId
            $rootScope.$broadcast('pubsub-message', 'comments/' + parts[1] + ' changed')
          }
        }
        if(parts[0] == 'participants') {
          if(msg.toString() == 'changed') {
            // parts[1] is the participant list's eventId
            $rootScope.$broadcast('pubsub-message', 'participants/' + parts[1] + ' changed')
          }
        }
      }
    })
  }

  var createClient = function createClient() {
    pubsub.client = PUBSUB_CLIENT(window.location.host, window.location.port, createClient)
    init()
  }

  createClient()
  
  pubsub.subscribe = function(topic, parentId) {
    // e.g. topic = 'participants'
    // e.g. parentId = 1
    if(!knownSubscriptions[topic]) {
      knownSubscriptions[topic] = {}
    }
    if(knownSubscriptions[topic][parentId]) {
      console.log('re-subscription of subscribed topic+parentId', topic, parentId)
      return;
    }
    knownSubscriptions[topic][parentId] = true
    var subscription = topic + '/' + parentId
    console.log('pubsub.subscribe', subscription)
    pubsub.client.subscribe(subscription)
  }
  
  pubsub.unsubscribe = function(topic, parentId) {
    if(knownSubscriptions[topic]) {
      knownSubscriptions[topic][parentId] = false
    }
    var subscription = topic + '/' + parentId
    console.log('pubsub.unsubscribe', subscription)
    pubsub.client.unsubscribe(subscription)
  }
  
  pubsub.unsubscribeTopic = function(topic) {
    console.log('pubsub.unsubscribeTopic', topic)
    var topicObject = knownSubscriptions[topic]
    if(topicObject) {
      Object.keys(topicObject).forEach(function(parentId) {
        pubsub.unsubscribe(topic, parentId)
      })
    }
  }
  
  pubsub.unsubscribeAll = function() {
    console.log('pubsub.unsubscribeAll')
    Object.keys(knownSubscriptions).forEach(function(topic) {
      pubsub.unsubscribeTopic(topic)
    })
  }
  
  return pubsub
}])
