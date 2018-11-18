import concatenate from "concat-buffers";
import { encode, decode } from "isomorphic-textencoder";
import * as Uint32 from "../Uint32.js";

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
  return concatenate([new Uint8Array([0xb4, ...Uint32.serialize(buffer.length)]), buffer]);
}
