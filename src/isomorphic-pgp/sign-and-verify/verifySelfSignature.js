import { BigInteger } from "jsbn";
import { sha1 } from "crypto-hash";
import arrayBufferToHex from "array-buffer-to-hex";

import * as Message from "isomorphic-pgp/parser/Message.js";
import * as PublicKey from "isomorphic-pgp/parser/Packet/PublicKey.js";
import * as UrlSafeBase64 from "isomorphic-pgp/parser/UrlSafeBase64.js";
import * as EMSA from "isomorphic-pgp/parser/emsa.js";
import { certificationSignatureHashData } from "isomorphic-pgp/parser/certificationSignatureHashData.js";

export async function verifySelfSignature(openpgpPublicKey) {
  let parsed = Message.parse(openpgpPublicKey);
  let publicKeyPacket = parsed.packets[0].packet;
  let userIdPacket = parsed.packets[1].packet;
  let selfSignaturePacket = parsed.packets[2].packet;

  let buffer = await certificationSignatureHashData(publicKeyPacket, userIdPacket, selfSignaturePacket);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  console.log("hash", arrayBufferToHex(hash)); // 90c9b728f814a93191cc1551493f06c88159ec68
  console.log("left16", selfSignaturePacket.left16.toString(16));

  let jwkPublicKey = PublicKey.toJWK(publicKeyPacket);

  let n = UrlSafeBase64.serialize(publicKeyPacket.mpi.n);

  // Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format.
  hash = EMSA.encode("SHA1", hash, n.length);

  let signature = UrlSafeBase64.serialize(selfSignaturePacket.mpi.signature);

  console.time("jsbn"); // 5ms
  let S = new BigInteger(arrayBufferToHex(signature), 16);
  let N = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(publicKeyPacket.mpi.n)), 16);
  let E = new BigInteger(arrayBufferToHex(UrlSafeBase64.serialize(publicKeyPacket.mpi.e)), 16);

  let M = S.modPow(E, N);
  let _hashbytes = M.toByteArray();
  _hashbytes.unshift(0);
  let _hash = new Uint8Array(_hashbytes);
  console.log("_hash", _hash);
  console.timeEnd("jsbn");

  let valid = hash.every((byte, index) => byte === _hash[index]);
  return valid;
}
