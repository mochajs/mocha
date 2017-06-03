'use strict';

var http = require('http');
var getPort = require('get-port');

var server = http.createServer(function (req, res) {
  res.end('Hello World\n');
});

describe('http', function () {
  var port;

  before(function (done) {
    getPort(function (err, portNo) {
      if (err) {
        return done(err);
      }
      port = portNo;
      server.listen(port, done);
    });
  });

  it('should provide an example', function (done) {
    http.get({
      path: '/',
      port: port
    }, function (res) {
      expect(res)
        .to
        .have
        .property('statusCode', 200);
      done();
    });
  });
});
