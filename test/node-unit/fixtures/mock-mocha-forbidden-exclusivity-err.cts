/*
 Mock file that simulates a Mocha FORBIDDEN_EXCLUSIVITY error
 This error is thrown when .only is used in parallel mode

 It has to stay .cts, the root package.json is "type": "module", so a .ts file
 here is loaded as ESM and "require" below would not be defined.
 */
const { createForbiddenExclusivityError } = require('../../../lib/errors.js');

const mockMocha = { isWorker: true };

throw createForbiddenExclusivityError(mockMocha);
