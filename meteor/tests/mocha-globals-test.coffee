Tinytest.add 'mocha should exist', (test)->
  expect(mocha).to.be.an 'object'

Tinytest.add 'mocha.run should exist', (test)->
  expect(mocha.run).to.be.a 'function'

Tinytest.add 'describe should exist', (test)->
  expect(describe).to.be.a 'function'

Tinytest.add 'it  should exist', (test)->
  expect(it).to.be.a 'function'

Tinytest.add 'before  should exist', (test)->
  expect(before).to.be.a 'function'

Tinytest.add 'after  should exist', (test)->
  expect(after).to.be.a 'function'

Tinytest.add 'beforeEach  should exist', (test)->
  expect(beforeEach).to.be.a 'function'

Tinytest.add 'afterEach  should exist', (test)->
  expect(afterEach).to.be.a 'function'

Tinytest.add 'xdescribe  should exist', (test)->
  expect(xdescribe).to.be.a 'function'

Tinytest.add 'xit  should exist', (test)->
  expect(xit).to.be.a 'function'

Tinytest.add 'specify  should exist', (test)->
  expect(specify).to.be.a 'function'

Tinytest.add 'xspecify  should exist', (test)->
  expect(xspecify).to.be.a 'function'

Tinytest.add 'context  should exist', (test)->
  expect(context).to.be.a 'function'

Tinytest.add 'xcontext  should exist', (test)->
  expect(xcontext).to.be.a 'function'
