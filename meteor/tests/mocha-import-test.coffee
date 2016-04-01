{describe, it, before, after, beforeEach, afterEach, xdescribe, xit, specify, xspecify, context, xcontext} = require("meteor/practicalmeteor:mocha")


Tinytest.add 'import - describe should exist', (test)->
  expect(describe).to.be.a 'function'

Tinytest.add 'import - it  should exist', (test)->
  expect(it).to.be.a 'function'

Tinytest.add 'import - before  should exist', (test)->
  expect(before).to.be.a 'function'

Tinytest.add 'import - after  should exist', (test)->
  expect(after).to.be.a 'function'

Tinytest.add 'import - beforeEach  should exist', (test)->
  expect(beforeEach).to.be.a 'function'

Tinytest.add 'import - afterEach  should exist', (test)->
  expect(afterEach).to.be.a 'function'

Tinytest.add 'import - xdescribe  should exist', (test)->
  expect(xdescribe).to.be.a 'function'

Tinytest.add 'import - xit  should exist', (test)->
  expect(xit).to.be.a 'function'

Tinytest.add 'import - specify  should exist', (test)->
  expect(specify).to.be.a 'function'

Tinytest.add 'import - xspecify  should exist', (test)->
  expect(xspecify).to.be.a 'function'

Tinytest.add 'import - context  should exist', (test)->
  expect(context).to.be.a 'function'

Tinytest.add 'import - xcontext  should exist', (test)->
  expect(xcontext).to.be.a 'function'

