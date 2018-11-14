import { BigInteger } from "jsbn";
import * as Message from "../pgp-signature/Message.js";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";
import { payloadSignatureHashData } from "../pgp-signature/payloadSignatureHashData.js";
import * as EMSA from "../pgp-signature/emsa.js";
import { sha1 } from "crypto-hash";
import { trimZeros } from "../pgp-signature/trimZeros.js";
import { encode } from "../isomorphic-textencoder";

import arrayBufferToHex from "array-buffer-to-hex";

// TODO: WORK IN PROGRESS
export async function sign(openpgpPrivateKey, payload, timestamp) {
  let parsed = Message.parse(openpgpPrivateKey);
  let privateKeyPacket = parsed.packets[0].packet;
  let userIdPacket = parsed.packets[1].packet;

  // TODO: Assert that this is all correct and stuff.
  let selfSignaturePacket = parsed.packets[2].packet;
  let keyid = selfSignaturePacket.unhashed.subpackets.find(subpacket => subpacket.type === 16).subpacket.issuer;
  console.log("keyid", arrayBufferToHex(UrlSafeBase64.serialize(keyid)));

  let e = UrlSafeBase64.serialize(privateKeyPacket.mpi.e);
  console.log("e", e);
  let n = UrlSafeBase64.serialize(privateKeyPacket.mpi.n);
  console.log("n", n);
  let d = UrlSafeBase64.serialize(privateKeyPacket.mpi.d);
  console.log("d", d);
  let p = UrlSafeBase64.serialize(privateKeyPacket.mpi.p);
  console.log("p", p);
  let q = UrlSafeBase64.serialize(privateKeyPacket.mpi.q);
  console.log("q", q);
  let u = UrlSafeBase64.serialize(privateKeyPacket.mpi.u);
  console.log("u", u);

  // SIGN
  let D = new BigInteger(arrayBufferToHex(d), 16);
  let P = new BigInteger(arrayBufferToHex(p), 16);
  let Q = new BigInteger(arrayBufferToHex(q), 16);
  let U = new BigInteger(arrayBufferToHex(u), 16);

  let partialSignaturePacket = {
    version: 4,
    // type: 16,
    // type_s: "Generic certification of a User ID and Public-Key packet",
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
            creation: timestamp
          }
        }
      ]
    }
  };

  payload = typeof payload === "string" ? encode(payload) : payload;
  let buffer = await payloadSignatureHashData(payload, partialSignaturePacket);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  console.log("hash", arrayBufferToHex(hash));
  let left16 = (hash[0] << 8) + hash[1];
  console.log("left16", left16);
  // Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format:
  console.log("n.byteLength", n.byteLength);
  hash = EMSA.encode("SHA1", hash, n.byteLength);
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
  console.log("signature", signature);

  let signatureLength = signature.byteLength;
  console.log("signatureLength", signatureLength);

  signature = UrlSafeBase64.parse(signature);
  console.log("signature", signature);

  let completeSignaturePacket = Object.assign({}, partialSignaturePacket, {
    unhashed: {
      length: 10,
      subpackets: [
        {
          length: 9,
          type: 16,
          subpacket: {
            issuer: keyid
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
          value: 12 + 6 + 10 + signatureLength
        },
        packet: completeSignaturePacket
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
