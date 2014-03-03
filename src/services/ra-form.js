'use strict';

angular.module('ra.form').

  factory('raForm', function() {
    var raForm = function raForm() {
      this.initialized     = true;
      this.submitting      = false;
      this.submitCallbacks = [];
    };

    _.extend(raForm.prototype, {
      showErrors: function(field) {
        if (field && this[field]) {
          this[field].show_errors = true;
        }
      },

      hideErrors: function(field) {
        if (field && this[field]) {
          this[field].show_errors = false;
        }
      },

      showErrorsOnInValid: function(field) {
        var $this = this;

        _.each($this.$error, function(errors, type) {
          _.each(errors, function(error) {
            $this.showErrors(error.$name);
          });
        });
      },

      setValidity: function(field, key, value) {
        this[field].$setValidity(key, value);

        if (value === true) {
          this.hideErrors(field);
        } else {
          this.showErrors(field);
        }
      },

      errorOn: function(field, key) {
        if (this[field] && this[field].show_errors) {
          return this[field].show_errors && this[field].$error[key];
        }
      },

      focus: function(field) {
        this.hideErrors(field);
      },

      blur: function(field) {
        this.change(field);
        this.showErrors(field);
      },

      change: function(field) {
        if (this.validations) {
          var validation = this.validations[field];

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
