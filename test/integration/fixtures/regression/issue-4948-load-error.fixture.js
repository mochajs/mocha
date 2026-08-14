"use strict";

// Thrown during load (not inside a test) so Mocha must surface the error
// instead of exiting with no reporter output. See issue #4948.
throw new Error("intentional load failure from issue 4948");
