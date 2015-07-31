Mocha = Npm.require('mocha')
Future = Npm.require('fibers/future')

options =
  ui: 'bdd'
  ignoreLeaks: true
#  reporter: practical.mocha.MeteorPublishReporter

global.mocha = new Mocha(options)

mochaGlobals = {}
mocha.suite.emit("pre-require", mochaGlobals, undefined, mocha)

expect(mochaGlobals.describe).to.be.ok

onError = (err)->
  throw err

wrapDescribe = (func)->
  ->
    Meteor.bindEnvironment(_.bind(func, @), onError)()

global.describe = (name, func)->
  return mochaGlobals.describe(name, wrapDescribe(func) )
# No need to wrap skip and only with bindEnvironment. Nested functions are enough (it, before, etc...)
# for fnName in ['skip', 'only']
#  log.info fnName
#  global.describe[fnName] = mochaGlobals.describe[fnName]

# For some reason, coffee's for takes last element always here,
# so we use forEach
['before', 'beforeEach', 'it', 'afterEach', 'after'].forEach (fnName)->
  global[fnName] = (args...)=>
    fn = args[args.length - 1]

#   If function has arguments, it's a done function and function is async
    if fn.length > 0
      rethrow = (err)->
        throw err
      args[args.length - 1] = practical.bindEnvironment fn, rethrow, @

    mochaGlobals[fnName].apply(@, args)


# Skip won't run the test, so no need to wrap it.
global.it.skip = mochaGlobals.it.skip
# only will run. Need to wrap it.
['only'].forEach (fnName)->
  global.it[fnName] = (args...)=>
    fn = args[args.length - 1]

    if fn.length > 0
      rethrow = (err)->
        throw err
      args[args.length - 1] = practical.bindEnvironment fn, rethrow, @

    mochaGlobals.it[fnName].apply(@, args)
