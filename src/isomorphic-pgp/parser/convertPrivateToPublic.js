import * as Message from "./Message.js";
import * as SecretKey from "./Packet/SecretKey.js";

export async function convertPrivateToPublic(openpgpPrivateKey) {
  let parsed = Message.parse(openpgpPrivateKey);
  let keyPacket = parsed.packets[0].packet;
  SecretKey.toPublicKey(keyPacket);
  parsed.type = "PGP PUBLIC KEY BLOCK";
  for (let packet of parsed.packets) {
    if (packet.tag === 5) {
      packet.tag = 6;
    }
    if (packet.tag === 7) {
      packet.tag = 14;
    }
  }
  return Message.serialize(parsed);
}
