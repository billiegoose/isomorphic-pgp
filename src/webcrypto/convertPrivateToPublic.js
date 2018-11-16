// import BN from "bn.js";
import * as Message from "../pgp-signature/Message.js";
import * as SecretKey from "../pgp-signature/Packet/SecretKey.js";
import { PacketTag } from "../pgp-signature/constants.js";
// TODO: WORK IN PROGRESS
export async function convertPrivateToPublic(openpgpPrivateKey) {
  let parsed = Message.parse(openpgpPrivateKey);
  let keyPacket = parsed.packets[0].packet;
  SecretKey.toPublicKey(keyPacket);
  parsed.type = "PGP PUBLIC KEY BLOCK";
  parsed.packets[0].tag = 6;
  parsed.packets[0].tag_s = PacketTag[6];
  return Message.serialize(parsed);
}
