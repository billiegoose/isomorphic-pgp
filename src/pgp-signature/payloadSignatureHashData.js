import concatenate from "concat-buffers";
import * as Signature from "./Packet/Signature.js";

import arrayBufferToHex from "array-buffer-to-hex";

export async function payloadSignatureHashData(payload, signaturePacket) {
  let trailer = Signature.serializeForHashTrailer(signaturePacket);
  return concatenate([payload, trailer]);
}
