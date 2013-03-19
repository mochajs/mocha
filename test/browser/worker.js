describe('Web Workers', function(){
  if (window.Worker) {
    it('can use mocha', function(done){
      var worker = new Worker('worker_main.js');
      worker.onmessage = function(e){
        var message = e.data;
        switch(message.type) {
        case 'pass':
          console.log('WebWorker Test Passed: ' + message.test.fullTitle);
          break;
        case 'fail':
          console.log('WebWorker Test Failed: ' + message.test.fullTitle);
          break;
        case 'done':
          console.log('WebWorker Tests Done', message);
          assert(message.stats.failures === 1);
          done();
          break;
        }
      };
      worker.postMessage({type: 'go'});
    });
  } else {
    skip('can use mocha');
  }
})
