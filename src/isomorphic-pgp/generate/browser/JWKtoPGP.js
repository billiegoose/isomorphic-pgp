import { BigInteger } from "jsbn";
import { sha1 } from "crypto-hash";
import arrayBufferToHex from "array-buffer-to-hex";

import * as UrlSafeBase64 from "@isomorphic-pgp/parser/UrlSafeBase64.js";
import * as Message from "@isomorphic-pgp/parser/Message.js";
import * as SecretKey from "@isomorphic-pgp/parser/Packet/SecretKey.js";
import { certificationSignatureHashData } from "@isomorphic-pgp/parser/certificationSignatureHashData.js";
import * as EMSA from "@isomorphic-pgp/parser/emsa.js";
import { trimZeros } from "@isomorphic-pgp/parser/util/trimZeros.js";
import { roundPowerOfTwo } from "@isomorphic-pgp/parser/util/roundPowerOfTwo.js";
import * as Uint16 from "@isomorphic-pgp/parser/Uint16.js";

import { calcKeyId } from "@isomorphic-pgp/util/calcKeyId.js";

// TODO: WORK IN PROGRESS
export async function JWKtoPGP(jwk, author, timestamp) {
  if (jwk.kty !== "RSA" || jwk.alg !== "RS1") throw new Error("Only RSA keys supported at this time");

  console.log(jwk);
  let e = UrlSafeBase64.serialize(jwk.e);
  console.log("e.byteLength", e.byteLength);
  let n = UrlSafeBase64.serialize(jwk.n);
  console.log("n.byteLength", n.byteLength);
  let d = UrlSafeBase64.serialize(jwk.d);
  console.log("d.byteLength", d.byteLength);
  let p = UrlSafeBase64.serialize(jwk.p);
  console.log("p.byteLength", p.byteLength);
  let q = UrlSafeBase64.serialize(jwk.q);
  console.log("q.byteLength", q.byteLength);

  let secretKeyPacket = SecretKey.fromJWK(jwk, { creation: timestamp });

  // Compute missing parameter u
  let P = new BigInteger(arrayBufferToHex(p), 16);
  let Q = new BigInteger(arrayBufferToHex(q), 16);
  let U = P.modInverse(Q);
  let _U = new Uint8Array(U.toByteArray());
  let u = UrlSafeBase64.parse(_U);
  secretKeyPacket.mpi.u = u;

  let { fingerprint, keyid } = await calcKeyId(secretKeyPacket);
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

  let buffer = await certificationSignatureHashData(secretKeyPacket, userIdPacket, partialSignaturePacket);
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

  // SIGN
  console.log("nativePrivateKey", jwk);

  let N = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(jwk.n)), 16);
  // let E = new BN(UrlSafeBase64.serialize(jwk.e));
  let D = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(jwk.d)), 16);
  let M = new BigInteger(arrayBufferToHex(hash), 16);

  // // Straightforward solution: ~ 679ms
  // console.time("standard");
  // let S = M.modPow(D, N);
  // console.timeEnd("standard");

  // Fast solution using Chinese Remainder Theorem: ~184ms
  // from libgcryp docs:
  /*
   *      m1 = c ^ (d mod (p-1)) mod p
   *      m2 = c ^ (d mod (q-1)) mod q
   *      h = u * (m2 - m1) mod q
   *      m = m1 + h * p
   */
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
  console.log("_signature2", signature);

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
    type: "PGP PRIVATE KEY BLOCK",
    packets: [
      {
        type: 0,
        tag: 5,
        packet: secretKeyPacket
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
