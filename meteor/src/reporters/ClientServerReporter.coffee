MochaRunner  = require("./../lib/MochaRunner")
{ObjectLogger}  = require("meteor/practicalmeteor:loglevel")
{EventEmitter}  = require("events")

log = new ObjectLogger('ClientServerReporter', 'info')

class ClientServerReporter


  constructor: (@clientRunner, @options = {})->
    try
      log.enter('constructor')
      @serverRunnerProxy = new EventEmitter()

      if @options.runOrder is "serial"
        @clientRunner = new EventEmitter()
        @runTestsSerially(@clientRunner, @serverRunnerProxy)

      if not MochaRunner.reporter
        log.error("Missing reporter to run tests. Use MochaRunner.setReporter(reporter) to set one.")
        return

      @reporter = new MochaRunner.reporter(@clientRunner, @serverRunnerProxy, @options)

      MochaRunner.serverRunEvents.find().observe( {
        added: _.bind(@onServerRunnerEvent, @)
      })

      # Exposes global states of tests
      @clientRunner.on "start", ->
        window.mochaIsRunning = true

      @clientRunner.on "end", ->
        window.mochaIsRunning = false
        window.mochaIsDone = true


    finally
      log.return()


  runTestsSerially: (clientRunner, serverRunnerProxy)=>
    try
      log.enter("runTestsSerially",)

      # Mirror every event from mocha's runner to our clientRunner
      class MirrorReporter

        constructor: (mochaClientRunner, options)->
          clientRunner.total = mochaClientRunner.total
          # Listen to every event sent from mochaClientRunner
          mochaClientRunner.any (event, eventArgs)->
            args = eventArgs.slice()
            args.unshift(event)
            clientRunner.emit.apply(clientRunner, args)

      serverRunnerProxy.on "end", =>
        mocha.reporter(MirrorReporter)
        mocha.run(->)

    finally
      log.return()


  onServerRunnerEvent: (doc)->
    try
      log.enter('onServerRunnerEvent')
      expect(doc).to.be.an('object')
      expect(doc.event).to.be.a('string')

      if doc.event is "run order"
        return
      expect(doc.data).to.be.an('object')

      # Required by the standard mocha reporters
      doc.data.fullTitle = -> return doc.data._fullTitle
      doc.data.slow = -> return doc.data._slow
      doc.data.err?.toString = -> "Error: " + @message

      if doc.data.parent
        doc.data.parent.fullTitle = -> return doc.data.parent._fullTitle
        doc.data.parent.slow = -> return doc.data.parent._slow


      if doc.event is 'start'
        @serverRunnerProxy.stats = doc.data
        @serverRunnerProxy.total = doc.data.total

      @serverRunnerProxy.emit(doc.event, doc.data,  doc.data.err)

    catch ex
      log.error ex
    finally
      log.return()


module.exports = ClientServerReporter
