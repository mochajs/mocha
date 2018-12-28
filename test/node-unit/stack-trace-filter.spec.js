'use strict';

var path = require('path');
var utils = require('../../lib/utils');

describe('stackTraceFilter()', function() {
  describe('on node', function() {
    var filter = utils.stackTraceFilter();

    describe('on POSIX OS', function() {
      before(function() {
        if (path.sep !== '/') {
          this.skip();
        }
      });

      it('should get a stack-trace as a string and prettify it', function() {
        var stack = [
          'AssertionError: foo bar',
          'at EventEmitter.<anonymous> (/usr/local/dev/test.js:16:12)',
          'at Context.<anonymous> (/usr/local/dev/test.js:19:5)',
          'Test.Runnable.run (/usr/local/lib/node_modules/mocha/lib/runnable.js:244:7)',
          'Runner.runTest (/usr/local/lib/node_modules/mocha/lib/runner.js:374:10)',
          '/usr/local/lib/node_modules/mocha/lib/runner.js:452:12',
          'next (/usr/local/lib/node_modules/mocha/lib/runner.js:299:14)',
          '/usr/local/lib/node_modules/mocha/lib/runner.js:309:7',
          'next (/usr/local/lib/node_modules/mocha/lib/runner.js:248:23)',
          'Immediate._onImmediate (/usr/local/lib/node_modules/mocha/lib/runner.js:276:5)',
          'at processImmediate [as _immediateCallback] (timers.js:321:17)'
        ];
        expect(filter(stack.join('\n')), 'to be', stack.slice(0, 3).join('\n'));

        stack = [
          'AssertionError: bar baz',
          'at /usr/local/dev/some-test-file.js:25:8',
          'at tryCatcher (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/util.js:24:31)',
          'at Promise._resolveFromResolver (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:439:31)',
          'at new Promise (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:53:37)',
          'at yourFunction (/usr/local/dev/own/tmp/test1.js:24:13)',
          'at Context.<anonymous> (/usr/local/dev/some-test-file:30:4)',
          'Test.Runnable.run (/usr/local/lib/node_modules/mocha/lib/runnable.js:218:15)',
          'next (/usr/local/lib/node_modules/mocha/lib/runner.js:248:23)',
          'Immediate._onImmediate (/usr/local/lib/node_modules/mocha/lib/runner.js:276:5)',
          'at processImmediate [as _immediateCallback] (timers.js:321:17)'
        ];

        expect(filter(stack.join('\n')), 'to be', stack.slice(0, 7).join('\n'));
      });

      it('does not ignore other bower_components and components', function() {
        var stack = [
          'Error: failed',
          'at assert (index.html:11:26)',
          'at Context.<anonymous> (test.js:17:18)',
          'at bower_components/should/should.js:4827:7',
          'at next (file:///.../bower_components/should/should.js:4766:23)',
          'at components/should/5.0.0/should.js:4827:7',
          'at next (file:///.../components/should/5.0.0/should.js:4766:23)',
          'at file:///.../bower_components/mocha/mocha.js:4794:5',
          'at timeslice (.../components/mocha/mocha.js:6218:27)',
          'at Test.require.register.Runnable.run (file:///.../components/mochajs/mocha/2.1.0/mocha.js:4463:15)',
          'at Runner.require.register.Runner.runTest (file:///.../components/mochajs/mocha/2.1.0/mocha.js:4892:10)',
          'at file:///.../components/mochajs/mocha/2.1.0/mocha.js:4970:12',
          'at next (file:///.../components/mochajs/mocha/2.1.0/mocha.js:4817:14)'
        ];
        expect(filter(stack.join('\n')), 'to be', stack.slice(0, 7).join('\n'));
      });

      it('should replace absolute with relative paths', function() {
        var stack = [
          'Error: ' + process.cwd() + '/bla.js has a problem',
          'at foo (' + process.cwd() + '/foo/index.js:13:226)',
          'at bar (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:11:26)'
        ];

        var expected = [
          'Error: ' + process.cwd() + '/bla.js has a problem',
          'at foo (foo/index.js:13:226)',
          'at bar (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:11:26)'
        ];

        expect(filter(stack.join('\n')), 'to be', expected.join('\n'));
      });

      it('should not replace absolute path which has cwd as infix', function() {
        var stack = [
          'Error: /www' + process.cwd() + '/bla.js has a problem',
          'at foo (/www' + process.cwd() + '/foo/index.js:13:226)',
          'at bar (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:11:26)'
        ];

        var expected = [
          'Error: /www' + process.cwd() + '/bla.js has a problem',
          'at foo (/www' + process.cwd() + '/foo/index.js:13:226)',
          'at bar (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:11:26)'
        ];

        expect(filter(stack.join('\n')), 'to be', expected.join('\n'));
      });
    });

    describe('on Windows', function() {
      before(function() {
        if (path.sep === '/') {
          this.skip();
        }
      });

      it('should work on Windows', function() {
        var stack = [
          'Error: failed',
          'at Context.<anonymous> (C:\\Users\\ishida\\src\\test\\test\\mytest.js:5:9)',
          'at callFn (C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runnable.js:326:21)',
          'at Test.Runnable.run (C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runnable.js:319:7)',
          'at Runner.runTest (C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runner.js:422:10)',
          'at C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runner.js:528:12',
          'at next (C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runner.js:342:14)',
          'at C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runner.js:352:7',
          'at next (C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runner.js:284:14)',
          'at Immediate._onImmediate (C:\\Users\\ishida\\src\\test\\node_modules\\mocha\\lib\\runner.js:320:5)'
        ];
        expect(filter(stack.join('\n')), 'to be', stack.slice(0, 2).join('\n'));
      });
    });
  });

  describe('on browser', function() {
    var filter;
    before(function() {
      global.document = true;
      global.location = {href: 'localhost:3000/foo/bar/index.html'};
      filter = utils.stackTraceFilter();
    });
    it('does not strip out other bower_components', function() {
      var stack = [
        'Error: failed',
        'at assert (index.html:11:26)',
        'at Context.<anonymous> (test.js:17:18)',
        'at bower_components/should/should.js:4827:7',
        'at next (bower_components/should/should.js:4766:23)',
        'at components/should/5.0.0/should.js:4827:7',
        'at next (components/should/5.0.0/should.js:4766:23)',
        'at Runner.require.register.Runner.runTest (node_modules/mocha.js:4892:10)',
        'at localhost:3000/foo/bar/node_modules/mocha.js:4970:12',
        'at next (node_modules/mocha.js:4817:14)'
      ];
      expect(filter(stack.join('\n')), 'to be', stack.slice(0, 7).join('\n'));
    });

    after(function() {
      delete global.document;
      delete global.location;
    });
  });
});
