log = new ObjectLogger('MochaRunner', 'debug')

@practical ?= {}

publisher = {}


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
        Meteor.methods({
          "mocha/run": @runServer.bind(@)
        })

        # We cannot bind an instance method, since we need the this provided by meteor
        # inside the publish function to control the published documents manually
        self = @
        Meteor.publish 'mochaServerRunEvents', (runId)->
          try
            log.enter 'Meteor.publish.mochaServerRunEvents'
            log.info("")
            expect(@ready).to.be.a('function')
            publisher[runId] ?= @
            @ready()
            return undefined
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


  runServer: (runId, grep)=>
    try
      log.enter("runServer", runId)
      log.info("publisher[runId]", publisher[runId]?)
      expect(runId).to.be.a("string")
      expect(publisher[runId], "publisher").to.be.an("object")
      mocha.reporter(practical.mocha.MeteorPublishReporter, {
        grep: @escapeGrep(grep)
        publisher: publisher[runId]
      })
      boundRun = Meteor.bindEnvironment ->
        mocha.run Meteor.bindEnvironment (failures)->
          log.warn 'failures:', failures

      boundRun()

    finally
      log.return()


  runEverywhere: ->
    try
      log.enter 'runEverywhere'
      expect(Meteor.isClient).to.be.true

      @runId = Random.id()
      @serverRunSubscriptionHandle = Meteor.subscribe 'mochaServerRunEvents', @runId, {
        onReady: _.bind(@onServerRunSubscriptionReady, @)
        onError: _.bind(@onServerRunSubscriptionError, @)
      }

    finally
      log.return()


  setReporter: (@reporter)->

  onServerRunSubscriptionReady: =>
    try
      log.enter 'onServerRunSubscriptionReady'
      query = practical.mocha.Mocha.utils.parseQuery(location.search || '');

      Meteor.call "mocha/run", @runId,  query.grep, (err)->
        log.info "tests started"
        log.error(err) if err


      Tracker.autorun =>
        log.info "running"
        runOrder = @serverRunEvents.findOne({event: "run order"})
        if runOrder?.data is "serial"
          reporter = new practical.mocha.ClientServerReporter(null, {runOrder: "serial"})
        else if runOrder?.data is "parallel"
          mocha.reporter(practical.mocha.ClientServerReporter)
          mocha.run(->)



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
