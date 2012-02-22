
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `JSON` containing coverage data.
 */

exports = module.exports = JsCoverageReporter;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JsCoverageReporter(runner) {
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
    var coverage = global._$jscoverage || {};
    var result = map(coverage);
    result.stats = self.stats;
    result.tests = tests.map(clean);
    result.failures = failures.map(clean);
    result.passes = passes.map(clean);

    process.stdout.write(JSON.stringify(result));
  });
}

/**
 * Map jscoverage data to a JSON structure
 * suitable for reporting.
 *
 * @param {Object} coverageMap jscoverage data
 * @return {Object}
 * @api private
 */

function map(coverageMap) {
  var ret = {
    instrumentation: 'node-jscoverage',
    sloc: 0,
    hits: 0,
    misses: 0,
    coverage: 0,
    files: []
  };

  for (var filename in coverageMap) {
    if (coverageMap.hasOwnProperty(filename)) {
      var data = coverage(filename, coverageMap[filename]);
      ret.files.push(data);
      ret.hits += data.hits;
      ret.misses += data.misses;
      ret.sloc += data.sloc;
    }
  }

  if (ret.sloc > 0) {
    ret.coverage = (ret.hits / ret.sloc) * 100;
  }

  return ret;
};

/**
 * Map jscoverage data for a single source file
 * to a JSON structure suitable for reporting.
 *
 * @param {String} filename name of the source file
 * @param {Object} data jscoverage coverage data
 * @return {Object}
 * @api private
 */

function coverage(filename, data) {
  var ret = {
    filename: filename,
    coverage: 0,
    hits: 0,
    misses: 0,
    sloc: 0,
    source: {}
  };

  data.source.forEach(function (line, num) {
    num++;

    if (data[num] === 0) {
      ret.misses++;
      ret.sloc++;
    } else if (data[num] !== undefined) {
      ret.hits++;
      ret.sloc++;
    }

    ret.source[num] = { line: line, coverage: (data[num] === undefined ? '' : data[num]) };
  });

  ret.coverage = (ret.hits / ret.sloc) * 100;

  return ret;
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
