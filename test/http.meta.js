var http = require('http');

var PORT = 8889;

var server = http.createServer(function(req, res){
  var accept = req.headers.accept || ''
    , json = ~accept.indexOf('json');

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


function get(url, body, header) {
  return function(done){
    http.get({ path: url, port: PORT, headers: header || {}}, function(res){
      var buf = '';
      res.should.have.property('statusCode', 200);
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        buf.should.equal(body);
        done();
      });
    })
  }
}

describe('http requests', function () {

  before(function(done) {
    server.listen(PORT, done);
  });

  after(function() {
    server.close();
  });

  describe('GET /', function () {
    it('should respond with hello',
      get('/', 'hello'))
  })

  describe('GET /users', function(){
    it('should respond with users',
      get('/users', 'tobi, loki, jane'))

    it('should respond with users',
      get('/users', '["tobi","loki","jane"]', { Accept: 'application/json' }))
  })
})
