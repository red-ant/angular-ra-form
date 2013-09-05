angular-ra-form
===============

AngularJS Module: form extensions

Example
---------------

```html
<form name="password_reset" ra-form="form" ng-submit="password_reset.submit()">
  <legend>Password Reset</legend>

  <div class="form-group">
    <label for="email">Email</label>
    <input
      ng-model="user.email"
      type="email"
      name="email"
      id="email"
      class="form-control"
      validate-on="blur"
      required>

    <p error-for="email">
      <span error-on="required">Please provide an email.</span>
      <span error-on="email">Please provide a valid email address.</span>
    </p>
  </div>
  
  <div class="form-group">
    <button
      type="submit"
      class="btn btn-primary btn-block"
      loading="password_reset.submitting"
      loading-truthy
      loading-text="Resetting password&hellip;">
      Reset Password
    </button>
  </div>
</form>
```
