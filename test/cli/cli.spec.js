'use strict';

var Commander = require('commander');
var Command = Commander.Command;
var Option = Commander.Option;
var cli = require('../../lib/cli/cli');
var path = require('path');
var Mocha = require('../../');

var testArgs1 = [
  '/usr/bin/nodejs',
  '/random/path/mocha/bin/_mocha',
  '--opts', 'test/cli/test.opts',
  'test/cli/cli.spec.js'
];

var testArgs2 = [
  '/usr/bin/nodejs',
  '/random/path/mocha/bin/_mocha',
  '--opts', 'test/cli/test.opts',
  'test/cli/parser.spec.js'
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
      program.parse(testArgs1);

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

  xdescribe('.setMochaOptions()', function () {
    var program = cli.makeCommand();
    program.parse(testArgs1);

    it('should set options on mocha', function () {
      var mocha = new Mocha();
      cli.setMochaOptions(mocha, program.opts());

      // how to test this?
    });
  });

  xdescribe('.run()', function () {
    var program = cli.makeCommand();
    program.parse(testArgs2);

    it('should run mocha ', function () {
      var mocha = new Mocha();
      cli.setMochaOptions(mocha, program.opts());
      // how to test this?

      cli.run(mocha, program.opts(), cli.resolveFiles(program.args, program.opts()));
    });
  });

  describe('.resolveFiles()', function () {
    it('should resolve a single file', function () {
      var files = cli.resolveFiles(['test/cli/cli.spec.js']);

      files.should.have.length(1);
      files[0].should.be.eql(path.resolve('test/cli/cli.spec.js'));
    });

    it('should recursively resolve and sort files', function () {
      var files = cli.resolveFiles(['test/cli'], {
        recursive: true,
        sort: true
      });

      files.should.have.length(2);
      files[0].should.be.eql(path.resolve('test/cli/cli.spec.js'));
      files[1].should.be.eql(path.resolve('test/cli/parser.spec.js'));
    });

    it('should resolve test.opts', function () {
      var files = cli.resolveFiles(['test/cli/test.opts'], {
        watchExtensions: 'opts'
      });

      files.should.have.length(1);
      files[0].should.be.eql(path.resolve('test/cli/test.opts'));
    });
  });
});
