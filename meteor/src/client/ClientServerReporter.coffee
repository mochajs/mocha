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
      @spacejamReporter = new practical.mocha.SpacejamReporter(@clientRunner, @serverRunnerProxy)
#      @serverReporter = new practical.mocha.reporters.HTML(@clientRunnerProxy, {
#        elementIdPrefix: 'server-'
#      })
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

      if doc.data.parent
        doc.data.parent.fullTitle = -> return doc.data.parent._fullTitle
        doc.data.parent.slow = -> return doc.data.parent._slow


      if doc.event is 'start'
        @serverRunnerProxy.stats = doc.data
        @serverRunnerProxy.total = doc.data.total
        @serverReporter = new practical.mocha.reporters.HTML(@serverRunnerProxy, {
          elementIdPrefix: 'server-'
        })
#        @clientRunnerProxy.total = @clientRunner.total + doc.data.total


      @serverRunnerProxy.emit(doc.event, doc.data)
#      if doc.event is 'start'
#        @total = doc.data.total
#        @reporter = new practical.mocha.reporters.HTML(@)
#      @emit doc.event, doc.data
    catch ex
      console.error ex.stack
    finally
      log.return()
