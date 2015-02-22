@practical ?= {}

class practical.MochaRunner

  @instance: null

  @get: ->
    practical.MochaRunner.instance ?= new practical.MochaRunner()

  constructor: ->
    if Meteor.isServer
      log.debug "Adding 'mocha.run' method"
      runOnServerMethod = _.bind(@runOnServer, @)
      Meteor.methods ({
        'mocha.run': runOnServerMethod
      })

  runOnServer: ->
    log.info 'Running tests on server'
    mocha.run (failures)=>
      log.debug 'failures:', failures
    return true


  runEverywhere: ->
    log.info 'Running tests everywhere'
    mocha.run()
    Meteor.call 'mocha.run', (err, res)=>
      log.error 'Error: Calling mocha.run:', err if err?


if Meteor.isClient
  Meteor.startup ->
    practical.MochaRunner.get().runEverywhere()
else
  practical.MochaRunner.get()
