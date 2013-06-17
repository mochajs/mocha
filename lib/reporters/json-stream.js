
/**
 * Module dependencies.
 */

var Base = require('./base')
  , output = Base.output
  , color = Base.color;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total;

  runner.on('start', function(){
    output.log(JSON.stringify(['start', { total: total }]));
  });

  runner.on('pass', function(test){
    output.log(JSON.stringify(['pass', clean(test)]));
  });

  runner.on('fail', function(test, err){
    output.log(JSON.stringify(['fail', clean(test)]));
  });

  runner.on('end', function(){
    output.write(JSON.stringify(['end', self.stats]));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}
