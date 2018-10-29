import { bits } from "./bits.js";
import * as PacketType0 from "./PacketType0.js";
import { PacketType } from "./constants.js";

export function parse(a, packet) {
  let byte1 = a.b[a.i];
  let _bit7_unused = byte1 & bits[7];
  if (_bit7_unused === 0) {
    throw new Error(
      "Expected bit 7 to be high. Possibly unknown OpenPGP packet format"
    );
  }
  packet.type = byte1 & bits[6];
  packet.type_s = PacketType[packet.type];
  switch (packet.type) {
    case 0: {
      PacketType0.parse(a, packet);
      break;
    }
    case 1: {
      throw new Error("New packets not supported yet");
    }
  }
}
