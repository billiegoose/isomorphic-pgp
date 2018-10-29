import * as Packet from "./Packet.js";

export function parse(_data) {
  let packets = [];
  let failsafe = 10;
  let a = {
    b: _data,
    i: 0
  };
  while (failsafe-- > 0 && a.i < a.b.length - 1) {
    let packet = {};
    try {
      Packet.parse(a, packet);
    } catch (err) {
      break;
    }
    packets.push(packet);
  }
  return packets;
}
