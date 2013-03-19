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
global = ('undefined' === typeof window) ? self : window;

/**
 * next tick implementation.
 */

process.nextTick = (function(){
  // postMessage behaves badly on IE8
  if (global.ActiveXObject || !global.postMessage) {
    return function(fn){ fn() };
  }

  // based on setZeroTimeout by David Baron
  // - http://dbaron.org/log/20100309-faster-timeouts
  var timeouts = []
    , name = 'mocha-zero-timeout'

  if ('undefined' === typeof window) {
    // Web Worker implementation.
    if ('function' === typeof MessageChannel) {
      var channel = new MessageChannel();
      channel.port1.onmessage = function() {
        if (timeouts.length) timeouts.shift()();
      }
      return function(fn) {
        timeouts.push(fn);
        channel.port2.postMessage('*');
      }
    } else {
      return function(fn) { fn() };
    }
  } else {
    window.addEventListener('message', function(e){
      if (e.source == window && e.data == name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
      }
    }, true);

    return function(fn){
      timeouts.push(fn);
      window.postMessage(name, '*');
    }
  }
})();

/**
 * Remove uncaughtException listener.
 */

process.removeListener = function(e){
  if ('uncaughtException' == e) {
    global.onerror = function(){};
  }
};

/**
 * Implements uncaughtException listener.
 */

process.on = function(e, fn){
  if ('uncaughtException' == e) {
    global.onerror = function(err, url, line){
      fn(new Error(err + ' (' + url + ':' + line + ')'));
    };
  }
};

// boot
;(function(){

  /**
   * Expose mocha.
   */

  var Mocha = global.Mocha = require('mocha'),
      mocha = global.mocha = new Mocha({ reporter: 'html' });

  /**
   * Override ui to ensure that the ui functions are initialized.
   * Normally this would happen in Mocha.prototype.loadFiles.
   */

  mocha.ui = function(ui){
    Mocha.prototype.ui.call(this, ui);
    this.suite.emit('pre-require', global, null, this);
    return this;
  };

  /**
   * Setup mocha with the given setting options.
   */

  mocha.setup = function(opts){
    if ('string' == typeof opts) opts = { ui: opts };
    for (var opt in opts) this[opt](opts[opt]);
    return this;
  };

  /**
   * Run mocha, returning the Runner.
   */

  mocha.run = function(fn){
    var options = mocha.options;
    mocha.globals('location');

    var location = ('undefined' === typeof window) ? self.location : window.location;
    var query = Mocha.utils.parseQuery(location.search || '');
    if (query.grep) mocha.grep(query.grep);
    if (query.invert) mocha.invert();

    return Mocha.prototype.run.call(mocha, function(){
      if ('undefined' !== typeof document) {
        Mocha.utils.highlightTags('code');
      }
      if (fn) fn();
    });
  };
})();
