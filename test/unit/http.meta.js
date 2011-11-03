
var http = require('http');

var server = http.createServer(function(req, res){
  switch (req.url) {
    case '/':
      res.end('hello');
      break;
    case '/users':
      res.end('tobi, loki, jane');
      break;
  }
})

server.listen(8889);

function get(url, body) {
  return function(done){
    http.get({ path: url, port: 8889 }, function(res){
      var buf = '';
      res.statusCode.should.equal(200);
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        buf.should.equal(body);
        done();
      });
    })
  }
}

describe('http', function(){
  describe('GET /', function(){
    it('should respond with hello', get('/', 'hello'))
  })

  describe('GET /users', function(){
    it('should respond with users', get('/users', 'tobi, loki, jane'))
  })
})