var mocha = require('..');
var utils = mocha.utils;

describe('utils', function() {
  describe('.clean()', function() {
    var clean = utils.clean;
    it('should remove the wrapping function declaration', function() {
      clean('function  (one, two, three)  {\n//code\n}').should.equal('//code');
    });

    it('should handle newlines in the function declaration', function() {
      clean('function  (one, two, three)\n  {\n//code\n}').should.equal('//code');
    });

    it('should remove space character indentation from the function body', function() {
      clean('  //line1\n    //line2').should.equal('//line1\n  //line2');
    });

    it('should remove tab character indentation from the function body', function() {
      clean('\t//line1\n\t\t//line2').should.equal('//line1\n\t//line2');
    });
  });

  describe('.isBuffer()', function() {
    var isBuffer = utils.isBuffer;
    it('should test if object is a Buffer', function() {
      isBuffer(new Buffer([0x01])).should.equal(true);
      isBuffer({}).should.equal(false);
    })
  });

  describe('.map()', function() {
    var map = utils.map;
    it('should behave same as Array.prototype.map', function() {
      var arr = [1, 2, 3];
      map(arr, JSON.stringify).should.eql(arr.map(JSON.stringify));
    });

    it('should call the callback with 3 arguments[currentValue, index, array]', function() {
      var index = 0;
      map([1, 2, 3], function(e, i, arr) {
        e.should.equal(arr[index]);
        i.should.equal(index++);
      })
    });

    it('should apply with the given scope', function() {
      var scope = {};
      map(['a', 'b', 'c'], function() {
        this.should.equal(scope);
      }, scope);
    });
  });

  describe('.parseQuery()', function() {
    var parseQuery = utils.parseQuery;
    it('should get queryString and return key-value object', function() {
      parseQuery('?foo=1&bar=2&baz=3').should.eql({
        foo: '1',
        bar: '2',
        baz: '3'
      });

      parseQuery('?r1=^@(?!.*\\)$)&r2=m{2}&r3=^co.*').should.eql({
        r1: '^@(?!.*\\)$)',
        r2: 'm{2}',
        r3: '^co.*'
      });
    })
  });

  describe('.stackTraceFilter()', function() {
    describe('on node', function() {
      var filter = utils.stackTraceFilter();
      it('should get a stack-trace as a string and prettify it', function() {
        var stack = [ 'AssertionError: foo bar'
            , 'at EventEmitter.<anonymous> (/usr/local/dev/test.js:16:12)'
            , 'at Context.<anonymous> (/usr/local/dev/test.js:19:5)'
            , 'Test.Runnable.run (/usr/local/lib/node_modules/mocha/lib/runnable.js:244:7)'
            , 'Runner.runTest (/usr/local/lib/node_modules/mocha/lib/runner.js:374:10)'
            , '/usr/local/lib/node_modules/mocha/lib/runner.js:452:12'
            , 'next (/usr/local/lib/node_modules/mocha/lib/runner.js:299:14)'
            , '/usr/local/lib/node_modules/mocha/lib/runner.js:309:7'
            , 'next (/usr/local/lib/node_modules/mocha/lib/runner.js:248:23)'
            , 'Immediate._onImmediate (/usr/local/lib/node_modules/mocha/lib/runner.js:276:5)'
            , 'at processImmediate [as _immediateCallback] (timers.js:321:17)'];
        filter(stack.join('\n')).should.equal(stack.slice(0,3).join('\n'));

        stack = [ 'AssertionError: bar baz'
          , 'at /usr/local/dev/some-test-file.js:25:8'
          , 'at tryCatcher (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/util.js:24:31)'
          , 'at Promise._resolveFromResolver (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:439:31)'
          , 'at new Promise (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:53:37)'
          , 'at yourFunction (/usr/local/dev/own/tmp/test1.js:24:13)'
          , 'at Context.<anonymous> (/usr/local/dev/some-test-file:30:4)'
          , 'Test.Runnable.run (/usr/local/lib/node_modules/mocha/lib/runnable.js:218:15)'
          , 'next (/usr/local/lib/node_modules/mocha/lib/runner.js:248:23)'
          , 'Immediate._onImmediate (/usr/local/lib/node_modules/mocha/lib/runner.js:276:5)'
          , 'at processImmediate [as _immediateCallback] (timers.js:321:17)'];

        filter(stack.join('\n')).should.equal(stack.slice(0,7).join('\n'));
      });

      it('does not ignore other bower_components and components', function() {
        var stack = ['Error: failed'
          , 'at assert (index.html:11:26)'
          , 'at Context.<anonymous> (test.js:17:18)'
          , 'at bower_components/should/should.js:4827:7'
          , 'at next (file:///.../bower_components/should/should.js:4766:23)'
          , 'at components/should/5.0.0/should.js:4827:7'
          , 'at next (file:///.../components/should/5.0.0/should.js:4766:23)'
          , 'at file:///.../bower_components/mocha/mocha.js:4794:5'
          , 'at timeslice (.../components/mocha/mocha.js:6218:27)'
          , 'at Test.require.register.Runnable.run (file:///.../components/mochajs/mocha/2.1.0/mocha.js:4463:15)'
          , 'at Runner.require.register.Runner.runTest (file:///.../components/mochajs/mocha/2.1.0/mocha.js:4892:10)'
          , 'at file:///.../components/mochajs/mocha/2.1.0/mocha.js:4970:12'
          , 'at next (file:///.../components/mochajs/mocha/2.1.0/mocha.js:4817:14)'];
        filter(stack.join('\n')).should.equal(stack.slice(0,7).join('\n'));
      });

      it('should replace absolute with relative paths', function() {
        var stack = ['Error: ' + process.cwd() + '/bla.js has a problem'
          , 'at foo (' + process.cwd() + '/foo/index.js:13:226)'
          , 'at bar (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:11:26)'];

        var expected = ['Error: ' + process.cwd() + '/bla.js has a problem'
          , 'at foo (foo/index.js:13:226)'
          , 'at bar (/usr/local/dev/own/tmp/node_modules/bluebird/js/main/promise.js:11:26)'];

        filter(stack.join('\n')).should.equal(expected.join('\n'));
      });
    });

    describe('on browser', function() {
      var filter;
      before(function() {
        global.document = true;
        global.location = { href: 'localhost:3000/foo/bar/index.html' };
        filter = utils.stackTraceFilter();
      });
      it('does not strip out other bower_components and components', function() {
        var stack = ['Error: failed'
          , 'at assert (index.html:11:26)'
          , 'at Context.<anonymous> (test.js:17:18)'
          , 'at bower_components/should/should.js:4827:7'
          , 'at next (bower_components/should/should.js:4766:23)'
          , 'at components/should/5.0.0/should.js:4827:7'
          , 'at next (components/should/5.0.0/should.js:4766:23)'
          , 'at Runner.require.register.Runner.runTest (node_modules/mocha.js:4892:10)'
          , 'at localhost:3000/foo/bar/node_modules/mocha.js:4970:12'
          , 'at next (node_modules/mocha.js:4817:14)'];
        filter(stack.join('\n')).should.equal(stack.slice(0,7).join('\n'));
      });

      after(function() {
        delete global.document;
        delete global.location;
      });
    });
  });
});
