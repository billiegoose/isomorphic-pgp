const KeyExpirationTime = require("../KeyExpirationTime.js");

// prettier-ignore
let time = {keyExpirationTime: Math.floor(Date.now() / 1000)}

describe("KeyExpirationTime", () => {
  it("parse -> serialize", () => {
    let result = KeyExpirationTime.parse(KeyExpirationTime.serialize(time));
    expect(result).toEqual(time);
  });
});
