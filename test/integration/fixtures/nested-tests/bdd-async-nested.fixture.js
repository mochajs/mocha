'use strict';

// BDD async nested test fixtures - should fail with nested test errors
describe('Async Nested Tests', function() {
  it('sync nested test', function() {
    it('nested in sync', function() {
      // Should fail immediately
    });
  });

  it('callback nested test', function(done) {
    setTimeout(function() {
      it('nested in callback', function() {
        // Should fail with uncaught error
      });
      done();
    }, 10);
  });

  it('promise nested test', function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        it('nested in promise', function() {
          // Should fail with uncaught error
        });
        resolve();
      }, 10);
    });
  });

  it('async/await nested test', async function() {
    await new Promise(resolve => setTimeout(resolve, 10));
    it('nested in async', function() {
      // Should fail
    });
  });
});
