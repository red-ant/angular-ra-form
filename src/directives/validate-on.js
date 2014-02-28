'use strict';

angular.module('ra.form').

  directive('validateOn', function() {
    return {
      require: ['^raForm', 'ngModel'],
      restrict: 'A',
      link: function($scope, element, attr, controller) {
        var formController  = controller[0],
            modelController = controller[1];

        var init = function() {
          if (attr.validateOn === 'blur') {
            watchBlur();
          }

          else if (attr.validateOn === 'submit') {
            watchSubmit();
          }
        };


        var watchBlur = function() {
          _.each('focus blur'.split(' '), function(event) {
            element.on(event, function() {
              $scope.$apply(function() {
                formController[event](modelController.$name);
              });
            });
          });
        };


        var watchSubmit = function() {
          formController.onSubmit(function() {
            formController.blur(modelController.$name);
          });
        };


        var dereg = $scope.$watch(function() { return formController.initialized; }, function(value) {
          dereg();
          init();
        });
      }
    };
  });
