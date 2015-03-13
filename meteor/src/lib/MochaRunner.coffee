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
      # mocha.run()

      @serverRunSubscriptionHandle = Meteor.subscribe 'mochaServerRunEvents', {
        onReady: _.bind(@onServerRunSubscriptionReady, @)
        onError: _.bind(@onServerRunSubscriptionError, @)
      }
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
  Meteor.startup ->
    practical.MochaRunner.get().runEverywhere()
else
  practical.MochaRunner.get()
