module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'components/angular/angular.js',
      'components/angular-mocks/angular-mocks.js',
      'src/angular-ra-form.js',
      'test/angular-ra-form.js'
    ],

    exclude: [],

    port: 9876,

    colors: true,
    logLevel: config.LOG_INFO,
    reporters: ['progress'],

    browsers: ['Chrome'],

    autoWatch: true,
    singleRun: true,
    captureTimeout: 60000
  });
};
