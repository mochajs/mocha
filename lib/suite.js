
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;

module.exports = Suite;

function Suite(title) {
  this.title = title;
  this.suites = [];
  this.tests = [];
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Suite.prototype.__proto__ = EventEmitter.prototype;

Suite.prototype.addSuite = function(suite){
  suite.parent = this;
  this.suites.push(suite);
  return this;
};

Suite.prototype.addTest = function(test){
  test.parent = this;
  this.tests.push(test);
  return this;
};

Suite.prototype.fullTitle = function(){
  if (this.parent) {
    var full = this.parent.fullTitle();
    if (full) return full + ' ' + this.title;
  }
  return this.title;
};

Suite.prototype.total = function(){
  return this.suites.reduce(function(sum, suite){
    return sum + suite.total();
  }, 0) + this.tests.length;
};
