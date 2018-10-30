import * as SignaturePacket from "../pgp-signature/Packet/Signature.js";

let fixture = {
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
          issuer: new Uint8Array([
            0x96,
            0x09,
            0xb8,
            0xa5,
            0x92,
            0x8b,
            0xa6,
            0xb9
          ]),
          issuer_s: "9609b8a5928ba6b9"
        }
      }
    ]
  },
  left16: 59615,
  mpi: {
    signature: new Uint8Array([1, 0, 1])
  }
};

describe("Signature Packet", () => {
  test("serialize -> parse", () => {
    let _data = SignaturePacket.serialize(fixture);
    let result = SignaturePacket.parse(_data);
    expect(result).toEqual(fixture);
  });
});
