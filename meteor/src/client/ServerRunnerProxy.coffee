log = new ObjectLogger('ServerRunnerProxy')

practical.mocha ?= {}

class practical.mocha.ServerRunnerProxy extends practical.mocha.EventEmitter

  serverRunEvents = new Mongo.Collection('mochaServerRunEvents')

  constructor: ->
    try
      log.enter('constructor')
      serverRunEvents.find().observe( {
        added: _.bind(@added, @)
      } )
      expect(practical.mocha.reporters.HTML).to.be.a('function')
    finally
      log.return()

  added: (doc)->
    try
      log.enter('added')
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
