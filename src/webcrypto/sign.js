import * as Message from "../pgp-signature/Message.js";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";

export async function sign(nativePrivateKey, text2sign) {
  let signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    nativePrivateKey,
    text2sign
  );
  console.log(signature);
  // Oh the irony.
  signature = UrlSafeBase64.parse(new Uint8Array(signature));
  console.log(signature);
  let message = {
    type: "PGP SIGNATURE",
    packets: [
      {
        type: 0,
        type_s: "old",
        tag: 2,
        tag_s: "Signature Packet",
        length: { type: 1, type_s: "two-octet length", value: 540 },
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
                subpacket: { creation: Math.floor(Date.now() / 1000) }
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
            signature: signature
          }
        }
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
