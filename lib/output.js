var debug = require('debug')('mocha:output');
var util = require('util');
var fs = require('fs');
var stream = require('stream');

// Initialize in stdout mode
var ostream = exports.ostream = process.stdout;

/**
 * Write preformatted output directly to the stream.
 */
exports.write = function(data) {
    ostream.write(data);
};


/**
 * Wrapper for log output.
 */
exports.log = function() {
    if (ostream === process.stdout) {
        console.log.apply(console, arguments);
    } else {
        ostream.write(util.format.apply(util, arguments) + "\n");
    }
};

/**
 * Wrapper for error output.
 */
exports.error = function() {
    if (ostream === process.stdout) {
        console.error.apply(console, arguments);
    } else {
        ostream.write(util.format.apply(util, arguments) + "\n");
    }
};

/**
 * Hook that's called when the test process is done to close the
 * ostream ostream.
 */
exports.end = function(errCount, fn) {
    if (ostream === process.stdout) {
        // nothing to do
        return fn(errCount);
    }

    ostream.end(function() { 
        debug("ostream ended");
        fn(errCount);

        // Reset the ostream
        ostream = process.stdout;
    } );
};

/**
 * Initialize the output module.
 *
 * If target is undefined or "-" then use stdout, otherwise open the
 * target file.
 */
var initialize = exports.initialize = function(target) {
    if (target === undefined) {
        return ostream; // don't change
    }

    if (target === "-") {
        ostream = exports.ostream = process.stdout;
    } else if (target instanceof stream) {
        ostream = exports.ostream = target;
    } else {
        ostream = exports.ostream = fs.createWriteStream(target);
    }

    return ostream;
};
