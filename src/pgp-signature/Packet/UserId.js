import concatenate from "concat-buffers";
import { encode, decode } from "../../isomorphic-textencoder";

export function parse(buffer) {
  return {
    userid: decode(buffer)
  };
}

export function serialize(packet) {
  return encode(packet.userid);
}

export function serializeForHash(packet) {
  let buffer = serialize(packet);
  let buffers = [
    new Uint8Array([
      0xb4,
      (buffer.length >> 24) & 255,
      (buffer.length >> 16) & 255,
      (buffer.length >> 8) & 255,
      buffer.length & 255
    ]),
    buffer
  ];
  return concatenate(buffers);
}
