import {describe, it} from "meteor/practicalmeteor:mocha"

import {expect} from "meteor/practicalmeteor:chai"

describe("Full app: Server Test", function(){

  it("this test is server side only", function(){
    expect(Meteor.isServer).to.be.true
    expect(Meteor.isClient).to.be.false
  })
});
