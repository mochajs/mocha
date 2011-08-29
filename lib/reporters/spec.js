
exports = module.exports = Spec;

exports.useColors = true;

exports.colors = {
    suite: '90'
  , pass: '32'
  , fail: '31'
};

function color(type, str) {
  if (!exports.useColors) return str;
  return '\033[' + exports.colors[type] + 'm' + str + '\033[0m';
}

function Spec(runner) {
  var indents = 0;

  function indent() {
    return Array(indents + 1).join('  ');
  }

  runner.on('start', function(){
    console.log();
  });

  runner.on('suite', function(suite){
    console.log('  %s', color('suite', suite.title));
  });

  runner.on('test', function(test){
    console.log('  %s', color(test.title);
  });

  runner.on('pass', function(test){
    console.log('    √');
  });

  runner.on('fail', function(test, err){
    console.log('    x %s', err.message);
  });

  runner.on('end', function(){
    console.log();
  });
}