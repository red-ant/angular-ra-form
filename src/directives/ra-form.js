'use strict';

angular.module('ra.form').

  directive('raForm', function(raForm) {
    return {
      restrict: 'A',
      require:  ['raForm', 'form'],

      controller: raForm,

      link: function($scope, element, attr, controllers) {
        var ra_form_controller = controllers[0],
            form_controller    = controllers[1],
            decorator          = $scope.$eval(attr.raForm);

        // Make sure an update callback is passed
        if (_.isUndefined(decorator) || _.isFunction(decorator.update) === false) {
          throw new Error(
            'You must provide an update callback. e.g. <form ra-form="form_events">,' +
            'where $scope.form_events = { update: callbackFn }'
          );
        }

        // Decorate ng-form controller
        _.extend(form_controller, ra_form_controller);
        _.extend(form_controller, decorator);
      }
    };
  });
