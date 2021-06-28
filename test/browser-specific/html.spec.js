'use strict';

var events = require('../../lib/runner').constants;
var helpers = require('../reporters/helpers');
var reporters = require('../../lib/mocha').reporters;

describe('browser error bar', function() {
  var htmlReporter;
  var runner;
  var suite;
  var createMockRunner;
  var makeRunReporter;
  var EVENT_TEST_FAIL;
  var options = {};
  var runReporter;

  beforeEach(function() {
    htmlReporter = reporters.HTML;
    createMockRunner = helpers.createMockRunner;
    makeRunReporter = helpers.createRunReporterFunction;
    EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
    runReporter = makeRunReporter(htmlReporter);
    suite = {
      root: false,
      title: 'some title'
    };
  });

  beforeEach(function() {
    var fixtures = '<div id="progress-bar></div>';
    document.body.insertAdjacentHTML('afterbegin', fixtures);
  });

  it('should add the error class to progress-bar', function() {
    runner = createMockRunner('fail', EVENT_TEST_FAIL, suite);
    console.log('this is runner', runner);
    var stdout = runReporter(this, runner, options);

    var expectedArray = ['<div id="progress-bar class="error"></div>'];
    expect(stdout, 'to equal', expectedArray);
  });
});
