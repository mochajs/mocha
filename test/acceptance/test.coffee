
obj = foo: 'bar'

describe 'coffeescript', ->
  it 'should work', ->
    expect(obj).to.eql foo: 'bar'
