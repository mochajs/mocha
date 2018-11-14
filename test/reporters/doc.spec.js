'use strict';

var reporters = require('../../').reporters;
var Doc = reporters.Doc;

var createMockRunner = require('./helpers.js').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Doc reporter', function() {
  var runner;
  var options = {};
  var runReporter = makeRunReporter(Doc);

  afterEach(function() {
    runner = undefined;
  });

  describe('on suite', function() {
    describe('if suite root does not exist', function() {
      var expectedTitle = 'expectedTitle';
      var unescapedTitle = '<div>' + expectedTitle + '</div>';
      var suite = {
        root: false,
        title: expectedTitle
      };
      it('should log html with indents and expected title', function() {
        runner = createMockRunner('suite', 'suite', null, null, suite);
        var stdout = runReporter(this, runner, options);
        var expectedArray = [
          '    <section class="suite">\n',
          '      <h1>' + expectedTitle + '</h1>\n',
          '      <dl>\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
      it('should escape title where necessary', function() {
        var suite = {
          root: false,
          title: unescapedTitle
        };
        expectedTitle = '&#x3C;div&#x3E;' + expectedTitle + '&#x3C;/div&#x3E;';
        runner = createMockRunner('suite', 'suite', null, null, suite);
        var stdout = runReporter(this, runner, options);
        var expectedArray = [
          '    <section class="suite">\n',
          '      <h1>' + expectedTitle + '</h1>\n',
          '      <dl>\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if suite root does exist', function() {
      var suite = {
        root: true
      };
      it('should not log any html', function() {
        runner = createMockRunner('suite', 'suite', null, null, suite);
        var stdout = runReporter(this, runner, options);
        expect(stdout, 'to be empty');
      });
    });
  });

  describe('on suite end', function() {
    describe('if suite root does not exist', function() {
      var suite = {
        root: false
      };
      it('should log expected html with indents', function() {
        runner = createMockRunner('suite end', 'suite end', null, null, suite);
        var stdout = runReporter(this, runner, options);
        var expectedArray = ['  </dl>\n', '</section>\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if suite root does exist', function() {
      var suite = {
        root: true
      };
      it('should not log any html', function() {
        runner = createMockRunner('suite end', 'suite end', null, null, suite);
        var stdout = runReporter(this, runner, options);
        expect(stdout, 'to be empty');
      });
    });
  });

  describe('on pass', function() {
    var expectedTitle = 'some tite';
    var expectedBody = 'some body';
    var test = {
      title: expectedTitle,
      body: expectedBody,
      slow: function() {
        return '';
      }
    };
    it('should log html with indents and expected title and body', function() {
      runner = createMockRunner('pass', 'pass', null, null, test);
      var stdout = runReporter(this, runner, options);
      var expectedArray = [
        '    <dt>' + expectedTitle + '</dt>\n',
        '    <dd><pre><code>' + expectedBody + '</code></pre></dd>\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });
    it('should escape title and body where necessary', function() {
      var unescapedTitle = '<div>' + expectedTitle + '</div>';
      var unescapedBody = '<div>' + expectedBody + '</div>';
      test.title = unescapedTitle;
      test.body = unescapedBody;

      var expectedEscapedTitle =
        '&#x3C;div&#x3E;' + expectedTitle + '&#x3C;/div&#x3E;';
      var expectedEscapedBody =
        '&#x3C;div&#x3E;' + expectedBody + '&#x3C;/div&#x3E;';
      runner = createMockRunner('pass', 'pass', null, null, test);
      var stdout = runReporter(this, runner, options);
      var expectedArray = [
        '    <dt>' + expectedEscapedTitle + '</dt>\n',
        '    <dd><pre><code>' + expectedEscapedBody + '</code></pre></dd>\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });
  });

  describe('on fail', function() {
    var expectedTitle = 'some tite';
    var expectedBody = 'some body';
    var expectedError = 'some error';
    var test = {
      title: expectedTitle,
      body: expectedBody,
      slow: function() {
        return '';
      }
    };
    it('should log html with indents and expected title, body and error', function() {
      runner = createMockRunner(
        'fail two args',
        'fail',
        null,
        null,
        test,
        expectedError
      );
      var stdout = runReporter(this, runner, options);
      var expectedArray = [
        '    <dt class="error">' + expectedTitle + '</dt>\n',
        '    <dd class="error"><pre><code>' +
          expectedBody +
          '</code></pre></dd>\n',
        '    <dd class="error">' + expectedError + '</dd>\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });
    it('should escape title, body and error where necessary', function() {
      var unescapedTitle = '<div>' + expectedTitle + '</div>';
      var unescapedBody = '<div>' + expectedBody + '</div>';
      var unescapedError = '<div>' + expectedError + '</div>';
      test.title = unescapedTitle;
      test.body = unescapedBody;

      var expectedEscapedTitle =
        '&#x3C;div&#x3E;' + expectedTitle + '&#x3C;/div&#x3E;';
      var expectedEscapedBody =
        '&#x3C;div&#x3E;' + expectedBody + '&#x3C;/div&#x3E;';
      var expectedEscapedError =
        '&#x3C;div&#x3E;' + expectedError + '&#x3C;/div&#x3E;';
      runner = createMockRunner(
        'fail two args',
        'fail',
        null,
        null,
        test,
        unescapedError
      );
      var stdout = runReporter(this, runner, options);
      var expectedArray = [
        '    <dt class="error">' + expectedEscapedTitle + '</dt>\n',
        '    <dd class="error"><pre><code>' +
          expectedEscapedBody +
          '</code></pre></dd>\n',
        '    <dd class="error">' + expectedEscapedError + '</dd>\n'
      ];
      expect(stdout, 'to equal', expectedArray);
    });
  });
});
