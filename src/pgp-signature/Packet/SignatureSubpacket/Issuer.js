import uint8ArrayToHex from "array-buffer-to-hex";

export function parse(data) {
  return {
    issuer: data,
    issuer_s: uint8ArrayToHex(data)
  };
}

export function serialize(subpacket) {
  return subpacket.issuer;
}
