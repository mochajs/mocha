
/**
 * Module dependencies.
 */

var Base = require('./base')
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

function List(runner, ostream) {
  Base.call(this, runner, ostream);

  var self = this
    , stats = this.stats
    , total = runner.total;

  runner.on('start', function(){
    ostream.write(JSON.stringify(['start', { total: total }]) + "\n");
  });

  runner.on('pass', function(test){
    ostream.write(JSON.stringify(['pass', clean(test)]) + "\n");
  });

  runner.on('fail', function(test, err){
    ostream.write(JSON.stringify(['fail', clean(test)]) + "\n");
  });

  runner.on('end', function(){
    ostream.write(JSON.stringify(['end', self.stats]) + "\n");
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
