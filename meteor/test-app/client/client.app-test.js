import {describe, it} from "meteor/practicalmeteor:mocha"

import {expect} from "meteor/practicalmeteor:chai"

describe("Fuel app: Client Test", function(){

  it("this test is client side only", function(){
    expect(Meteor.isClient).to.be.true
    expect(Meteor.isServer).to.be.false
  })
});
