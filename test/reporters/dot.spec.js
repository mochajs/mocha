'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var Base = reporters.Base;
var Dot = reporters.Dot;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;
var EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('Dot reporter', function() {
  var windowWidthStub;
  var runReporter = makeRunReporter(Dot);
  var noop = function() {};

  beforeEach(function() {
    windowWidthStub = sinon.stub(Base.window, 'width').value(0);
    sinon.stub(Base, 'useColors').value(false);
    sinon.stub(Base, 'color').callsFake(function(type, str) {
      return type.replace(/ /g, '-') + '_' + str;
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('event handlers', function() {
    describe("on 'start' event", function() {
      it('should write a newline', function() {
        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var options = {};
        var stdout = runReporter({epilogue: noop}, runner, options);
        sinon.restore();

        var expectedArray = ['\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pending' event", function() {
      describe('when window width is greater than 1', function() {
        beforeEach(function() {
          windowWidthStub.value(2);
        });

        it('should write a newline followed by a comma', function() {
          var runner = createMockRunner('pending', EVENT_TEST_PENDING);
          var options = {};
          var stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          var expectedArray = ['\n  ', 'pending_' + Base.symbols.comma];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when window width is less than or equal to 1', function() {
        it('should write a comma', function() {
          var runner = createMockRunner('pending', EVENT_TEST_PENDING);
          var options = {};
          var stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          var expectedArray = ['pending_' + Base.symbols.comma];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe("on 'pass' event", function() {
      var test = {
        duration: 1,
        slow: function() {
          return 2;
        }
      };

      describe('when window width is greater than 1', function() {
        beforeEach(function() {
          windowWidthStub.value(2);
        });

        describe('when test speed is fast', function() {
          it('should write a newline followed by a dot', function() {
            var runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            var options = {};
            var stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'fast');
            var expectedArray = ['\n  ', 'fast_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });

      describe('when window width is less than or equal to 1', function() {
        describe('when test speed is fast', function() {
          it('should write a grey dot', function() {
            var runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            var options = {};
            var stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'fast');
            var expectedArray = ['fast_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe('when test speed is medium', function() {
          it('should write a yellow dot', function() {
            test.duration = 2;
            var runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            var options = {};
            var stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'medium');
            var expectedArray = ['medium_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe('when test speed is slow', function() {
          it('should write a bright yellow dot', function() {
            test.duration = 3;
            var runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            var options = {};
            var stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'slow');
            var expectedArray = ['bright-yellow_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });
    });

    describe("on 'fail' event", function() {
      var test = {
        test: {
          err: 'some error'
        }
      };

      describe('when window width is greater than 1', function() {
        beforeEach(function() {
          windowWidthStub.value(2);
        });

        it('should write a newline followed by an exclamation mark', function() {
          var runner = createMockRunner(
            'fail',
            EVENT_TEST_FAIL,
            null,
            null,
            test
          );
          var options = {};
          var stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          var expectedArray = ['\n  ', 'fail_' + Base.symbols.bang];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when window width is less than or equal to 1', function() {
        it('should write an exclamation mark', function() {
          var runner = createMockRunner(
            'fail',
            EVENT_TEST_FAIL,
            null,
            null,
            test
          );
          var options = {};
          var stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          var expectedArray = ['fail_' + Base.symbols.bang];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe("on 'end' event", function() {
      it('should call epilogue', function() {
        var runner = createMockRunner('end', EVENT_RUN_END);
        var fakeThis = {
          epilogue: sinon.stub()
        };
        var options = {};
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(fakeThis.epilogue.called, 'to be true');
      });
    });
  });
});
