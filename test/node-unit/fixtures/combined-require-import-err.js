/**
 * Fixture for testing combined require/import error reporting.
 * Throws a custom error that is neither TSError nor Mocha error.
 */
throw new Error('Custom load failure for combined error test');
