'use strict';

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
