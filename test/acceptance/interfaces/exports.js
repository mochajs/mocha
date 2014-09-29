var calls = [];

exports.Array = {
  before: function(){
    calls.push('before');
  },

  after: function(){
    calls.push('after');
    calls.should.eql([
        'before'
      , 'before each'
      , 'one'
      , 'after each'
      , 'before each'
      , 'two'
      , 'after each'
      , 'after']);
  },

  '#indexOf()': {
    beforeEach: function(){
      calls.push('before each');
    },

    afterEach: function(){
      calls.push('after each');
    },

    'should return -1 when the value is not present': function(){
      calls.push('one');
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    },

    'should return the correct index when the value is present': function(){
      calls.push('two');
      [1,2,3].indexOf(1).should.equal(0);
      [1,2,3].indexOf(2).should.equal(1);
      [1,2,3].indexOf(3).should.equal(2);
    }
  }
};
