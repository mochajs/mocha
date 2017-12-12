'use strict';

var net = require('net');

it('should hang when --no-exit used', function (done) {
  var server = net.createServer();
  server.listen(55555, done);
});
