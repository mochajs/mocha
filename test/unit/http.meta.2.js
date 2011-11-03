
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
  var fields
    , expected;

  if (header) {
    fields = Object.keys(header).map(function(field){
      return field + ': ' + header[field];
    }).join(', ');
  }

  function request(done) {
    http.get({ path: url, port: 8899, headers: header }, function(res){
      var buf = '';
      res.statusCode.should.equal(200);
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        buf.should.equal(expected);
        done();
      });
    })
  }

  return {
    should: {
      respond: function(body){
        expected = body;
        describe('GET ' + url, function(){
          if (fields) {
            describe('when given ' + fields, function(){
              it('should respond with "' + body + '"', request);
            });
          } else {
            it('should respond with "' + body + '"', request);
          }
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