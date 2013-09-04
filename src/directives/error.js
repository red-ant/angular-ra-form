'use strict';

angular.module('ra.form').

  directive('errorFor', function() {
    return {
      restrict:   'A',
      replace:    true,
      scope:      true,
      template:   '<p class="form-error" ng-show="error_count > 0" ng-transclude></p>',
      transclude: true,
      controller: function($scope, $element, $attrs) {
        $scope.error_count = 0;

        this.show = function() {
          $scope.error_count++;
        };

        this.hide = function() {
          if ($scope.error_count > 0) {
            $scope.error_count--;
          }
        };

        this.name = $attrs.errorFor;
      }
    };
  }).

  directive('errorOn', function() {
    return {
      require:    ['^form', '?^errorFor'],
      restrict:   'A',
      replace:    true,
      scope:      true,
      template:   '<span class="text-danger" ng-show="show_error" ng-transclude></span>',
      transclude: true,
      link: function($scope, element, attr, controller) {
        var form      = controller[0],
            error_for = controller[1];

        var field, type;

        if (error_for) {
          field = error_for.name;
          type  = attr.errorOn;
        } else {
          var validation_exp = attr.errorOn.split(',');

          field = _.str.trim(validation_exp[0]);
          type  = _.str.trim(validation_exp[1]);
        }

        var hasError = function() {
          var has_error = $scope[form.$name] &&
                          $scope[form.$name][field] &&
                          $scope[form.$name][field].$error[type];

          return has_error;
        };

        $scope.$watch(form.$name + '.' + field + '.show_errors', function(show_errors) {
          if (show_errors && hasError()) {
            $scope.show_error = true;

            if (error_for) {
              error_for.show();
            }
          } else {
            $scope.show_error = false;

            if (error_for) {
              error_for.hide();
            }
          }
        });
      }
    };
  });
