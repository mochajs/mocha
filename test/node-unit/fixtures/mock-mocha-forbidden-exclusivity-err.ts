/*
 Mock file that simulates a Mocha FORBIDDEN_EXCLUSIVITY error
 This error is thrown when .only is used in parallel mode
 */
const { createForbiddenExclusivityError } = require('../../../lib/errors');

// Simulate a mocha instance in worker mode
const mockMocha = { isWorker: true };

throw createForbiddenExclusivityError(mockMocha);
