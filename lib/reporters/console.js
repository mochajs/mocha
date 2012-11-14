
  /**
   * Module dependencies.
   */

  var Base = require('./base')
    , utils = require('../utils')
    , escape = utils.escape;

  /**
   * Save timer references to avoid Sinon interfering (see GH-237).
   */

  var Date = global.Date
    , setTimeout = global.setTimeout
    , setInterval = global.setInterval
    , clearTimeout = global.clearTimeout
    , clearInterval = global.clearInterval;

  /**
   * Expose `XUnit`.
   */

  exports = module.exports = Console;

  /**
   * Initialize a new `Console` reporter.
   *
   * @param {Runner} runner
   * @api public
   */

  function Console(runner, options) {
    //TODO needs to be removed to options somehow
    var defaultParameters = '&reporter=console'
    var parameterForRunningAllTests = '?test=true'

    Base.call(this, runner);
    var stats = this.stats
      , tests = []
      , self = this
      , total = runner.total
      , title = document.title
      , calls = [];

    runner.on('pass', function(test){
    });

    runner.on('fail', function(test){
      calls.push(['info', null, test.title])
      calls.push(['error', null, test.err.stack])
      flagFailures(test.parent)
    });

    function flagFailures(node) {
      node.hasFailures = true
      if(node.parent) flagFailures(node.parent)
    }

    runner.on('suite', function(suite) {
      var parameter = '?grep=' + encodeURIComponent(suite.fullTitle()) + defaultParameters
      var location = document.location
      var url = location.origin + location.pathname + parameter
      calls.push(['group', suite, suite.title])
      calls.push(['groupCollapsed', suite , 'url'])
      calls.push(['log', suite, url])
      calls.push(['groupEnd', suite])
    })
    runner.on('suite end', function(suite) {
      calls.push(['groupEnd', suite])
    })

    runner.on('test end', function() {
      var percent = stats.tests / total * 100 | 0;
      document.title = percent + '% '+(stats.failures ? stats.failures + ' failures ' : '' ) + title
    })

    runner.on('end', function(){
      if(stats.errors || stats.failures) {
        utils.forEach(calls, function(call) {
          var command = call.shift()
          var suite = call.shift()
          var failures = !suite || suite.hasFailures
          if (failures || command == 'info' || command == 'error') {
            console[command].apply(console, call)
          }
        })
      }
      if(stats.errors) console.warn(stats.errors,' errors')
      if(stats.failures) console.warn(stats.failures,' failures')
      var skipped = stats.tests - stats.failures - stats.passes
      if(skipped) console.warn(skipped, ' skipped')
      console.log(stats.passes, ' tests passed')
      console.log(stats.duration / 1000, ' seconds')
      console.log((new Date).toUTCString())
      console.log('Run all tests ' + location.origin + location.pathname + parameterForRunningAllTests + defaultParameters)
    });
  }
  /**
   * Inherit from `Base.prototype`.
   */

  Console.prototype = new Base;
  Console.prototype.constructor = Console;

