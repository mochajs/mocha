'use strict';

var parser = require('../../lib/cli/parser');

var testOpts = [
  '--require', 'should',
  '--require', './test/setup',
  '--reporter', 'dot',
  '--ui', 'bdd',
  '--globals', 'okGlobalA,okGlobalB',
  '--globals', 'okGlobalC',
  '--globals', 'callback*',
  '--timeout', '200'
];

describe('parser', function () {
  describe('.expandArg()', function () {
    it('should expand argument', function () {
      expand('-d').should.deepEqual(['--debug', '--no-timeouts']);
      expand('debug').should.deepEqual(['debug', '--no-timeouts']);
      expand('--debug').should.deepEqual(['--debug', '--no-timeouts']);
      expand('--debug-brk').should.deepEqual(['--debug-brk', '--no-timeouts']);
      expand('--inspect').should.deepEqual(['--inspect', '--no-timeouts']);

      expand('-gc').should.deepEqual(['--expose-gc']);
      expand('--expose-gc').should.deepEqual(['--expose-gc']);

      expand('--gc-global').should.deepEqual(['--gc-global']);
      expand('--es_staging').should.deepEqual(['--es_staging']);
      expand('--no-deprecation').should.deepEqual(['--no-deprecation']);
      expand('--prof').should.deepEqual(['--prof']);
      expand('--log-timer-events').should.deepEqual(['--log-timer-events']);
      expand('--throw-deprecation').should.deepEqual(['--throw-deprecation']);
      expand('--trace-deprecation').should.deepEqual(['--trace-deprecation']);
      expand('--use_strict').should.deepEqual(['--use_strict']);
      expand('--allow-natives-syntax').should.deepEqual(['--allow-natives-syntax']);
      expand('--perf-basic-prof').should.deepEqual(['--perf-basic-prof']);

      expand('--harmonywithtrailingrubbish').should.deepEqual(['--harmonywithtrailingrubbish']);
      expand('--tracewithtrailingrubbish').should.deepEqual(['--tracewithtrailingrubbish']);
      expand('--icu-data-dirwithtrailingrubbish').should.deepEqual(['--icu-data-dirwithtrailingrubbish']);
      expand('--max-old-space-sizewithtrailingrubbish').should.deepEqual(['--max-old-space-sizewithtrailingrubbish']);
      expand('--preserve-symlinkswithtrailingrubbish').should.deepEqual(['--preserve-symlinkswithtrailingrubbish']);

      expand('--doesnotexist').should.deepEqual(['--doesnotexist']);
    });
  });

  describe('.expandArgs()', function () {
    it('should expand multiple arguments', function () {
      var args = parser.expandArgs([
        '-d',
        '-gc',
        '--gc-global',
        '--harmonywithtrailingrubbish',
        'random',
        'stuff'
      ]);

      args.should.deepEqual([
        '--harmonywithtrailingrubbish',
        '--gc-global',
        '--expose-gc',
        '--debug',
        '--no-timeouts',
        'random',
        'stuff'
      ]);
    });
  });

  describe('.optsFile()', function () {
    it('should parse "test/cli/test.opts"', function () {
      parser.optsFile('test/cli/test.opts').should.deepEqual(testOpts);
    });
  });

  describe('.expandOpts()', function () {
    it('should expand --opts into args', function () {
      var _args = [
        '/usr/bin/nodejs',
        '/random/path/mocha/bin/_mocha',
        '--opts', 'test/cli/test.opts',
        'test/cli/parser.spec.js'
      ];
      var args = _args.slice();
      var argc = _args
        .slice(0, 2)
        .concat(testOpts) // test opts is added in the middle here
        .concat(_args.slice(2));

      parser.expandOpts(args).should.deepEqual(argc);
      args.should.deepEqual(argc);
    });
  });
});

function expand (arg) {
  var _args = [];
  parser.expandArg(arg, _args);

  return _args;
}
