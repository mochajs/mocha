
/**
 * Module dependencies
 */

var requirejs = require('requirejs');

/**
 * Expose `RequireJs FileLoad`
 */

module.exports = LoadModule;

/**
 * Setup requirejs configuration.
 */

requirejs.config({
  baseUrl: process.cwd(),
  nodeRequire: require
});

var useRequireJs = false;

/**
 * Load module using either Node's native require or the with the RequireJs AMD specification.
 */

function LoadModule(file){
  return useRequireJs
    ? requirejs(file)
    : require(file);
};

/**
 * Set the method of module loading to use RequireJs.
 */

module.exports.UseRequireJs = function(){
  useRequireJs = true;
};
