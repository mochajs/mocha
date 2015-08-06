log = new ObjectLogger('ClientServerReporter', 'info')

practical.mocha ?= {}

class practical.mocha.ServerFirstReporter



  constructor: (@clientRunner, @options = {})->
    try
      log.enter('constructor')
      @serverRunnerProxy = new practical.mocha.EventEmitter()
      super(@serverRunnerProxy, @options)
#      super(@serverRunnerProxy, @options)
      MochaRunner.serverRunEvents.find().observe( {
        added: _.bind(@onServerRunnerEvent, @)
      } )

      expect(MochaRunner.reporter).to.be.a('function')


      @reporter = new MochaRunner.reporter(@clientRunner, @serverRunnerProxy, @options)
    finally
      log.return()


  @runServerTestsFirst: ()=>
    try
      log.enter("runServerTestsFirst",)

    finally
      log.return()

  @runClientTestsFirst: ()=>
    try
      log.enter("runClientTestsFirst",)

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

      if doc.data.parent
        doc.data.parent.fullTitle = -> return doc.data.parent._fullTitle
        doc.data.parent.slow = -> return doc.data.parent._slow


      if doc.event is 'start'
        @serverRunnerProxy.stats = doc.data
        @serverRunnerProxy.total = doc.data.total

      @serverRunnerProxy.emit(doc.event, doc.data,  doc.data.err)

    catch ex
      console.log (ex.stack || ex)
    finally
      log.return()
