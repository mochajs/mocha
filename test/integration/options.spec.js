'use strict';

var path = require('path');
var loadOptions = require('../../lib/cli/options').loadOptions;

describe('options', function() {
  it('Should support extended options', function() {
    var configDir = path.join(
      __dirname,
      'fixtures',
      'config',
      'mocharc-extended'
    );
    var extended = loadOptions([
      '--config',
      path.join(configDir, 'extends.json')
    ]);
    expect(extended.require, 'to equal', ['foo', 'bar']);
    expect(extended.bail, 'to equal', true);
    expect(extended.reporter, 'to equal', 'html');
    expect(extended.slow, 'to equal', 30);
  });
});
