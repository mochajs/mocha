'use strict';
describe('Stack trace', function () {
  it('should prettify the stack-trace', function () {
    var err = new Error();
    // We do this fake stack-trace because we under development,
    // and our root isn't `node_modules`, `bower` or `components`
    err.stack = [
      'Error: failed',
      'at assert (stack-trace.html:11:30)',
      'at Context.<anonymous> (stack-trace.js:5:5)',
      'at callFn (http://localhost:63342/node_modules/mocha.js:4546:21)',
      'at Test.require.register.Runnable.run (http://localhost:63342/node_modules/mocha.js:4539:7)',
      'at Runner.require.register.Runner.runTest (http://localhost:63342/node_modules/mocha.js:4958:10)',
      'at http://localhost:63342/bower_components/mocha.js:5041:12',
      'at next (http://localhost:63342/bower_components/mocha.js:4883:14)',
      'at http://localhost:63342/bower_components/mocha.js:4893:7',
      'at next (http://localhost:63342/bower_components/mocha.js:4828:23)',
      'at http://localhost:63342/bower_components/mocha.js:4860:5'
    ].join('\n');
    assert(false, err);
  });
});
