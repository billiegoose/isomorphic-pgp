import arrayBufferToHex from "array-buffer-to-hex";
import * as PublicKey from "../pgp-signature/Packet/PublicKey.js";

export async function keyid(keyjson) {
  let buffer = await PublicKey.serializeForHash(keyjson.packets[0].packet);
  let hash = await crypto.subtle.digest("SHA-1", buffer);
  hash = new Uint8Array(hash);
  let fingerprint = arrayBufferToHex(hash);
  let keyid = arrayBufferToHex(hash.slice(12));
  return { fingerprint, keyid };
}
