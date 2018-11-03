import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";
import * as Message from "../pgp-signature/Message.js";
import * as MPI from "../pgp-signature/MPI.js";
import { certificationSignatureHashData } from "../pgp-signature/certificationSignatureHashData.js";

export async function exportPublicKey(
  nativePublicKey,
  nativePrivateKey,
  author,
  timestamp
) {
  let jwk = await crypto.subtle.exportKey("jwk", nativePublicKey);
  if (jwk.kty !== "RSA" || jwk.alg !== "RS1")
    throw new Error("Only RSA keys supported at this time");
  // TODO: I need to figure out how to automatically adjust the lengths based on the data.
  console.log(jwk);
  let e = UrlSafeBase64.serialize(jwk.e);
  console.log("e", e);
  let n = UrlSafeBase64.serialize(jwk.n);
  console.log("n", n);

  let publicKeyPacket = {
    version: 4,
    creation: timestamp,
    alg: 1,
    alg_s: "RSA (Encrypt or Sign)",
    mpi: {
      n: jwk.n,
      e: jwk.e
    }
  };

  let userIdPacket = { userid: author };

  let partialSignaturePacket = {
    version: 4,
    type: 16,
    type_s: "Generic certification of a User ID and Public-Key packet",
    alg: 1,
    alg_s: "RSA (Encrypt or Sign)",
    hash: 2,
    hash_s: "SHA1",
    hashed: {
      length: 0,
      subpackets: []
    }
  };

  let buffer = await certificationSignatureHashData(
    publicKeyPacket,
    userIdPacket,
    partialSignaturePacket
  );
  console.log("hash this!", buffer);
  let hash = await crypto.subtle.digest("SHA-1", buffer);

  let view = new Uint16Array(hash);
  let left16 = view[0];
  console.log("left16", left16);

  let signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    nativePrivateKey,
    hash
  );
  let signatureLength = signature.byteLength;
  console.log("signatureLength", signatureLength);
  signature = UrlSafeBase64.parse(new Uint8Array(signature));
  console.log("signature", signature);

  let completeSignaturePacket = {
    version: 4,
    type: 16,
    type_s: "Generic certification of a User ID and Public-Key packet",
    alg: 1,
    alg_s: "RSA (Encrypt or Sign)",
    hash: 2,
    hash_s: "SHA1",
    hashed: {
      length: 0,
      subpackets: []
    },
    unhashed: {
      length: 0,
      subpackets: []
    },
    left16,
    mpi: {
      signature
    }
  };

  let message = {
    type: "PGP PUBLIC KEY BLOCK",
    packets: [
      {
        type: 0,
        type_s: "old",
        tag: 6,
        tag_s: "Public-Key Packet",
        length: { type: 1, type_s: "two-octet length", value: 525 },
        packet: publicKeyPacket
      },
      {
        type: 0,
        type_s: "old",
        tag: 13,
        tag_s: "User ID Packet",
        length: { type: 0, type_s: "one-octet length", value: author.length },
        packet: userIdPacket
      },
      {
        type: 0,
        type_s: "old",
        tag: 2,
        tag_s: "Signature Packet",
        length: {
          type: 1,
          type_s: "two-octet length",
          value: 12 + signatureLength
        },
        packet: completeSignaturePacket
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
