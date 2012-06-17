
describe('String', function(){
  describe('.trim()', function(){
    it('should remove leading and trailing whitespace', function(){
      expect('  foo  '.trim()).to.equal('foo');
    })
  })

  describe('.replace(substr, str)', function(){
    it('should replace the first occurrence of substr', function(){
      var str = 'foobar'.replace('foo', 'bar');
      expect(str).to.equal('barbar');
    })
  })
})