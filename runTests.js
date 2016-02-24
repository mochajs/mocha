import { hideOtherCSS, hideApp } from 'meteor/tmeasday:test-reporter-helpers';

export const runTests = () => {
  hideApp('.mocha-wrapper');
  hideOtherCSS();
  MochaRunner.setReporter(practical.mocha.HtmlReporter)
}