import defineLazyProp from "define-lazy-prop";
import { bits } from "./bits.js";
import { PacketTag, OldPacketLengthType } from "./constants.js";
import * as SignaturePacket from "./Packet/Signature.js";
import * as PublicKeyPacket from "./Packet/PublicKey.js";
import * as SecretKeyPacket from "./Packet/SecretKey.js";
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
      case 5:
      case 7: {
        return SecretKeyPacket.parse(_data);
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
  return packet;
}

export function serialize(packet) {
  let lengthLength = {
    0: 1,
    1: 2,
    2: 4,
    3: 0
  }[packet.length.type];

  let data = new Uint8Array(1 + lengthLength + packet.length.value);
  let i = 0;
  const highbit = bits[7];
  const packetType = 0 << 6;
  const tag = (packet.tag << 2) & (bits[5] + bits[4] + bits[3] + bits[2]);
  const lengthType = packet.length.type & (bits[1] + bits[0]);
  // prettier-ignore
  data[i++] = highbit + packetType + tag + lengthType
  switch (packet.length.type) {
    case 0: {
      data[i++] = packet.length.value;
      break;
    }
    case 1: {
      data[i++] = (packet.length.value >> 8) & 255;
      data[i++] = packet.length.value & 255;
      break;
    }
    case 2: {
      data[i++] = (packet.length.value >> 24) & 255;
      data[i++] = (packet.length.value >> 16) & 255;
      data[i++] = (packet.length.value >> 8) & 255;
      data[i++] = packet.length.value & 255;
      break;
    }
    case 3: {
      break;
    }
  }
  switch (packet.tag) {
    case 2: {
      data.set(SignaturePacket.serialize(packet.packet), i);
      break;
    }
    case 5:
    case 7: {
      data.set(SecretKeyPacket.serialize(packet.packet), i);
    }
    case 6:
    case 14: {
      data.set(PublicKeyPacket.serialize(packet.packet), i);
      break;
    }
    case 13: {
      data.set(UserIdPacket.serialize(packet.packet), i);
      break;
    }
  }
  return data;
}
