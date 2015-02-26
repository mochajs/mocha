
obj = foo: 'bar'

describe 'coffeescript', ->
  it 'should work', ->
    obj.should.eql foo: 'bar'
