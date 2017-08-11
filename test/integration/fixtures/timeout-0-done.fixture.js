'use strict';

it('never finishes', function (done) {
  process.send('process started');
  this.timeout(0);
});
