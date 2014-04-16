/* global require */
(function() {
  'use strict';

  module.exports = function(grunt) {
    // Load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      dist: 'dist',

      clean: {
        dist: ['angular-ra-*.js']
      },

      concat: {
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
                   src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },

        dist: {
          src:  ['src/angular-ra-form.js', 'src/**/*.js'],
          dest: 'angular-ra-form.js'
        }
      },

      ngmin: {
        dist: {
          src: ['angular-ra-form.js'],
          dest: 'angular-ra-form.min.js'
        }
      },

      uglify: {
        dist: {
          src: ['angular-ra-form.min.js'],
          dest: 'angular-ra-form.min.js'
        }
      },

      bower: {
        options: {
          copy: false
        },
        install: {}
      },

      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        all: [
          'Gruntfile.js',
          'src/{,*/}*.js',
          'test/{,*/}*.js',
        ]
      },

      karma: {
        dev: {
          configFile: 'karma.conf.js',
          singleRun: false
        },

        dist: {
          configFile: 'karma.conf.js'
        }
      },

      bump: {
        options: {
          files:       ['package.json', 'bower.json'],
          commitFiles: ['package.json', 'bower.json'],
          pushTo:      'origin'
        }
      },

      watch: {
        scripts: {
          files: ['src/**/*.js'],
          tasks: ['build']
        }
      }
    });

    grunt.registerTask('test', 'karma:dev');
    grunt.registerTask('build', ['jshint:all', 'bower', 'clean', 'concat', 'ngmin', 'uglify']);
  };
})();
