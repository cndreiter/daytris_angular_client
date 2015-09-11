'use strict'

module.exports = 'lib/daytris-translator'
var dependencies = []

angular.module(module.exports, dependencies).factory('t', function() {
  var t = {}
  t.allTranslations = {}
  t.add = function(namespace, namespaceTranslations) {
    t.allTranslations[namespace] = namespaceTranslations
  }
  return t
})

var translateDirective = ['t', function(t) {
  return {
    restrict: 'A',
    require: '?^^tns',
    compile: function() {
      var directiveName = this.name
      return function(scope, element, attrs, ctrl) {
        if(directiveName == 'ttarget') {
          // directive is called as "ttarget"
          //  => test if "t" exists as well in the HTML tag:
          if(typeof attrs.t !== 'undefined') {
            // yield to "t" => do nothing
            return
          }
        }
        var getText = function(target) {
          switch(target) {
            case 'text': return element.text()
            case 'placeholder': return attrs.placeholder
          }
        }
        var setText = function(target, text) {
          switch(target) {
            case 'text': element.text(text); break
            case 'placeholder': element.attr('placeholder', text); break
          }
        }
        var translate = function(translationNamespace) {
          var key = attrs.t // read directive's value
          var target = attrs.ttarget || 'text' // what should be translated?
          var text = getText(target) // read text of HTML element
          var translations = translationNamespace? t.allTranslations[translationNamespace] : t.allTranslations
          var translation = translations[key || text]
          if(typeof translation !== 'undefined') {
            setText(target, translation)
          }
        }
        if(ctrl) {
          ctrl.registerNamespaceCallback(translate)
        } else {
          // no tns controller exists, call directly:
          translate()
        }
      }
    }
  }
}]

angular.module(module.exports).directive('t', translateDirective)
angular.module(module.exports).directive('ttarget', translateDirective) // if t is omitted, ttarget is used instead
angular.module(module.exports).directive('tns', function() {
  return {
    restrict: 'A',
    controller: function($scope) {
      $scope.callbacks = []
      this.registerNamespaceCallback = function(callback) {
        $scope.callbacks.push(callback)
      }
    },
    link: function(scope, element, attrs, ctrl) {
      var translationNamespace = attrs.tns
      scope.callbacks.forEach(function(callback) {
        callback(translationNamespace)
      })
    }
  }
})
