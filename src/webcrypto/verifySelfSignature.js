import * as Message from "../pgp-signature/Message.js";
import * as PublicKey from "../pgp-signature/Packet/PublicKey.js";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";
import { certificationSignatureHashData } from "../pgp-signature/certificationSignatureHashData.js";
import arrayBufferToHex from "array-buffer-to-hex";

async function printHash(buffer) {
  let hash = await crypto.subtle.digest("SHA-1", buffer);
  hash = new Uint8Array(hash);
  console.log("hash", arrayBufferToHex(hash));
}

export async function verifySelfSignature(openpgpPublicKey) {
  let parsed = Message.parse(openpgpPublicKey);
  let publicKeyPacket = parsed.packets[0].packet;
  let userIdPacket = parsed.packets[1].packet;
  let selfSignaturePacket = parsed.packets[2].packet;

  let buffer = await certificationSignatureHashData(
    publicKeyPacket,
    userIdPacket,
    selfSignaturePacket
  );
  let hash = await crypto.subtle.digest("SHA-1", buffer);
  hash = new Uint8Array(hash);
  console.log("hash", arrayBufferToHex(hash)); // 90c9b728f814a93191cc1551493f06c88159ec68
  console.log("left16", selfSignaturePacket.left16.toString(16));

  let nativePublicKey = await crypto.subtle.importKey(
    "jwk",
    PublicKey.toJWK(publicKeyPacket),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-1"
    },
    true,
    ["verify"]
  );

  let signature = UrlSafeBase64.serialize(selfSignaturePacket.mpi.signature);
  console.log("signature", signature.slice(10));
  let valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    nativePublicKey,
    signature,
    hash
  );
  return valid;
}
