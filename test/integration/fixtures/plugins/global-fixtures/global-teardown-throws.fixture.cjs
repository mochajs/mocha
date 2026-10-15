"use strict";

exports.mochaGlobalSetup = async function () {
  console.log("setup ran");
};

exports.mochaGlobalTeardown = async function () {
  throw new Error("teardown kaboom");
};
