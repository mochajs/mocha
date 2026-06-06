'use strict';

exports.mochaGlobalSetup = async function() {
  this.foo = 'bar';
  console.log(`setup: this.foo = ${this.foo}`);
};

exports.mochaGlobalTeardown = async function() {
  console.log(`teardown: this.foo = ${this.foo}`);
};
