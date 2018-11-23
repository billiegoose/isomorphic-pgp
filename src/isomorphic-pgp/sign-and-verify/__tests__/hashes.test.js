const { hashes } = require("../hashes.js");

describe("hashes", () => {
  it("hashes", async () => {
    expect(Object.keys(hashes)).toEqual(["SHA1", "SHA256", "SHA384", "SHA512"]);
  });
});