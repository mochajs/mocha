/* global Mocha */
'use strict';

describe('HTML reporter', function () {
  var Suite = Mocha.Suite;
  var Runner = Mocha.Runner;
  var HTML = Mocha.reporters.HTML;

  function removeMochaElem () {
    var mochaElem = document.getElementById('mocha');
    if (mochaElem) {
      mochaElem.parentNode.removeChild(mochaElem);
    }
  }

  function addMochaElem () {
    var mochaElem = document.createElement('div');
    mochaElem.id = 'mocha';
    document.body.appendChild(mochaElem);
  }

  function sleep (fn, ms) {
    return new Promise((resolve) => {
      setTimeout(function () {
        fn();
        resolve();
      }, ms);
    });
  }

  describe('constructor', function () {
    it('should post error message if #mocha does not exist', function () {
      removeMochaElem();
      var suite = new Suite('Suite', 'root');
      var runner = new Runner(suite);
      // eslint-disable-next-line no-new
      new HTML(runner);
      var message = document.getElementById('mocha-error').textContent;
      expect(message).to.eql('#mocha div missing, add it to your document');
    });

    it('should add #mocha-stats and #mocha-report', function () {
      removeMochaElem();
      addMochaElem();
      var suite = new Suite('Suite', 'root');
      var runner = new Runner(suite);
      // eslint-disable-next-line no-new
      new HTML(runner);
      expect(document.getElementById('mocha-stats')).to.not.eql(null);
      expect(document.getElementById('mocha-report')).to.not.eql(null);
    });
  });

  describe('event', function () {
    var html;
    var runner;

    beforeEach(function () {
      removeMochaElem();
      addMochaElem();
      var suite = new Suite('Suite', 'root');
      runner = new Runner(suite);
      html = new HTML(runner);
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
        return sleep(function () {
          var report = document.getElementById('mocha-report');
          expect(report.innerHTML).to.eql('<li class="suite"><h1><a href="/context.html?grep=fullTitle">title</a></h1><ul></ul></li>');
        }, 50);
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
        return sleep(function () {
          var report = document.getElementById('mocha-report');
          expect(report.innerHTML).to.eql('<li class="test pass fast"><h2>title<span class="duration">100ms</span> <a href="/context.html?grep=fullTitle" class="replay">‣</a></h2><pre style="display: none;"><code>body</code></pre></li>');
          expect(document.querySelector('.passes em').textContent).to.eql('1');
          expect(document.querySelector('.failures em').textContent).to.eql('0');
          expect(document.querySelector('.duration em').textContent).to.not.eql('0');
        }, 50);
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
        return sleep(function () {
          var report = document.getElementById('mocha-report');
          expect(report.innerHTML).to.eql('<li class="test fail"><h2>title <a href="/context.html?grep=fullTitle" class="replay">‣</a></h2><pre class="error">error message</pre><pre style="display: none;"><code>body</code></pre></li>');
          expect(document.querySelector('.passes em').textContent).to.eql('0');
          expect(document.querySelector('.failures em').textContent).to.eql('1');
          expect(document.querySelector('.duration em').textContent).to.not.eql('0');
        }, 50);
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
});
