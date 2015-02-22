Mocha = Npm.require('mocha')
Future = Npm.require('fibers/future')


options =
  ui: 'bdd'
  ignoreLeaks: true
  reporter: practical.mocha.JsonStreamReporter

global.mocha = new Mocha(options)

mochaGlobals = {}
mocha.suite.emit("pre-require", mochaGlobals, undefined, mocha)

global.describe = mochaGlobals.describe

#for fnName in ['skip', 'only']
#  log.info fnName
#  global.describe[fnName] = mochaGlobals.describe[fnName]

# For some reason, coffee for takes last element always here, so we use forEach
['before', 'beforeEach', 'it', 'afterEach', 'after'].forEach (fnName)->
  global[fnName] = (args...)=>
    fn = args[args.length - 1]

    if fn.length > 0
      rethrow = (err)->
        throw err
      args[args.length - 1] = practical.bindEnvironment fn, rethrow, @

    mochaGlobals[fnName].apply(@, args)


['skip', 'only'].forEach (fnName)->
  global.it[fnName] = (args...)=>
    fn = args[args.length - 1]

    if fn.length > 0
      rethrow = (err)->
        throw err
      args[args.length - 1] = practical.bindEnvironment fn, rethrow, @

    mochaGlobals.it[fnName].apply(@, args)
