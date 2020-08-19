const SignatureExpirationTime = require("../SignatureExpirationTime.js");

// prettier-ignore
let time = {signatureExpirationTime: Math.floor(Date.now() / 1000)}

describe("SignatureExpirationTime", () => {
  it("parse -> serialize", () => {
    let result = SignatureExpirationTime.parse(SignatureExpirationTime.serialize(time));
    expect(result).toEqual(time);
  });
});
