import * as UrlSafeBase64 from "../../UrlSafeBase64.js";
import arrayBufferToHex from "array-buffer-to-hex";

export function parse(data) {
  return {
    issuer: UrlSafeBase64.parse(data),
    issuer_s: arrayBufferToHex(data, "hex")
  };
}

export function serialize(subpacket) {
  return UrlSafeBase64.serialize(subpacket.issuer);
}
