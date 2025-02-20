'use strict';

exports.mochaGlobalTeardown = async function () { 
    throw new Error('Teardown problem');
}