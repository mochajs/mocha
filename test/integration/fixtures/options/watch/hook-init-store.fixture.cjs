"use strict";

const { store } = require("./lib/store");

exports.mochaHooks = {
  beforeEach() {
    store.initialize(["testItem1", "testItem2"]);
  },
};
