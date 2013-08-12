
/**
 * Helpers.
 */

var units = {};
units.second = 1000;
units.minute = units.second * 60;
units.hour = units.minute * 60;
units.day = units.hour * 24;

/**
 * Parse or format the given `val`.
 *
 * @param {String|Number} val
 * @return {String|Number}
 * @api public
 */

module.exports = function(val){
  if ('string' == typeof val) return parse(val);
  return format(val);
}

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var m = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!m) return;
  var n = parseFloat(m[1]);
  var type = (m[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * 31557600000;
    case 'days':
    case 'day':
    case 'd':
      return n * 86400000;
    case 'hours':
    case 'hour':
    case 'h':
      return n * 3600000;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * 60000;
    case 'seconds':
    case 'second':
    case 's':
      return n * 1000;
    case 'ms':
      return n;
  }
}

/**
 * Format the given `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api public
 */

function format(ms) {
  var unit;

  if (ms >= units.day) unit = 'day';
  else if (ms >= units.hour) unit = 'hour';
  else if (ms >= units.minute) unit = 'minute';
  else if (ms >= units.second)  unit = 'second';

  if (unit) {
    ms = Math.round(ms / units[unit]);
    if (ms !== 1) {
      unit += 's';
    }
  } else {
    unit = 'ms';
  }

  return ms + ' ' + unit;
}
