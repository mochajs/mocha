'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['mocha.js', 'coverage.html', 'lib-cov'],
    copy: {
      'lib/browser/diff.js': ['node_modules/diff/diff.js']
    },
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
};
