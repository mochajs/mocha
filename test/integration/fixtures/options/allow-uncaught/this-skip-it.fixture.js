'use strict';

describe('test suite', () => {
    it('test1', function () { });
    it('test2', function (done) {
        var self = this;
        setTimeout(function () {
          self.skip();
          throw new Error("should not throw");
        }, 10);
    });
    it('test3', function () {
        this.skip();
        throw new Error("should not throw");
    });
    it('test4', function () { });
    it('test5', function () {
        this.skip();
        throw new Error("should not throw");
    });
});
