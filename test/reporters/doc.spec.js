'use strict';

const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Doc = reporters.Doc;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_SUITE_BEGIN = events.EVENT_SUITE_BEGIN;
const EVENT_SUITE_END = events.EVENT_SUITE_END;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;

describe('Doc reporter', function () {
  let runner;
  const options = {};
  const runReporter = makeRunReporter(Doc);

  afterEach(function () {
    runner = null;
  });

  describe('event handlers', function () {
    describe("on 'suite' event", function () {
      describe('when suite root does not exist', function () {
        let expectedTitle = 'expectedTitle';
        const unescapedTitle = '<div>' + expectedTitle + '</div>';
        const suite = {
          root: false,
          title: expectedTitle
        };

        it('should log html with indents and expected title', function () {
          runner = createMockRunner(
            'suite',
            EVENT_SUITE_BEGIN,
            null,
            null,
            suite
          );
          const stdout = runReporter(this, runner, options);
          const expectedArray = [
            '    <section class="suite">\n',
            '      <h1>' + expectedTitle + '</h1>\n',
            '      <dl>\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });

        it('should escape title where necessary', function () {
          const suite = {
            root: false,
            title: unescapedTitle
          };
          expectedTitle =
            '&#x3C;div&#x3E;' + expectedTitle + '&#x3C;/div&#x3E;';

          runner = createMockRunner(
            'suite',
            EVENT_SUITE_BEGIN,
            null,
            null,
            suite
          );
          const stdout = runReporter(this, runner, options);
          const expectedArray = [
            '    <section class="suite">\n',
            '      <h1>' + expectedTitle + '</h1>\n',
            '      <dl>\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when suite root exists', function () {
        const suite = {
          root: true
        };

        it('should not log any html', function () {
          runner = createMockRunner(
            'suite',
            EVENT_SUITE_BEGIN,
            null,
            null,
            suite
          );
          const stdout = runReporter(this, runner, options);
          expect(stdout, 'to be empty');
        });
      });
    });

    describe("on 'suite end' event", function () {
      describe('when suite root does not exist', function () {
        const suite = {
          root: false
        };

        it('should log expected html with indents', function () {
          runner = createMockRunner(
            'suite end',
            EVENT_SUITE_END,
            null,
            null,
            suite
          );
          const stdout = runReporter(this, runner, options);
          const expectedArray = ['  </dl>\n', '</section>\n'];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when suite root exists', function () {
        const suite = {
          root: true
        };

        it('should not log any html', function () {
          runner = createMockRunner(
            'suite end',
            EVENT_SUITE_END,
            null,
            null,
            suite
          );
          const stdout = runReporter(this, runner, options);
          expect(stdout, 'to be empty');
        });
      });
    });

    describe("on 'pass' event", function () {
      const expectedTitle = 'some tite';
      const expectedFile = 'testFile.spec.js';
      const expectedBody = 'some body';
      const test = {
        title: expectedTitle,
        file: expectedFile,
        body: expectedBody,
        slow: function () {
          return '';
        }
      };

      it('should log html with indents, expected title, and body', function () {
        runner = createMockRunner('pass', EVENT_TEST_PASS, null, null, test);
        const stdout = runReporter(this, runner, options);
        const expectedArray = [
          '    <dt>' + expectedTitle + '</dt>\n',
          '    <dt>' + expectedFile + '</dt>\n',
          '    <dd><pre><code>' + expectedBody + '</code></pre></dd>\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });

      it('should escape title and body where necessary', function () {
        const unescapedTitle = '<div>' + expectedTitle + '</div>';
        const unescapedFile = '<div>' + expectedFile + '</div>';
        const unescapedBody = '<div>' + expectedBody + '</div>';
        test.title = unescapedTitle;
        test.file = unescapedFile;
        test.body = unescapedBody;

        const expectedEscapedTitle =
          '&#x3C;div&#x3E;' + expectedTitle + '&#x3C;/div&#x3E;';
        const expectedEscapedFile =
          '&#x3C;div&#x3E;' + expectedFile + '&#x3C;/div&#x3E;';
        const expectedEscapedBody =
          '&#x3C;div&#x3E;' + expectedBody + '&#x3C;/div&#x3E;';
        runner = createMockRunner('pass', EVENT_TEST_PASS, null, null, test);
        const stdout = runReporter(this, runner, options);
        const expectedArray = [
          '    <dt>' + expectedEscapedTitle + '</dt>\n',
          '    <dt>' + expectedEscapedFile + '</dt>\n',
          '    <dd><pre><code>' + expectedEscapedBody + '</code></pre></dd>\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'fail' event", function () {
      const expectedTitle = 'some tite';
      const expectedFile = 'testFile.spec.js';
      const expectedBody = 'some body';
      const expectedError = 'some error';
      const test = {
        title: expectedTitle,
        file: expectedFile,
        body: expectedBody,
        slow: function () {
          return '';
        }
      };

      it('should log html with indents, expected title, body, and error', function () {
        runner = createMockRunner(
          'fail two args',
          EVENT_TEST_FAIL,
          null,
          null,
          test,
          expectedError
        );
        const stdout = runReporter(this, runner, options);
        const expectedArray = [
          '    <dt class="error">' + expectedTitle + '</dt>\n',
          '    <dt class="error">' + expectedFile + '</dt>\n',
          '    <dd class="error"><pre><code>' +
            expectedBody +
            '</code></pre></dd>\n',
          '    <dd class="error">' + expectedError + '</dd>\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });

      it('should escape title, body, and error where necessary', function () {
        const unescapedTitle = '<div>' + expectedTitle + '</div>';
        const unescapedFile = '<div>' + expectedFile + '</div>';
        const unescapedBody = '<div>' + expectedBody + '</div>';
        const unescapedError = '<div>' + expectedError + '</div>';
        test.title = unescapedTitle;
        test.file = unescapedFile;
        test.body = unescapedBody;

        const expectedEscapedTitle =
          '&#x3C;div&#x3E;' + expectedTitle + '&#x3C;/div&#x3E;';
        const expectedEscapedFile =
          '&#x3C;div&#x3E;' + expectedFile + '&#x3C;/div&#x3E;';
        const expectedEscapedBody =
          '&#x3C;div&#x3E;' + expectedBody + '&#x3C;/div&#x3E;';
        const expectedEscapedError =
          '&#x3C;div&#x3E;' + expectedError + '&#x3C;/div&#x3E;';
        runner = createMockRunner(
          'fail two args',
          EVENT_TEST_FAIL,
          null,
          null,
          test,
          unescapedError
        );
        const stdout = runReporter(this, runner, options);
        const expectedArray = [
          '    <dt class="error">' + expectedEscapedTitle + '</dt>\n',
          '    <dt class="error">' + expectedEscapedFile + '</dt>\n',
          '    <dd class="error"><pre><code>' +
            expectedEscapedBody +
            '</code></pre></dd>\n',
          '    <dd class="error">' + expectedEscapedError + '</dd>\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
  });
});
