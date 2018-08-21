'use strict';

function MochaError(message, code) {
  this.name = 'MochaError';
  this.message = message;
  this.code = code;
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
}
MochaError.prototype = Error.prototype;

module.exports = MochaError;
