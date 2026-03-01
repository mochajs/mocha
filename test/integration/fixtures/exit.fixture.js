import { createServer } from 'net';

it('should hang when --no-exit used', function (done) {
  var server = createServer();
  server.listen(55554, done);
});
