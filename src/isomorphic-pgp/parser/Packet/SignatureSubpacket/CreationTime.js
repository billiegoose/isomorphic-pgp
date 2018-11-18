import * as Uint32 from "../../Uint32.js";

export function parse(data) {
  return {
    creation: Uint32.parse(data)
  };
}

export function serialize(subpacket) {
  return new Uint8Array(Uint32.serialize(subpacket.creation));
}
