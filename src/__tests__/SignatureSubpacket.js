import * as Subpacket from "../pgp-signature/Packet/SignatureSubpacket/Subpacket.js";
import * as SubpacketArray from "../pgp-signature/Packet/SignatureSubpacket/SubpacketArray.js";

let fixtures = [
  {
    length: 5,
    type: 2,
    subpacket: {
      creation: 1479107004
    }
  },
  {
    length: 9,
    type: 16,
    subpacket: {
      issuer: "wpYJwrjCpcKSwovCpsK5",
      issuer_s: "9609b8a5928ba6b9"
    }
  },
  {
    length: 11,
    type: 64,
    subpacket: {
      data: "AAAAAAAAAAAAAA"
    }
  }
];

describe("Signature Subpacket", () => {
  test("serialize -> parse", () => {
    for (const fixture of fixtures) {
      let _data = Subpacket.serialize(fixture);
      let a = {
        b: _data,
        i: 0
      };
      let result = Subpacket.parse(a);
      expect(result).toEqual(fixture);
    }
  });
});

describe("Signature SubpacketArray", () => {
  test("serialize -> parse", () => {
    let _data = SubpacketArray.serialize(fixtures);
    let result = SubpacketArray.parse(_data);
    expect(result).toEqual(fixtures);
  });
});
