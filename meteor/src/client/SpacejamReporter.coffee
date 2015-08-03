log = new ObjectLogger('SpacejamReporter', 'info')

practical.mocha ?= {}

class practical.mocha.SpacejamReporter


  constructor: (@clientRunner, @serverRunner)->
    try
      log.enter('constructor')
      @registerRunnerEvents()
      @serverStats = null
      @clientStats = null
      @clientTests =  []
    finally
      log.return()

  registerRunnerEvents:->
    try
      log.enter("registerRunnerEvents")

      @serverRunner.on "start", => @printReporterHeader("Server")
      @serverRunner.on 'test end', @onServerTestEnd
      @serverRunner.on "end", @onServerTestFinish

      @clientRunner.on 'test end', @onClientTestEnd
      @clientRunner.on "end", @onClientTestFinish

    finally
      log.return()

  printReporterHeader: (where)=>
    try
      log.enter("printReporterHeader[#{where}]")
      console.log("\n--------------------------------------------------")
      console.log("------------------ #{where} tests ------------------")
      console.log("--------------------------------------------------\n")
    finally
      log.return()

  onServerTestEnd: (test)=>
    try
      log.enter("onServerTestEnd", test)
      @printTest(test, "server")
    finally
      log.return()

  onServerTestFinish: (stats)=>
    try
      log.enter("onServerTestFinish", stats)
      @serverStats = stats
      @printClientTests()

    finally
      log.return()

  onClientTestEnd: (test)=>
    try
      log.enter("onClientTestEnd", test)
      @clientTests.push(test)

    finally
      log.return()

  onClientTestFinish: ()=>
    try
      log.enter("onClientTestFinish")
      @clientStats = @clientRunner.stats

      # total property is missing in clientRunner.stats
      @clientStats.total = @clientRunner.total
      @printClientTests()

    finally
      log.return()

  printTest: (test, where)->
    try
      log.enter("prinTest", test)
      state = test.state or (if test.pending then "pending")
      console.log("#{test.fullTitle()} : #{state}")
      if test.state is "failed"
        console.log("  " + (test.err.stack || test.err))
      console.log(" ")
    finally
      log.return()

  printClientTests: ()=>
    try
      log.enter("printClientTests")
      return if not @clientStats?.total? or not @serverStats?.total?

      @printReporterHeader("Client")

      for test in @clientTests
        @printTest(test, "client")

      @finishAndPrintTestsSummary()
    finally
      log.return()

  finishAndPrintTestsSummary: ()=>
    try
      log.enter("finishAndPrintTestsSummary")
      if not @clientStats and not @serverStats
        throw new Error("Missing client or server stats to print tests summary")

      console.log("\n--------------------------------------------------")
      console.log("---------------------RESULTS----------------------")
      console.log("PASSED:", @serverStats.passes + @clientStats.passes)
      console.log("FAILED:", @serverStats.failures + @clientStats.failures)
      console.log("TOTAL:", @serverStats.total + @clientStats.total)
      console.log("--------------------------------------------------")
      console.log("--------------------------------------------------\n")
      window.TEST_STATUS = {FAILURES: @serverStats.failures + @clientStats.failures, DONE: true}
      window.DONE = true
      window.FAILURES = @serverStats.failures + @clientStats.failures
    finally
      log.return()
