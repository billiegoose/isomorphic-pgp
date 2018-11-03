import concat from "concat-buffers";
import arrayBufferToHex from "array-buffer-to-hex";
import * as Message from "../pgp-signature/Message.js";
import * as PublicKey from "../pgp-signature/Packet/PublicKey.js";

export async function keyid(keyjson) {
  console.log(keyjson.packets[0].packet);
  let pubkeyBuffer = PublicKey.serialize(keyjson.packets[0].packet);
  console.log(pubkeyBuffer);
  let buffers = [
    new Uint8Array([
      0x99,
      (pubkeyBuffer.length >> 8) & 255,
      pubkeyBuffer.length & 255
    ]),
    pubkeyBuffer
  ];
  let buffer = concat(buffers);
  let hash = await crypto.subtle.digest("SHA-1", buffer);
  hash = new Uint8Array(hash);
  let fingerprint = arrayBufferToHex(hash);
  let keyid = arrayBufferToHex(hash.slice(12));
  return { fingerprint, keyid };
}
