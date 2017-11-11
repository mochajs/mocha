'use strict';

var mocha = require('../../lib/mocha');
var Suite = mocha.Suite;
var Runner = mocha.Runner;
var reporters = require('../../').reporters;
var HTML = reporters.HTML;
var jsdom = require('jsdom').jsdom;

describe('HTML reporter', function () {
  var doc;
  var html;
  var runner;

  beforeEach(function () {
    doc = jsdom('<!DOCTYPE html><html><body><div id="mocha"></div></body></html>');
    global.window = doc.defaultView;
    global.document = doc.defaultView.document;
    window.HTMLCanvasElement.prototype.getContext = function () {
      return {
        scale: function () {}
      };
    };
    var suite = new Suite('Suite', 'root');
    runner = new Runner(suite);
    html = new HTML(runner);
  });

  describe('constructor', function () {
    it('should post error message if #mocha does not exist', function () {
      doc = jsdom('<!DOCTYPE html><html><body></body></html>');
      global.window = doc.defaultView;
      global.document = doc.defaultView.document;
      window.HTMLCanvasElement.prototype.getContext = function () {
        return {
          scale: function () {}
        };
      };
      var suite = new Suite('Suite', 'root');
      runner = new Runner(suite);
      html = new HTML(runner);
      var message = document.getElementById('mocha-error').textContent;
      expect(message).to.eql('#mocha div missing, add it to your document');
    });

    it('should add #mocha-stats and #mocha-report', function () {
      expect(document.getElementById('mocha-stats')).to.not.eql(null);
      expect(document.getElementById('mocha-report')).to.not.eql(null);
    });
  });

  describe('on suite', function () {
    it('should do nothing if suite.root is true', function () {
      runner.emit('suite', {root: true});
      var report = document.getElementById('mocha-report');
      expect(report.innerHTML).to.eql('');
    });

    it('should add elements for suite if suite.root is false', function () {
      var suite = {
        root: false,
        title: 'title',
        fullTitle: function () {
          return 'fullTitle';
        }
      };
      runner.emit('suite', suite);
      var report = document.getElementById('mocha-report');
      expect(report.innerHTML).to.eql('<li class="suite"><h1><a href="blank?grep=fullTitle">title</a></h1><ul></ul></li>');
    });
  });

  describe('on suite end', function () {
    it('should update #mocha-stats if suite.root is true', function () {
      html.stats.passes = 1;
      html.stats.failures = 2;
      runner.emit('suite end', {root: true});
      expect(document.querySelector('.passes em').textContent).to.eql('1');
      expect(document.querySelector('.failures em').textContent).to.eql('2');
      expect(document.querySelector('.duration em').textContent).to.not.eql('0');
    });
  });

  describe('on pass', function () {
    it('should add elements for pass and update #mocha-stats', function () {
      var test = {
        speed: 'fast',
        title: 'title',
        fullTitle: function () {
          return 'fullTitle';
        },
        duration: 100,
        body: 'body',
        slow: function () {}
      };
      runner.emit('pass', test);
      var report = document.getElementById('mocha-report');
      expect(report.innerHTML).to.eql('<li class="test pass fast"><h2>title<span class="duration">100ms</span> <a href="blank?grep=fullTitle" class="replay">‣</a></h2><pre style="display: none;"><code>body</code></pre></li>');
      expect(document.querySelector('.passes em').textContent).to.eql('1');
      expect(document.querySelector('.failures em').textContent).to.eql('0');
      expect(document.querySelector('.duration em').textContent).to.not.eql('0');
    });
  });

  describe('on fail', function () {
    it('should add elements for fail and update #mocha-stats', function () {
      var test = {
        title: 'title',
        fullTitle: function () {
          return 'fullTitle';
        },
        duration: 100,
        body: 'body'
      };
      var err = {
        toString: function () {
          return 'error message';
        }
      };
      runner.emit('fail', test, err);
      var report = document.getElementById('mocha-report');
      expect(report.innerHTML).to.eql('<li class="test fail"><h2>title <a href="blank?grep=fullTitle" class="replay">‣</a></h2><pre class="error">error message</pre><pre style="display: none;"><code>body</code></pre></li>');
      expect(document.querySelector('.passes em').textContent).to.eql('0');
      expect(document.querySelector('.failures em').textContent).to.eql('1');
      expect(document.querySelector('.duration em').textContent).to.not.eql('0');
    });
  });

  describe('on pending', function () {
    it('should add elements for pending', function () {
      runner.emit('pending', {title: 'title'});
      var report = document.getElementById('mocha-report');
      expect(report.innerHTML).to.eql('<li class="test pass pending"><h2>title</h2></li>');
    });
  });
});
