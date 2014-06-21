
/**
 * Styles.
 */

var styles = {
  bold:    'font-weight:bold;',
  normal:  'font-weight:normal;',
  success: 'color:green;',
  pending: 'color:blue;',
  fail:    'color:red;',
  suite:   'font-weight:bold;',
  slow:    'color:white; background:red; border-radius:5px; padding:0 4px;',
  medium:  'color:white; background:orange; border-radius:5px; padding:0 4px;'
};

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `WebKit`.
 */

exports = module.exports = WebKit;

/**
 * Initialize a new `WebKit` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function WebKit(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , failures = 0;

  runner.on('start', function(){
    console.time('duration');
  });

  runner.on('suite', function(suite){
    if (suite.root) return;
    console.group('%c'+suite.title, styles.suite);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    console.groupEnd();
  });

  runner.on('pending', function(test){
    console.log('%c- '+test.title, styles.pending);
  });

  runner.on('pass', function(test){
    if ('fast' == test.speed) {
      console.log('%c'+Base.symbols.ok+' '+test.title, styles.success);
    }
    else if ('medium' == test.speed) {
      console.log('%c'+Base.symbols.ok+' '+test.title+' %c'+test.duration,
        styles.success, styles.medium);
    }
    else {
      console.log('%c'+Base.symbols.ok+' '+test.title+' %c'+test.duration,
        styles.success, styles.slow);
    }
  });

  runner.on('fail', function(test, err){
    console.error(++failures+') '+test.title+'%O', err);
  });

  runner.on('end', function() {
    var stats = this.stats;

    // duration
    console.timeEnd('duration');

    // passes
    console.log('%c'+(stats.passes||0)+' passing', styles.success);
    
    // pending
    if (stats.pending) {
      console.log('%c'+stats.pending+' pending', styles.pending);
    }

    // failures
    if (stats.failures) {
      console.log('%c'+stats.failures+' failing', 'color:red;');
      errors.call(this, this.failures);
    }
  }.bind(this));

  function errors(failures){
    failures.forEach(function(test, i){
      // msg
      var err = test.err
        , message = err.message || ''
        , stack = err.stack || message
        , index = stack.indexOf(message) + message.length
        , msg = stack.slice(0, index)
        , actual = err.actual
        , expected = err.expected
        , escape = true;

      // uncaught
      if (err.uncaught) {
        msg = 'Uncaught ' + msg;
      }

      // indent stack trace without msg
      stack = stack.slice(index ? index + 1 : index)
        .replace(/^/gm, '  ');

      console.error((i + 1)+') '+test.fullTitle()+'\n%c'+msg+'\n%c'+stack,
        styles.bold, styles.normal);
    });
  }
}

/**
 * Inherit from `Base.prototype`.
 */

WebKit.prototype.__proto__ = Base.prototype;
