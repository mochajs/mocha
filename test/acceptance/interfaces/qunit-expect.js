suite("Using expect as a function");

test('expect succeeds', function (){
  expect(3);
  ok(true);
  ok(true);
  ok(true);
});

test('Should Fail: expect fails', function (){
  expect(25);
  ok(true);
});

test('expect succeds async', function (done){
  expect(2);
  ok(true);
  setTimeout(function (){
    ok(true);
    done();
  }, 100);
});

test('Should Fail: expect fails async', function (done){
  expect(1);
  ok(true);
  setTimeout(function (){
    ok(true);
    done();
  }, 100);
});

suite("Using expect as an argument");

test('expect succeeds', 3, function (){
  ok(true);
  ok(true);
  ok(true);
});

test('Should Fail: expect fails', 25, function (){
  ok(true);
});

test('expect succeds async', 2, function (done){
  ok(true);
  setTimeout(function (){
    ok(true);
    done();
  }, 100);
});

test('Should Fail: expect fails async', 1, function (done){
  ok(true);
  setTimeout(function (){
    ok(true);
    done();
  }, 100);
});