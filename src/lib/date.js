/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'lib/daytris-date'
var dependencies = []

angular.module(module.exports, dependencies).factory('date', [function() {
  var date = {}
  var z2 = function(value) {
    if(value < 10) { return '0' + value }
    return '' + value
  }
  var z4 = function(value) {
    if(value < 10) { return '000' + value }
    if(value < 100) { return '00' + value }
    if(value < 1000) { return '0' + value }
    return '' + value
  }
  date.stringify = function(part, value) {
    switch(part) {
    case 'date':
      var y = value.getFullYear()
      var m = value.getMonth() + 1
      var d = value.getDate()
      return z4(y) + '-' + z2(m) + '-' + z2(d)
    case 'time':
      var h = value.getHours()
      var m = value.getMinutes()
      return z2(h) + ':' + z2(m)
    }
  }
  return date
}])
