'use strict';

const net = require('net');
const assert = require('assert');

describe('how to debug Mocha when it hangs', function () {
  before(function (done) {
    const server = net.createServer();
    server.listen(10101, done);
  });

  after(function () {
    global.asyncDump();
  });

  it('should complete, but Mocha should not exit', function(done) {
    const sock = net.createConnection(10101, () => {
      assert.deepEqual(sock.address().family, 'IPv4');
      done();
    });
  });
});