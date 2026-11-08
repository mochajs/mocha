"use strict";
if (/worker\.c?js$/.test(process.argv[1] ?? "")) {
  throw new Error("worker failed to start");
}
