import * as Message from "../Message.js";

let fixture = {
  type: "PGP SIGNATURE",
  packets: [
    {
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
    }
  ]
};

describe("Message", () => {
  test("serialize -> parse", () => {
    let _data = Message.serialize(fixture);
    let result = Message.parse(_data);
    expect(result).toEqual(fixture);
  });
});
