
/**
 * Module dependencies.
 */

var Base = require('./base')
  , output = Base.output
  , utils = require('../utils');

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Doc(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('suite', function(suite){
    if (suite.root) return;
    ++indents;
    output.log('%s<section class="suite">', indent());
    ++indents;
    output.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    output.log('%s<dl>', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    output.log('%s</dl>', indent());
    --indents;
    output.log('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test){
    output.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.fn.toString()));
    output.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });
}
