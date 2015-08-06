log = new ObjectLogger('MochaRunner', 'info')

@practical ?= {}

class practical.MochaRunner

  @instance: null

  @get: ->
    practical.MochaRunner.instance ?= new practical.MochaRunner()

  serverRunEvents: null

  constructor: ->
    try
      log.enter 'constructor'

      @serverRunEvents = new Mongo.Collection('mochaServerRunEvents')
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


      query = practical.mocha.Mocha.utils.parseQuery(location.search || '');

      @serverRunSubscriptionHandle = Meteor.subscribe 'mochaServerRunEvents', query.grep, {
        onReady: _.bind(@onServerRunSubscriptionReady, @)
        onError: _.bind(@onServerRunSubscriptionError, @)
      }
    finally
      log.return()


  setReporter: (@reporter)->

  onServerRunSubscriptionReady: =>
    try
      log.enter 'onServerRunSubscriptionReady'
      runOrder = @serverRunEvents.findOne({event: "run order"})
      if runOrder.data is "server"
        @runServerTestsFirst()
      else if runOrder.data is "client"
        @runClientTestsFirst()
      else
        @runTestsInParallel()

      console.log "coll", runOrder

      console.log()
    finally
      log.return()

  runTestsInParallel: ()=>
    try
      log.enter("runTestsInParallel",)
      mocha.reporter(practical.mocha.ClientServerReporter)
      mocha.run(->)
    finally
      log.return()

  runServerTestsFirst: ()=>
    try
      log.enter("runServerTestsFirst",)
      practical.mocha.ClientServerReporter.runServerTestsFirst()
    finally
      log.return()

  runClientTestsFirst: ()=>
    try
      log.enter("runClientTestsFirst",)

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
    # We defer because if another package sets a different reporter on Meteor.startup,
    # that's the reporter that we want to be used.
    Meteor.defer ->
      MochaRunner.runEverywhere()
