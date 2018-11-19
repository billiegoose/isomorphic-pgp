import { BigInteger } from "jsbn";
import { sha1 } from "crypto-hash";
import arrayBufferToHex from "array-buffer-to-hex";

import { encode } from "isomorphic-textencoder";

import * as Message from "@isomorphic-pgp/parser/Message.js";
import * as UrlSafeBase64 from "@isomorphic-pgp/parser/UrlSafeBase64.js";
import { payloadSignatureHashData } from "@isomorphic-pgp/parser/payloadSignatureHashData.js";
import * as EMSA from "@isomorphic-pgp/parser/emsa.js";
import { trimZeros } from "@isomorphic-pgp/parser/util/trimZeros.js";

export async function verify(openpgpPublicKey, openpgpSignature, payload) {
  console.log("openpgpPublicKey", openpgpPublicKey);
  console.log("openpgpSignature", openpgpSignature);
  console.log("payload", payload);
  let parsedPublicKey = Message.parse(openpgpPublicKey);
  let publicKeyPacket = parsedPublicKey.packets[0].packet;
  let userIdPacket = parsedPublicKey.packets[1].packet;
  let selfSignaturePacket = parsedPublicKey.packets[2].packet;

  let n = UrlSafeBase64.serialize(publicKeyPacket.mpi.n);
  console.log("n", n);
  let e = UrlSafeBase64.serialize(publicKeyPacket.mpi.e);
  console.log("e", e);

  // TODO: Verify self-signature.

  let parsedSignature = Message.parse(openpgpSignature);
  let signaturePacket = parsedSignature.packets[0].packet;

  let signature = UrlSafeBase64.serialize(signaturePacket.mpi.signature);

  payload = typeof payload === "string" ? encode(payload) : payload;
  let buffer = await payloadSignatureHashData(payload, signaturePacket);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  console.log("computed hash", arrayBufferToHex(hash));
  let left16 = (hash[0] << 8) + hash[1];
  console.log("comptued left16", left16);
  console.log("given left16", signaturePacket.left16);
  if (left16 !== signaturePacket.left16) {
    throw new Error("Signature failed left16 hash check");
  }

  // Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format:
  console.log("n.byteLength", n.byteLength);
  hash = EMSA.encode("SHA1", hash, n.byteLength);

  console.time("jsbn"); // 5ms
  let S = new BigInteger(arrayBufferToHex(signature), 16);
  let N = new BigInteger(arrayBufferToHex(n), 16);
  let E = new BigInteger(arrayBufferToHex(e), 16);

  let M = S.modPow(E, N);
  let _hashbytes = M.toByteArray();
  let _hash = new Uint8Array(_hashbytes);
  _hash = trimZeros(_hash);
  console.log("signed hash", _hash);
  console.timeEnd("jsbn");

  let valid = hash.every((byte, index) => byte === _hash[index]);
  return valid;
}
