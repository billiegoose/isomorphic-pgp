import * as OldFormatPacket from "../pgp-signature/OldFormatPacket.js";

let fixture = {
  type: 0,
  type_s: "old",
  tag: 2,
  tag_s: "Signature Packet",
  length: {
    type: 0,
    type_s: "one-octet length",
    value: 31
  },
  packet: {
    version: 4,
    type: 0,
    type_s: "Signature of a binary document",
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
            issuer: "lgm4pZKLprk",
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

let _fixture = {
  type: 0,
  tag: 2,
  packet: {
    version: 4,
    type: 0,
    alg: 1,
    hash: 2,
    hashed: {
      subpackets: [
        {
          type: 2,
          subpacket: {
            creation: 1540511553
          }
        }
      ]
    },
    unhashed: {
      subpackets: [
        {
          type: 16,
          subpacket: {
            issuer: "lgm4pZKLprk"
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

describe("OldFormatPacket", () => {
  test("serialize -> parse", () => {
    let _data = OldFormatPacket.serialize(_fixture);
    let a = {
      b: _data,
      i: 0
    };
    let result = OldFormatPacket.parse(a, { type: 0, type_s: "old" });
    expect(result).toEqual(fixture);
  });
});
