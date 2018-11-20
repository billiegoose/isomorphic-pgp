import { BigInteger } from "jsbn";
import { sha1 } from "crypto-hash";
import arrayBufferToHex from "array-buffer-to-hex";

import * as UrlSafeBase64 from "@isomorphic-pgp/parser/UrlSafeBase64.js";
import * as Message from "@isomorphic-pgp/parser/Message.js";
import * as SecretKey from "@isomorphic-pgp/parser/Packet/SecretKey.js";
import { certificationSignatureHashData } from "@isomorphic-pgp/parser/certificationSignatureHashData.js";
import * as EMSA from "@isomorphic-pgp/parser/emsa.js";
import * as Uint16 from "@isomorphic-pgp/parser/Uint16.js";

import { trimZeros } from "@isomorphic-pgp/util/trimZeros.js";
import { roundPowerOfTwo } from "@isomorphic-pgp/util/roundPowerOfTwo.js";
import { fingerprint } from "@isomorphic-pgp/util/fingerprint.js";

// TODO: WORK IN PROGRESS
export async function JWKtoPGP(jwk, author, timestamp) {
  if (jwk.kty !== "RSA" || jwk.alg !== "RS1") throw new Error("Only RSA keys supported at this time");

  let e = UrlSafeBase64.serialize(jwk.e);
  let n = UrlSafeBase64.serialize(jwk.n);
  let d = UrlSafeBase64.serialize(jwk.d);
  let p = UrlSafeBase64.serialize(jwk.p);
  let q = UrlSafeBase64.serialize(jwk.q);

  let secretKeyPacket = SecretKey.fromJWK(jwk, { creation: timestamp });

  // Compute missing parameter u
  let P = new BigInteger(arrayBufferToHex(p), 16);
  let Q = new BigInteger(arrayBufferToHex(q), 16);
  let U = P.modInverse(Q);
  let _U = new Uint8Array(U.toByteArray());
  let u = UrlSafeBase64.parse(_U);
  secretKeyPacket.mpi.u = u;

  let keyidBuffer = (await fingerprint(secretKeyPacket)).slice(12);

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
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);

  let left16 = Uint16.parse([hash[0], hash[1]]);

  // We need the modulus length in bytes
  let modulusLength = roundPowerOfTwo(n.byteLength);

  // TODO: Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format:
  // https://github.com/openpgpjs/openpgpjs/blob/a35b4d28e0215c3a6654a4401c4e7e085b55e220/src/crypto/pkcs1.js
  hash = EMSA.encode("SHA1", hash, modulusLength);

  // SIGN
  let N = new BigInteger(arrayBufferToHex(n), 16);
  let D = new BigInteger(arrayBufferToHex(d), 16);
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
  let ONE = new BigInteger("01", 16);
  let DP = D.mod(P.subtract(ONE));
  let DQ = D.mod(Q.subtract(ONE));
  let M1 = M.modPow(DP, P);
  let M2 = M.modPow(DQ, Q);
  let H = U.multiply(M2.subtract(M1)).mod(Q);
  let S = M1.add(H.multiply(P));

  let signature = new Uint8Array(S.toByteArray());
  signature = trimZeros(signature);
  signature = UrlSafeBase64.parse(new Uint8Array(signature));

  let completeSignaturePacket = Object.assign({}, partialSignaturePacket, {
    unhashed: {
      subpackets: [
        {
          type: 16,
          subpacket: {
            issuer: UrlSafeBase64.parse(keyidBuffer)
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
