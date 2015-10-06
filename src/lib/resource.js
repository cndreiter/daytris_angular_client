'use strict'

module.exports = 'lib/daytris-resource'
var dependencies = []

angular.module(module.exports, dependencies).factory('resource', [function() {
  return {
    restApiRoot: DAYTRIS_REST_API_ROOT // set through index.twig
  }
}])
