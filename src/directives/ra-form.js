'use strict';

angular.module('ra.form').

  directive('raForm', function(raForm) {
    return {
      restrict: 'A',
      require:  ['raForm', 'form'],

      controller: function() {
        return new raForm();
      },

      link: function($scope, element, attr, controllers) {
        var ra_form   = controllers[0],
            ng_form   = controllers[1],
            decorator = $scope.$eval(attr.raForm);

        // Make sure an update callback is passed
        if (_.isUndefined(decorator) || _.isFunction(decorator.update) === false) {
          throw new Error(
            'You must provide an update callback. e.g. <form ra-form="form_events">,' +
            'where $scope.form_events = { update: callbackFn }'
          );
        }

        // Set models
        ra_form.setFields(ng_form);

        // Decorate ng-form controller
        _.extend(ng_form, ra_form);
        _.extend(ng_form, raForm.prototype);
        _.extend(ng_form, decorator);
      }
    };
  });
