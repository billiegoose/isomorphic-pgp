import * as Packet from "./Packet.js";
import concatenate from "concat-buffers";

export function parse(_data) {
  let packets = [];
  let failsafe = 10;
  let a = {
    b: _data,
    i: 0
  };
  while (failsafe-- > 0 && a.i < a.b.length - 1) {
    try {
      packets.push(Packet.parse(a));
    } catch (err) {
      break;
    }
  }
  return packets;
}

export function serialize(packets) {
  let buffers = [];
  for (const packet of packets) {
    buffers.push(Packet.serialize(packet));
  }
  return concatenate(buffers);
}