// Loaded via --require so every parallel worker throws during startup.
if (/worker\.[cm]?js$/.test(process.argv[1] ?? "")) {
  throw new Error("worker failed to start");
}
