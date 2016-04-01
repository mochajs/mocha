import "./setupMochaServer"
import setupMochaClient from "./setupMochaClient"
import Mocha from "../../../lib/mocha"
import setupRunnables from "./SetupRunnables"

let mocha = new Mocha({
  ui: 'bdd',
  ignoreLeaks: true
});

if(Meteor.isClient){
  setupMochaClient(mocha, Mocha)
}

// TODO Support meteor setting or env var to make runnables globals
global.mocha = mocha;
let runnables = setupRunnables(mocha, {globalize: true});
export {mocha}
export {runnables};
