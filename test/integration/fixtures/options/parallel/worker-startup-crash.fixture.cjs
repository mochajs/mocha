"use strict";

// Loaded via NODE_OPTIONS=--require by the test for workers that fail to
// start. Throws only inside a worker process, whose entry point is
// Mocha's worker script, so the main process is unaffected while every
// worker crashes before it can run anything.
if (/worker\.c?js$/.test(process.argv[1] || "")) {
  throw new Error("worker failed to start");
}
