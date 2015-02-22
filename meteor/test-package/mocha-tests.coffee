log = loglevel.createPackageLogger('mocha:test', 'debug')

describe 'Array', ->
  describe '#indexOf()', ->
    it 'should return -1 when the value is not present', ->
      expect([1,2,3].indexOf(5)).to.equal -1
      expect([1,2,3].indexOf(0)).to.equal -1

  describe 'length', ->
    it 'should return length of array', ->
      expect([1,2,3].length).to.equal 3

describe 'Async test', ()->
  it 'should pass', (done)->
    Meteor.setTimeout =>
      done()
    , 1000
  it 'should throw', (done)->
    Meteor.setTimeout =>
      done("I'm throwing")
    , 1000

describe.skip 'Skipped suite', ()->
  it 'should pass', (done)->
    Meteor.setTimeout =>
      done()
    , 1000

describe 'Skipped test', ()->
  it.skip 'should pass', (done)->
    Meteor.setTimeout =>
      done()
    , 1000

describe 'All sync test suite', ->
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

describe 'All async test suite', ->
  before (done)->
    log.debug 'before'
    Meteor.defer -> done()
  after (done)->
    log.debug 'after'
    Meteor.defer -> done()
  beforeEach (done)->
    log.debug 'beforeEach'
    Meteor.defer -> done()
  afterEach (done)->
    log.debug 'afterEach'
    Meteor.defer -> done()
  it 'passing', (done)->
    expect(true).to.be.true
    Meteor.defer -> done()
  it 'throwing', (done)->
    Meteor.defer -> done(new Error('failing'))
