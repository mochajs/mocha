
/**
 * Module dependencies.
 */

var Base = require('./base')
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
    mconsole.log('%s<section class="suite">', indent());
    ++indents;
    mconsole.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
    mconsole.log('%s<dl>', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    mconsole.log('%s</dl>', indent());
    --indents;
    mconsole.log('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test){
    mconsole.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
    var code = utils.escape(utils.clean(test.fn.toString()));
    mconsole.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });
}
