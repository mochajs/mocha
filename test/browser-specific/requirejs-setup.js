/* eslint-disable strict */
(function() {
  'use strict';
  var tests = [];

  for (var file in window.__karma__.files) {
    if (/fixture\.js$/.test(file)) {
      tests.push(file);
    }
  }

  require.config({
    baseUrl: '/base',
    deps: tests,
    callback: window.__karma__.start
  });
})();
