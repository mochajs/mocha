
import Mocha from '../../../../lib/mocha.js';

const mocha = new Mocha({reporter: 'json'});
mocha.addFile("./test/integration/fixtures/__default__.fixture.js");

const runner = mocha.run();
runner.on('test', function (test) { test.pending = true; });
