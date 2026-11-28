// Nothing ever resolves this, so the file never finishes loading
await new Promise(() => {});

it("should never be loaded", () => {});
