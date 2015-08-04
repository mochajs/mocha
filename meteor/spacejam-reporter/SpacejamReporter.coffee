log = new ObjectLogger('SpacejamReporter', 'info')


class SpacejamReporter extends  practical.mocha.BaseReporter


  constructor: (@clientRunner, @serverRunner, @options)->
    try
      log.enter('constructor')
      super(@clientRunner, @options)
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
      @serverRunner.on "end", @onServerRunEnd

      @clientRunner.on 'test end', @onClientTestEnd
      @clientRunner.on "end", @onClientRunEnd

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

  onServerRunEnd: (stats)=>
    try
      log.enter("onServerRunEnd", stats)
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

  onClientRunEnd: ()=>
    try
      log.enter("onClientRunEnd")
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

Meteor.startup ->
  MochaRunner.setReporter(SpacejamReporter)
