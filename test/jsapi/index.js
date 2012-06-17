
var Mocha = require('../../')
  , path = require('path');

var mocha = new Mocha({
  ui: 'bdd',
  reporter: false, //Turn off reporter this time
  globals: ['okGlobalA', 'okGlobalB', 'okGlobalC'],
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

mocha.run(function(stats, testList){
  console.log('Done:');
  console.log('  Passed: %d', stats.passes);
  console.log('  Pending: %d', stats.pending);
  console.log('  Failed: %d', stats.failures);
  console.log('  Total time: %dms', stats.duration);
  console.log();

  var pending = testList.filter(function(test){
    return test.pending;
  });

  console.log('Pending tests:');
  pending.forEach(function(test){
    console.log(' - %s: %s', (test.parent && test.parent.title || '#'), test.title);
  });
}).on('pass', function(test){
  // console.log('...passed %s', test.title);
}).on('fail', function(test){
  // console.log('...failed %s', test.title);
});
