const Issuer = require("../Issuer.js");

let input = {
  issuer: "lgm4pZKLprk"
};

let output = {
  issuer: "lgm4pZKLprk",
  issuer_s: "9609b8a5928ba6b9"
};

describe("Issuer", () => {
  it("parse -> serialize", () => {
    let result = Issuer.parse(Issuer.serialize(input));
    expect(result).toEqual(output);
  });
});
