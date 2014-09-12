var debug = require('debug')('mocha:issue1327');
it("test 1", function() {
    debug("This runs only once.");
    process.nextTick(function() {
        throw "Too bad";
    });
});
it("test 2", function() {
    debug("This should run once - Previously wasn't called at all.");
});
it("test 3", function() {
    debug("This used to run twice.");
    throw new Error("OUCH");
});
