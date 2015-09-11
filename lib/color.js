'use strict'

module.exports = 'lib/daytris-color'
var dependencies = []

angular.module(module.exports, dependencies).directive('colorIcon', function() {
  return {
    restrict: 'A',
    scope: true,
    controller: function($scope, $element, $attrs) {
      var color = $attrs.colorIcon
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
    }
  }
})
