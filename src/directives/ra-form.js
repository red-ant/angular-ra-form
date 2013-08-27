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

        $scope[controller.$name] = _.extend($scope[controller.$name], raForm.actions, actions);
      }
    };
  });
