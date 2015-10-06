/* Copyright (C) Christian Niederreiter <cndreiter@gmail.com>
 * Unauthorized copying of this file, via any medium, is strictly prohibited
 * Proprietary and confidential
 */

'use strict'

module.exports = 'lib/daytris-resource'
var dependencies = []

angular.module(module.exports, dependencies).factory('resource', [function() {
  return {
    restApiRoot: DAYTRIS_REST_API_ROOT // set through index.twig
  }
}])
