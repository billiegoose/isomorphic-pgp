import * as Packet from "../pgp-signature/Packet.js";

let fixture = {
  type: 0,
  type_s: "old",
  tag: 2,
  tag_s: "Signature Packet",
  length: {
    type: 1,
    type_s: "two-octet length",
    value: 31
  },
  packet: {
    version: 4,
    type: 0,
    alg: 1,
    alg_s: "RSA (Encrypt or Sign)",
    hash: 2,
    hash_s: "SHA1",
    hashed: {
      length: 6,
      subpackets: [
        {
          length: 5,
          type: 2,
          subpacket: {
            creation: 1540511553
          }
        }
      ]
    },
    unhashed: {
      length: 10,
      subpackets: [
        {
          length: 9,
          type: 16,
          subpacket: {
            issuer: "wpYJwrjCpcKSwovCpsK5",
            issuer_s: "9609b8a5928ba6b9"
          }
        }
      ]
    },
    left16: 59615,
    mpi: {
      signature: "AQAB"
    }
  }
};

describe("Packet", () => {
  test("serialize -> parse", () => {
    let _data = Packet.serialize(fixture);
    let a = {
      b: _data,
      i: 0
    };
    let result = Packet.parse(a, { type: 0, type_s: "old" });
    expect(result).toEqual(fixture);
  });
});
