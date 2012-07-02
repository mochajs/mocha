
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `CovJS`.
 */

exports = module.exports = CovJS;

/**
 * Initialize a new `CoverJS` reporter.
 *
 * @param {Runner} runner
 * @param {Boolean} output
 * @api public
 */

function CovJS(runner, output) {
  var self = this
    , output = 1 == arguments.length ? true : output;

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
    var cov = global.__$coverObject || {};
    var result = self.cov = map(cov);
    result.stats = self.stats;
    result.tests = tests.map(clean);
    result.failures = failures.map(clean);
    result.passes = passes.map(clean);
    if (!output) return;
    process.stdout.write(JSON.stringify(result, null, 2 ));
  });
}

/**
 * Map jscoverage data to a JSON structure
 * suitable for reporting.
 *
 * @param {Object} cov
 * @return {Object}
 * @api private
 */

function map(cov) {
  var ret = {
      instrumentation: 'node-coverjs'
    , ssoc: 0
    , hits: 0
    , misses: 0
    , coverage: 0
    , files: []
  };

  for (var filename in cov) {
    var data = coverage(filename, cov[filename]);
    ret.files.push(data);
    ret.hits += data.hits;
    ret.misses += data.misses;
    ret.ssoc += data.ssoc;
  }

  if (ret.ssoc > 0) {
    ret.coverage = (ret.hits / ret.ssoc) * 100;
  }

  return ret;
};

/**
 * Map coverjs data for a single source file.
 *
 * @param {String} filename name of the source file
 * @param {Object} data coverjs coverage data
 * @return {Object}
 * @api private
 */

function coverage(filename, data) {
  var ret = {
    filename: filename,
    coverage: 0,
    hits: 0,
    misses: 0,
    ssoc: 0,
    source: {}
  },
  __code = data['__code'],
  data = dataToArray(data),
  parts,
  points = [],
  point,
  inject;

  data.forEach(function(range, id) {
    addPoint(points, range.from, id, true, range.cover);
    addPoint(points, range.to, id, false, range.cover);

    if (!range.cover) {
      ret.misses++;
    } else {
      ret.hits++;
    }
    ret.ssoc++;

  });

  points.sort(function(a, b) {
    return a.index - b.index;
  });

  var s = '';

  if (points.length) {
    var i = 0;

    // check if code starts with statement
    if (points[0].index !== '0') {
      s += __code.substring(0, points[0].index);
      i++;
    }

    // inject cover stat in code
    for (; i < points.length; i++) {
      point = points[i];
      inject = '$$$#covjs#' + point.id + ':' + point.cover + '$$$';
      if (i !== points.length - 1) {
        s += inject + __code.substring(point.index, points[i + 1].index);
      } else {
        s += inject + __code.substring(point.index, __code.length);
      }
    }
  }

  // split code into lines and look at stat per line
  s.split('\n').forEach(function(line, num) {
    var _line = [],
        covered = true;

    line.split('$$$').forEach(function(part) {
      if (part.length && part.indexOf('#covjs#') === 0) {
        var stat = part.substring(7).split(':'); // 7 - '#covjs#'.length
        if (stat[1] === '0') covered = false;

        _line.push({ id: stat[0], cover: stat[1], html: true });
      } else {
        _line.push({ src: part, html: false });
      }
    });

    ret.source[num] = {
        parts: _line,
        covered: covered
    };

  });

  ret.coverage = ret.hits / ret.ssoc * 100;

  return ret;
}

/**
 * Convert data object to array.
 */

function dataToArray(data) {
  var _data = [],
      parts;

  for (var range in data) {
    if (range !== '__code') {
      parts = range.split(':');
      _data.push({
        from: parts[0],
        to: parts[1],
        cover: data[range]
      });
    }
  }

  return _data;
}

/**
 * Add coverage point.
 */

function addPoint(points, index, id, from, cover) {
  points.push({
    index: index,
    id: id,
    from: from,
    cover: cover
  });

  return points;
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
