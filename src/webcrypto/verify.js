import * as Message from "../pgp-signature/Message.js";

export async function verify(nativePublicKey, pgpSignature, text2sign) {
  let signature = Message.serialize(pgpSignature).packets[0].packet.mpi
    .signature;

  let valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    nativePublicKey,
    signature,
    text2sign
  );
  return valid;
}
