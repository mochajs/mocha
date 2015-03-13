log = new ObjectLogger('MeteorPublishReporter', 'debug')


class practical.mocha.MeteorPublishReporter extends practical.mocha.BaseReporter

  # TODO: Change this to use Meteor.bindEnvironment
  @publisher: null

  constructor: (runner, options)->
    try
      log.enter 'constructor', arguments
      super(runner, options)
      @publisher = practical.mocha.MeteorPublishReporter.publisher
      expect(@publisher, '@publisher').to.be.an('object')
      expect(@publisher.ready, '@publisher.ready').to.be.a('function')
      expect(@publisher.added, '@publisher.added').to.be.a('function')
      expect(@publisher.onStop, '@publisher.onStop').to.be.a('function')
      @publisher.onStop =>
        @stopped = true
      @stopped = false
      @sequence = 0

      @runner.on 'start', (total)=>
        try
          log.enter 'onStart', total, arguments
          @added 'start', {total: total}
          @publisher.ready()
        finally
          log.return()

      @runner.on 'suite', (suite)=>
        try
          log.enter 'onSuite', arguments
          @added 'suite', {suite: suite}
        finally
          log.return()

      @runner.on 'test end', (test)=>
        try
          log.enter 'onTestEnd', arguments
          @added 'test end', {test: test}
        finally
          log.return()

      @runner.on 'pass', (test)=>
        try
          log.enter 'onPass', arguments
          @added 'pass', {test: test}
        finally
          log.return()

      @runner.on 'fail', (test, error)=>
        try
          log.enter 'onFail', arguments
          @added 'fail', {test: test, error: error}
        finally
          log.return()

      @runner.on 'end', =>
        try
          log.enter 'onEnd', arguments
          @added 'end', {}
        finally
          log.return()

      @runner.on 'pending', (test)=>
        try
          log.enter 'onPending', arguments
          @added 'pending', {test: test}
        finally
          log.return()
    finally
      log.return()


  added: (event, data)=>
    try
      log.enter 'added', arguments
      return if @stopped is true
      doc =
        _id: "#{++@sequence}"
        event: event
        data: data
      @publisher.added('mochaServerRunEvents', doc._id, doc)
    finally
      log.return()
