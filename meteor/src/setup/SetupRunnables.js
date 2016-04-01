import {Meteor} from "meteor/meteor"
var Fiber = Meteor.isServer ? Npm.require("fibers") : {};


class SetupRunnables {


  constructor(mocha, opts = {}) {
    this.mocha = mocha;
    this.opts = opts;
  };


  setup() {
    let runnables = this._getRunnables();
    if (Meteor.isServer) {
      runnables = this._setupServerRunnables(runnables);
    }
    if(this.opts.globalize){
      this._makeRunnablesGlobals(runnables);
    }
    return runnables;
  };


  _getRunnables() {
    let runnables = {};
    this.mocha.suite.emit("pre-require", runnables, undefined, this.mocha);
    return runnables;
  };


  _makeRunnablesGlobals(runnables){

    var listOfRunnables = [
      "before",
      "after",
      "beforeEach",
      "afterEach",
      "describe",
      "xdescribe",
      "it",
      "xit",
      "specify",
      "xspecify",
      "xcontext",
      "context"
    ];

    listOfRunnables.forEach((runnable)=>{
      global[runnable]  = runnables[runnable];
    });
  }


  _setupServerRunnables(runnables) {

    let self = this;
    runnables["__org_it"] = runnables["it"];

    runnables['it'] = function (name, func) {
      // You can create pending tests without a function
      // http://mochajs.org/#pending-tests
      // i.e pending test
      // it('this is a pending test');
      if (func) {
        func = self._wrapRunnable(func);
      }
      runnables["__org_it"](name, func);
    };
    runnables.it.skip = runnables["__org_it"].skip;
    runnables.it.only = (name, func) => {
      runnables["__org_it"].only(name, self._wrapRunnable(func));
    };

    let hooks = ["before", "beforeEach", "after", "afterEach"];
    hooks.forEach((hook)=> {
      runnables[`__org_${hook}`] = runnables[hook];
      runnables[hook] = (func)=> {
        runnables[`__org_${hook}`](self._wrapRunnable(func));
      }
    });

    return runnables;
  };


  // 1. patch up it and hooks functions so it plays nice w/ fibers
  // 2. trick to allow binding the suite instance as `this` value
  // inside of suites blocks, to allow e.g. to set custom timeouts.
  _wrapRunnable(func) {

    //In Meteor, these blocks will all be invoking Meteor code and must
    //run within a fiber. We must therefore wrap each with something like
    //bindEnvironment. The function passed off to mocha must have length
    //greater than zero if we want mocha to run it asynchronously. That's
    //why it uses the Fibers

    //We're actually having mocha run all tests asynchronously. This
    //is because mocha cannot tell when a synchronous fiber test has
    //finished, because the test runner runs outside a fiber.

    //It is possible that the mocha test runner could be run from within a
    //fiber, but it was unclear to me how that could be done without
    //forking mocha itself.


    var wrappedFunction = function (done) {
      var self = this;
      var run = function () {
        try {
          if (func.length == 0) {
            func.call(self);
            done();
          }
          else {
            func.call(self, done);
          }
        } catch (error) {
          done(error);
        }
      };

      if (Fiber.current) {
        return run();
      }
      Fiber(run).run();
    };

    // Show original function source code
    wrappedFunction.toString = function () {
      return func.toString()
    };
    return wrappedFunction;
  };


}

export default (mocha, opts = {})=>{
  var setupRunnables = new SetupRunnables(mocha, opts);
  return setupRunnables.setup();
};
