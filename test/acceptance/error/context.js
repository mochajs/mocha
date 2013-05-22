
// Known issue: #270
// This will currently fail and stop further execution of mocha entirely.
// describe('failure during beforeEach', function(){
//    beforeEach(function(){
//      throw new Error("Failure during beforeEach");
//    })
//
//   it('should fail during beforeEach #1', function(){
//   })
//
//   it('should fail during beforeEach #2', function(){
//   })
// })

