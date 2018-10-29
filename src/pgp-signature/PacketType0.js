import defineLazyProp from "define-lazy-prop";
import { bits } from "./bits.js";
import { PacketTag, OldPacketLengthType } from "./constants.js";
import * as SignaturePacket from "./Packet/Signature.js";
import * as PublicKeyPacket from "./Packet/PublicKey.js";
import * as UserIdPacket from "./Packet/UserId.js";

export function parse(a, packet) {
  let byte1 = a.b[a.i];
  packet.tag = (byte1 & (bits[5] + bits[4] + bits[3] + bits[2])) >> 2;
  packet.tag_s = PacketTag[packet.tag];
  packet.length = {};
  packet.length.type = byte1 & (bits[1] + bits[0]);
  packet.length.type_s = OldPacketLengthType[packet.length.type];
  // Skip over lengthType
  a.i++;

  let lengthLength = {
    0: 1,
    1: 2,
    2: 4,
    3: a.b.length - a.i
  }[packet.length.type];

  // JavaScript's float64 numbers can safely store the largest uint32 value
  // so no need to use BigInts to store the result.
  // And since it uses uint32 for bitwise arithmetic, we can safely abuse
  // bit-shifting instead of multiplying as well.
  packet.length.value = 0;
  for (let j = 0; j < lengthLength; j++) {
    packet.length.value = (packet.length.value << 8) + a.b[a.i + j];
  }
  // pass over length length
  a.i += lengthLength;

  let _data = a.b.slice(a.i, (a.i += packet.length.value));

  defineLazyProp(packet, "packet", () => {
    let a = { b: _data, i: 0 };
    switch (packet.tag) {
      case 2: {
        return SignaturePacket.parse(_data);
      }
      case 6:
      case 14: {
        return PublicKeyPacket.parse(_data);
      }
      case 13: {
        return UserIdPacket.parse(_data);
      }
      default: {
        return null;
      }
    }
  });
  return;
}
