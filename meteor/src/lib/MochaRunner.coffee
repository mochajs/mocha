log = new ObjectLogger('MochaRunner', 'debug')

@practical ?= {}

class practical.MochaRunner

  @instance: null

  @get: ->
    practical.MochaRunner.instance ?= new practical.MochaRunner()

  constructor: ->
    try
      log.enter 'constructor'
      if Meteor.isServer
        # We cannot bind an instance method, since we need the this provided by meteor
        # inside the publish function to control the published documents manually
        # TODO: Subscribe with the mocha html reporter query string identifiying a subset of the tests, so only those tests will run server side too.
        Meteor.publish 'mochaServerRunEvents', ->
          try
            log.enter 'Meteor.publish.mochaServerRunEvents'
            self = @
            expect(self.ready).to.be.a('function')
            practical.mocha.MeteorPublishReporter.publisher = self
            mocha.run (failures)=>
              log.warn 'failures:', failures
            return
          catch ex
            log.error ex.stack if ex.stack?
            throw new Meteor.Error('unknown-error', (if ex.message? then ex.message else undefined), (if ex.stack? then ex.stack else undefined))
          finally
            log.return()
    finally
      log.return()


  runEverywhere: ->
    try
      log.enter 'runEverywhere'
      expect(Meteor.isClient).to.be.true
      mocha.reporter(practical.mocha.ClientServerReporter)
      mocha.run(->)

      @serverRunSubscriptionHandle = Meteor.subscribe 'mochaServerRunEvents', {
        onReady: _.bind(@onServerRunSubscriptionReady, @)
        onError: _.bind(@onServerRunSubscriptionError, @)
      }
#      @serverRunnerProxy = new practical.mocha.ServerRunnerProxy(@serverRunSubscriptionHandle)
    finally
      log.return()


  onServerRunSubscriptionReady: ->
    try
      log.enter 'onServerRunSubscriptionReady'
    finally
      log.return()


  onServerRunSubscriptionError: (meteorError)->
    try
      log.enter 'onServerRunSubscriptionError'
      log.error meteorError
    finally
      log.return()


if Meteor.isClient
# Run the tests on Meteor.startup, after all code is loaded and ready
  Meteor.startup ->
    practical.MochaRunner.get().runEverywhere()
else
# Run the ctor, so publication will be published
  practical.MochaRunner.get()
