'use strict';

var HTML = require('../../lib/reporters/html');

var Suite = require('../../lib/suite');
var Context = require('../../lib/context');
var Test = require('../../lib/test');

describe('HTML reporter', function () {
  this.slow(250);

  var realOutput;
  var realOutputStats;
  var realOutputReport;

  function saveRealOutput () {
    if (!realOutput) {
      realOutput = document.getElementById('mocha');
      realOutputStats = document.getElementById('mocha-stats');
      realOutputReport = document.getElementById('mocha-report');
    }
  }

  function removeRealOutput () {
    saveRealOutput();
    if (realOutput) {
      realOutput.id = null;
      realOutputStats.id = null;
      realOutputReport.id = null;
    }
  }

  function stubOutput () {
    removeRealOutput();
    var tmp = document.createElement('div');
    tmp.id = 'mocha';
    document.body.appendChild(tmp);
    return tmp;
  }

  function restoreOutput () {
    var tmp = document.getElementById('mocha');
    if (tmp && tmp !== realOutput) { tmp.parentNode.removeChild(tmp); }
    if (realOutput) {
      realOutput.id = 'mocha';
      realOutputStats.id = 'mocha-stats';
      realOutputReport.id = 'mocha-report';
    }
    return tmp !== realOutput ? tmp : undefined;
  }

  before(saveRealOutput); // so that the following afterEach is guaranteed to work

  afterEach(function () { restoreOutput(); }); // WARNING: this is solely a fallback so *further* tests can be guaranteed to report correctly; these tests will not be reported correctly unless `restoreOutput` is called at the end of the test, before throwing any errors

  it('should show an error if the tag is missing', function () {
    try {
      // TODO: Figure out why it's ok to add an element to display this error but not ok to just add the missing element in the first place.
      removeRealOutput();
      new HTML(new Runner()); // eslint-disable-line no-new
      var error = document.getElementById('mocha-error');
      expect(error).not.to.be(null);
      expect(error).not.to.be(undefined);
      error.parentNode.removeChild(error);
      expect(error.outerHTML).to.equal('<div id="mocha-error">#mocha div missing, add it to your document</div>');
      restoreOutput();
    } catch (error) {
      try {
        restoreOutput();
      } catch (ignore) {}
      throw error;
    }
  });

  it('should output to the "mocha" div', function () {
    try {
      stubOutput();
      var runner = new Runner(7);
      new HTML(runner); // eslint-disable-line no-new
      var rootSuite = new Suite('', new Context());
      var mainSuite = Suite.create(rootSuite, 'suite');
      mainSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
      mainSuite.addTest(new Test('pending'));
      mainSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
      mainSuite.addTest(new Test('slow', function (done) { setTimeout(done, 100); }));
      mainSuite.addTest(new Test('less slow', function (done) { setTimeout(done, 50); }));
      var failingTest = function () {
        var AssertionError = function (message, actual, expected) {
          this.message = message;
          this.actual = actual;
          this.expected = expected;
          this.showDiff = true;
        };
        AssertionError.prototype = Object.create(Error.prototype);
        AssertionError.prototype.name = 'AssertionError';
        AssertionError.prototype.constructor = AssertionError;
        throw new AssertionError('example', 'text with a typo', 'text without a typo');
      };
      mainSuite.addTest(new Test('failing', failingTest));
      mainSuite.addTest(new Test('timeout', function (done) { /* does not complete */; })); // eslint-disable-line no-extra-semi
      runner.emit('start');
      runner.emit('suite', rootSuite);
      runner.emit('suite', mainSuite);
      runner.emit('test', mainSuite.tests[0]);
      mainSuite.tests[0].duration = 0;
      mainSuite.tests[0].state = 'passed';
      runner.emit('pass', mainSuite.tests[0]);
      runner.emit('test end', mainSuite.tests[0]);
      // no 'test' event is emitted for pending tests
      runner.emit('pending', mainSuite.tests[1]);
      runner.emit('test end', mainSuite.tests[1]);
      runner.emit('test', mainSuite.tests[2]);
      mainSuite.tests[2].pending = true;
      mainSuite.tests[2].duration = 0;
      runner.emit('pending', mainSuite.tests[2]);
      runner.emit('test end', mainSuite.tests[2]);
      runner.emit('test', mainSuite.tests[3]);
      mainSuite.tests[3].timer = { '0': null };
      mainSuite.tests[3].duration = 116;
      mainSuite.tests[3].state = 'passed';
      runner.emit('pass', mainSuite.tests[3]);
      runner.emit('test end', mainSuite.tests[3]);
      runner.emit('test', mainSuite.tests[4]);
      mainSuite.tests[4].timer = { '0': null };
      mainSuite.tests[4].duration = 63;
      mainSuite.tests[4].state = 'passed';
      runner.emit('pass', mainSuite.tests[4]);
      runner.emit('test end', mainSuite.tests[4]);
      runner.emit('test', mainSuite.tests[5]);
      mainSuite.tests[5].duration = 0;
      mainSuite.tests[5].state = 'failed';
      try {
        failingTest();
        throw new Error('Failing test did not throw assertion');
      } catch (assertion) {
        runner.emit('fail', mainSuite.tests[5], assertion);
      }
      runner.emit('test end', mainSuite.tests[5]);
      runner.emit('test', mainSuite.tests[6]);
      mainSuite.tests[6].timer = { '0': null };
      mainSuite.tests[6].duration = 211;
      mainSuite.tests[6].state = 'failed';
      runner.emit('fail', mainSuite.tests[6], new Error('Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.'));
      runner.emit('test end', mainSuite.tests[6]);
      runner.emit('suite end', mainSuite);
      runner.emit('suite end', rootSuite);
      runner.emit('end');
      var output = restoreOutput().outerHTML
        .replace(/\u2023/g, '&#x2023;')
        .replace(/(<li class="duration">duration: <em>)[0-9]+(?:[.][0-9]+)?(<\/em>s<\/li>)/, '$1$2')
        .replace(/href="[^"?]*[?]/g, 'href="?')
        .replace(/class="replay" (href="[^"]*")/g, '$1 class="replay"')
        .replace(/style="display:\s*none;?\s*"/g, 'style="display: none;"')
        .replace(/\s+style=""/g, '')
        .replace(/(height="[^"]*")(\s+)(width="[^"]*")/g, '$3$2$1')
        .replace(/<pre class="error">AssertionError: example[^<]*<\/pre>/g, '<pre class="error">AssertionError: example\nat STACKTRACE</pre>')
        .replace(/<pre class="error">Error: Timeout of 200ms exceeded[.] For async tests and hooks, ensure "done[(][)]" is called; if returning a Promise, ensure it resolves[.][^<]*<\/pre>/g, '<pre class="error">Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.\nat STACKTRACE</pre>')
        .replace(/\r\n/g, '\n');
      expect(output).to.equal('<div id="mocha"><ul id="mocha-stats"><li class="progress"><canvas width="40" height="40"></canvas></li><li class="passes"><a href="javascript:void(0);">passes:</a> <em>3</em></li><li class="failures"><a href="javascript:void(0);">failures:</a> <em>2</em></li><li class="duration">duration: <em></em>s</li></ul><ul id="mocha-report"><li class="suite"><h1><a href="?grep=suite">suite</a></h1><ul><li class="test pass fast"><h2>passing<span class="duration">0ms</span> <a href="?grep=suite%20passing" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>/* content here */;</code></pre></li><li class="test pass pending"><h2>pending</h2></li><li class="test pass pending"><h2>skipped at runtime</h2></li><li class="test pass slow"><h2>slow<span class="duration">116ms</span> <a href="?grep=suite%20slow" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>setTimeout(done, 100);</code></pre></li><li class="test pass medium"><h2>less slow<span class="duration">63ms</span> <a href="?grep=suite%20less%20slow" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>setTimeout(done, 50);</code></pre></li><li class="test fail"><h2>failing <a href="?grep=suite%20failing" class="replay">&#x2023;</a></h2><pre class="error">AssertionError: example\nat STACKTRACE</pre><pre style="display: none;"><code>var AssertionError = function (message, actual, expected) {\n  this.message = message;\n  this.actual = actual;\n  this.expected = expected;\n  this.showDiff = true;\n};\nAssertionError.prototype = Object.create(Error.prototype);\nAssertionError.prototype.name = \'AssertionError\';\nAssertionError.prototype.constructor = AssertionError;\nthrow new AssertionError(\'example\', \'text with a typo\', \'text without a typo\');</code></pre></li><li class="test fail"><h2>timeout <a href="?grep=suite%20timeout" class="replay">&#x2023;</a></h2><pre class="error">Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.\nat STACKTRACE</pre><pre style="display: none;"><code>/* does not complete */;</code></pre></li></ul></li></ul></div>');
    } catch (error) {
      try {
        restoreOutput();
      } catch (ignore) {}
      throw error;
    }
  });

  it('should correctly output multiple adjacent nested suites', function () {
    try {
      stubOutput();
      var runner = new Runner(4);
      new HTML(runner); // eslint-disable-line no-new
      var rootSuite = new Suite('', new Context());
      Suite.create(rootSuite, 'outer suite 1');
      Suite.create(rootSuite.suites[0], 'inner suite 1');
      rootSuite.suites[0].suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
      Suite.create(rootSuite.suites[0], 'inner suite 2');
      rootSuite.suites[0].suites[1].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
      Suite.create(rootSuite, 'outer suite 2');
      Suite.create(rootSuite.suites[1], 'inner suite 1');
      rootSuite.suites[1].suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
      Suite.create(rootSuite.suites[1], 'inner suite 2');
      rootSuite.suites[1].suites[1].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
      runner.emit('start');
      runner.emit('suite', rootSuite);
      runner.emit('suite', rootSuite.suites[0]);
      runner.emit('suite', rootSuite.suites[0].suites[0]);
      runner.emit('test', rootSuite.suites[0].suites[0].tests[0]);
      rootSuite.suites[0].suites[0].tests[0].duration = 0;
      rootSuite.suites[0].suites[0].tests[0].state = 'passed';
      runner.emit('pass', rootSuite.suites[0].suites[0].tests[0]);
      runner.emit('test end', rootSuite.suites[0].suites[0].tests[0]);
      runner.emit('suite end', rootSuite.suites[0].suites[0]);
      runner.emit('suite', rootSuite.suites[0].suites[1]);
      runner.emit('test', rootSuite.suites[0].suites[1].tests[0]);
      rootSuite.suites[0].suites[1].tests[0].duration = 0;
      rootSuite.suites[0].suites[1].tests[0].state = 'passed';
      runner.emit('pass', rootSuite.suites[0].suites[1].tests[0]);
      runner.emit('test end', rootSuite.suites[0].suites[1].tests[0]);
      runner.emit('suite end', rootSuite.suites[0].suites[1]);
      runner.emit('suite end', rootSuite.suites[0]);
      runner.emit('suite', rootSuite.suites[1]);
      runner.emit('suite', rootSuite.suites[1].suites[0]);
      runner.emit('test', rootSuite.suites[1].suites[0].tests[0]);
      rootSuite.suites[1].suites[0].tests[0].duration = 0;
      rootSuite.suites[1].suites[0].tests[0].state = 'passed';
      runner.emit('pass', rootSuite.suites[1].suites[0].tests[0]);
      runner.emit('test end', rootSuite.suites[1].suites[0].tests[0]);
      runner.emit('suite end', rootSuite.suites[1].suites[0]);
      runner.emit('suite', rootSuite.suites[1].suites[1]);
      runner.emit('test', rootSuite.suites[1].suites[1].tests[0]);
      rootSuite.suites[1].suites[1].tests[0].duration = 0;
      rootSuite.suites[1].suites[1].tests[0].state = 'passed';
      runner.emit('pass', rootSuite.suites[1].suites[1].tests[0]);
      runner.emit('test end', rootSuite.suites[1].suites[1].tests[0]);
      runner.emit('suite end', rootSuite.suites[1].suites[1]);
      runner.emit('suite end', rootSuite.suites[1]);
      runner.emit('suite end', rootSuite);
      runner.emit('end');
      var output = restoreOutput().outerHTML
        .replace(/\u2023/g, '&#x2023;')
        .replace(/(<li class="duration">duration: <em>)[0-9]+(?:[.][0-9]+)?(<\/em>s<\/li>)/, '$1$2')
        .replace(/href="[^"?]*[?]/g, 'href="?')
        .replace(/class="replay" (href="[^"]*")/g, '$1 class="replay"')
        .replace(/style="display:\s*none;?\s*"/g, 'style="display: none;"')
        .replace(/\s+style=""/g, '')
        .replace(/(height="[^"]*")(\s+)(width="[^"]*")/g, '$3$2$1')
        .replace(/<pre class="error">AssertionError: example[^<]*<\/pre>/g, '<pre class="error">AssertionError: example\nat STACKTRACE</pre>')
        .replace(/<pre class="error">Error: Timeout of 200ms exceeded[.] For async tests and hooks, ensure "done[(][)]" is called; if returning a Promise, ensure it resolves[.][^<]*<\/pre>/g, '<pre class="error">Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.\nat STACKTRACE</pre>')
        .replace(/\r\n/g, '\n');
      expect(output).to.equal('<div id="mocha"><ul id="mocha-stats"><li class="progress"><canvas width="40" height="40"></canvas></li><li class="passes"><a href="javascript:void(0);">passes:</a> <em>4</em></li><li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li><li class="duration">duration: <em></em>s</li></ul><ul id="mocha-report"><li class="suite"><h1><a href="?grep=outer%20suite%201">outer suite 1</a></h1><ul><li class="suite"><h1><a href="?grep=outer%20suite%201%20inner%20suite%201">inner suite 1</a></h1><ul><li class="test pass fast"><h2>passing<span class="duration">0ms</span> <a href="?grep=outer%20suite%201%20inner%20suite%201%20passing" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>/* content here */;</code></pre></li></ul></li><li class="suite"><h1><a href="?grep=outer%20suite%201%20inner%20suite%202">inner suite 2</a></h1><ul><li class="test pass fast"><h2>passing<span class="duration">0ms</span> <a href="?grep=outer%20suite%201%20inner%20suite%202%20passing" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>/* content here */;</code></pre></li></ul></li></ul></li><li class="suite"><h1><a href="?grep=outer%20suite%202">outer suite 2</a></h1><ul><li class="suite"><h1><a href="?grep=outer%20suite%202%20inner%20suite%201">inner suite 1</a></h1><ul><li class="test pass fast"><h2>passing<span class="duration">0ms</span> <a href="?grep=outer%20suite%202%20inner%20suite%201%20passing" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>/* content here */;</code></pre></li></ul></li><li class="suite"><h1><a href="?grep=outer%20suite%202%20inner%20suite%202">inner suite 2</a></h1><ul><li class="test pass fast"><h2>passing<span class="duration">0ms</span> <a href="?grep=outer%20suite%202%20inner%20suite%202%20passing" class="replay">&#x2023;</a></h2><pre style="display: none;"><code>/* content here */;</code></pre></li></ul></li></ul></li></ul></div>');
    } catch (error) {
      try {
        restoreOutput();
      } catch (ignore) {}
      throw error;
    }
  });

  it('should output sanely when there are no tests', function () {
    try {
      stubOutput();
      var runner = new Runner(0);
      new HTML(runner); // eslint-disable-line no-new
      var rootSuite = new Suite('', new Context());
      runner.emit('start');
      runner.emit('suite', rootSuite);
      runner.emit('suite end', rootSuite);
      runner.emit('end');
      var output = restoreOutput().outerHTML
        .replace(/\u2023/g, '&#x2023;')
        .replace(/(<li class="duration">duration: <em>)[0-9]+(?:[.][0-9]+)?(<\/em>s<\/li>)/, '$1$2')
        .replace(/href="[^"?]*[?]/g, 'href="?')
        .replace(/class="replay" (href="[^"]*")/g, '$1 class="replay"')
        .replace(/style="display:\s*none;?\s*"/g, 'style="display: none;"')
        .replace(/\s+style=""/g, '')
        .replace(/(height="[^"]*")(\s+)(width="[^"]*")/g, '$3$2$1')
        .replace(/<pre class="error">AssertionError: example[^<]*<\/pre>/g, '<pre class="error">AssertionError: example\nat STACKTRACE</pre>')
        .replace(/<pre class="error">Error: Timeout of 200ms exceeded[.] For async tests and hooks, ensure "done[(][)]" is called; if returning a Promise, ensure it resolves[.][^<]*<\/pre>/g, '<pre class="error">Error: Timeout of 200ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.\nat STACKTRACE</pre>')
        .replace(/\r\n/g, '\n');
      expect(output).to.equal('<div id="mocha"><ul id="mocha-stats"><li class="progress"><canvas width="40" height="40"></canvas></li><li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li><li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li><li class="duration">duration: <em></em>s</li></ul><ul id="mocha-report"></ul></div>');
    } catch (error) {
      try {
        restoreOutput();
      } catch (ignore) {}
      throw error;
    }
  });

  // this is mostly to validate the reliability of the other tests, rather than because the reporter is actually meant to run multiple instances; after all, it depends on the current global document.getElementById('mocha')
  describe('multiple instances', function () {
    it('should print only to the current instance', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        var initialStates = [
          rootSuite.tests[0].state,
          rootSuite.tests[1].pending,
          rootSuite.tests[2].pending,
          rootSuite.tests[3].state
        ];
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        var assertion;
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (caughtAssertion) {
          assertion = caughtAssertion;
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var originalHTML = output.outerHTML;
        restoreOutput();
        var other = stubOutput();
        runner = new Runner(0);
        new HTML(runner); // eslint-disable-line no-new
        rootSuite.tests[0].state = initialStates[0];
        rootSuite.tests[1].pending = initialStates[1];
        rootSuite.tests[2].pending = initialStates[2];
        rootSuite.tests[3].state = initialStates[3];
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 1;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 1;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 1;
        rootSuite.tests[3].state = 'failed';
        runner.emit('fail', rootSuite.tests[3], assertion);
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        expect(output.outerHTML).to.be(originalHTML);
        expect(output.outerHTML).not.to.equal(other.outerHTML);
        expect(output.outerHTML
            .replace(/(<li class="duration">duration: <em>)[0-9]+(?:[.][0-9]+)?(<\/em>s<\/li>)/, '$1$2'))
          .to.equal(other.outerHTML.replace(/1ms/g, '0ms')
            .replace(/(<li class="duration">duration: <em>)[0-9]+(?:[.][0-9]+)?(<\/em>s<\/li>)/, '$1$2'));
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should not affect other instances when the passes filter is clicked', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var originalHTML = output.outerHTML;
        restoreOutput();
        var other = stubOutput();
        runner = new Runner(0);
        new HTML(runner); // eslint-disable-line no-new
        rootSuite = new Suite('', new Context());
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(other.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        expect(output.outerHTML).to.be(originalHTML);
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should not affect other instances when the failures filter is clicked', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var originalHTML = output.outerHTML;
        restoreOutput();
        var other = stubOutput();
        runner = new Runner(0);
        new HTML(runner); // eslint-disable-line no-new
        rootSuite = new Suite('', new Context());
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(other.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        expect(output.outerHTML).to.be(originalHTML);
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });
  });

  describe('passes filter', function () {
    it('should still show passed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        var tests = output.getElementsByClassName('test');
        for (var index = 0; index < tests.length; index += 1) {
          if (/\bpass\b/.test(tests[index].className)) {
            assertDisplayed(tests[index]);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should hide all non-passed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        var tests = output.getElementsByClassName('test');
        for (var index = 0; index < tests.length; index += 1) {
          if (!/\bpass\b/.test(tests[index].className)) {
            assertDisplayed(tests[index], false);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should hide suites with only non-passed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        Suite.create(rootSuite, 'passing');
        rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        Suite.create(rootSuite, 'pending');
        rootSuite.suites[1].addTest(new Test('pending'));
        rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
        Suite.create(rootSuite, 'failing');
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.suites[2].addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', rootSuite.suites[0]);
        runner.emit('test', rootSuite.suites[0].tests[0]);
        rootSuite.suites[0].tests[0].duration = 0;
        rootSuite.suites[0].tests[0].state = 'passed';
        runner.emit('pass', rootSuite.suites[0].tests[0]);
        runner.emit('test end', rootSuite.suites[0].tests[0]);
        runner.emit('suite end', rootSuite.suites[0]);
        runner.emit('suite', rootSuite.suites[1]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.suites[1].tests[0]);
        runner.emit('test end', rootSuite.suites[1].tests[0]);
        runner.emit('test', rootSuite.suites[1].tests[1]);
        rootSuite.suites[1].tests[1].pending = true;
        rootSuite.suites[1].tests[1].duration = 0;
        runner.emit('pending', rootSuite.suites[1].tests[1]);
        runner.emit('test end', rootSuite.suites[1].tests[1]);
        runner.emit('suite end', rootSuite.suites[1]);
        runner.emit('suite', rootSuite.suites[2]);
        runner.emit('test', rootSuite.suites[2].tests[0]);
        rootSuite.suites[2].tests[0].duration = 0;
        rootSuite.suites[2].tests[0].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
        }
        runner.emit('test end', rootSuite.suites[2].tests[0]);
        runner.emit('suite end', rootSuite.suites[2]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        var suites = output.getElementsByClassName('suite');
        for (var index = 0; index < suites.length; index += 1) {
          if (!suites[index].getElementsByClassName('test pass').length) {
            assertDisplayed(suites[index], false);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should not hide suites with passed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        Suite.create(rootSuite, 'passing');
        rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        Suite.create(rootSuite, 'pending');
        rootSuite.suites[1].addTest(new Test('pending'));
        rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
        Suite.create(rootSuite, 'failing');
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.suites[2].addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', rootSuite.suites[0]);
        runner.emit('test', rootSuite.suites[0].tests[0]);
        rootSuite.suites[0].tests[0].duration = 0;
        rootSuite.suites[0].tests[0].state = 'passed';
        runner.emit('pass', rootSuite.suites[0].tests[0]);
        runner.emit('test end', rootSuite.suites[0].tests[0]);
        runner.emit('suite end', rootSuite.suites[0]);
        runner.emit('suite', rootSuite.suites[1]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.suites[1].tests[0]);
        runner.emit('test end', rootSuite.suites[1].tests[0]);
        runner.emit('test', rootSuite.suites[1].tests[1]);
        rootSuite.suites[1].tests[1].pending = true;
        rootSuite.suites[1].tests[1].duration = 0;
        runner.emit('pending', rootSuite.suites[1].tests[1]);
        runner.emit('test end', rootSuite.suites[1].tests[1]);
        runner.emit('suite end', rootSuite.suites[1]);
        runner.emit('suite', rootSuite.suites[2]);
        runner.emit('test', rootSuite.suites[2].tests[0]);
        rootSuite.suites[2].tests[0].duration = 0;
        rootSuite.suites[2].tests[0].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
        }
        runner.emit('test end', rootSuite.suites[2].tests[0]);
        runner.emit('suite end', rootSuite.suites[2]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        var suites = output.getElementsByClassName('suite');
        for (var index = 0; index < suites.length; index += 1) {
          if (suites[index].getElementsByClassName('test pass').length > 0) {
            assertDisplayed(suites[index]);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should unhide all tests and suites when clicked again', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        Suite.create(rootSuite, 'passing');
        rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        Suite.create(rootSuite, 'pending');
        rootSuite.suites[1].addTest(new Test('pending'));
        rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
        Suite.create(rootSuite, 'failing');
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.suites[2].addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', rootSuite.suites[0]);
        runner.emit('test', rootSuite.suites[0].tests[0]);
        rootSuite.suites[0].tests[0].duration = 0;
        rootSuite.suites[0].tests[0].state = 'passed';
        runner.emit('pass', rootSuite.suites[0].tests[0]);
        runner.emit('test end', rootSuite.suites[0].tests[0]);
        runner.emit('suite end', rootSuite.suites[0]);
        runner.emit('suite', rootSuite.suites[1]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.suites[1].tests[0]);
        runner.emit('test end', rootSuite.suites[1].tests[0]);
        runner.emit('test', rootSuite.suites[1].tests[1]);
        rootSuite.suites[1].tests[1].pending = true;
        rootSuite.suites[1].tests[1].duration = 0;
        runner.emit('pending', rootSuite.suites[1].tests[1]);
        runner.emit('test end', rootSuite.suites[1].tests[1]);
        runner.emit('suite end', rootSuite.suites[1]);
        runner.emit('suite', rootSuite.suites[2]);
        runner.emit('test', rootSuite.suites[2].tests[0]);
        rootSuite.suites[2].tests[0].duration = 0;
        rootSuite.suites[2].tests[0].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
        }
        runner.emit('test end', rootSuite.suites[2].tests[0]);
        runner.emit('suite end', rootSuite.suites[2]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
        var suites = output.getElementsByClassName('suite');
        for (var suiteIndex = 0; suiteIndex < suites.length; suiteIndex += 1) {
          assertDisplayed(suites[suiteIndex]);
        }
        var tests = output.getElementsByClassName('test');
        for (var testIndex = 0; testIndex < tests.length; testIndex += 1) {
          assertDisplayed(tests[testIndex]);
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    describe('after failures filter was clicked', function () {
      it('should show passed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          rootSuite.addTest(new Test('pending'));
          rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('test', rootSuite.tests[0]);
          rootSuite.tests[0].duration = 0;
          rootSuite.tests[0].state = 'passed';
          runner.emit('pass', rootSuite.tests[0]);
          runner.emit('test end', rootSuite.tests[0]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.tests[1]);
          runner.emit('test end', rootSuite.tests[1]);
          runner.emit('test', rootSuite.tests[2]);
          rootSuite.tests[2].pending = true;
          rootSuite.tests[2].duration = 0;
          runner.emit('pending', rootSuite.tests[2]);
          runner.emit('test end', rootSuite.tests[2]);
          runner.emit('test', rootSuite.tests[3]);
          rootSuite.tests[3].duration = 0;
          rootSuite.tests[3].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.tests[3], assertion);
          }
          runner.emit('test end', rootSuite.tests[3]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          var tests = output.getElementsByClassName('test');
          for (var index = 0; index < tests.length; index += 1) {
            if (/\bpass\b/.test(tests[index].className)) {
              assertDisplayed(tests[index]);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should hide all non-passed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          rootSuite.addTest(new Test('pending'));
          rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('test', rootSuite.tests[0]);
          rootSuite.tests[0].duration = 0;
          rootSuite.tests[0].state = 'passed';
          runner.emit('pass', rootSuite.tests[0]);
          runner.emit('test end', rootSuite.tests[0]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.tests[1]);
          runner.emit('test end', rootSuite.tests[1]);
          runner.emit('test', rootSuite.tests[2]);
          rootSuite.tests[2].pending = true;
          rootSuite.tests[2].duration = 0;
          runner.emit('pending', rootSuite.tests[2]);
          runner.emit('test end', rootSuite.tests[2]);
          runner.emit('test', rootSuite.tests[3]);
          rootSuite.tests[3].duration = 0;
          rootSuite.tests[3].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.tests[3], assertion);
          }
          runner.emit('test end', rootSuite.tests[3]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          var tests = output.getElementsByClassName('test');
          for (var index = 0; index < tests.length; index += 1) {
            if (!/\bpass\b/.test(tests[index].className)) {
              assertDisplayed(tests[index], false);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should hide suites with only non-passed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          Suite.create(rootSuite, 'passing');
          rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          Suite.create(rootSuite, 'pending');
          rootSuite.suites[1].addTest(new Test('pending'));
          rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
          Suite.create(rootSuite, 'failing');
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.suites[2].addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('suite', rootSuite.suites[0]);
          runner.emit('test', rootSuite.suites[0].tests[0]);
          rootSuite.suites[0].tests[0].duration = 0;
          rootSuite.suites[0].tests[0].state = 'passed';
          runner.emit('pass', rootSuite.suites[0].tests[0]);
          runner.emit('test end', rootSuite.suites[0].tests[0]);
          runner.emit('suite end', rootSuite.suites[0]);
          runner.emit('suite', rootSuite.suites[1]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.suites[1].tests[0]);
          runner.emit('test end', rootSuite.suites[1].tests[0]);
          runner.emit('test', rootSuite.suites[1].tests[1]);
          rootSuite.suites[1].tests[1].pending = true;
          rootSuite.suites[1].tests[1].duration = 0;
          runner.emit('pending', rootSuite.suites[1].tests[1]);
          runner.emit('test end', rootSuite.suites[1].tests[1]);
          runner.emit('suite end', rootSuite.suites[1]);
          runner.emit('suite', rootSuite.suites[2]);
          runner.emit('test', rootSuite.suites[2].tests[0]);
          rootSuite.suites[2].tests[0].duration = 0;
          rootSuite.suites[2].tests[0].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
          }
          runner.emit('test end', rootSuite.suites[2].tests[0]);
          runner.emit('suite end', rootSuite.suites[2]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          var suites = output.getElementsByClassName('suite');
          for (var index = 0; index < suites.length; index += 1) {
            if (!suites[index].getElementsByClassName('test pass').length) {
              assertDisplayed(suites[index], false);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should not hide suites with passed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          Suite.create(rootSuite, 'passing');
          rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          Suite.create(rootSuite, 'pending');
          rootSuite.suites[1].addTest(new Test('pending'));
          rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
          Suite.create(rootSuite, 'failing');
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.suites[2].addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('suite', rootSuite.suites[0]);
          runner.emit('test', rootSuite.suites[0].tests[0]);
          rootSuite.suites[0].tests[0].duration = 0;
          rootSuite.suites[0].tests[0].state = 'passed';
          runner.emit('pass', rootSuite.suites[0].tests[0]);
          runner.emit('test end', rootSuite.suites[0].tests[0]);
          runner.emit('suite end', rootSuite.suites[0]);
          runner.emit('suite', rootSuite.suites[1]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.suites[1].tests[0]);
          runner.emit('test end', rootSuite.suites[1].tests[0]);
          runner.emit('test', rootSuite.suites[1].tests[1]);
          rootSuite.suites[1].tests[1].pending = true;
          rootSuite.suites[1].tests[1].duration = 0;
          runner.emit('pending', rootSuite.suites[1].tests[1]);
          runner.emit('test end', rootSuite.suites[1].tests[1]);
          runner.emit('suite end', rootSuite.suites[1]);
          runner.emit('suite', rootSuite.suites[2]);
          runner.emit('test', rootSuite.suites[2].tests[0]);
          rootSuite.suites[2].tests[0].duration = 0;
          rootSuite.suites[2].tests[0].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
          }
          runner.emit('test end', rootSuite.suites[2].tests[0]);
          runner.emit('suite end', rootSuite.suites[2]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          var suites = output.getElementsByClassName('suite');
          for (var index = 0; index < suites.length; index += 1) {
            if (suites[index].getElementsByClassName('test pass').length > 0) {
              assertDisplayed(suites[index]);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should unhide all tests and suites when clicked again', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          Suite.create(rootSuite, 'passing');
          rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          Suite.create(rootSuite, 'pending');
          rootSuite.suites[1].addTest(new Test('pending'));
          rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
          Suite.create(rootSuite, 'failing');
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.suites[2].addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('suite', rootSuite.suites[0]);
          runner.emit('test', rootSuite.suites[0].tests[0]);
          rootSuite.suites[0].tests[0].duration = 0;
          rootSuite.suites[0].tests[0].state = 'passed';
          runner.emit('pass', rootSuite.suites[0].tests[0]);
          runner.emit('test end', rootSuite.suites[0].tests[0]);
          runner.emit('suite end', rootSuite.suites[0]);
          runner.emit('suite', rootSuite.suites[1]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.suites[1].tests[0]);
          runner.emit('test end', rootSuite.suites[1].tests[0]);
          runner.emit('test', rootSuite.suites[1].tests[1]);
          rootSuite.suites[1].tests[1].pending = true;
          rootSuite.suites[1].tests[1].duration = 0;
          runner.emit('pending', rootSuite.suites[1].tests[1]);
          runner.emit('test end', rootSuite.suites[1].tests[1]);
          runner.emit('suite end', rootSuite.suites[1]);
          runner.emit('suite', rootSuite.suites[2]);
          runner.emit('test', rootSuite.suites[2].tests[0]);
          rootSuite.suites[2].tests[0].duration = 0;
          rootSuite.suites[2].tests[0].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
          }
          runner.emit('test end', rootSuite.suites[2].tests[0]);
          runner.emit('suite end', rootSuite.suites[2]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          var suites = output.getElementsByClassName('suite');
          for (var suiteIndex = 0; suiteIndex < suites.length; suiteIndex += 1) {
            assertDisplayed(suites[suiteIndex]);
          }
          var tests = output.getElementsByClassName('test');
          for (var testIndex = 0; testIndex < tests.length; testIndex += 1) {
            assertDisplayed(tests[testIndex]);
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });
    });
  });

  describe('failures filter', function () {
    it('should still show failed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        var tests = output.getElementsByClassName('test');
        for (var index = 0; index < tests.length; index += 1) {
          if (/\bfail\b/.test(tests[index].className)) {
            assertDisplayed(tests[index]);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should hide all non-failed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        rootSuite.addTest(new Test('pending'));
        rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('test', rootSuite.tests[2]);
        rootSuite.tests[2].pending = true;
        rootSuite.tests[2].duration = 0;
        runner.emit('pending', rootSuite.tests[2]);
        runner.emit('test end', rootSuite.tests[2]);
        runner.emit('test', rootSuite.tests[3]);
        rootSuite.tests[3].duration = 0;
        rootSuite.tests[3].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.tests[3], assertion);
        }
        runner.emit('test end', rootSuite.tests[3]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        var tests = output.getElementsByClassName('test');
        for (var index = 0; index < tests.length; index += 1) {
          if (!/\bfail\b/.test(tests[index].className)) {
            assertDisplayed(tests[index], false);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should hide suites with only non-failed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        Suite.create(rootSuite, 'passing');
        rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        Suite.create(rootSuite, 'pending');
        rootSuite.suites[1].addTest(new Test('pending'));
        rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
        Suite.create(rootSuite, 'failing');
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.suites[2].addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', rootSuite.suites[0]);
        runner.emit('test', rootSuite.suites[0].tests[0]);
        rootSuite.suites[0].tests[0].duration = 0;
        rootSuite.suites[0].tests[0].state = 'passed';
        runner.emit('pass', rootSuite.suites[0].tests[0]);
        runner.emit('test end', rootSuite.suites[0].tests[0]);
        runner.emit('suite end', rootSuite.suites[0]);
        runner.emit('suite', rootSuite.suites[1]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.suites[1].tests[0]);
        runner.emit('test end', rootSuite.suites[1].tests[0]);
        runner.emit('test', rootSuite.suites[1].tests[1]);
        rootSuite.suites[1].tests[1].pending = true;
        rootSuite.suites[1].tests[1].duration = 0;
        runner.emit('pending', rootSuite.suites[1].tests[1]);
        runner.emit('test end', rootSuite.suites[1].tests[1]);
        runner.emit('suite end', rootSuite.suites[1]);
        runner.emit('suite', rootSuite.suites[2]);
        runner.emit('test', rootSuite.suites[2].tests[0]);
        rootSuite.suites[2].tests[0].duration = 0;
        rootSuite.suites[2].tests[0].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
        }
        runner.emit('test end', rootSuite.suites[2].tests[0]);
        runner.emit('suite end', rootSuite.suites[2]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        var suites = output.getElementsByClassName('suite');
        for (var index = 0; index < suites.length; index += 1) {
          if (!suites[index].getElementsByClassName('test fail').length) {
            assertDisplayed(suites[index], false);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should not hide suites with failed tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        Suite.create(rootSuite, 'passing');
        rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        Suite.create(rootSuite, 'pending');
        rootSuite.suites[1].addTest(new Test('pending'));
        rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
        Suite.create(rootSuite, 'failing');
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.suites[2].addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', rootSuite.suites[0]);
        runner.emit('test', rootSuite.suites[0].tests[0]);
        rootSuite.suites[0].tests[0].duration = 0;
        rootSuite.suites[0].tests[0].state = 'passed';
        runner.emit('pass', rootSuite.suites[0].tests[0]);
        runner.emit('test end', rootSuite.suites[0].tests[0]);
        runner.emit('suite end', rootSuite.suites[0]);
        runner.emit('suite', rootSuite.suites[1]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.suites[1].tests[0]);
        runner.emit('test end', rootSuite.suites[1].tests[0]);
        runner.emit('test', rootSuite.suites[1].tests[1]);
        rootSuite.suites[1].tests[1].pending = true;
        rootSuite.suites[1].tests[1].duration = 0;
        runner.emit('pending', rootSuite.suites[1].tests[1]);
        runner.emit('test end', rootSuite.suites[1].tests[1]);
        runner.emit('suite end', rootSuite.suites[1]);
        runner.emit('suite', rootSuite.suites[2]);
        runner.emit('test', rootSuite.suites[2].tests[0]);
        rootSuite.suites[2].tests[0].duration = 0;
        rootSuite.suites[2].tests[0].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
        }
        runner.emit('test end', rootSuite.suites[2].tests[0]);
        runner.emit('suite end', rootSuite.suites[2]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        var suites = output.getElementsByClassName('suite');
        for (var index = 0; index < suites.length; index += 1) {
          if (suites[index].getElementsByClassName('test fail').length > 0) {
            assertDisplayed(suites[index]);
          }
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should unhide all tests and suites when clicked again', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(4);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        Suite.create(rootSuite, 'passing');
        rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
        Suite.create(rootSuite, 'pending');
        rootSuite.suites[1].addTest(new Test('pending'));
        rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
        Suite.create(rootSuite, 'failing');
        var failingTest = function () { throw new Error('fail test'); };
        rootSuite.suites[2].addTest(new Test('failing', failingTest));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', rootSuite.suites[0]);
        runner.emit('test', rootSuite.suites[0].tests[0]);
        rootSuite.suites[0].tests[0].duration = 0;
        rootSuite.suites[0].tests[0].state = 'passed';
        runner.emit('pass', rootSuite.suites[0].tests[0]);
        runner.emit('test end', rootSuite.suites[0].tests[0]);
        runner.emit('suite end', rootSuite.suites[0]);
        runner.emit('suite', rootSuite.suites[1]);
        // no 'test' event is emitted for pending tests
        runner.emit('pending', rootSuite.suites[1].tests[0]);
        runner.emit('test end', rootSuite.suites[1].tests[0]);
        runner.emit('test', rootSuite.suites[1].tests[1]);
        rootSuite.suites[1].tests[1].pending = true;
        rootSuite.suites[1].tests[1].duration = 0;
        runner.emit('pending', rootSuite.suites[1].tests[1]);
        runner.emit('test end', rootSuite.suites[1].tests[1]);
        runner.emit('suite end', rootSuite.suites[1]);
        runner.emit('suite', rootSuite.suites[2]);
        runner.emit('test', rootSuite.suites[2].tests[0]);
        rootSuite.suites[2].tests[0].duration = 0;
        rootSuite.suites[2].tests[0].state = 'failed';
        try {
          failingTest();
          throw new Error('Failing test did not throw assertion');
        } catch (assertion) {
          runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
        }
        runner.emit('test end', rootSuite.suites[2].tests[0]);
        runner.emit('suite end', rootSuite.suites[2]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
        var suites = output.getElementsByClassName('suite');
        for (var suiteIndex = 0; suiteIndex < suites.length; suiteIndex += 1) {
          assertDisplayed(suites[suiteIndex]);
        }
        var tests = output.getElementsByClassName('test');
        for (var testIndex = 0; testIndex < tests.length; testIndex += 1) {
          assertDisplayed(tests[testIndex]);
        }
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    describe('after passes filter was clicked', function () {
      it('should show failed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          rootSuite.addTest(new Test('pending'));
          rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('test', rootSuite.tests[0]);
          rootSuite.tests[0].duration = 0;
          rootSuite.tests[0].state = 'passed';
          runner.emit('pass', rootSuite.tests[0]);
          runner.emit('test end', rootSuite.tests[0]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.tests[1]);
          runner.emit('test end', rootSuite.tests[1]);
          runner.emit('test', rootSuite.tests[2]);
          rootSuite.tests[2].pending = true;
          rootSuite.tests[2].duration = 0;
          runner.emit('pending', rootSuite.tests[2]);
          runner.emit('test end', rootSuite.tests[2]);
          runner.emit('test', rootSuite.tests[3]);
          rootSuite.tests[3].duration = 0;
          rootSuite.tests[3].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.tests[3], assertion);
          }
          runner.emit('test end', rootSuite.tests[3]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          var tests = output.getElementsByClassName('test');
          for (var index = 0; index < tests.length; index += 1) {
            if (/\bfail\b/.test(tests[index].className)) {
              assertDisplayed(tests[index]);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should hide all non-failed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          rootSuite.addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          rootSuite.addTest(new Test('pending'));
          rootSuite.addTest(new Test('skipped at runtime', function () { this.skip(); }));
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('test', rootSuite.tests[0]);
          rootSuite.tests[0].duration = 0;
          rootSuite.tests[0].state = 'passed';
          runner.emit('pass', rootSuite.tests[0]);
          runner.emit('test end', rootSuite.tests[0]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.tests[1]);
          runner.emit('test end', rootSuite.tests[1]);
          runner.emit('test', rootSuite.tests[2]);
          rootSuite.tests[2].pending = true;
          rootSuite.tests[2].duration = 0;
          runner.emit('pending', rootSuite.tests[2]);
          runner.emit('test end', rootSuite.tests[2]);
          runner.emit('test', rootSuite.tests[3]);
          rootSuite.tests[3].duration = 0;
          rootSuite.tests[3].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.tests[3], assertion);
          }
          runner.emit('test end', rootSuite.tests[3]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          var tests = output.getElementsByClassName('test');
          for (var index = 0; index < tests.length; index += 1) {
            if (!/\bfail\b/.test(tests[index].className)) {
              assertDisplayed(tests[index], false);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should hide suites with only non-failed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          Suite.create(rootSuite, 'passing');
          rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          Suite.create(rootSuite, 'pending');
          rootSuite.suites[1].addTest(new Test('pending'));
          rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
          Suite.create(rootSuite, 'failing');
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.suites[2].addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('suite', rootSuite.suites[0]);
          runner.emit('test', rootSuite.suites[0].tests[0]);
          rootSuite.suites[0].tests[0].duration = 0;
          rootSuite.suites[0].tests[0].state = 'passed';
          runner.emit('pass', rootSuite.suites[0].tests[0]);
          runner.emit('test end', rootSuite.suites[0].tests[0]);
          runner.emit('suite end', rootSuite.suites[0]);
          runner.emit('suite', rootSuite.suites[1]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.suites[1].tests[0]);
          runner.emit('test end', rootSuite.suites[1].tests[0]);
          runner.emit('test', rootSuite.suites[1].tests[1]);
          rootSuite.suites[1].tests[1].pending = true;
          rootSuite.suites[1].tests[1].duration = 0;
          runner.emit('pending', rootSuite.suites[1].tests[1]);
          runner.emit('test end', rootSuite.suites[1].tests[1]);
          runner.emit('suite end', rootSuite.suites[1]);
          runner.emit('suite', rootSuite.suites[2]);
          runner.emit('test', rootSuite.suites[2].tests[0]);
          rootSuite.suites[2].tests[0].duration = 0;
          rootSuite.suites[2].tests[0].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
          }
          runner.emit('test end', rootSuite.suites[2].tests[0]);
          runner.emit('suite end', rootSuite.suites[2]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          var suites = output.getElementsByClassName('suite');
          for (var index = 0; index < suites.length; index += 1) {
            if (!suites[index].getElementsByClassName('test fail').length) {
              assertDisplayed(suites[index], false);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should not hide suites with failed tests', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          Suite.create(rootSuite, 'passing');
          rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          Suite.create(rootSuite, 'pending');
          rootSuite.suites[1].addTest(new Test('pending'));
          rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
          Suite.create(rootSuite, 'failing');
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.suites[2].addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('suite', rootSuite.suites[0]);
          runner.emit('test', rootSuite.suites[0].tests[0]);
          rootSuite.suites[0].tests[0].duration = 0;
          rootSuite.suites[0].tests[0].state = 'passed';
          runner.emit('pass', rootSuite.suites[0].tests[0]);
          runner.emit('test end', rootSuite.suites[0].tests[0]);
          runner.emit('suite end', rootSuite.suites[0]);
          runner.emit('suite', rootSuite.suites[1]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.suites[1].tests[0]);
          runner.emit('test end', rootSuite.suites[1].tests[0]);
          runner.emit('test', rootSuite.suites[1].tests[1]);
          rootSuite.suites[1].tests[1].pending = true;
          rootSuite.suites[1].tests[1].duration = 0;
          runner.emit('pending', rootSuite.suites[1].tests[1]);
          runner.emit('test end', rootSuite.suites[1].tests[1]);
          runner.emit('suite end', rootSuite.suites[1]);
          runner.emit('suite', rootSuite.suites[2]);
          runner.emit('test', rootSuite.suites[2].tests[0]);
          rootSuite.suites[2].tests[0].duration = 0;
          rootSuite.suites[2].tests[0].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
          }
          runner.emit('test end', rootSuite.suites[2].tests[0]);
          runner.emit('suite end', rootSuite.suites[2]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          var suites = output.getElementsByClassName('suite');
          for (var index = 0; index < suites.length; index += 1) {
            if (suites[index].getElementsByClassName('test fail').length > 0) {
              assertDisplayed(suites[index]);
            }
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });

      it('should unhide all tests and suites when clicked again', function () {
        try {
          var output = stubOutput();
          var runner = new Runner(4);
          new HTML(runner); // eslint-disable-line no-new
          var rootSuite = new Suite('', new Context());
          Suite.create(rootSuite, 'passing');
          rootSuite.suites[0].addTest(new Test('passing', function () { /* content here */; })); // eslint-disable-line no-extra-semi
          Suite.create(rootSuite, 'pending');
          rootSuite.suites[1].addTest(new Test('pending'));
          rootSuite.suites[1].addTest(new Test('skipped at runtime', function () { this.skip(); }));
          Suite.create(rootSuite, 'failing');
          var failingTest = function () { throw new Error('fail test'); };
          rootSuite.suites[2].addTest(new Test('failing', failingTest));
          runner.emit('start');
          runner.emit('suite', rootSuite);
          runner.emit('suite', rootSuite.suites[0]);
          runner.emit('test', rootSuite.suites[0].tests[0]);
          rootSuite.suites[0].tests[0].duration = 0;
          rootSuite.suites[0].tests[0].state = 'passed';
          runner.emit('pass', rootSuite.suites[0].tests[0]);
          runner.emit('test end', rootSuite.suites[0].tests[0]);
          runner.emit('suite end', rootSuite.suites[0]);
          runner.emit('suite', rootSuite.suites[1]);
          // no 'test' event is emitted for pending tests
          runner.emit('pending', rootSuite.suites[1].tests[0]);
          runner.emit('test end', rootSuite.suites[1].tests[0]);
          runner.emit('test', rootSuite.suites[1].tests[1]);
          rootSuite.suites[1].tests[1].pending = true;
          rootSuite.suites[1].tests[1].duration = 0;
          runner.emit('pending', rootSuite.suites[1].tests[1]);
          runner.emit('test end', rootSuite.suites[1].tests[1]);
          runner.emit('suite end', rootSuite.suites[1]);
          runner.emit('suite', rootSuite.suites[2]);
          runner.emit('test', rootSuite.suites[2].tests[0]);
          rootSuite.suites[2].tests[0].duration = 0;
          rootSuite.suites[2].tests[0].state = 'failed';
          try {
            failingTest();
            throw new Error('Failing test did not throw assertion');
          } catch (assertion) {
            runner.emit('fail', rootSuite.suites[2].tests[0], assertion);
          }
          runner.emit('test end', rootSuite.suites[2].tests[0]);
          runner.emit('suite end', rootSuite.suites[2]);
          runner.emit('suite end', rootSuite);
          runner.emit('end');
          click(output.getElementsByClassName('passes').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          click(output.getElementsByClassName('failures').item(0).getElementsByTagName('a').item(0));
          var suites = output.getElementsByClassName('suite');
          for (var suiteIndex = 0; suiteIndex < suites.length; suiteIndex += 1) {
            assertDisplayed(suites[suiteIndex]);
          }
          var tests = output.getElementsByClassName('test');
          for (var testIndex = 0; testIndex < tests.length; testIndex += 1) {
            assertDisplayed(tests[testIndex]);
          }
          restoreOutput();
        } catch (error) {
          try {
            restoreOutput();
          } catch (ignore) {}
          throw error;
        }
      });
    });
  });

  describe('test source', function () {
    it('should not be displayed initially', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(1);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { }));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var testCodeElement = output.getElementsByClassName('test').item(0).getElementsByTagName('pre').item(0);
        assertDisplayed(testCodeElement, false);
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should be displayed when the test is clicked upon', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(1);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { }));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var testCodeElement = output.getElementsByClassName('test').item(0).getElementsByTagName('pre').item(0);
        click(testCodeElement.parentNode.getElementsByTagName('h2').item(0));
        assertDisplayed(testCodeElement);
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should be hidden again when clicked twice', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(1);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { }));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var testCodeElement = output.getElementsByClassName('test').item(0).getElementsByTagName('pre').item(0);
        click(testCodeElement.parentNode.getElementsByTagName('h2').item(0));
        click(testCodeElement.parentNode.getElementsByTagName('h2').item(0));
        assertDisplayed(testCodeElement, false);
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should not affect other tests than the one clicked', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(1);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { }));
        rootSuite.addTest(new Test('passing', function () { }));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        runner.emit('test', rootSuite.tests[1]);
        rootSuite.tests[1].duration = 0;
        rootSuite.tests[1].state = 'passed';
        runner.emit('pass', rootSuite.tests[1]);
        runner.emit('test end', rootSuite.tests[1]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        click(output.getElementsByClassName('test').item(0).getElementsByTagName('pre').item(0).parentNode.getElementsByTagName('h2').item(0));
        assertDisplayed(output.getElementsByClassName('test').item(1).getElementsByTagName('pre').item(0), false);
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });
  });

  describe('grep links', function () {
    it('should be generated for suites', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(1);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        var mainSuite = Suite.create(rootSuite, 'suite');
        mainSuite.addTest(new Test('passing', function () { }));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('suite', mainSuite);
        runner.emit('test', mainSuite.tests[0]);
        mainSuite.tests[0].duration = 0;
        mainSuite.tests[0].state = 'passed';
        runner.emit('pass', mainSuite.tests[0]);
        runner.emit('test end', mainSuite.tests[0]);
        runner.emit('suite end', mainSuite);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var href = output.getElementsByClassName('suite').item(0).getElementsByTagName('a').item(0).href.replace(/.*[?]/, '?');
        expect(href).to.be('?grep=suite');
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });

    it('should be generated for tests', function () {
      try {
        var output = stubOutput();
        var runner = new Runner(1);
        new HTML(runner); // eslint-disable-line no-new
        var rootSuite = new Suite('', new Context());
        rootSuite.addTest(new Test('passing', function () { }));
        runner.emit('start');
        runner.emit('suite', rootSuite);
        runner.emit('test', rootSuite.tests[0]);
        rootSuite.tests[0].duration = 0;
        rootSuite.tests[0].state = 'passed';
        runner.emit('pass', rootSuite.tests[0]);
        runner.emit('test end', rootSuite.tests[0]);
        runner.emit('suite end', rootSuite);
        runner.emit('end');
        var href = output.getElementsByClassName('test').item(0).getElementsByTagName('a').item(0).href.replace(/.*[?]/, '?');
        expect(href).to.be('?grep=%20passing');
        restoreOutput();
      } catch (error) {
        try {
          restoreOutput();
        } catch (ignore) {}
        throw error;
      }
    });
  });
});

function Runner (total) {
  var callbacks = {};
  return {
    total: total,
    on: function (event, callback) {
      if (!callbacks[event]) {
        callbacks[event] = [];
      }
      callbacks[event].push(callback);
    },
    emit: function (event) {
      var args = [].slice.call(arguments, 1);
      (callbacks[event] || []).forEach(function (callback) {
        callback.apply(null, args);
      });
    }
  };
}

function click (element) {
  var event;
  try {
    event = new MouseEvent('click');
  } catch (ignore) {
    event = document.createEvent('MouseEvent');
    event.initEvent('click', true, true);
  }
  if (element.dispatchEvent) {
    element.dispatchEvent(event);
  } else {
    element.fireEvent(event);
  }
}

function assertDisplayed (element, yes) {
  if (yes === undefined) { yes = true; }
  var expectDisplay;
  if (window.getComputedStyle) {
    expectDisplay = expect(window.getComputedStyle(element).getPropertyValue('display'));
  } else {
    expectDisplay = expect(element.currentStyle.display);
  }
  if (yes) {
    expectDisplay.not.to.be('none');
  } else {
    expectDisplay.to.be('none');
  }
}
