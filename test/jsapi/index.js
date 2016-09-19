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

mocha.addFile('test/suite.spec.js');
mocha.addFile('test/runner.spec.js');
mocha.addFile('test/runnable.spec.js');
mocha.addFile('test/hook-sync.spec.js');
mocha.addFile('test/hook-sync-nested.spec.js');
mocha.addFile('test/hook-async.spec.js');
mocha.addFile('test/acceptance/duration.spec.js');
mocha.addFile('test/acceptance/fs.spec.js');
mocha.addFile('test/acceptance/globals.spec.js');
mocha.addFile('test/acceptance/timeout.spec.js');

mocha.run(function(){
  console.log('done');
}).on('pass', function(test){
  // console.log('... %s', test.title);
});
