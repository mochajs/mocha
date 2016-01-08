/**
 * Dependencies.
 */

var fs = require('fs')
  , path = require('path');

/**
 * Export `getOptions`.
 */

module.exports = getOptions;

/**
 * Get options.
 */

function getOptions() {
  var lookupOptsPaths = ['mocha.opts', 'test/mocha.opts'];

  process.argv.slice(2)
    .forEach(function (arg, i, argv){
      var regex = /^\-\-?/
        , isOptionArg = argv[i - 1] && regex.test(argv[i - 1]) || regex.test(arg);
      if (isOptionArg) return;
      Array.prototype.unshift.apply(lookupOptsPaths, getOptionsLookupTree(arg));
    })

  if (~process.argv.indexOf('--opts')) {
    lookupOptsPaths.length = 0;
    lookupOptsPaths.push(process.argv[process.argv.indexOf('--opts') + 1]); // max priority
  }

  try {
    var optsPath;
    while(optsPath = lookupOptsPaths.shift()){
      if (!fs.existsSync(optsPath))
        continue;
      var opts = fs.readFileSync(optsPath, 'utf8')
        .replace(/\\\s/g, '%20')
        .split(/\s/)
        .filter(Boolean)
        .map(function(value) {
          return value.replace(/%20/g, ' ');
        });
      process.argv = process.argv
        .slice(0, 2)
        .concat(opts.concat(process.argv.slice(2)));
      break;
    }
  } catch (err) {
    // ignore
  }

  process.env.LOADED_MOCHA_OPTS = true;
}

/**
 * Get option's lookup tree.
 */

function getOptionsLookupTree(filepath){
  try {
    var dirname = fs.lstatSync(filepath).isDirectory() ? filepath : path.dirname(filepath);
    return dirname.split(path.sep).map(function(_, index, array){
      return path.join.apply(null, array.slice(0, array.length - index).concat('mocha.opts'));
    })
  } catch (err) {
    return []; // path does not exist
  }
}
