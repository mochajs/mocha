'use strict';

exports.mochaGlobalSetup = [
  async function() {
    this.foo = 0;
  },
  function() {
    this.foo = this.foo + 1;
  }
];

exports.mochaGlobalTeardown = [
  async function() {
    this.foo = this.foo + 1;
  },
  function() {
    this.foo = this.foo + 1;
    console.log(`teardown: this.foo = ${this.foo}`);
  }
];
