log = new ObjectLogger('ClientServerReporter', 'info')

practical.mocha ?= {}

class practical.mocha.SpacejamReporter


  constructor: (@clientRunner, @serverRunner)->
    try
      log.enter('constructor')
      @registerRunnerEvents()
    finally
      log.return()

  registerRunnerEvents:->
    try
      log.enter("registerRunnerEvents")

      clientOrServerEnd = false
      clientRunner = @clientRunner
      finish = (stats)->
        if not @stats
          @stats = stats
          return
        console.log("--------------------------------------------------")
        console.log("---------------------RESULTS----------------------")
        console.log("PASSED:", @stats.passes + stats.passes)
        console.log("FAILED:", @stats.failures + stats.failures)
        console.log("TOTAL:", @stats.total + stats.total)
        console.log("--------------------------------------------------")
        console.log("--------------------------------------------------")
        window.TEST_STATUS = {FAILURES: @stats.failures, DONE: true}
        window.DONE = true
        window.FAILURES = @stats.failures

      @clientRunner.on 'test end', (test)=>
        console.log("client - " +test.parent.fullTitle() + " " + test.fullTitle() + " : " + test.state)
        if test.state is "failed"
          console.log(test.err.stack || test.err)

      @clientRunner.on "end", =>
        stats = @clientRunner.stats
        stats.total = @clientRunner.total
        finish(@clientRunner.stats)

      @serverRunner.on 'test end', (test)=>
        console.log("server - " +test.parent.fullTitle() + " " + test.fullTitle() + " : " + test.state)
        if test.state is "failed"
          console.log(test.err.stack || test.err)

      @serverRunner.on "end", (stats)=>
        finish(stats)

    finally
      log.return()
