'use strict';

var path = require('path');
var loadOptions = require('../../lib/cli/options').loadOptions;

describe('options', function () {
  var workingDirectory;
  const workspaceDir = path.join(
    __dirname,
    'fixtures',
    'config',
    'mocharc-extended'
  );
  const configFile = path.join(workspaceDir, 'extends.json');

  beforeEach(function () {
    workingDirectory = process.cwd();
    process.chdir(workspaceDir);
  });

  afterEach(function () {
    process.chdir(workingDirectory);
  });

  it('Should load `_`-option properly', function () {
    var extended = loadOptions(['--config', configFile]);
    expect(extended._, 'to equal', ['**/*.spec.js']);
  });

  it('Should support extended options using --config parameter', function () {
    var extended = loadOptions(['--config', configFile]);
    expect(extended.require, 'to equal', ['foo', 'bar']);
    expect(extended.bail, 'to equal', true);
    expect(extended.reporter, 'to equal', 'html');
    expect(extended.slow, 'to equal', 30);
  });

  it('Should support extended options using rc file', function () {
    var extended = loadOptions([]);
    expect(extended.require, 'to equal', ['foo', 'bar']);
    expect(extended.bail, 'to equal', true);
    expect(extended.reporter, 'to equal', 'html');
    expect(extended.slow, 'to equal', 30);
  });

  it('Should support extended options using package.json', function () {
    var extended = loadOptions([
      '--no-config',
      '--package',
      path.join(workspaceDir, 'package-lock.json')
    ]);
    expect(extended.require, 'to equal', ['foo', 'bar']);
    expect(extended.bail, 'to equal', true);
    expect(extended.reporter, 'to equal', 'html');
    expect(extended.slow, 'to equal', 30);
    expect(extended.grep, 'to equal', 'package');
  });
});
