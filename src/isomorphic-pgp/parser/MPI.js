import * as UrlSafeBase64 from "./UrlSafeBase64.js";
import clz from "clz-buffer";

export function parse(a) {
  let len = (a.b[a.i++] << 8) + a.b[a.i++];
  let value = a.b.slice(a.i, (a.i += Math.ceil(len / 8)));
  return UrlSafeBase64.parse(value);
}

export function serialize(value) {
  value = UrlSafeBase64.serialize(value);
  // Note:
  let leadingZeros = clz(value);
  let lengthInBits = value.byteLength * 8 - leadingZeros;
  let b = new Uint8Array(2 + value.byteLength);
  b[0] = (lengthInBits >> 8) & 255;
  b[1] = lengthInBits & 255;
  b.set(value, 2);
  return b;
}
