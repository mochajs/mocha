"use strict";

/**
 @module Pending
*/

/**
 * Initialize a new `PendingError` error with the given message.
 *
 * @param {string} message
 */
class PendingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PendingError';
  }
}

module.exports = PendingError;
