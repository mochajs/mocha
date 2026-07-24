import { main } from "../../../lib/cli/cli.js";
import sinon from "sinon";

describe("cli", function () {
  describe("main()", function () {
    beforeEach(function () {
      sinon.stub(console, "error");
      sinon.stub(console, "log");
      sinon.stub(process, "exit").throws(new Error("process.exit"));
    });

    afterEach(function () {
      sinon.restore();
    });

    it("prints version and exits for --version", function () {
      expect(() => main(["--version"]), "to throw", /process\.exit/);
      expect(process.exit, "to have a call satisfying", [0]);
    });

    it("prints help and exits for --help", function () {
      expect(() => main(["--help"]), "to throw", /process\.exit/);
      expect(process.exit, "to have a call satisfying", [0]);
    });
  });
});
