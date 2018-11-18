// import BN from "bn.js";
import { BigInteger } from "jsbn";
import { sha1 } from "crypto-hash";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";
import * as Message from "../pgp-signature/Message.js";
import * as MPI from "../pgp-signature/MPI.js";
import * as PublicKey from "../pgp-signature/Packet/PublicKey.js";
import { calcKeyId } from "./calcKeyId.js";
import { certificationSignatureHashData } from "../pgp-signature/certificationSignatureHashData.js";
import * as EMSA from "../pgp-signature/emsa.js";
import { trimZeros } from "../pgp-signature/trimZeros.js";
import { roundPowerOfTwo } from "../pgp-signature/roundPowerOfTwo.js";
import arrayBufferToHex from "array-buffer-to-hex";
import * as Uint16 from "../pgp-signature/Uint16.js";

export async function exportPublicKey(jwk, _jwk, author, timestamp) {
  if (jwk.kty !== "RSA" || jwk.alg !== "RS1") throw new Error("Only RSA keys supported at this time");
  // TODO: I need to figure out how to automatically adjust the lengths based on the data.
  console.log(jwk);
  let e = UrlSafeBase64.serialize(jwk.e);
  console.log("e", e);
  let n = UrlSafeBase64.serialize(jwk.n);
  console.log("n", n);

  let publicKeyPacket = PublicKey.fromJWK(jwk, { creation: timestamp });

  let { fingerprint, keyid } = await calcKeyId(publicKeyPacket);
  console.log("keyid", arrayBufferToHex(keyid));

  let userIdPacket = { userid: author };

  let partialSignaturePacket = {
    version: 4,
    type: 19,
    alg: 1,
    hash: 2,
    hashed: {
      subpackets: [
        {
          type: 2,
          subpacket: {
            creation: timestamp
          }
        },
        {
          type: 27,
          subpacket: {
            flags: 3
          }
        }
      ]
    }
  };

  let buffer = await certificationSignatureHashData(publicKeyPacket, userIdPacket, partialSignaturePacket);
  console.log("hash this!", buffer);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  console.log("hash", new Uint8Array(hash));
  console.log("hash", arrayBufferToHex(new Uint8Array(hash))); // ef0a51219d056749a63fda970f5a504e451de039

  let left16 = Uint16.parse([hash[0], hash[1]]);
  console.log("left16", left16);

  // We need the modulus length in bytes
  let modulusLength = roundPowerOfTwo(n.byteLength);
  console.log("modulusLength", modulusLength);

  // TODO: Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format:
  // https://github.com/openpgpjs/openpgpjs/blob/a35b4d28e0215c3a6654a4401c4e7e085b55e220/src/crypto/pkcs1.js
  hash = EMSA.encode("SHA1", hash, modulusLength);

  console.log("nativePrivateKey", _jwk);

  console.time("jsbn"); // 679ms
  let P = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(_jwk.p)), 16);
  let Q = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(_jwk.q)), 16);
  let U = P.modInverse(Q);
  let N = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(_jwk.n)), 16);
  // let E = new BN(UrlSafeBase64.serialize(_jwk.e));
  let D = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(_jwk.d)), 16);
  let M = new BigInteger(arrayBufferToHex(hash), 16);

  // // Straightforward solution: ~ 679ms
  // console.time("standard");
  // let S = M.modPow(D, N);
  // console.timeEnd("standard");

  // Fast solution using Chinese Remainder Theorem: ~184ms
  console.time("CRT"); //
  let ONE = new BigInteger("01", 16);
  let DP = D.mod(P.subtract(ONE));
  let DQ = D.mod(Q.subtract(ONE));
  let M1 = M.modPow(DP, P);
  let M2 = M.modPow(DQ, Q);
  let H = U.multiply(M2.subtract(M1)).mod(Q);
  let S = M1.add(H.multiply(P));
  console.timeEnd("CRT");

  let signature = new Uint8Array(S.toByteArray());
  signature = trimZeros(signature);
  console.log("_signature", signature);
  console.timeEnd("jsbn");

  let signatureLength = signature.byteLength;
  console.log("signatureLength", signatureLength);
  signature = UrlSafeBase64.parse(new Uint8Array(signature));
  console.log("signature", signature);

  let completeSignaturePacket = Object.assign({}, partialSignaturePacket, {
    unhashed: {
      subpackets: [
        {
          type: 16,
          subpacket: {
            issuer: UrlSafeBase64.parse(keyid)
          }
        }
      ]
    },
    left16,
    mpi: {
      signature
    }
  });

  let message = {
    type: "PGP PUBLIC KEY BLOCK",
    packets: [
      {
        type: 0,
        tag: 6,
        packet: publicKeyPacket
      },
      {
        type: 0,
        tag: 13,
        packet: userIdPacket
      },
      {
        type: 0,
        tag: 2,
        packet: completeSignaturePacket
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
