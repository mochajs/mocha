
var http = require('http');

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
})

server.listen(8899);

function get(url, header) {
  return {
    should: {
      respond: function(body){
        describe('GET ' + url, function(){
          it('should respond with "' + body + '"', function(done){
            http.get({ path: url, port: 8899, headers: header }, function(res){
              var buf = '';
              res.statusCode.should.equal(200);
              res.setEncoding('utf8');
              res.on('data', function(chunk){ buf += chunk });
              res.on('end', function(){
                buf.should.equal(body);
                done();
              });
            })            
          });
        });
      }
    }
  };

}

describe('http server', function(){
  var json = 'application/json';
  get('/').should.respond('hello')
  get('/users').should.respond('tobi, loki, jane')
  get('/users', { Accept: json }).should.respond('["tobi","loki","jane"]')
})