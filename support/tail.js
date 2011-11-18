
/**
 * Node shims.
 * 
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code on
 * the server.
 */

process = {};

process.nextTick = function(fn){ setTimeout(fn, 0); };
process.on = function(){};
process.exit = function(status){};
process.stdout = {};

global = this;

// boot

;(function(){
  var mocha = require('mocha');
  var suite = new mocha.Suite;
  var Reporter = mocha.reporters.HTML;
  mocha.interfaces.bdd(suite);
  suite.emit('pre-require', global);

  setTimeout(run, 0);

  function run() {
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var reporter = new Reporter(runner);
    runner.run();
  }
})();