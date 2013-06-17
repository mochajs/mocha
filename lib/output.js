var debug = require('debug')('mocha:output');
var util = require('util');
var fs = require('fs');

// Initialize to be in stdout mode
var stream = exports.stream = process.stdout;

/**
 * Write preformatted output directly to the stream.
 */
var write = exports.write = function(data) {
    stream.write(data);
};


/**
 * Wrapper for log output.
 */
var log = exports.log = function() {
    if (stream === process.stdout) {
        console.log.apply(console, arguments);
    } else {
        stream.write(util.format.apply(util, arguments) + "\n");
    }
};

/**
 * Wrapper for error output.
 */
var error = exports.error = function() {
    if (stream === process.stdout) {
        console.error.apply(console, arguments);
    } else {
        stream.write(util.format.apply(util, arguments) + "\n");
    }
};

/**
 * Hook that's called when the test process is done to close the
 * output stream.
 */
var end = exports.end = function(errCount, fn) {
    if (stream === process.stdout) {
        // nothing to do
        return fn(errCount);
    }

    stream.end(function() { 
        debug("stream ended");
        fn(errCount);

        // Reset the stream
        stream = process.stdout;
    } );
};

/**
 * Initialize the output layer.
 *
 * If target is undefined or "-" then use stdout, otherwise open the
 * target file.
 */
var initialize = exports.initialize = function(target) {
    if (target === undefined || target === "-") {
        return; // nothing to do - stay in stdout mode
    }

    stream = exports.stream = fs.createWriteStream(target);
};


