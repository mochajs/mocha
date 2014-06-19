
describe('timeout', function(){
  this.timeout(20);

  it('should be honored with sync suites', function(){
    sleep(30);
  });

  it('should be honored with async suites', function(done){
    sleep(30);
    done();
  });

  function sleep(ms){
    var start = Date.now();
    while(start + ms > Date.now())continue;
  }
});
