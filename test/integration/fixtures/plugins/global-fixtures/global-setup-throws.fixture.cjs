"use strict";

exports.mochaGlobalSetup = async function () {
  throw new Error("setup kaboom");
};

exports.mochaGlobalTeardown = async function () {
  console.log("teardown should not run");
};
