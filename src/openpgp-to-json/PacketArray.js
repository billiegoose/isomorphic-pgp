import * as Packet from "./Packet.js";

export function parse(a, packets) {
  let failsafe = 10;
  while (failsafe-- > 0 && a.i < a.b.length - 1) {
    let packet = {};
    try {
      Packet.parse(a, packet);
    } catch (err) {
      break;
    }
    packets.push(packet);
  }
}
