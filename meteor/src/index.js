import {runnables}  from "./setup"
import MochaRunner  from "./lib/MochaRunner"
import BaseReporter from "./reporters/BaseReporter"
import HtmlReporter from "./reporters/HtmlReporter"
import {hideOtherCSS, hideApp} from 'meteor/tmeasday:test-reporter-helpers';

export const runTests = () => {
  hideApp('.mocha-wrapper');
  hideOtherCSS();
  MochaRunner.setReporter(HtmlReporter)
};

let { before, after, beforeEach, afterEach,
      describe, xdescribe, it, xit, specify,
      xspecify, xcontext, context } = runnables;

export {BaseReporter}
export {MochaRunner}
export { before, after, beforeEach, afterEach,
describe, xdescribe, it, xit, specify,
xspecify, xcontext, context };
