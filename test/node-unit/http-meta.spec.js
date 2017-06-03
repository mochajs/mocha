'use strict';

var http = require('http');
var getPort = require('get-port');

var server = http.createServer(function (req, res) {
  var accept = req.headers.accept || '';
  var json = ~accept.indexOf('json');

  switch (req.url) {
    case '/':
      res.end('hello');
      break;
    case '/users':
      if (json) {
        res.end('["tobi","loki","jane"]');
      } else {
        res.end('tobi, loki, jane');
      }
      break;
  }
});

describe('http requests', function () {
  var port;

  function get (url, body, header) {
    return function (done) {
      http.get({
        path: url,
        port: port,
        headers: header || {}
      }, function (res) {
        var buf = '';
        res.should.have.property('statusCode', 200);
        res.setEncoding('utf8');
        res.on('data', function (chunk) { buf += chunk; });
        res.on('end', function () {
          buf.should.equal(body);
          done();
        });
      });
    };
  }

  before(function (done) {
    getPort(function (err, portNo) {
      if (err) {
        return done(err);
      }
      port = portNo;
      server.listen(port, done);
    });
  });

  beforeEach(function () {
    this.timeout(2000);
  });

  after(function () {
    server.close();
  });

  describe('GET /', function () {
    it('should respond with hello',
      get('/', 'hello'));
  });

  describe('GET /users', function () {
    it('should respond with users',
      get('/users', 'tobi, loki, jane'));

    it('should respond with users',
      get('/users', '["tobi","loki","jane"]', { Accept: 'application/json' }));
  });
});
