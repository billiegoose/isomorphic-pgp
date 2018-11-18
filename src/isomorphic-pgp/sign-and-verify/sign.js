import { BigInteger } from "jsbn";
import { sha1 } from "crypto-hash";
import arrayBufferToHex from "array-buffer-to-hex";

import { encode } from "isomorphic-textencoder";

import * as Message from "isomorphic-pgp/parser/Message.js";
import * as UrlSafeBase64 from "isomorphic-pgp/parser/UrlSafeBase64.js";
import { payloadSignatureHashData } from "isomorphic-pgp/parser/payloadSignatureHashData.js";
import * as EMSA from "isomorphic-pgp/parser/emsa.js";
import { trimZeros } from "isomorphic-pgp/parser/trimZeros.js";
import * as Uint16 from "isomorphic-pgp/parser/Uint16.js";

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
    type: 0,
    alg: 1,
    hash: 2,
    hashed: {
      subpackets: [
        {
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
  let left16 = Uint16.parse([hash[0], hash[1]]);
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
      subpackets: [
        {
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
        tag: 2,
        tag_s: "Signature Packet",
        packet: completeSignaturePacket
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
