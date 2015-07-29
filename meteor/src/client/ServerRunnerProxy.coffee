log = new ObjectLogger('ServerRunnerProxy', 'debug')

practical.mocha ?= {}

class practical.mocha.ServerRunnerProxy

  serverRunEvents = new Mongo.Collection('mochaServerRunEvents')

  constructor: (@runner, @options)->
    try
      log.enter('constructor')
      serverRunEvents.find().observe( {
        added: _.bind(@added, @)
      } )

      @reporterRunner = new practical.mocha.EventEmitter()
      @reporter = new practical.mocha.reporters.HTML(@reporterRunner, @options)
      @registerRunnerEvents()
      expect(practical.mocha.reporters.HTML).to.be.a('function')
    finally
      log.return()

  registerRunnerEvents:->
    @runner.on 'start', =>
      @reporterRunner.emit("start")

    @runner.on 'suite', (suite)=>
      @reporterRunner.emit('suite', suite)

    @runner.on 'test end', (test)=>
      @reporterRunner.emit('test end', test)

    @runner.on 'pass', (test)=>
      @reporterRunner.emit('pass', test)

    @runner.on 'fail', (test, err)=>
      @reporterRunner.emit('fail', test, err)

    @runner.on 'end', =>
      @reporterRunner.emit('end')
    @runner.on 'pending', =>
      @reporterRunner.emit('pending')

  added: (doc)->
    try
      log.enter('added')
      test = doc.data
      test.fullTitle = -> test._fullTitle
      test.slow = -> test._slow
#      test.fn
      @reporterRunner.emit(doc.event, doc.data)
#      expect(doc).to.be.an('object')
#      expect(doc.event).to.be.a('string')
#      expect(doc.data).to.be.an('object')
#      if doc.data._fullTitle?
#        doc.data.fullTitle = -> return @_fullTitle
#      if doc.data._slow
#        doc.data.slow = -> return @_slow
#
#      if doc.event is 'start'
#        @total = doc.data.total
#        @reporter = new practical.mocha.reporters.HTML(@)
#      @emit doc.event, doc.data
    catch ex
      console.error ex.stack
    finally
      log.return()
