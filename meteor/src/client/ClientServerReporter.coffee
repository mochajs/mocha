log = new ObjectLogger('ClientServerReporter', 'debug')

practical.mocha ?= {}

class practical.mocha.ClientServerReporter

  serverRunEvents = new Mongo.Collection('mochaServerRunEvents')

  constructor: (@clientRunner, @options)->
    try
      log.enter('constructor')
      serverRunEvents.find().observe( {
        added: _.bind(@added, @)
      } )

      expect(practical.mocha.reporters.HTML).to.be.a('function')

      @clientRunnerProxy= new practical.mocha.EventEmitter()
      @clientRunnerProxy.stats = @clientRunner.stats
      @reporter = new practical.mocha.reporters.HTML(@clientRunnerProxy, @options)
      @registerRunnerEvents()
    finally
      log.return()

  registerRunnerEvents:->
    @clientRunner.on 'start', =>

      @clientRunnerProxy.emit("start")

    @clientRunner.on 'suite', (suite)=>
      log.info("suite", suite)
      @clientRunnerProxy.emit('suite', suite)

    @clientRunner.on 'test end', (test)=>
      log.info("test end", test)
      @clientRunnerProxy.emit('test end', test)

    @clientRunner.on 'pass', (test)=>
      @clientRunnerProxy.emit('pass', test)

    @clientRunner.on 'fail', (test, err)=>
      @clientRunnerProxy.emit('fail', test, err)

    @clientRunner.on 'end', =>
      @clientRunnerProxy.emit('end')
    @clientRunner.on 'pending', =>
      @clientRunnerProxy.emit('pending')

  added: (doc)->
    try
      log.enter('added')
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
        @clientRunnerProxy.total = @clientRunner.total + doc.data.total


      @clientRunnerProxy.emit(doc.event, doc.data)
#      if doc.event is 'start'
#        @total = doc.data.total
#        @reporter = new practical.mocha.reporters.HTML(@)
#      @emit doc.event, doc.data
    catch ex
      console.error ex.stack
    finally
      log.return()
