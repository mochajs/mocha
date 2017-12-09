'use strict';

const {createHook} = require('async_hooks');
const {stackTraceFilter} = require('mocha/lib/utils');
const allResources = new Map();
const resourceActivity = new Set();

const filterStack = stackTraceFilter();

const hook = createHook({
  init(asyncId, type, triggerAsyncId) {
    allResources.set(asyncId, {type, triggerAsyncId, stack: (new Error()).stack});
  },
  before(asyncId) {
    resourceActivity.add(asyncId);
  },
  after(asyncId) {
    resourceActivity.delete(asyncId);
  },
  destroy(asyncId) {
    allResources.delete(asyncId);
  }
}).enable();

global.asyncDump = module.exports = () => {
  hook.disable();
  console.error('STUFF STILL IN THE EVENT LOOP:')
  allResources.forEach(value=> {
    console.error(`Type: ${value.type}`);
    console.error(filterStack(value.stack));
    console.error('\n');
  });
};
