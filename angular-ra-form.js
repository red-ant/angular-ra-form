'use strict';
// Source: src/angular-ra-form.js
angular.module('ra.form', []);

// Source: src/directives/error.js
angular.module('ra.form').

    directive('errorFor', function() {
    return {
      restrict:   'A',
      replace:    true,
      scope:      true,
      template:   '<p class="form-error" ng-show="errors.length > 0" ng-transclude></p>',
      transclude: true,
      controller: function($scope, $element, $attrs) {
        $scope.errors = [];

        this.show = function(type) {
          if (!_.contains($scope.errors, type)) {
            $scope.errors.push(type);
          }
        };

        this.hide = function(type) {
          $scope.errors = _.reject($scope.errors, type);
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
        function trim(string) {
          return string.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        }

        var form      = controller[0],
            error_for = controller[1];

        var field, type;

        if (error_for) {
          field = error_for.name;
          type  = attr.errorOn;
        } else {
          var validation_exp = attr.errorOn.split(',');

          field = trim(validation_exp[0]);
          type  = trim(validation_exp[1]);
        }

        var getField = function() {
          var form_field = $scope[form.$name] && $scope[form.$name][field];
          return form_field;
        };

        var hasError = function() {
          var field = getField();
          return !!(field && field.$error[type]);
        };

        var showErrors = function() {
          var field = getField();
          return !!(field && field.show_errors);
        };

        $scope.$watch(showErrors, function(value) {
          if (value === true && hasError() === true) {
            displayErrors();
          } else {
            hideErrors();
          }
        });

        $scope.$watch(hasError, function(value) {
          if (showErrors() === true && value === true) {
            displayErrors();
          } else {
            hideErrors();
          }
        });

        var displayErrors = function() {
          $scope.show_error = true;

          if (error_for) {
            error_for.show(type);
          }
        };

        var hideErrors = function() {
          $scope.show_error = false;

          if (error_for) {
            error_for.hide(type);
          }
        };
      }
    };
  });

// Source: src/directives/ra-form.js
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

// Source: src/directives/validate-on.js
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

// Source: src/services/ra-form.js
angular.module('ra.form').

  factory('raForm', function() {
    var raForm = function raForm() {
      this.initialized     = true;
      this.submitting      = false;
      this.submitCallbacks = [];
    };

    _.extend(raForm.prototype, {
      showErrors: function(field_name) {
        var field = this.getField(field_name);

        if (field) {
          field.show_errors = true;
        }
      },

      hideErrors: function(field_name) {
        var field = this.getField(field_name);

        if (field) {
          field.show_errors = false;
        }
      },

      showErrorsOnInValid: function(field_name) {
        var $this = this;

        _.each($this.$error, function(errors, type) {
          _.each(errors, function(error) {
            $this.showErrors(error.$name);
          });
        });
      },

      setValidity: function(field_name, key, value) {
        var field = this.getField(field_name);

        if (field) {
          field.$setValidity(key, value);
        }

        if (value === true) {
          this.hideErrors(field_name);
        } else {
          this.showErrors(field_name);
        }
      },

      setFields: function(fields) {
        this.fields = fields;
      },

      getField: function(field_name) {
        return this.fields && this.fields[field_name];
      },

      errorOn: function(field_name, key) {
        var field = this.getField(field_name);

        if (field && field.show_errors) {
          return field.show_errors && field.$error[key];
        }
      },

      focus: function(field_name) {
        this.hideErrors(field_name);
      },

      blur: function(field_name) {
        this.change(field_name);
        this.showErrors(field_name);
      },

      change: function(field_name) {
        if (this.validations) {
          var validation = this.validations[field_name];

          if (_.isFunction(validation)) {
            validation();
          }
        }
      },

      onSubmit: function(callback) {
        this.submitCallbacks.push(callback);
      },

      submit: function() {
        var valid = true;

        _.each(this.submitCallbacks, function(callback) {
          if (_.isFunction(callback)) {
            callback();
          }
        });

        if (_.isFunction(this.validation)) {
          valid = this.validation();
        }

        if (this.$valid && valid !== false) {
          this.submitting = true;
          this.update();
        } else {
          this.showErrorsOnInValid();
        }
      }
    });

    return raForm;
  });
