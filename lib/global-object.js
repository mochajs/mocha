'use strict';

/**
 * Module dependencies.
 */

var utils = require('./utils');

/**
 * Expose `GlobalObject`.
 */

module.exports = GlobalObject;

/**
 * Initialize `GlobalObject`.
 *
 */
function GlobalObject() {
  if (!(this instanceof GlobalObject)) {
    return new GlobalObject();
  }
  this._cache = null;
}

/**
 * Cache all functions in the `global object.
 *
 * @api public
 */

GlobalObject.prototype.save = function(){
  if (!this._cache) {
    this._cache = saveGlobalObject(global);
  }
  return this._cache;
};

/**
 * Restore cached functions back to the global object.
 *
 * @api public
 */

GlobalObject.prototype.restore = function(){
  if (this._cache) {
    restoreGlobalObject(this._cache, global);
  }
}

function saveGlobalObject(object, checklist) {
  var checklist = checklist ? checklist : [];
  var val = {};

  if (utils.type(object) === 'global' && arguments.length > 1) {
    return;
  }

  for(var i=0; i<checklist.length; i++) {
    if (checklist === checklist[i]) {
      return;
    }
  }
  checklist.push(object);

  for(var prop in object) {
    if(utils.type(object[prop]) === 'object' || utils.type(object[prop]) === 'process') {
      val[prop] = saveGlobalObject(object[prop], checklist);
    }

    if(utils.type(object[prop]) === 'function') {
      val[prop] = object[prop];
    }
  }

  return val;
}


function restoreGlobalObject(source, target) {
  for(var prop in source) {
    if(utils.type(source[prop]) === 'object' || utils.type(source[prop]) === 'process') {
      if ('object' !== typeof target[prop]) {
        target[prop] = {};
      }
      restoreGlobalObject(source[prop], target[prop]);
    }
    
    if(utils.type(source[prop]) === 'function') {
      target[prop] = source[prop]
    }
  }
}

