log = new ObjectLogger('MochaRunner', 'info')

@practical ?= {}

class practical.MochaRunner

  @instance: null

  @get: ->
    practical.MochaRunner.instance ?= new practical.MochaRunner()

  constructor: ->
    try
      log.enter 'constructor'

#      if Meteor.isClient
#        @reporter = practical.mocha.reporters.HTML

      if Meteor.isServer
        # We cannot bind an instance method, since we need the this provided by meteor
        # inside the publish function to control the published documents manually
        self = @
        Meteor.publish 'mochaServerRunEvents', (grep)->
          try
            log.enter 'Meteor.publish.mochaServerRunEvents'
            expect(@ready).to.be.a('function')


            #  self is our MochaRunner
            # @ is publication's this
            mocha.reporter(practical.mocha.MeteorPublishReporter, {
              grep: self.escapeGrep(grep)
              publisher: @
            })
#            practical.mocha.MeteorPublishReporter.publisher = self
            boundRun = Meteor.bindEnvironment ->
              mocha.run Meteor.bindEnvironment (failures)->
                log.warn 'failures:', failures

            boundRun()
            return
          catch ex
            log.error ex.stack if ex.stack?
            throw new Meteor.Error('unknown-error', (if ex.message? then ex.message else undefined), (if ex.stack? then ex.stack else undefined))
          finally
            log.return()
    finally
      log.return()


  escapeGrep: (grep = '')->
    try
      log.enter("escapeGrep", grep)
      matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
      grep.replace(matchOperatorsRe,  '\\$&')
      return new RegExp(grep)
    finally
      log.return()


  runEverywhere: ->
    try
      log.enter 'runEverywhere'
      expect(Meteor.isClient).to.be.true
      mocha.reporter(practical.mocha.ClientServerReporter)
      mocha.run(->)

      query = practical.mocha.Mocha.utils.parseQuery(location.search || '');

      @serverRunSubscriptionHandle = Meteor.subscribe 'mochaServerRunEvents', query.grep, {
        onReady: _.bind(@onServerRunSubscriptionReady, @)
        onError: _.bind(@onServerRunSubscriptionError, @)
      }
#      @serverRunnerProxy = new practical.mocha.ServerRunnerProxy(@serverRunSubscriptionHandle)
    finally
      log.return()


  setReporter: (@reporter)->

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


@MochaRunner = practical.MochaRunner.get()

if Meteor.isClient
# Run the tests on Meteor.startup, after all code is loaded and ready
  Meteor.startup ->
    Meteor.defer ->
      MochaRunner.runEverywhere()
