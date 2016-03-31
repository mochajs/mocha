import "./setup-mocha"
import { hideOtherCSS, hideApp } from 'meteor/tmeasday:test-reporter-helpers';
import MochaRunner from "./meteor/src/lib/MochaRunner"

export const runTests = () => {
  hideApp('.mocha-wrapper');
  hideOtherCSS();
  MochaRunner.setReporter(practical.mocha.HtmlReporter)
};
