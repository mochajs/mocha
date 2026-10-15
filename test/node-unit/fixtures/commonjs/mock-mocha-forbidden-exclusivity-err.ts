/*
 Mock file that simulates a Mocha FORBIDDEN_EXCLUSIVITY error
 This error is thrown when .only is used in parallel mode

 This fixture uses require(), so it lives in a folder with a "commonjs" package.json.
 The root package.json is "type": "module" which would otherwise make Node load this 
 .ts file as ESM and leave "require" undefined.
 */
const { createForbiddenExclusivityError } = require('../../../../lib/errors.js');

const mockMocha = { isWorker: true };

throw createForbiddenExclusivityError(mockMocha);
