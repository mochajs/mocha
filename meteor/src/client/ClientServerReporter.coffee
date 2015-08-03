log = new ObjectLogger('ClientServerReporter', 'info')

practical.mocha ?= {}

class practical.mocha.ClientServerReporter

  serverRunEvents = new Mongo.Collection('mochaServerRunEvents')

  constructor: (@clientRunner, @options)->
    try
      log.enter('constructor')
      serverRunEvents.find().observe( {
        added: _.bind(@onServerRunnerEvent, @)
      } )

      expect(practical.mocha.reporters.HTML).to.be.a('function')

      @serverRunnerProxy = new practical.mocha.EventEmitter()

      @reporter = new practical.mocha.reporters.HTML(@clientRunner)
#      @serverReporter = new practical.mocha.reporters.HTML(@clientRunnerProxy, {
#        elementIdPrefix: 'server-'
#      })
#      @registerRunnerEvents()
    finally
      log.return()

  registerRunnerEvents:->

    @clientRunner.on 'start', =>
      try
        log.enter 'onStart', arguments
        @serverRunnerProxy.emit 'start'
      finally
        log.return()

    @clientRunner.on 'suite', (suite)=>
      try
        log.enter 'onSuite', arguments
#        return if suite.root
        @serverRunnerProxy.emit 'suite', suite
      finally
        log.return()

    @clientRunner.on 'suite end', (suite)=>
      try
        log.enter 'onSuiteEnd', arguments
#        return if suite.root
        @serverRunnerProxy.emit 'suite end', suite
      finally
        log.return()

    @clientRunner.on 'test end', (test)=>
      try
        log.enter 'onTestEnd', arguments
        @serverRunnerProxy.emit 'test end', test
      finally
        log.return()

    @clientRunner.on 'pass', (test)=>
      try
        log.enter 'onPass', arguments
        @serverRunnerProxy.emit 'pass', test
      finally
        log.return()

    @clientRunner.on 'fail', (test, error)=>
      try
        log.enter 'onFail', arguments
        @serverRunnerProxy.emit 'fail', test, error
      finally
        log.return()

    @clientRunner.on 'end', =>
      try
        log.enter 'onEnd', arguments
        @serverRunnerProxy.emit 'end'
      finally
        log.return()

    @clientRunner.on 'pending', (test)=>
      try
        log.enter 'onPending', arguments
        @serverRunnerProxy.emit 'pending', test
      finally
        log.return()


  onServerRunnerEvent: (doc)->
    try
      log.enter('onServerRunnerEvent')
      expect(doc).to.be.an('object')
      expect(doc.event).to.be.a('string')
      expect(doc.data).to.be.an('object')

      # Required by the standard mocha reporters
      doc.data.fullTitle = -> return doc.data._fullTitle
      doc.data.slow = -> return doc.data._slow

      if doc.event is 'suite'
        log.info "suite", doc.data

      if doc.event is 'start'
        log.info "total:", doc.data
        log.info "HTML:", @reporter
        @serverRunnerProxy.stats = doc.data
        @serverRunnerProxy.total = doc.data.total
        @serverReporter = new practical.mocha.reporters.HTML(@serverRunnerProxy, {
          elementIdPrefix: 'server-'
        })
#        @clientRunnerProxy.total = @clientRunner.total + doc.data.total

      @serverRunnerProxy.emit(doc.event, doc.data,  doc.data.err)
#      if doc.event is 'start'
#        @total = doc.data.total
#        @reporter = new practical.mocha.reporters.HTML(@)
#      @emit doc.event, doc.data
    catch ex
      console.error ex
    finally
      log.return()
