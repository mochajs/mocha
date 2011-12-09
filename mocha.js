
// CommonJS require()

function require(p){
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

require.modules = {};

require.resolve = function (path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

require.register = function (path, fn){
    require.modules[path] = fn;
  };

require.relative = function (parent) {
    return function(p){
      if ('.' != p[0]) return require(p);
      
      var path = parent.split('/')
        , segs = p.split('/');
      path.pop();
      
      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  };


require.register("browser/debug.js", function(module, exports, require){

module.exports = function(type){
  return function(){
    
  }
};
}); // module: browser/debug.js

require.register("browser/events.js", function(module, exports, require){

/**
 * Expose `EventEmitter`.
 */

exports.EventEmitter = EventEmitter;

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * EventEmitter.
 */

function EventEmitter() {
  this.callbacks = {};
};

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 */

EventEmitter.prototype.on = function(event, fn){
  (this.callbacks[event] = this.callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 */

EventEmitter.prototype.emit = function(event){
  var args = slice.call(arguments, 1)
    , callbacks = this.callbacks[event];

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this;
};

}); // module: browser/events.js

require.register("browser/fs.js", function(module, exports, require){

}); // module: browser/fs.js

require.register("browser/tty.js", function(module, exports, require){

exports.isatty = function(){
  return true;
};

exports.getWindowSize = function(){
  return [window.innerHeight, window.innerWidth];
};
}); // module: browser/tty.js

require.register("hook.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Hook`.
 */

module.exports = Hook;

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Hook(title, fn) {
  Runnable.call(this, title, fn);
}

/**
 * Inherit from `Runnable.prototype`.
 */

Hook.prototype = new Runnable;
Hook.prototype.constructor = Hook;


}); // module: hook.js

require.register("interfaces/bdd.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * BDD-style interface:
 * 
 *      describe('Array', function(){
 *        describe('#indexOf()', function(){
 *          it('should return -1 when not present', function(){
 *
 *          });
 *
 *          it('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
  
    context.describe = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};

}); // module: interfaces/bdd.js

require.register("interfaces/exports.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 * 
 *     exports.Array = {
 *       '#indexOf()': {
 *         'should return -1 when the value is not present': function(){
 *           
 *         },
 *
 *         'should return the correct index when the value is present': function(){
 *           
 *         }
 *       }
 *     };
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('require', visit);

  function visit(obj) {
    var suite;
    for (var key in obj) {
      if ('function' == typeof obj[key]) {
        var fn = obj[key];
        switch (key) {
          case 'before':
            suites[0].beforeAll(fn);
            break;
          case 'after':
            suites[0].afterAll(fn);
            break;
          case 'beforeEach':
            suites[0].beforeEach(fn);
            break;
          case 'afterEach':
            suites[0].afterEach(fn);
            break;
          default:
            suites[0].addTest(new Test(key, fn));
        }
      } else {
        var suite = Suite.create(suites[0], key);
        suites.unshift(suite);
        visit(obj[key]);
        suites.shift();
      }
    }
  }
};
}); // module: interfaces/exports.js

require.register("interfaces/index.js", function(module, exports, require){

exports.bdd = require('./bdd');
exports.tdd = require('./tdd');
exports.exports = require('./exports');
}); // module: interfaces/index.js

require.register("interfaces/tdd.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 *
 *      suite('Array', function(){
 *        suite('#indexOf()', function(){
 *          suiteSetup(function(){
 *
 *          });
 *          
 *          test('should return -1 when not present', function(){
 *
 *          });
 *
 *          test('should return the index when present', function(){
 *
 *          });
 *
 *          suiteTeardown(function(){
 *
 *          });
 *        });
 *      });
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    /**
     * Execute before each test case.
     */

    context.setup = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.teardown = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Execute before the suite.
     */

    context.suiteSetup = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after the suite.
     */

    context.suiteTeardown = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.suite = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};

}); // module: interfaces/tdd.js

require.register("mocha.js", function(module, exports, require){

/*!
 * mocha
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.3.5';

exports.interfaces = require('./interfaces');
exports.reporters = require('./reporters');
exports.Runnable = require('./runnable');
exports.Runner = require('./runner');
exports.Suite = require('./suite');
exports.Hook = require('./hook');
exports.Test = require('./test');
exports.watch = require('./watch');
}); // module: mocha.js

require.register("reporters/base.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var tty = require('browser/tty');

/**
 * Check if both stdio streams are associated with a tty.
 */

var isatty = tty.isatty(1) && tty.isatty(2);

/**
 * Expose `Base`.
 */

exports = module.exports = Base;

/**
 * Enable coloring by default.
 */

exports.useColors = isatty;

/**
 * Default color map.
 */

exports.colors = {
    'pass': 90
  , 'fail': 31
  , 'bright pass': 92
  , 'bright fail': 91
  , 'bright yellow': 93
  , 'pending': 36
  , 'suite': '40'
  , 'error title': 0
  , 'error message': 31
  , 'error stack': 90
  , 'checkmark': 32
  , 'fast': 90
  , 'medium': 33
  , 'slow': 31
  , 'green': 32
  , 'light': 90
};

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @param {String} type
 * @param {String} str
 * @return {String}
 * @api private
 */

var color = exports.color = function(type, str) {
  if (!exports.useColors) return str;
  return '\033[' + exports.colors[type] + 'm' + str + '\033[0m';
};

/**
 * Expose term window size, with some
 * defaults for when stderr is not a tty.
 */

exports.window = {
  width: isatty
    ? process.stdout.getWindowSize
      ? process.stdout.getWindowSize(1)[0]
      : tty.getWindowSize()[1]
    : 75
};

/**
 * Expose some basic cursor interactions
 * that are common among reporters.
 */

exports.cursor = {
  hide: function(){
    process.stdout.write('\033[?25l');
  },

  show: function(){
    process.stdout.write('\033[?25h');
  }
};

/**
 * A test is considered slow if it
 * exceeds the following value in milliseconds.
 */

exports.slow = 75;

/**
 * Outut the given `failures` as a list.
 *
 * @param {Array} failures
 * @api public
 */

exports.list = function(failures){
  console.error();
  failures.forEach(function(test, i){
    // format
    var fmt = color('error title', '  %s) %s:\n')
      + color('error message', '     %s')
      + color('error stack', '\n%s\n');

    // msg
    var err = test.err
      , stack = err.stack
      , message = err.message || ''
      , index = stack.indexOf(message) + message.length
      , msg = stack.slice(0, index);

    // indent stack trace without msg
    stack = stack.slice(index + 1)
      .replace(/^/gm, '  ');

    console.error(fmt, i, test.fullTitle(), msg, stack);
  });
};

/**
 * Initialize a new `Base` reporter.
 *
 * All other reporters generally
 * inherit from this reporter, providing
 * stats such as test duration, number
 * of tests passed / failed etc.
 *
 * @param {Runner} runner
 * @api public
 */

function Base(runner) {
  var self = this
    , stats = this.stats = { suites: 0, tests: 0, passes: 0, failures: 0 }
    , failures = this.failures = [];

  if (!runner) return;
  this.runner = runner;

  runner.on('start', function(){
    stats.start = new Date;
  });

  runner.on('suite', function(suite){
    stats.suites = stats.suites || 0;
    stats.suites++;
  });

  runner.on('test end', function(test){
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function(test){
    stats.passes = stats.passes || 0;

    var medium = exports.slow / 2;
    test.speed = test.duration > exports.slow
      ? 'slow'
      : test.duration > medium
        ? 'medium'
        : 'fast';

    stats.passes++;
  });

  runner.on('fail', function(test, err){
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('end', function(){
    stats.end = new Date;
    stats.duration = new Date - stats.start;
  });
}

/**
 * Output common epilogue used by many of
 * the bundled reporters.
 *
 * @api public
 */

Base.prototype.epilogue = function(){
  var stats = this.stats
    , fmt;

  console.log();

  // failure
  if (stats.failures) {
    fmt = color('bright fail', '  ✖')
      + color('fail', ' %d of %d tests failed')
      + color('light', ':')

    console.error(fmt, stats.failures, this.runner.total);
    Base.list(this.failures);
    console.error();
    return;
  }

  // pass
  fmt = color('bright pass', '  ✔')
    + color('green', ' %d tests complete')
    + color('light', ' (%dms)');

  console.log(fmt, stats.tests || 0, stats.duration);
  console.log();
};

}); // module: reporters/base.js

require.register("reporters/doc.js", function(module, exports, require){

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
    console.log('%s<section class="suite">', indent());
    ++indents;
    console.log('%s<h1>%s</h1>', indent(), suite.title);
    console.log('%s<dl>', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    console.log('%s</dl>', indent());
    --indents;
    console.log('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test){
    console.log('%s  <dt>%s</dt>', indent(), test.title);
    var code = utils.escape(clean(test.fn.toString()));
    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });
}

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

function clean(str) {
  str = str
    .replace(/^function *\(.*\) *{/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length
    , re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str.replace(re, '');

  return str;
}
}); // module: reporters/doc.js

require.register("reporters/dot.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Dot(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , n = 0;

  runner.on('start', function(){
    process.stdout.write('\n  ');
  });

  runner.on('pending', function(test){
    process.stdout.write(color('pending', '.'));
  });

  runner.on('pass', function(test){
    if (++n % width == 0) process.stdout.write('\n  ');
    if ('slow' == test.speed) {
      process.stdout.write(color('bright yellow', '.'));
    } else {
      process.stdout.write(color(test.speed, '.'));
    }
  });

  runner.on('fail', function(test, err){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('fail', '.'));
  });

  runner.on('end', function(){
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Dot.prototype = new Base;
Dot.prototype.constructor = Dot;

}); // module: reporters/dot.js

require.register("reporters/html.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Doc`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */

var statsTemplate = '<ul id="stats">'
  + '<li class="passes">passes: <em>0</em></li>'
  + '<li class="failures">failures: <em>0</em></li>'
  + '<li class="duration">duration: <em>0</em>s</li>'
  + '</ul>';

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTML(runner) {
  Base.call(this, runner);

  // TODO: clean up

  var self = this
    , stats = this.stats
    , total = runner.total
    , root = $('#mocha')
    , stack = [root]
    , stat = $(statsTemplate).appendTo(root);

  if (!root.length) return error('#mocha div missing, add it to your document');

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = $('<div class="suite"><h1>' + suite.title + '</h1></div>');

    // container
    stack[0].append(el);
    stack.unshift($('<div>'));
    el.append(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('test end', function(test){
    // update stats
    var ms = new Date - stats.start;
    stat.find('.passes em').text(stats.passes);
    stat.find('.failures em').text(stats.failures);
    stat.find('.duration em').text((ms / 1000).toFixed(2));

    // test
    if (test.passed) {
      var el = $('<div class="test pass"><h2>' + test.title + '</h2></div>')
    } else if (test.pending) {
      var el = $('<div class="test pass pending"><h2>' + test.title + '</h2></div>')
    } else {
      var el = $('<div class="test fail"><h2>' + test.title + '</h2></div>');
      var str = test.err.stack || test.err;
      var err = $('<pre class="error">' + str + '</pre>');
      el.append(err);
    }

    // toggle code
    el.find('h2').toggle(function(){
      pre.slideDown('fast');
    }, function(){
      pre.slideUp('fast');
    });

    // code
    // TODO: defer
    if (!test.pending) {
      var code = utils.escape(clean(test.fn.toString()));
      var pre = $('<pre><code>' + code + '</code></pre>');
      pre.appendTo(el).hide();
    }
    stack[0].append(el);
  });
}

function error(msg) {
  $('<div id="error">' + msg + '</div>').appendTo('body');
}

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

function clean(str) {
  str = str
    .replace(/^function *\(.*\) *{/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length
    , re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str
    .replace(re, '')
    .replace(/^\s+/, '');

  return str;
}
}); // module: reporters/html.js

require.register("reporters/index.js", function(module, exports, require){

exports.Base = require('./base');
exports.Dot = require('./dot');
exports.Doc = require('./doc');
exports.TAP = require('./tap');
exports.JSON = require('./json');
exports.HTML = require('./html');
exports.List = require('./list');
exports.Spec = require('./spec');
exports.Progress = require('./progress');
exports.Landing = require('./landing');
exports.JSONStream = require('./json-stream');

}); // module: reporters/index.js

require.register("reporters/json-stream.js", function(module, exports, require){

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

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total;

  runner.on('start', function(){
    console.log(JSON.stringify(['start', { total: total }]));
  });

  runner.on('pass', function(test){
    console.log(JSON.stringify(['pass', clean(test)]));
  });

  runner.on('fail', function(test, err){
    console.log(JSON.stringify(['fail', clean(test)]));
  });

  runner.on('end', function(){
    process.stdout.write(JSON.stringify(['end', self.stats]));
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
}); // module: reporters/json-stream.js

require.register("reporters/json.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var obj = {
        stats: self.stats
      , tests: tests.map(clean)
      , failures: failures.map(clean)
      , passes: passes.map(clean)
    };

    process.stdout.write(JSON.stringify(obj));
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
}); // module: reporters/json.js

require.register("reporters/landing.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Landing`.
 */

exports = module.exports = Landing;

/**
 * Airplane color.
 */

Base.colors.plane = 0;

/**
 * Airplane crash color.
 */

Base.colors['plane crash'] = 31;

/**
 * Runway color.
 */

Base.colors.runway = 90;

/**
 * Initialize a new `Landing` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Landing(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , total = runner.total
    , stream = process.stdout
    , plane = color('plane', '✈')
    , crashed = -1
    , n = 0;

  function runway() {
    var buf = Array(width).join('-');
    return '  ' + color('runway', buf);
  }

  runner.on('start', function(){
    stream.write('\n  ');
    cursor.hide();
  });

  runner.on('test end', function(test){
    // check if the plane crashed
    var col = -1 == crashed
      ? width * ++n / total | 0
      : crashed;

    // show the crash
    if (test.failed) {
      plane = color('plane crash', '✈');
      crashed = col;
    }

    // render landing strip
    stream.write('\033[4F\n\n');
    stream.write(runway());
    stream.write('\n  ');
    stream.write(color('runway', Array(col).join('⋅')));
    stream.write(plane)
    stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
    stream.write(runway());
    stream.write('\033[0m');
  });

  runner.on('end', function(){
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Landing.prototype = new Base;
Landing.prototype.constructor = Landing;

}); // module: reporters/landing.js

require.register("reporters/list.js", function(module, exports, require){

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

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , n = 0;

  runner.on('start', function(){
    console.log();
  });

  runner.on('test', function(test){
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  runner.on('pending', function(test){
    var fmt = color('checkmark', '  -')
      + color('pending', ' %s');
    console.log(fmt, test.fullTitle());
  });

  runner.on('pass', function(test){
    var fmt = color('checkmark', '  ✓')
      + color('pass', ' %s: ')
      + color(test.speed, '%dms');
    console.log('\r' + fmt, test.fullTitle(), test.duration);
  });

  runner.on('fail', function(test, err){
    console.log('\r' + color('fail', '  %d) %s'), n++, test.fullTitle());
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

List.prototype = new Base;
List.prototype.constructor = List;

}); // module: reporters/list.js

require.register("reporters/progress.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Progress`.
 */

exports = module.exports = Progress;

/**
 * General progress bar color.
 */

Base.colors.progress = 90;

/**
 * Initialize a new `Progress` bar test reporter.
 *
 * @param {Runner} runner
 * @param {Object} options
 * @api public
 */

function Progress(runner, options) {
  Base.call(this, runner);

  var self = this
    , options = options || {}
    , stats = this.stats
    , width = Base.window.width * .50 | 0
    , total = runner.total
    , complete = 0
    , max = Math.max;

  // default chars
  options.open = options.open || '[';
  options.complete = options.complete || '▬';
  options.incomplete = options.incomplete || '⋅';
  options.close = options.close || ']';
  options.verbose = false;

  // tests started
  runner.on('start', function(){
    console.log();
    cursor.hide();
  });

  // tests complete
  runner.on('test end', function(){
    var incomplete = total - complete
      , percent = complete++ / total
      , n = width * percent | 0
      , i = width - n;

    process.stdout.write('\r\033[J');
    process.stdout.write(color('progress', '  ' + options.open));
    process.stdout.write(Array(n).join(options.complete));
    process.stdout.write(Array(i).join(options.incomplete));
    process.stdout.write(color('progress', options.close));
    if (options.verbose) {
      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
    }
  });

  // tests are complete, output some stats
  // and the failures if any
  runner.on('end', function(){
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Progress.prototype = new Base;
Progress.prototype.constructor = Progress;

}); // module: reporters/progress.js

require.register("reporters/spec.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Spec(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , indents = 0
    , n = 0;

  function indent() {
    return Array(indents).join('  ')
  }

  runner.on('start', function(){
    console.log();
  });

  runner.on('suite', function(suite){
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function(suite){
    --indents;
    if (1 == indents) console.log();
  });

  runner.on('test', function(test){
    process.stdout.write(indent() + color('pass', '  ◦ ' + test.title + ': '));
  });

  runner.on('pending', function(test){
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test){
    if ('fast' == test.speed) {
      var fmt = indent()
        + color('checkmark', '  ✓')
        + color('pass', ' %s ');
      console.log('\r' + fmt, test.title);
    } else {
      var fmt = indent()
        + color('checkmark', '  ✓')
        + color('pass', ' %s ')
        + color(test.speed, '(%dms)');
      console.log('\r' + fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test, err){
    console.log('\r' + indent() + color('fail', '  %d) %s'), n++, test.title);
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

Spec.prototype = new Base;
Spec.prototype.constructor = Spec;

}); // module: reporters/spec.js

require.register("reporters/tap.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function TAP(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , n = 1;

  runner.on('start', function(){
    console.log('%d..%d', 1, total);
  });

  runner.on('test end', function(){
    ++n;
  });

  runner.on('pass', function(test){
    console.log('ok %d %s', n, test.fullTitle());
  });

  runner.on('fail', function(test, err){
    console.log('not ok %d %s', n, test.fullTitle());
    console.log(err.stack.replace(/^/gm, '  '));
  });
}
}); // module: reporters/tap.js

require.register("runnable.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('runnable');

/**
 * Expose `Runnable`.
 */

module.exports = Runnable;

/**
 * Initialize a new `Runnable` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Runnable(title, fn) {
  this.title = title;
  this.fn = fn;
  this.async = fn && fn.length;
  this.sync = ! this.async;
  this._timeout = 2000;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Runnable.prototype = new EventEmitter;
Runnable.prototype.constructor = Runnable;


/**
 * Set & get timeout `ms`.
 *
 * @param {Number} ms
 * @return {Runnable|Number} ms or self
 * @api private
 */

Runnable.prototype.timeout = function(ms){
  if (0 == arguments.length) return this._timeout;
  debug('timeout %d', ms);
  this._timeout = ms;
  return this;
};

/**
 * Return the full title generated by recursively
 * concatenating the parent's full title.
 *
 * @return {String}
 * @api public
 */

Runnable.prototype.fullTitle = function(){
  return this.parent.fullTitle() + ' ' + this.title;
};

/**
 * Clear the timeout.
 *
 * @api private
 */

Runnable.prototype.clearTimeout = function(){
  clearTimeout(this.timer);
};

/**
 * Run the test and invoke `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runnable.prototype.run = function(fn){
  var self = this
    , ms = this.timeout()
    , start = new Date
    , finished
    , emitted;

  // timeout
  if (this.async) {
    this.timer = setTimeout(function(){
      done(new Error('timeout of ' + ms + 'ms exceeded'));
    }, ms);
  }

  // called multiple times
  function multiple() {
    if (emitted) return;
    emitted = true;
    self.emit('error', new Error('done() called multiple times'));
  }

  // finished
  function done(err) {
    if (finished) return multiple();
    self.clearTimeout();
    self.duration = new Date - start;
    finished = true;
    fn(err);
  }

  // async
  if (this.async) {
    try {
      this.fn(function(err){
        if (err instanceof Error) return done(err);
        done();
      });
    } catch (err) {
      done(err);
    }
    return;
  }
  
  // sync
  try {
    if (!this.pending) this.fn();
    this.duration = new Date - start;
    fn();
  } catch (err) {
    fn(err);
  }
};

}); // module: runnable.js

require.register("runner.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('runner')
  , Test = require('./test')
  , noop = function(){};

/**
 * Expose `Runner`.
 */

module.exports = Runner;

/**
 * Initialize a `Runner` for the given `suite`.
 *
 * Events:
 *
 *   - `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `hook`  (hook) hook execution started
 *   - `hook end`  (hook) hook complete
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 *
 * @api public
 */

function Runner(suite) {
  var self = this;
  this._globals = [];
  this.suite = suite;
  this.total = suite.total();
  this.failures = 0;
  this.on('test end', function(test){ self.checkGlobals(test); });
  this.on('hook end', function(hook){ self.checkGlobals(hook); });
  this.grep(/.*/);
  this.globals(Object.keys(global).concat(['errno']));
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Runner.prototype = new EventEmitter;
Runner.prototype.constructor = Runner;


/**
 * Run tests with full titles matching `re`.
 *
 * @param {RegExp} re
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.grep = function(re){
  debug('grep %s', re);
  this._grep = re;
  return this;
};

/**
 * Allow the given `arr` of globals.
 *
 * @param {Array} arr
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.globals = function(arr){
  debug('globals %j', arr);
  arr.forEach(function(arr){
    this._globals.push(arr);
  }, this);
  return this;
};

/**
 * Check for global variable leaks.
 *
 * @api private
 */

Runner.prototype.checkGlobals = function(test){
  if (this.ignoreLeaks) return;

  var leaks = Object.keys(global).filter(function(key){
    return !~this._globals.indexOf(key);
  }, this);

  this._globals = this._globals.concat(leaks);

  if (leaks.length > 1) {
    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));
  } else if (leaks.length) {
    this.fail(test, new Error('global leak detected: ' + leaks[0]));
  }
};

/**
 * Fail the given `test`.
 *
 * @param {Test} test
 * @param {Error} err
 * @api private
 */

Runner.prototype.fail = function(test, err){
  ++this.failures;
  test.failed = true;
  this.emit('fail', test, err);
};

/**
 * Fail the given `hook` with `err`.
 *
 * Hook failures (currently) hard-end due
 * to that fact that a failing hook will
 * surely cause subsequent tests to fail,
 * causing jumbled reporting.
 *
 * @param {Hook} hook
 * @param {Error} err
 * @api private
 */

Runner.prototype.failHook = function(hook, err){
  ++this.failures;
  this.fail(hook, err);
  this.emit('end');
};

/**
 * Run hook `name` callbacks and then invoke `fn()`.
 *
 * @param {String} name
 * @param {Function} function
 * @api private
 */

Runner.prototype.hook = function(name, fn){
  var suite = this.suite
    , hooks = suite['_' + name]
    , ms = suite._timeout
    , self = this
    , timer;

  function next(i) {
    var hook = hooks[i];
    if (!hook) return fn();
    self.currentRunnable = hook;

    self.emit('hook', hook);

    hook.on('error', function(err){
      self.failHook(hook, err);
    });

    hook.run(function(err){
      hook.removeAllListeners('error');
      if (err) return self.failHook(hook, err);
      self.emit('hook end', hook);
      next(++i);
    });
  }

  process.nextTick(function(){
    next(0);
  });
};

/**
 * Run hook `name` for the given array of `suites`
 * in order, and callback `fn(err)`.
 *
 * @param {String} name
 * @param {Array} suites
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hooks = function(name, suites, fn){
  var self = this
    , orig = this.suite;

  function next(suite) {
    self.suite = suite;

    if (!suite) {
      self.suite = orig;
      return fn();
    }

    self.hook(name, function(err){
      if (err) {
        self.suite = orig;
        return fn(err);
      }

      next(suites.pop());
    });
  }

  next(suites.pop());
};

/**
 * Run hooks from the top level down.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookUp = function(name, fn){
  var suites = [this.suite].concat(this.parents()).reverse();
  this.hooks(name, suites, fn);
};

/**
 * Run hooks from the bottom up.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookDown = function(name, fn){
  var suites = [this.suite].concat(this.parents());
  this.hooks(name, suites, fn);
};

/**
 * Return an array of parent Suites from
 * closest to furthest.
 *
 * @return {Array}
 * @api private
 */

Runner.prototype.parents = function(){
  var suite = this.suite
    , suites = [];
  while (suite = suite.parent) suites.push(suite);
  return suites;
};

/**
 * Run the current test and callback `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTest = function(fn){
  var test = this.test
    , self = this;

  try {
    test.on('error', function(err){
      self.fail(test, err);
    });
    test.run(fn);
  } catch (err) {
    fn(err);
  }
};

/**
 * Run tests in the given `suite` and invoke
 * the callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTests = function(suite, fn){
  var self = this
    , tests = suite.tests
    , test;

  function next(err) {
    // next test
    test = tests.shift();

    // all done
    if (!test) return fn();

    // grep
    if (!self._grep.test(test.fullTitle())) return next();

    // pending
    if (test.pending) {
      self.emit('pending', test);
      self.emit('test end', test);
      return next();
    }

    // execute test and hook(s)
    self.emit('test', self.test = self.currentRunnable = test);
    self.hookDown('beforeEach', function(){
      self.runTest(function(err){
        if (err) {
          self.fail(test, err);
          self.emit('test end', test);
          return self.hookUp('afterEach', next);
        }

        self.emit('pass', test);
        test.passed = true;
        self.emit('test end', test);
        self.hookUp('afterEach', next);
      });
    });
  }

  next();
};

/**
 * Run the given `suite` and invoke the
 * callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runSuite = function(suite, fn){
  var self = this
    , i = 0;

  debug('run suite %s', suite.fullTitle());
  this.emit('suite', this.suite = suite);

  function next() {
    var curr = suite.suites[i++];
    if (!curr) return done();
    self.runSuite(curr, next);
  }

  function done() {
    self.suite = suite;
    self.hook('afterAll', function(){
      self.emit('suite end', suite);
      fn();
    });
  }

  this.hook('beforeAll', function(){
    self.runTests(suite, next);
  });
};

/**
 * Run the root suite and invoke `fn(failures)`
 * on completion.
 *
 * @param {Function} fn
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.run = function(fn){
  var self = this
    , fn = fn || function(){};

  debug('start');

  // callback
  self.on('end', function(){
    debug('end');
    process.removeListener('uncaughtException', uncaught);
    fn(self.failures);
  });

  // run suites
  this.emit('start');
  this.runSuite(this.suite, function(){
    debug('finished running');
    self.emit('end');
  });

  // uncaught exception
  function uncaught(err){
    debug('uncaught exception');
    self.currentRunnable.clearTimeout();
    self.fail(self.currentRunnable, err);
    self.emit('test end', self.test);
    self.emit('end');
  }

  process.on('uncaughtException', uncaught);

  return this;
};

}); // module: runner.js

require.register("suite.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('suite')
  , Hook = require('./hook');

/**
 * Expose `Suite`.
 */

exports = module.exports = Suite;

/**
 * Suite map.
 */

var map = {};

/**
 * Reset the suite map.
 *
 * @api public
 */

exports.reset = function(){
  map = {};
};

/**
 * Create a new `Suite` with the given `title`
 * and parent `Suite`. When a suite with the
 * same title is already present, that suite
 * is returned to provide nicer reporter
 * and more flexible meta-testing.
 *
 * @param {Suite} parent
 * @param {String} title
 * @return {Suite}
 * @api public
 */

exports.create = function(parent, title){
  var suite = new Suite(title);
  suite.parent = parent;
  title = suite.fullTitle();
  if (map[title]) return map[title];
  parent.addSuite(suite);
  return map[title] = suite;
};

/**
 * Initialize a new `Suite` with the given `title`.
 *
 * @param {String} title
 * @api private
 */

function Suite(title) {
  this.title = title;
  this.suites = [];
  this.tests = [];
  this._beforeEach = [];
  this._beforeAll = [];
  this._afterEach = [];
  this._afterAll = [];
  this.root = !title;
  this._timeout = 2000;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Suite.prototype = new EventEmitter;
Suite.prototype.constructor = Suite;


/**
 * Return a clone of this `Suite`.
 *
 * @return {Suite}
 * @api private
 */

Suite.prototype.clone = function(){
  var suite = new Suite(this.title);
  debug('clone');
  suite.timeout(this.timeout());
  return suite;
};

/**
 * Set timeout `ms` or short-hand such as "2s".
 *
 * @param {Number|String} ms
 * @return {Suite|Number} for chaining
 * @api private
 */

Suite.prototype.timeout = function(ms){
  if (0 == arguments.length) return this._timeout;
  if (String(ms).match(/s$/)) ms = parseFloat(ms) * 1000;
  debug('timeout %d', ms);
  this._timeout = parseInt(ms, 10);
  return this;
};

/**
 * Run `fn(test[, done])` before running tests.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.beforeAll = function(fn){
  var hook = new Hook('"before all" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  this._beforeAll.push(hook);
  this.emit('beforeAll', hook);
  return this;
};

/**
 * Run `fn(test[, done])` after running tests.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.afterAll = function(fn){
  var hook = new Hook('"after all" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  this._afterAll.push(hook);
  this.emit('afterAll', hook);
  return this;
};

/**
 * Run `fn(test[, done])` before each test case.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.beforeEach = function(fn){
  var hook = new Hook('"before each" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  this._beforeEach.push(hook);
  this.emit('beforeEach', hook);
  return this;
};

/**
 * Run `fn(test[, done])` after each test case.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.afterEach = function(fn){
  var hook = new Hook('"after each" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  this._afterEach.push(hook);
  this.emit('afterEach', hook);
  return this;
};

/**
 * Add a test `suite`.
 *
 * @param {Suite} suite
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.addSuite = function(suite){
  suite.parent = this;
  suite.timeout(this.timeout());
  this.suites.push(suite);
  this.emit('suite', suite);
  return this;
};

/**
 * Add a `test` to this suite.
 *
 * @param {Test} test
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.addTest = function(test){
  test.parent = this;
  test.timeout(this.timeout());
  this.tests.push(test);
  this.emit('test', test);
  return this;
};

/**
 * Return the full title generated by recursively
 * concatenating the parent's full title.
 *
 * @return {String}
 * @api public
 */

Suite.prototype.fullTitle = function(){
  if (this.parent) {
    var full = this.parent.fullTitle();
    if (full) return full + ' ' + this.title;
  }
  return this.title;
};

/**
 * Return the total number of tests.
 *
 * @return {Number}
 * @api public
 */

Suite.prototype.total = function(){
  return this.suites.reduce(function(sum, suite){
    return sum + suite.total();
  }, 0) + this.tests.length;
};

}); // module: suite.js

require.register("test.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Test`.
 */

module.exports = Test;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Test(title, fn) {
  Runnable.call(this, title, fn);
  this.pending = !fn;
}

/**
 * Inherit from `Runnable.prototype`.
 */

Test.prototype = new Runnable;
Test.prototype.constructor = Test;


}); // module: test.js

require.register("utils.js", function(module, exports, require){

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
}); // module: utils.js

require.register("watch.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var fs = require('browser/fs')
  , debug = require('browser/debug')('watch');

module.exports = function(paths, fn){
  var options = { interval: 100 };
  paths.forEach(function(path){
    debug('watch %s', path);
    fs.watchFile(path, options, function(curr, prev){
      if (prev.mtime < curr.mtime) fn(path);
    });
  });
};
}); // module: watch.js

/**
 * Node shims.
 *
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code in
 * the browser.
 */

process = {};
process.exit = function(status){};
process.stdout = {};
global = this;

process.nextTick = function(fn){
  setTimeout(fn, 0);
};

process.removeListener = function(ev){
  if ('uncaughtException' == ev) {
    window.onerror = null;
  }
};

process.on = function(ev, fn){
  if ('uncaughtException' == ev) {
    window.onerror = fn;
  }
};

mocha = require('mocha');

// boot
;(function(){
  var suite = new mocha.Suite;
  var Reporter = mocha.reporters.HTML;

  function parse(qs) {
    return qs
      .replace('?', '')
      .split('&')
      .reduce(function(obj, pair){
        var i = pair.indexOf('=')
          , key = pair.slice(0, i)
          , val = pair.slice(++i);

        obj[key] = decodeURIComponent(val);
        return obj;
      }, {});
  }

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
    var query = parse(window.location.search || "");
    if (query.grep) runner.grep(new RegExp(query.grep));
    return runner.run();
  };
})();
