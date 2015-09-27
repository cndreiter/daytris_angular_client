'use strict'

module.exports = 'controllers/calendar/daytris-calendar-form'
var dependencies = [
  require('../../page.js'),
  require('./collection.rest.js'),
  require('../events/event.rest.js'),
  require('../clipboard/clipboard.ctrl.js'),
  require('../../lib/comments.js'),
  require('../../lib/color.js'),
  require('../../lib/translator.js'),
  require('../../lib/pubsub.js')
]

var translations = require('./calendar.form.translations.js')

angular.module(module.exports, dependencies).controller('CalendarFormCtrl', [
        'page', '$scope', '$compile', '$state', '$stateParams', 'Collection', 'CollectionCollection', 'SubCollectionFactory', 'EventInCollectionFactory', 'comments', 't', 'pubsub',
function(page,   $scope,   $compile,   $state,   $stateParams,   Collection,   CollectionCollection,   SubCollectionFactory,   EventInCollectionFactory,   comments,   t,   pubsub) {
  
  var me = this
  
  translations(t) // use translations from calendar.form.translations.js
  
  $scope.getRecordUrl = function() {
    if(me.record) {
      return me.record.url
    }
  }
  
  var load = function(where, callback) {
    Collection.get({
      filter: JSON.stringify({
        where: where,
        include: ['collections', 'comments']
      })
    }, callback)
  }
  
  var loadCollection = function(url) {
    if(me.record) {
      if(!$scope.parentCalendar) {
        pubsub.unsubscribe('collections/:id/events', me.record.id)
        pubsub.unsubscribe('collections/:id/collections', me.record.id)
        pubsub.unsubscribe('collections/:id', me.record.id)
      }
    }
    load({ url: url }, function(records) {
      if($scope.destroyed) {
        // scope is dead => quit
        return
      }
      me.record = records[0]
      if(me.record) {
        
        if(!$scope.parentCalendar) {
          $scope.setParentCalendar(me.record)
          page.title = me.record.name
        }
        
        me.submit = function() {
          Collection.update({ id: me.record.id }, me.record, function() {
            me.hideSubCalendarEditForm()
          })
        }
        me.delete = function() {
          Collection.get({
            filter: JSON.stringify({
              where: { id: me.record.id },
              include: {
                relation: 'events',
                scope: {
                  fields: ['id']
                }
              }
            })
          }, function(records) {
            var record = records[0]
            if(record) {
              var deleteCalendar = function() {
                Collection.delete({ id: me.record.id }, function() {
                  if(!$scope.parentCalendar) {
                    $state.go('calendarDefaultView')
                  } else {
                    me.deleted = true
                    $scope.parentCalendar.reCountChildren()
                  }
                })
              }
              var mt = t.allTranslations.calendarMessageModal
              var hasEvents = record.events && record.events.length
              $scope.main.showMessage({
                message: hasEvents?
                  mt['Delete calendar '] + name + mt[' and its events?']:
                  mt['Delete empty calendar '] + name + mt['?'],
                okButtonText: hasEvents?
                  mt['Yes, delete calendar and its events']:
                  mt['Yes, delete empty calendar'],
                cancelButtonText: mt['Cancel'],
                okFunc: deleteCalendar
              })
            }
          })
        }
        
        if(!$scope.parentCalendar) {
          pubsub.subscribe('collections/:id', me.record.id) // subscribe to parent calendar changes
          pubsub.subscribe('collections/:id/collections', me.record.id) // subscribe to sub calendar changes
          pubsub.subscribe('collections/:id/events', me.record.id) // subscribe to event changes
        }
        
        if(me.record.isScheduler) {
          var EventInCollection = EventInCollectionFactory(me.record.id)
          EventInCollection.get({
            filter: JSON.stringify({
              include: ['participants', 'comments']
            })
          }, function(records) {
            me.sortedAlternativeEvents = records.sort(function(a, b) {
              var aParticipants = a.participants || []
              var bParticipants = b.participants || []
              return bParticipants.length - aParticipants.length
            })
          })
        } else {
          delete me.sortedAlternativeEvents
        }
        
        me.comments = comments.forParent({
          idName: 'collectionId',
          urlName: 'collectionUrl',
          record: me.record
        }, {
          load: function(response, initial) {
            if(initial) {
              var messageInput = $('.dt-message-input')[0] // FIXME make this independent of the REST response
              if(messageInput) {
                messageInput.focus()
              }
            }
          }
        })
        pubsub.subscribe('collections/:id/comments', me.record.id)
        
      } else {
        delete me.record
        if(!$scope.parentCalendar) {
          delete page.title
        }
        delete me.submit
        delete me.delete
        $state.go('newCalendar')
      }
    })
  }
  
  me.connectCandidate = {
    getUrlEndingFromPastedUrl: function() {
      me.connectCandidate.url = me.connectCandidate.pastedUrl.split('/').pop()
    },
    submit: function() {
      load({ url: me.connectCandidate.url }, function(records) {
        var record = records[0]
        if(record) {
          var linkRecord = new CollectionCollection({
            parentId: me.record.id,
            childId: record.id
          })
          linkRecord.$save(function() {
            window.location.reload()
          })
        }
      })
    }
  }
  
  me.disconnect = function() {
    var parentCalendar = $scope.parentCalendar
    CollectionCollection.get({
      filter: JSON.stringify({
        where: { childId: me.record.id }
      })
    }, function(records) {
      var numberOfLinks = records.length
      var linkToParentCalendar = records.filter(function(record) {
        return record.parentId == parentCalendar.record.id
      })[0]
      var disconnectCalendar = function() {
        var id = linkToParentCalendar.id
        var parentId = linkToParentCalendar.parentId
        var childId = linkToParentCalendar.childId
        CollectionCollection.delete({ id: id, parentId: parentId, childId: childId }, function() {
          $state.go('calendar', { collectionUrl: me.record.url })
        })
      }
      if(numberOfLinks < 2) {
        var mt = t.allTranslations.subCalendarMessageModal
        var fullUrl = page.makeFullUrl(me.record.url)
        $scope.main.messageModal = {
          message: mt["Remove this sub-calendar's last parent link? This action will make it stand-alone. Please remember its URL "] + fullUrl + mt["."],
          okButtonText: mt['Disconnect and make calendar stand-alone'],
          cancelButtonText: mt['Cancel'],
          okFunc: disconnectCalendar
        }
        // show modal
        UIkit.modal('#messageModal').show()
      } else {
        disconnectCalendar()
      }
    })
  }
  
  var url
  if(!$scope.parentCalendar) {
    url = $stateParams.collectionUrl
    if(!url) {
      page.title = 'Create a new Calendar'
    }
  } else {
    if($scope.subCalendar) {
      // the calendar of this controller is an existing sub-calendar of $scope.parentCalendar
      url = $scope.subCalendar.url
    }
  }
  
  if(url) {
    // UPDATE and DELETE
    loadCollection(url)
  } else {
    // CREATE
    var hasParent = !!$scope.parentCalendar
    if(hasParent) {
      var SubCollection = SubCollectionFactory($scope.parentCalendar.record.id)
      me.record = new SubCollection({})
    } else {
      me.record = new Collection({})
    }

    me.submit = function() {
      me.record.$save(function() {
        $state.go('calendar', {
          collectionUrl: hasParent? $scope.parentCalendar.record.url : me.record.url
        })
      })
      $state.go('calendarDefaultView')
    }
    
  }
  
  me.reCountChildren = function() {
    if(me.record && me.record.id) {
      load({ id: me.record.id }, function(records) {
        var record = records[0]
        if(record && record.collections) {
          me.upToDateChildrenCount = record.collections.length
        }
      })
    }
  }
  
  me.showEditForm = function() {
    var parentCalendar = $scope.parentCalendar
    if(parentCalendar) {
      // i am a sub-calendar => set editedSubCalendarId to my id in order to show my form
      parentCalendar.editedSubCalendarId = me.record.id
    } else {
      // i am the parent calendar => delete editedSubCalendarId to show my form
      delete me.editedSubCalendarId
    }
  }
  
  me.hideSubCalendarEditForm = function() {
    var parentCalendar = $scope.parentCalendar
    if(parentCalendar) {
      delete parentCalendar.editedSubCalendarId
    }
  }
  
  me.hasChildrenOrChildrenUnknown = function() {
    if(typeof me.upToDateChildrenCount !== 'undefined') {
      if(me.upToDateChildrenCount) {
        return true
      }
    } else {
      if(!me.record) {
        return true
      }
      if(me.record.collections && me.record.collections.length) {
        return true
      }
    }
    return false
  }
  
  $scope.chooseColor = function(color) {
    me.record.color = color
    me.palette = false
  }
  $scope.chosenColor = function() {
    if(me.record) {
      return me.record.color
    }
  }
  me.togglePalette = function() {
    me.palette = !me.palette
  }
  
  $scope.getCommentsObject = function() {
    return me.comments
  }
  $scope.getComments = function() {
    if(me.comments) {
      return me.comments.comments
    }
  }
  
  // websocket update
  $scope.$on('pubsub-message', function(event, message) {
    if(message.id) {
      load({ id: message.id }, function(records) {
        var record = records[0]
        if(record) {
          if(record.url == url) {
            loadCollection(url)
          } else {
            $state.go('calendar', { collectionUrl: record.url })
          }
        }
      })
    } else {
      loadCollection(url)
    }
  })
  
  var removeGridEventSource = $scope.removeGridEventSource
  $scope.$on('$destroy', function() {
    $scope.destroyed = true
    if(!$scope.parentCalendar) {
      pubsub.unsubscribeAll()
      if(me.record && me.record.id) {
        removeGridEventSource(me.record.id)
      }
    }
  })
  
}]).controller('SubCalendarFormsCtrl', ['$scope', function($scope) {
  $scope.parentCalendar = $scope.calendar
}]).controller('AlternativeEventsCtrl', ['$scope', function($scope) {
  $scope.getComments = function() {
    return $scope.event.comments
  }
}])
