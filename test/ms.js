var ms = require('../lib/ms');

describe('ms', function(){

  describe('millisecond to string', function(){
    it('does not pluralize durations that equate to single units of time', function(){
      ms(1).should.equal('1 ms');
      ms(1000).should.equal('1 second');
      ms(1000 * 60).should.equal('1 minute');
      ms(1000 * 60 * 60).should.equal('1 hour');
      ms(1000 * 60 * 60 * 24).should.equal('1 day');
    });

    it('does not pluralize durations that round to single units of time', function(){
      ms(1 + 1000).should.equal('1 second');
      ms(1 + 1000 * 60).should.equal('1 minute');
      ms(1 + 1000 * 60 * 60).should.equal('1 hour');
      ms(1 + 1000 * 60 * 60 * 24).should.equal('1 day');
    });

    it('pluralizes durations when necessary', function(){
      ms(2 * 1000).should.equal('2 seconds');
      ms(2 * 1000 * 60).should.equal('2 minutes');
      ms(2 * 1000 * 60 * 60).should.equal('2 hours');
      ms(2 * 1000 * 60 * 60 * 24).should.equal('2 days');
    });
  });

  describe('string to millisecond', function(){
    it('returns the correct milliseconds for years', function(){
      ms('1.5 years').should.equal(1.5 * 31557600000);
      ms('1.5 Years').should.equal(1.5 * 31557600000);
      ms('1.5 year').should.equal(1.5 * 31557600000);
      ms('1.5 y').should.equal(1.5 * 31557600000);
    });

    it('returns the correct milliseconds for days', function(){
      ms('1.5 days').should.equal(1.5 * 86400000);
      ms('1.5 Days').should.equal(1.5 * 86400000);
      ms('1.5 day').should.equal(1.5 * 86400000);
      ms('1.5 d').should.equal(1.5 * 86400000);
    });

    it('returns the correct milliseconds for hours', function(){
      ms('1.5 hours').should.equal(1.5 * 3600000);
      ms('1.5 Hours').should.equal(1.5 * 3600000);
      ms('1.5 hour').should.equal(1.5 * 3600000);
      ms('1.5 h').should.equal(1.5 * 3600000);
    });

    it('returns the correct milliseconds for minutes', function(){
      ms('1.5 minutes').should.equal(1.5 * 60000);
      ms('1.5 Minutes').should.equal(1.5 * 60000);
      ms('1.5 minute').should.equal(1.5 * 60000);
      ms('1.5 m').should.equal(1.5 * 60000);
    });

    it('returns the correct milliseconds for seconds', function(){
      ms('1.5 seconds').should.equal(1.5 * 1000);
      ms('1.5 Seconds').should.equal(1.5 * 1000);
      ms('1.5 second').should.equal(1.5 * 1000);
      ms('1.5 s').should.equal(1.5 * 1000);
    });

    it('returns the correct milliseconds for milliseconds', function(){
      ms('1.5 ms').should.equal(1.5);
      ms('1.5 MS').should.equal(1.5);
      ms('1.5').should.equal(1.5);
    });
  });

});
