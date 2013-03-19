importScripts('../../mocha.js');
mocha.setup({ ui: 'bdd', reporter: 'post-message' });

function assert(expr, msg) {
  if (!expr) throw new Error(msg || 'failed');
}

importScripts('array.js');

self.onmessage = function(e){
  switch(e.data.type) {
  case 'go':
    runner = mocha.run();
    break;
  }
}
