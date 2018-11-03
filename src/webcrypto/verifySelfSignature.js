import concatenate from "concat-buffers";
import * as Message from "../pgp-signature/Message.js";
import * as PublicKey from "../pgp-signature/Packet/PublicKey.js";
import * as UserId from "../pgp-signature/Packet/UserId.js";
import * as Signature from "../pgp-signature/Packet/Signature.js";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";

export async function verifySelfSignature(openpgpPublicKey) {
  let parsed = Message.parse(openpgpPublicKey);
  let publicKeyPacket = parsed.packets[0].packet;
  let userIdPacket = parsed.packets[1].packet;
  let selfSignaturePacket = parsed.packets[2].packet;

  let publicKeyBuffer = await PublicKey.serializeForHash(publicKeyPacket);
  let userIdBuffer = await UserId.serializeForHash(userIdPacket);
  console.log("selfSignaturePacket", selfSignaturePacket);
  let signatureBuffer = await Signature.serializeForHashTrailer(
    selfSignaturePacket
  );

  let buffer = concatenate([publicKeyBuffer, userIdBuffer, signatureBuffer]);

  let hash = await crypto.subtle.digest("SHA-1", buffer);
  hash = new Uint8Array(hash);
  console.log(hash);

  let nativePublicKey = await crypto.subtle.importKey(
    "jwk",
    {
      kty: "RSA",
      e: publicKeyPacket.mpi.e,
      n: publicKeyPacket.mpi.n,
      alg: "RS1",
      ext: true
    },
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-1"
    },
    true,
    ["verify"]
  );

  let signature = UrlSafeBase64.serialize(selfSignaturePacket.mpi.signature);

  let valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    nativePublicKey,
    signature,
    hash
  );
  return valid;
}
