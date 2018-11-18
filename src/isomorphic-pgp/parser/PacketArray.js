import * as Packet from "./Packet.js";
import concatenate from "concat-buffers";

export function parse(_data) {
  let packets = [];
  let makingProgress = true;
  let a = {
    b: _data,
    i: 0
  };
  while (makingProgress && a.i < a.b.length - 1) {
    try {
      let previ = a.i;
      packets.push(Packet.parse(a));
      makingProgress = a.i > previ;
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
