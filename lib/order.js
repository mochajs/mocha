// @ts-check

/**
 * Helpers for the `--order` option: parsing the option value and shuffling
 * the suite tree with a seeded pseudo-random number generator, so that a
 * randomized run can be reproduced by supplying the same seed.
 *
 * @module
 * @private
 */

/**
 * Run order constants.
 */
export const ORDER_DEFAULT = "default";
export const ORDER_RANDOM = "random";

/**
 * A parsed `order` option value.
 *
 * @typedef {Object} ParsedOrder
 * @property {string} mode - One of `"default"` or `"random"`.
 * @property {number|null} seed - Seed for randomization; `null` if none given.
 */

/**
 * Parses an `order` option value.
 *
 * Valid values are `default`, `random` and `random:<seed>`, where `<seed>`
 * is a non-negative integer. Seeds are normalized to unsigned 32-bit
 * integers; the normalized seed is what gets reported and reproduces a run.
 *
 * @param {string} value - Raw option value
 * @returns {ParsedOrder|null} Parsed value, or `null` if invalid
 */
export function parseOrder(value) {
  if (value === ORDER_DEFAULT) {
    return { mode: ORDER_DEFAULT, seed: null };
  }
  if (value === ORDER_RANDOM) {
    return { mode: ORDER_RANDOM, seed: null };
  }
  const match = /^random:(\d{1,10})$/.exec(value);
  if (match) {
    return { mode: ORDER_RANDOM, seed: Number(match[1]) >>> 0 };
  }
  return null;
}

/**
 * Generates a random seed suitable for {@link randomizeOrder}.
 *
 * @returns {number} Unsigned 32-bit integer seed
 */
export function generateOrderSeed() {
  return Math.floor(Math.random() * 0x100000000) >>> 0;
}

/**
 * Creates a seeded pseudo-random number generator (mulberry32).
 *
 * Small and dependency-free; quality is more than sufficient for shuffling
 * test order, and identical seeds yield identical sequences on any platform.
 *
 * @param {number} seed - Seed value
 * @returns {function(): number} Function returning numbers in `[0, 1)`
 */
function createRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/**
 * Shuffles `array` in place using the Fisher-Yates algorithm.
 *
 * @param {Array<*>} array - Array to shuffle
 * @param {function(): number} random - Function returning numbers in `[0, 1)`
 */
function shuffle(array, random) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
}

/**
 * Randomizes the run order of `suite` and all of its descendants in place.
 *
 * Sibling suites and sibling tests are shuffled within their parent suite;
 * the suite hierarchy itself is preserved, so hooks (`before`, `beforeEach`,
 * etc.) run exactly as often as they would in a non-randomized run.
 *
 * @param {import('./suite.js').Suite} suite - Root of the (sub)tree to shuffle
 * @param {number} seed - Seed for the pseudo-random number generator
 */
export function randomizeOrder(suite, seed) {
  const random = createRandom(seed);
  (function randomizeSuite(currentSuite) {
    shuffle(currentSuite.suites, random);
    shuffle(currentSuite.tests, random);
    currentSuite.suites.forEach(randomizeSuite);
  })(suite);
}
