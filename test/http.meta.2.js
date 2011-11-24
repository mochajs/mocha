
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

function get(url) {
  var fields
    , expected
    , header = {};

  function request(done) {
    http.get({ path: url, port: 8899, headers: header }, function(res){
      var buf = '';
      res.should.have.status(200);
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        buf.should.equal(expected);
        done();
      });
    })
  }

  return {
    set: function(field, val){
      header[field] = val;
      return this;
    },

    should: {
      respond: function(body){
        fields = Object.keys(header).map(function(field){
          return field + ': ' + header[field];
        }).join(', ');

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
  get('/')
    .should
    .respond('hello')

  get('/users')
    .should
    .respond('tobi, loki, jane')

  get('/users')
    .set('Accept', 'application/json')
    .should
    .respond('["tobi","loki","jane"]')
})