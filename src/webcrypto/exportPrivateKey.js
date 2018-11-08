// import BN from "bn.js";
import { BigInteger } from "jsbn";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";
import * as Message from "../pgp-signature/Message.js";
import * as SecretKey from "../pgp-signature/Packet/SecretKey.js";
import { calcKeyId } from "./calcKeyId.js";
import { certificationSignatureHashData } from "../pgp-signature/certificationSignatureHashData.js";
import * as EMSA from "../pgp-signature/emsa.js";
import arrayBufferToHex from "array-buffer-to-hex";

// TODO: WORK IN PROGRESS
export async function exportPrivateKey(nativePrivateKey, author, timestamp) {
  let jwk = await crypto.subtle.exportKey("jwk", nativePrivateKey);
  if (jwk.kty !== "RSA" || jwk.alg !== "RS1") throw new Error("Only RSA keys supported at this time");

  console.log(jwk);
  let e = UrlSafeBase64.serialize(jwk.e);
  console.log("e", e);
  let n = UrlSafeBase64.serialize(jwk.n);
  console.log("n", n);
  let d = UrlSafeBase64.serialize(jwk.d);
  console.log("d", d);
  let p = UrlSafeBase64.serialize(jwk.p);
  console.log("p", p);
  let q = UrlSafeBase64.serialize(jwk.q);
  console.log("q", q);

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
    // type: 16,
    // type_s: "Generic certification of a User ID and Public-Key packet",
    type: 19,
    type_s: "Positive certification of a User ID and Public-Key packet",
    alg: 1,
    alg_s: "RSA (Encrypt or Sign)",
    hash: 2,
    hash_s: "SHA1",
    hashed: {
      length: 6 + 3,
      subpackets: [
        {
          length: 5,
          type: 2,
          subpacket: {
            creation: timestamp
          }
        },
        {
          length: 2,
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
  let hash = await crypto.subtle.digest("SHA-1", buffer);
  hash = new Uint8Array(hash);
  console.log("hash", new Uint8Array(hash));
  console.log("hash", arrayBufferToHex(new Uint8Array(hash))); // ef0a51219d056749a63fda970f5a504e451de039

  let left16 = (hash[0] << 8) + hash[1];
  console.log("left16", left16);

  // TODO: Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format:
  // https://github.com/openpgpjs/openpgpjs/blob/a35b4d28e0215c3a6654a4401c4e7e085b55e220/src/crypto/pkcs1.js
  hash = EMSA.encode("SHA1", hash, nativePrivateKey.algorithm.modulusLength / 8);

  // SIGN
  // let signature =
  let _jwk = await crypto.subtle.exportKey("jwk", nativePrivateKey);
  console.log("nativePrivateKey", _jwk);

  // console.time("bn.js"); // 1339ms
  // let M = new BN(hash);
  // let N = new BN(UrlSafeBase64.serialize(_jwk.n));
  // // let E = new BN(UrlSafeBase64.serialize(_jwk.e));
  // let D = new BN(UrlSafeBase64.serialize(_jwk.d));

  // // Lifted from https://github.com/openpgpjs/openpgpjs/blob/master/src/crypto/public_key/rsa.js
  // const nred = new BN.red(N);
  // let S = M.toRed(nred).redPow(D);
  // let signature = S.toArrayLike(Uint8Array);
  // console.log("signature", signature);
  // console.timeEnd("bn.js");

  console.time("jsbn"); // 679ms
  let N = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(_jwk.n)), 16);
  // let E = new BN(UrlSafeBase64.serialize(_jwk.e));
  let D = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(_jwk.d)), 16);
  let M = new BigInteger(arrayBufferToHex(hash), 16);

  let S = M.modPow(D, N);
  // let _S = (_M ** _D) % _N;
  let signature = new Uint8Array(S.toByteArray().slice(1));
  console.log("_signature", signature);
  console.timeEnd("jsbn");

  // let signature = await crypto.subtle.sign(
  //   "RSASSA-PKCS1-v1_5",
  //   nativePrivateKey,
  //   hash
  // );

  let signatureLength = signature.byteLength;
  console.log("signatureLength", signatureLength);
  signature = UrlSafeBase64.parse(new Uint8Array(signature));
  console.log("signature", signature);

  let completeSignaturePacket = Object.assign({}, partialSignaturePacket, {
    unhashed: {
      length: 10,
      subpackets: [
        {
          length: 9,
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

  console.log("secretKeyPAcket.length", SecretKey.serialize(secretKeyPacket).length);

  let message = {
    type: "PGP PRIVATE KEY BLOCK",
    packets: [
      {
        type: 0,
        type_s: "old",
        tag: 5,
        tag_s: "Secret-Key Packet",
        length: { type: 1, type_s: "two-octet length", value: 1816 },
        packet: secretKeyPacket
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
          value: 12 + 6 + 3 + 10 + signatureLength
        },
        packet: completeSignaturePacket
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
