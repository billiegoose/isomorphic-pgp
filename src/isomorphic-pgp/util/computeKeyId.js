import arrayBufferToHex from "array-buffer-to-hex";
import * as Message from "@isomorphic-pgp/parser/Message.js";
import { calcKeyId } from "./calcKeyId.js";

export async function computeKeyId(openpgptext) {
  let message = Message.parse(openpgptext);
  let publicKeyPacket = message.packets[0].packet;
  let { keyid } = await calcKeyId(publicKeyPacket);
  return arrayBufferToHex(keyid);
}
