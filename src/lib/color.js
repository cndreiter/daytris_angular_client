/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'lib/daytris-color'
var dependencies = []

angular.module(module.exports, dependencies)
.factory('colors', [function() {
  var colors = {}
  colors.niceColors = [
    "#FF0000",
    "#FF8000",
    "#FFBF00",
    "#FFFF00",
    "#BFFF00",
    "#80FF00",
    "#00FF00",
    "#008000",
    "#00FF80",
    "#00FFBF",
    "#00FFFF",
    "#00BFFF",
    "#0080FF",
    "#0000FF",
    "#4000FF",
    "#8000FF",
    "#BF00FF",
    "#FF00FF",
    "#FF00BF",
    "#FF0080"
  ]
  colors.nicePaleColors = [
    '#ffbdbd',
    '#ffcb85',
    '#fdf5c9',
    '#feffa3',
    '#f9eb97',
    '#f2f6c3',
    '#c6f9ac',
    '#e1f7d5',
    '#d4ffea',
    '#a8d9f6',
    '#f1cbff',
    '#c9c9ff'
  ]
  return colors
}])
.directive('colorIcon', function() {
  return {
    restrict: 'A',
    scope: true,
    controller: function($scope, $element, $attrs) {
      $attrs.$observe('colorIcon', function(color) {
        $element.css('background-color', color)
      })
    }
  }
})
.directive('colorChooserIcon', function() {
  return {
    restrict: 'A',
    scope: true,
    controller: function($scope, $element, $attrs) {
      $attrs.$observe('colorChooserIcon', function(color) {
        // FIXME remove old $element.click if this callback is called again by $observe
        $element.css('background-color', color)
        $scope.$watch('$parent.chosenColor()', function() {
          if($scope.$parent.chosenColor() == color) {
            $element.hide()
          } else {
            $element.show()
          }
        })
        $element.click(function() {
          $scope.$apply(function() {
            $scope.$parent.chooseColor(color)
          })
        })
      })
    }
  }
})
