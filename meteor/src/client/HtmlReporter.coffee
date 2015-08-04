log = new ObjectLogger('HtmlReporter', 'info')

practical.mocha ?= {}

class practical.mocha.HtmlReporter extends practical.mocha.BaseReporter

  constructor: (@clientRunner, @serverRunner, @options = {})->
    try
      log.enter('constructor')

      @reporter = new practical.mocha.reporters.HTML(@clientRunner)
      @registerRunnerServerEvents()
    finally
      log.return()


  registerRunnerServerEvents: (doc)->
    try
      log.enter('onServerRunnerEvent')

      @serverRunner.on "start", =>
        @serverReporter = new practical.mocha.reporters.HTML(@serverRunner, {
          elementIdPrefix: 'server-'
        })

    catch ex
      console.error ex
    finally
      log.return()

#Meteor.startup ->
#  MochaRunner.setReporter(practical.mocha.HtmlReporter)
