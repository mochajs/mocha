// Shared constants to avoid circular dependencies

/**
 * Shared deadline for everything a single `runMochaWatchAsync` call waits
 * on.
 * 
 * Suites using the watch helpers must keep their test timeouts above
 * this, so that the helper's diagnostic error wins the race against Mocha's
 * own timeout.
 */
export const DEFAULT_WATCH_BUDGET_MS = 50000;