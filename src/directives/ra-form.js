'use strict';

angular.module('ra.form').

  directive('raForm', function(raForm) {
    return {
      restrict: 'A',
      require:  'form',
      link: function($scope, element, attr, controller) {
        var actions = $scope[attr.raForm];

        // Make sure an update callback is passed
        if (_.isUndefined(actions) || _.isFunction(actions.update) === false) {
          throw new Error(
            'You must provide an update callback. e.g. <form ra-form="form_events">,' +
            'where $scope.form_events = { update: callbackFn }'
          );
        }

        var form_controller = $scope[controller.$name];
        _.extend(form_controller, raForm());
        _.extend(form_controller, actions);

        $scope[controller.$name] = form_controller;
      }
    };
  });
