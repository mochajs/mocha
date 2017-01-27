'use strict';

var reporters = require('../../').reporters;
var Doc = reporters.Doc;

describe('Doc reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner = {};
  beforeEach(function () {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
  });

  describe('on suite', function() {
    describe('if suite root does not exist', function() {
      var expectedTitle = 'expectedTitle';
      var suite = {
        root: false,
        title: expectedTitle
      }
      it('should log html with expected header', function () {
        runner.on = function (event, callback) {
          if (event === 'suite') {
            callback(suite);
          }
        }
        var doc = new Doc(runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '    <section class="suite">\n',
          '      <h1>' + expectedTitle + '</h1>\n',
          '      <dl>\n'
        ];
        stdout.should.deepEqual(expectedArray)
      });
    });
    describe('if suite root does exist', function() {
      var suite = {
        root: true
      }
      it('should not log any html', function () {
        runner.on = function (event, callback) {
          if (event === 'suite') {
            callback(suite);
          }
        }
        var doc = new Doc(runner);
        process.stdout.write = stdoutWrite;
        stdout.should.be.empty();
      });
    });
  });

  describe('on suite end', function() {
    describe('if suite root does not exist', function() {
      var expectedTitle = 'expectedTitle';
      var suite = {
        root: false,
        title: expectedTitle
      }
      it('should log expected html', function () {
        runner.on = function (event, callback) {
          if (event === 'suite end') {
            callback(suite);
          }
        }
        var doc = new Doc(runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '  </dl>\n', '</section>\n'
        ];
        stdout.should.deepEqual(expectedArray)
      });
    });
    describe('if suite root does exist', function() {
      var suite = {
        root: true
      }
      it('should not log any html', function () {
        runner.on = function (event, callback) {
          if (event === 'suite end') {
            callback(suite);
          }
        }
        var doc = new Doc(runner);
        process.stdout.write = stdoutWrite;
        stdout.should.be.empty();
      });
    });
  });

  describe('on pass', function() {
    var expectedTitle = 'some tite';
    var expectedBody = 'some body';
    var test = {
      title: expectedTitle,
      body: expectedBody,
      slow: function () {
        return '';
      }
    }
    it('should log expected html', function () {
      runner.on = function (event, callback) {
        if (event === 'pass') {
          callback(test);
        }
      }
      var doc = new Doc(runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '    <dt>' + expectedTitle + '</dt>\n',
        '    <dd><pre><code>' + expectedBody + '</code></pre></dd>\n'
      ];
      stdout.should.deepEqual(expectedArray)
    });
  });

  describe('on fail', function() {
    var expectedTitle = 'some tite';
    var expectedBody = 'some body';
    var test = {
      title: expectedTitle,
      body: expectedBody,
      slow: function () {
        return '';
      }
    }
    it('should log expected html', function () {
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test);
        }
      }
      var doc = new Doc(runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '    <dt class=\"error\">' + expectedTitle + '</dt>\n',
        '    <dd class=\"error\"><pre><code>' + expectedBody + '</code></pre></dd>\n',
        '    <dd class=\"error\">undefined</dd>\n'
      ];
      stdout.should.deepEqual(expectedArray)
    });
  });
});
