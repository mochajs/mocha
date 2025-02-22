'use strict'

const { it } = require('../../../lib/mocha');

it('should pass', () => {});

exports.mochaGlobalTeardown = async function () {
    throw new Error('Teardown problem')
}