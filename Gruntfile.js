'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['mocha.js', 'coverage.html', 'lib-cov'],
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
};
