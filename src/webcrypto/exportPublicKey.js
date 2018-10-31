import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";
import * as Message from "../pgp-signature/Message.js";

export async function exportPublicKey(nativePublicKey, author) {
  let jwk = await crypto.subtle.exportKey("jwk", nativePublicKey);
  if (jwk.kty !== "RSA" || jwk.alg !== "RS1")
    throw new Error("Only RSA keys supported at this time");
  // TODO: I need to figure out how to automatically adjust the lengths based on the data.
  console.log(jwk);
  let e = UrlSafeBase64.serialize(jwk.e);
  console.log("e", e);
  let n = UrlSafeBase64.serialize(jwk.n);
  console.log("n", n);
  let message = {
    type: "PGP PUBLIC KEY BLOCK",
    packets: [
      {
        type: 0,
        type_s: "old",
        tag: 6,
        tag_s: "Public-Key Packet",
        length: { type: 1, type_s: "two-octet length", value: 525 },
        packet: {
          version: 4,
          creation: Math.floor(Date.now() / 1000),
          alg: 1,
          alg_s: "RSA (Encrypt or Sign)",
          mpi: {
            n: jwk.n,
            e: jwk.e
          }
        }
      },
      {
        type: 0,
        type_s: "old",
        tag: 13,
        tag_s: "User ID Packet",
        length: { type: 0, type_s: "one-octet length", value: author.length },
        packet: { userid: author }
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
