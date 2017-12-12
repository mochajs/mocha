'use strict';

var Mocha = require('../../');

var mocha = new Mocha({
  ui: 'bdd',
  globals: ['okGlobalA', 'okGlobalB', 'okGlobalC', 'callback*'],
  // ignoreLeaks: true,
  growl: true
});

global.expect = require('expect.js');

mocha.addFile('test/unit/suite.spec.js');
mocha.addFile('test/unit/runner.spec.js');
mocha.addFile('test/unit/runnable.spec.js');
mocha.addFile('test/unit/hook-sync.spec.js');
mocha.addFile('test/unit/hook-sync-nested.spec.js');
mocha.addFile('test/unit/hook-async.spec.js');
mocha.addFile('test/unit/duration.spec.js');
mocha.addFile('test/node-unit/fs.spec.js');
mocha.addFile('test/unit/globals.spec.js');
mocha.addFile('test/unit/timeout.spec.js');

mocha.run(function () {
  console.log('done');
}).on('pass', function (test) {
  // console.log('... %s', test.title);
});
