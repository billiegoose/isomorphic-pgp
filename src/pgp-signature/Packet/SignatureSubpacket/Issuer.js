import { uint8ArrayToHex } from "./uint8ArrayToHex.js";

export function parse(data) {
  return {
    issuer: data,
    issuer_s: uint8ArrayToHex(data)
  };
}

export function serialize(subpacket) {
  return subpacket.issuer;
}
