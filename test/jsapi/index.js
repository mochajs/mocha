
var Mocha = require('../../')
  , path = require('path');

var mocha = new Mocha({
  ui: 'bdd',
  globals: ['okGlobalA', 'okGlobalB', 'okGlobalC', 'callback*'],
  // ignoreLeaks: true,
  growl: true
});

// mocha.reporter('spec');
require('should');

mocha.addFile('test/suite.js');
mocha.addFile('test/runner.js');
mocha.addFile('test/runnable.js');
mocha.addFile('test/hook.sync.js');
mocha.addFile('test/hook.sync.nested.js');
mocha.addFile('test/hook.async.js');
mocha.addFile('test/acceptance/duration.js');
mocha.addFile('test/acceptance/fs.js');
mocha.addFile('test/acceptance/globals.js');
mocha.addFile('test/acceptance/pending.js');
mocha.addFile('test/acceptance/timeout.js');

mocha.run(function(){
  console.log('done');
}).on('pass', function(test){
  // console.log('... %s', test.title);
});
