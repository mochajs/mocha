require('should')

window.initMochaPhantomJS && window.initMochaPhantomJS()
mocha.setup('bdd')
mocha.timeout(200)

window.onload = function () {
  mocha.checkLeaks()
  var runner = mocha.run()
}
