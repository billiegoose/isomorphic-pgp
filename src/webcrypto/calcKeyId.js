import { sha1 } from "crypto-hash";
import arrayBufferToHex from "array-buffer-to-hex";
import * as Message from "../pgp-signature/Message.js";
import * as PublicKey from "../pgp-signature/Packet/PublicKey.js";

export async function calcKeyId(packet) {
  let buffer = await PublicKey.serializeForHash(packet);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  let fingerprint = hash;
  let keyid = hash.slice(12);
  return { fingerprint, keyid };
}

export async function computeKeyId(openpgptext) {
  let message = Message.parse(openpgptext);
  let publicKeyPacket = message.packets[0].packet;
  let { keyid } = await calcKeyId(publicKeyPacket);
  return arrayBufferToHex(keyid);
}
