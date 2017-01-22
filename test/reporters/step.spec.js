'use strict';

var assert = require('assert');

var reportersIndex = require('../../lib/reporters');
var Base = reportersIndex.Base;
var StepReporter = require('../../lib/reporters/step');

function getRandomInteger (max) {
  return Math.ceil(Math.random() * max);
}

function RunnerStub () {
  var events = [];

  this.on = function (eventName, handler) {
    events.push({
      name: eventName,
      handler: handler
    });
  };

  this.getEvents = function (eventName) {
    return events.filter(function (event) {
      return event.name === eventName;
    });
  };
}

function getLast (array) {
  return array.slice(-1)[0];
}

function givenConsoleLogStub (loggedText) {
  return function () {
    var args = Array.prototype.map.call(arguments, function (item) {
      return item;
    });
    loggedText.push(args);
  };
}

describe('Step reporter', function () {
  describe('Exposure via index', function () {
    it('should be exposed as step', function () {
      assert.equal(reportersIndex.step, StepReporter);
    });
    it('should be exposed as Step', function () {
      assert.equal(reportersIndex.Step, StepReporter);
    });
  });

  describe('Inherits from Base using "inherits" library', function () {
    it('should inherit from Base', function () {
      assert.equal(StepReporter.super_, Base);
    });
  });

  describe('Instantiation', function () {
    var runner;
    var instance;

    before('given runner instance', function () {
      runner = new RunnerStub();
    });

    before('when instantiated', function () {
      instance = new StepReporter(runner); // eslint-disable-line no-new
    });

    it('should apply base constructor', function () {
      assert.equal(instance.runner, runner);

      assert.deepEqual(instance.failures, []);

      assert(runner.stats);
      assert.equal(instance.runner.stats, runner.stats);
    });
  });

  describe('"suite" event', function () {
    var suiteDepth;
    var runner;
    var suites;
    var oldConsoleLog;
    var loggedText;

    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given number of suites with titles', function () {
      suiteDepth = getRandomInteger(10);
      suites = Array(suiteDepth).fill().map(function (unused, index) {
        return {
          title: 'Suite Title ' + index
        };
      });
    });
    before('given instantiated reporter', function () {
      new StepReporter(runner); // eslint-disable-line no-new
    });

    before('given console.log spy', function () {
      oldConsoleLog = console.log;
      loggedText = [];
      console.log = givenConsoleLogStub(loggedText);
    });
    before('when suite event emitted for all suites', function () {
      var suiteEvents = runner.getEvents('suite');

      suites.forEach(function (suite) {
        suiteEvents.forEach(function (event) {
          event.handler(suite);
        });
      });
    });
    before('restore console.log', function () {
      console.log = oldConsoleLog;
    });

    it('should output indented suite title for each suite', function () {
      var expectedIndentation = '  ';
      var expectedTitle;
      var expectedIndent;

      assert.equal(loggedText.length, suiteDepth);
      for (var index = 0; index < suiteDepth; index += 1) {
        expectedIndent = Array((index + 1)).fill(expectedIndentation).join('');
        expectedTitle = expectedIndent + 'Suite Title ' + index;

        assert.deepEqual(loggedText[index], [expectedTitle]);
      }
    });
  });

  describe('"suite end" event', function () {
    var runner;
    var suiteDepth;
    var oldConsoleLog;
    var suiteEventHandler;
    var loggedText;

    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given instantiated reporter', function () {
      new StepReporter(runner); // eslint-disable-line no-new
    });
    before('given console.log spy', function () {
      oldConsoleLog = console.log;
      loggedText = [];
      console.log = givenConsoleLogStub(loggedText);
    });
    before('given X existing suites on runner', function () {
      var suiteEvent = getLast(runner.getEvents('suite'));

      suiteEventHandler = suiteEvent.handler;
      suiteDepth = 2 + getRandomInteger(8);
      for (var currentDepth = 0; currentDepth < suiteDepth; currentDepth += 1) {
        suiteEventHandler({});
      }
    });

    before('when "suite end" emitted once', function () {
      var suiteEndEvents = runner.getEvents('suite end');

      suiteEndEvents.forEach(function (event) {
        event.handler();
      });
    });
    before('when another suite is added', function () {
      suiteEventHandler({title: 'title'});
    });
    before('restore console.log', function () {
      console.log = oldConsoleLog;
    });

    it('should indent for X suites', function () {
      var lastLoggedOutput = getLast(loggedText);
      var loggedOutputIndentation = lastLoggedOutput[0].split(/\b/)[0];

      assert.equal(lastLoggedOutput.length, 1);
      assert.equal(loggedOutputIndentation.length, 2 * suiteDepth);
    });
  });

  describe('"hook" event', function () {
    var runner;
    var suiteDepth;
    var oldConsoleLog;
    var suiteEventHandler;
    var hookCount;
    var hooks;
    var loggedText;

    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given instantiated reporter', function () {
      new StepReporter(runner); // eslint-disable-line no-new
    });
    before('given console.log spy', function () {
      oldConsoleLog = console.log;
      loggedText = [];
      console.log = givenConsoleLogStub(loggedText);
    });
    before('given X existing suites on runner', function () {
      var suiteEvent = getLast(runner.getEvents('suite'));

      suiteEventHandler = suiteEvent.handler;
      suiteDepth = 2 + getRandomInteger(8);
      for (var currentDepth = 0; currentDepth < suiteDepth; currentDepth += 1) {
        suiteEventHandler({});
      }
    });

    before('when "suite end" emitted', function () {
      var hookEvents = runner.getEvents('hook');

      hookCount = getRandomInteger(10);
      hooks = Array(hookCount).fill().map(function (unused, index) {
        return {
          title: 'Hook ' + index
        };
      });
      hookEvents.forEach(function (event) {
        hooks.forEach(function (hook) {
          event.handler(hook);
        });
      });
    });
    before('restore console.log', function () {
      console.log = oldConsoleLog;
    });

    it('should render hooks with an extra indent', function () {
      var lastLoggedOutput = loggedText.slice(-hookCount);
      var expectedOutput;
      var expectedIndent = Array(suiteDepth + 1).fill('  ').join('');

      for (var currentIndex = 0; currentIndex < hookCount; currentIndex += 1) {
        expectedOutput = [expectedIndent + 'Hook ' + currentIndex];
        assert.deepEqual(lastLoggedOutput[currentIndex], expectedOutput);
      }
    });
  });

  describe('"end" event', function () {
    var runner;
    var oldConsoleLog;
    var loggedText;

    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given instantiated reporter', function () {
      var instance = new StepReporter(runner); // eslint-disable-line no-new
      instance.stats = {duration: 0};
    });
    before('given console.log spy', function () {
      oldConsoleLog = console.log;
      loggedText = [];
      console.log = givenConsoleLogStub(loggedText);
    });

    before('when "end" event emitted', function () {
      var endEvents = runner.getEvents('end');

      endEvents.forEach(function (event) {
        event.handler();
      });
    });

    before('restore console.log', function () {
      console.log = oldConsoleLog;
    });

    it('should output epilogue', function () {
      var epilogueOutput = loggedText.slice(-2);

      assert.deepEqual(epilogueOutput, [
        ['  %d passing (%s)', 0, '0ms'],
        []
      ]);
    });
  });

  describe('"fail" event', function () {
    var oldColor;
    var oldConsoleLog;
    var loggedText;
    var runner;
    var failCallLength;
    var colorCalls;

    before('given color stub', function () {
      oldColor = Base.color;
      colorCalls = [];
      Base.color = function (arg1, arg2) {
        colorCalls.push([arg1, arg2]);

        return 'color: ' + colorCalls.length;
      };
    });
    before('given console.log stub', function () {
      loggedText = [];
      oldConsoleLog = console.log;
      console.log = givenConsoleLogStub(loggedText);
    });
    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given instantiated reporter', function () {
      new StepReporter(runner); // eslint-disable-line no-new
    });
    before('given a suite', function () {
      getLast(runner.getEvents('suite')).handler({});
    });

    before('when "fail" event emitted', function () {
      failCallLength = getRandomInteger(10);

      for (var currentIndex = 0; currentIndex < failCallLength; currentIndex += 1) {
        getLast(runner.getEvents('fail')).handler({
          title: 'test ' + currentIndex
        });
      }
    });
    before('restore color stub', function () {
      Base.color = oldColor;
    });
    before('restore console.log stub', function () {
      console.log = oldConsoleLog;
    });

    it('should render with indent, color, and failure count', function () {
      var loggedStatements = loggedText.slice(-failCallLength);
      var expectedColorArgs = ['fail', '  %d) %s'];

      for (var currentIndex = 0; currentIndex < loggedStatements.length; currentIndex += 1) {
        var currentStatement = loggedStatements[currentIndex];
        var colorStatement = currentStatement[0];
        var failingTestCount = currentStatement[1];
        var testTitle = currentStatement[2];

        assert.equal(colorStatement, '  color: ' + (currentIndex + 1));
        assert.equal(failingTestCount, currentIndex + 1);
        assert.equal(testTitle, 'test ' + currentIndex);

        assert.deepEqual(colorCalls[currentIndex], expectedColorArgs);
      }
    });
  });

  describe('"pass" event', function () {
    var oldColor;
    var colorCalls;
    var oldConsoleLog;
    var loggedText;
    var currentTest;
    var runner;

    before('given color stub', function () {
      oldColor = Base.color;
      colorCalls = [];
      Base.color = function (arg1, arg2) {
        colorCalls.push([arg1, arg2]);

        return 'color: ' + colorCalls.length;
      };
    });
    before('given console.log stub', function () {
      loggedText = [];
      oldConsoleLog = console.log;
      console.log = givenConsoleLogStub(loggedText);
    });
    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given instantiated reporter', function () {
      new StepReporter(runner); // eslint-disable-line no-new
    });
    before('given test', function () {
      currentTest = {
        title: 'test title ' + getRandomInteger(1000),
        duration: getRandomInteger(1000),
        speed: 'other speed'
      };
    });

    before('when "pass" event emitted', function () {
      getLast(runner.getEvents('pass')).handler(currentTest);
    });

    before('restore color stub', function () {
      Base.color = oldColor;
    });
    before('restore console.log stub', function () {
      console.log = oldConsoleLog;
    });

    it('should report status, title, and duration', function () {
      var passDetails = getLast(loggedText);
      var expectedFormatString = [
        'color: 1',
        'color: 2',
        'color: 3'
      ].join('');

      assert.deepEqual(passDetails, [
        expectedFormatString,
        currentTest.title,
        currentTest.duration
      ]);
    });

    it('should build format string using appropriate color() args', function () {
      assert.deepEqual(colorCalls, [
        ['checkmark', '  ' + Base.symbols.ok],
        ['pass', ' %s'],
        ['other speed', ' (%dms)']
      ]);
    });
  });

  describe('"pass" event with fast speed', function () {
    var oldColor;
    var colorCalls;
    var oldConsoleLog;
    var loggedText;
    var currentTest;
    var runner;

    before('given color stub', function () {
      oldColor = Base.color;
      colorCalls = [];
      Base.color = function (arg1, arg2) {
        colorCalls.push([arg1, arg2]);

        return 'color: ' + colorCalls.length;
      };
    });
    before('given console.log stub', function () {
      loggedText = [];
      oldConsoleLog = console.log;
      console.log = givenConsoleLogStub(loggedText);
    });
    before('given runner instance', function () {
      runner = new RunnerStub();
    });
    before('given instantiated reporter', function () {
      new StepReporter(runner); // eslint-disable-line no-new
    });
    before('given "fast" test', function () {
      currentTest = {
        title: 'test title ' + getRandomInteger(1000),
        speed: 'fast'
      };
    });

    before('when "pass" event emitted', function () {
      getLast(runner.getEvents('pass')).handler(currentTest);
    });

    before('restore all stubbed functionality', function () {
      Base.color = oldColor;
      console.log = oldConsoleLog;
    });

    it('should report status, title, and duration', function () {
      var passDetails = getLast(loggedText);
      var expectedFormatString = [
        'color: 1',
        'color: 2'
      ].join('');

      assert.deepEqual(passDetails, [
        expectedFormatString,
        currentTest.title
      ]);
    });
    it('should build format string using appropriate color() args', function () {
      assert.deepEqual(colorCalls, [
        ['checkmark', '  ' + Base.symbols.ok],
        ['pass', ' %s']
      ]);
    });
  });
});
