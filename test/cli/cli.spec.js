'use strict';

var Commander = require('commander');
var Command = Commander.Command;
var Option = Commander.Option;
var cli = require('../../lib/cli/cli');
var path = require('path');

var testArgs = [
  '/usr/bin/nodejs',
  '/random/path/mocha/bin/_mocha',
  '--opts', 'test/cli/test.opts',
  'test/cli/cli.spec.js'
];

describe('Cli', function () {
  describe('.makeCommand()', function () {
    var program = cli.makeCommand();

    it('should have these properties before parsing', function () {
      program.should.be.an.instanceOf(Command);
      program.should.have.property('_makeCommand', true);
      program.parse.should.be.a.Function;
      // ensure its correctly set before parsing
      program.opts.should.be.a.Function;
    });

    it('should have these properties after parsing', function () {
      program.parse(testArgs);

      // ensure its correctly set after parsing
      program.opts.should.be.a.Function;
      program.globals.should.be.an.Array;
      program.globals.should.deepEqual([
        'okGlobalA',
        'okGlobalB',
        'okGlobalC',
        'callback*'
      ]);
      program.require.should.be.an.Array;
      program.require.should.deepEqual([
        'should',
        path.resolve('./test/setup')
      ]);

      program.timeout.should.eql('200');
      program.ui.should.eql('bdd');
      program.reporter.should.eql('dot');
    });
  });

  describe('.addActions()', function () {
    var program = cli.makeCommand();
    cli.addActions(program);

    it('should have options and commands', function () {
      program.optionFor('--reporters').should.be.instanceOf(Option);
      program.optionFor('--interfaces').should.be.instanceOf(Option);
      program.optionFor('--watch').should.be.instanceOf(Option);
      // sanity test.
      expect(program.optionFor('--doesntexist')).to.not.be.ok;

      program.commands[0].name().should.be.eql('init');
    });
  });

  describe('.setMochaOptions()', function () {
    it('should', function () {

    });
  });

  describe('.run()', function () {
    it('should', function () {

    });
  });

  describe('.resolveFiles()', function () {
    it('should', function () {

    });
  });
});
