'use strict';

angular.module('ra.form').

  directive('errorOn', function() {
    return {
      require:    '^form',
      restrict:   'A',
      replace:    true,
      scope:      true,
      template:   '<span class="text-danger" ng-show="show_error" ng-transclude></span>',
      transclude: true,
      link: function($scope, element, attr, controller) {
        var validation_exp = attr.errorOn.split(',');
        var field = _.str.trim(validation_exp[0]),
            type  = _.str.trim(validation_exp[1]);

        var hasError = function() {
          var has_error = $scope[controller.$name] &&
                          $scope[controller.$name][field] &&
                          $scope[controller.$name][field].$error[type];

          return has_error;
        };

        $scope.$watch(controller.$name + '.' + field + '.show_errors', function(show_errors) {
          if (show_errors && hasError()) {
            $scope.show_error = true;
          } else {
            $scope.show_error = false;
          }
        });
      }
    };
  });
