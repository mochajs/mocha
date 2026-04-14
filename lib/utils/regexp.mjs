// @ts-check

/**
 * Escapes special characters in a string to make it safe for use in regular expressions.
 *
 * @param {string} value - The string to escape
 * @returns {string} The escaped string safe for use in regular expressions
 */
export function escapeRegExp (value) {
  // TODO [engine:node@>=24]: Replace with built in RegExp.escape()
  return value
    .replaceAll(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replaceAll('-', '\\x2d');
}
