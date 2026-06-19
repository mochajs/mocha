module.exports = function (mocha) {
  mocha.addFile(require.resolve('./multiple-runs-with-different-output-suite.fixture.js'));
  console.log('[');
  try {
    mocha.run(() => {
      console.log(',');
      try {
        mocha.run(() => {
          console.log(',');
          mocha.run(() => {
            console.log(']');
          });
        });
      } catch (err) {
        console.error(err.code);
        throw err;
      }
    });
  } catch (err) {
    console.error(err.code);
    throw err;
  }

}
