'use strict';

/**
 * This file generates a wide range of output to test reporter functionality.
 */

describe('Animals', function() {

  it('should consume organic material', function(done) { done(); });
  it('should breathe oxygen', function(done) {
    // we're a jellyfish
    var actualBreathe = 'nothing';
    var expectedBreathe = 'oxygen';
    expect(actualBreathe, 'to equal', expectedBreathe);
    done();
  });
  it('should be able to move', function(done) { done(); });
  it('should reproduce sexually', function(done) { done(); });
  it('should grow from a hollow sphere of cells', function(done) { done(); });

  describe('Vertebrates', function() {
    describe('Mammals', function() {
      it('should give birth to live young', function(done) {
        var expectedMammal = {
          consumesMaterial: 'organic',
          breathe: 'oxygen',
          reproduction: {
            type: 'sexually',
            spawnType: 'live',
          }
        };
        var platypus = JSON.parse(JSON.stringify(expectedMammal));
        platypus['reproduction']['spawnType'] = 'hard-shelled egg';

        expect(platypus, 'to equal', expectedMammal);
        done();
      });

      describe('Blue Whale', function() {
        it('should be the largest of all mammals', function(done) { done(); });
        it('should have a body in some shade of blue', function(done) {
          var bodyColor = 'blueish_grey';
          var shadesOfBlue = ['cyan', 'light_blue', 'blue', 'indigo'];
          expect(bodyColor, 'to be one of', shadesOfBlue);

          done();
        });
      });
    });
    describe('Birds', function() {
      it('should have feathers', function(done) { done(); });
      it('should lay hard-shelled eggs', function(done) { done(); });
    });
  });

  describe('Tardigrades', function() {
    it('should answer to "water bear"', function(done) { done(); });
    it('should be able to survive global mass extinction events', function(done) {
      throw new Error("How do we even test for this without causing one?")
      done();
    });
  });
});
