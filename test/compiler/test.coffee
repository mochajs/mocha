
obj = foo: 'bar'

describe 'coffeescript', ->
  it 'should work', ->
    expect(obj, 'to equal', foo: 'bar')
