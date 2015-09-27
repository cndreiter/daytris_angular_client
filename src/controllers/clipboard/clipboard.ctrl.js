'use strict'

module.exports = 'controllers/clipboard/daytris-clipboard'
var dependencies = [
  'zeroclipboard',
  require('../../page.js')
]

angular.module(module.exports, dependencies).controller('ClipboardCtrl', [
          'page', '$scope',
  function(page,   $scope) {
  // provide a scope for the "copied" flag
  
  $scope.pristineUrl = $scope.getRecordUrl()
  
  $scope.makeFullUrl = function(tail) {
    return page.makeFullUrl(tail)
  }
  
}])
