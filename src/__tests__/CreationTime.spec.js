import * as CreationTime from "../pgp-signature/Packet/SignatureSubpacket/CreationTime.js";

// prettier-ignore
let time = {creation: Math.floor(Date.now() / 1000)}

describe("CreationTime", () => {
  test("parse -> serialize", () => {
    let result = CreationTime.parse(CreationTime.serialize(time));
    expect(result).toEqual(time);
  });
});
