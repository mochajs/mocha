exports = module.exports = Teamcity;

function Teamcity(runner, options) {

  var start_time;

  runner.on('start', function() {
    start_time = new Date().getTime();
    console.log("##teamcity[testSuiteStarted name='mocha.suite']");
  });

  runner.on('test', function(test) {
    test.start = new Date().getTime();
    console.log("##teamcity[testStarted name='" + test.fullTitle() + "']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='" + test.fullTitle() + "' message='" + err.message + "']");
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='" + test.fullTitle() + "' message='" + err.message + "']");
  });

  runner.on('test end', function(test) {
    var duration = new Date().getTime() - test.start;
    console.log("##teamcity[testFinished name='" + test.fullTitle() + "' duration='" + duration + "']");
  });

  runner.on('end', function() {
    var duration = new Date().getTime() - start_time;
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + duration + "']");
  });
}
