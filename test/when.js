describe("Suite", function () {
	describe(".when()", function () {
		var containedSuite;
		describe("when when() is called with true", function () {
			it("should not make inner-suites pending", function () {
				when(true, function () {
					containedSuite = describe("this block should run", function () {
						it("should run this test", function () {
							true.should.equal(true);
						});
					});
				});

				containedSuite.pending.should.equal(false);
			});
		});

		describe("when when() is called with false", function () {
			it("should make inner-suites pending", function () {
				when(false, function () {
					containedSuite = describe("this block should not run", function () {
						it("should not run this test", function () {
							true.should.equal(false);
						});
					});
				});

				containedSuite.pending.should.equal(true);
			});
		});
	});
});
