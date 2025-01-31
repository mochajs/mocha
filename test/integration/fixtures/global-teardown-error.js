'use strict'

const { it } = require('../../../lib/mocha');

it('should pass', () => {});

exports.mochaTeardown = async function () {
    throw new Error('Teardown problem')
}