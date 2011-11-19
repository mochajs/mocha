
/**
 * Node shims.
 * 
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code in
 * the browser.
 */

process = {};
process.nextTick = function(fn){ setTimeout(fn, 0); };
process.on = function(){};
process.exit = function(status){};
process.stdout = {};
global = this;

mocha = require('mocha');

// boot

;(function(){
  var suite = new mocha.Suite;
  var Reporter = mocha.reporters.HTML;

  mocha.setup = function(ui){
    ui = mocha.interfaces[ui];
    if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
    ui(suite);
    suite.emit('pre-require', global);
  };

  mocha.run = function(){
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var reporter = new Reporter(runner);
    runner.run();
  };
})();