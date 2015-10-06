/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'lib/daytris-comments'
var dependencies = [
  require('../page.js'),
  require('../controllers/comments/comment.rest.js')
]

angular.module(module.exports, dependencies).factory('comments', [
        'page', 'Comment', 't',
function(page,   Comment,   t) {
  var comments = {}
  comments.forParent = function(parent, emailAddressModalCallback, listeners) {
    var me = {}
    
    var parentIdName = parent.idName
    var parentUrlName = parent.urlName
    var parentRecord = parent.record
    
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
        var deleteArguments = {
          id: comment.id
        }
        deleteArguments[parentIdName] = parentRecord.id
        deleteArguments[parentUrlName] = parentRecord.url // for authorization
        Comment.delete(deleteArguments, function() {
          done.count += 1
          if(done.count >= n) {
            // code to run after delete
          }
        })
      })
    }
    
    me.loadComments = function(initial) {
      var filterArguments = {
        where: {}
      }
      filterArguments[parentUrlName] = parentRecord.url // for authorization
      filterArguments.where[parentIdName] = parentRecord.id
      Comment.get({
        filter: JSON.stringify(filterArguments)
      }, function(response) {
        me.comments = response.data
        if(listeners && listeners.load) {
          listeners.load(response, initial)
        }
      })
    }
    
    me.init = function() {
      me.submit = function() {
        if(page.username && page.userColor) {
          var createComment = function() {
            var comment = new Comment({})
            comment[parentIdName] = parentRecord.id
            comment[parentUrlName] = parentRecord.url // for authorization
            comment.name = page.username
            comment.emailAddress = page.userEmailAddress
            comment.color = page.userColor
            comment.message = me.comment.message
            comment.$save(function() {
              me.comment = {}
            })
          }
          // email address modal
          if(!page.userEmailAddress) {
            var mt = t.allTranslations.emailAddressModal
            emailAddressModalCallback({
              message: mt['Provide your e-mail address to stay informed about changes.'],
              okFunc: createComment
            })
          } else {
            createComment()
          }
        }
      }
      me.loadComments(true)
    }
    
    me.init()
    
    return me
  }
  return comments
}])
