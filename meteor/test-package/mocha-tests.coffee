log = loglevel.createPackageLogger('mocha:test', 'info')

describe '1 - Array', ->
  describe '1.1 - #indexOf()', ->
    it 'should return -1 when the value is not present', ->
      expect([1,2,3].indexOf(5)).to.equal -1
      expect([1,2,3].indexOf(0)).to.equal -1

  describe '1.2 - length', ->
    it 'should return length of array', ->
      expect([1,2,3].length).to.equal 3

describe '2 - Async test', ()->
  it 'should pass', (done)->
    Meteor.setTimeout =>
      done()
    , 1000
  it 'should throw', (done)->
    Meteor.setTimeout =>
      done("I'm throwing")
    , 1000
#
#describe '3 - Skipped test', ()->
#  it.skip 'should pass', (done)->
#    Meteor.setTimeout =>
#      done()
#    , 1000
#
#describe.skip '4 - Skipped suite', ()->
#  it 'should pass', (done)->
#    Meteor.setTimeout =>
#      done()
#    , 1000



describe '5 - All sync test suite', ->
  before ->
    log.debug 'before'
  after ->
    log.debug 'after'
  beforeEach ->
    log.debug 'beforeEach'
  afterEach ->
    log.debug 'afterEach'
  it 'passing', ->
    expect(true).to.be.true
  it 'throwing', ->
    expect(false).to.be.true

describe '6 - All async test suite', ->
  before (done)->
    log.debug 'before'
    Meteor.defer -> done()
  after (done)->
    log.debug 'after'
    Meteor.setTimeout( (-> done()), 1000)
  beforeEach (done)->
    log.debug 'beforeEach'
    Meteor.setTimeout( (-> done()), 1000)
  afterEach (done)->
    log.debug 'afterEach'
    Meteor.setTimeout( (-> done()), 1000)
  it 'passing', (done)->
    @timeout(5000)

    expect(true).to.be.true
    Meteor.setTimeout( (-> done()), 3000)
  it 'throwing', (done)->
    Meteor.defer -> done(new Error('failing'))

describe '7 - implicit wait', ->
  it 'during findOne', ->
    doc = practical.TestCollection.findOne (_id: 'xxx')

describe.skip '8 - skip suite', ->
  it "this won't run", ->
    throw new Error("This is an error")
