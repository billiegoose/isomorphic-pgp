import ab2str from "arraybuffer-to-string";
import str2ab from "string-to-arraybuffer";
import { toBase64Url, fromBase64Url } from "b64u-lite";

export function parse(buffer) {
  let str = ab2str(buffer, "binary");
  console.log("str", str);
  let base64ustr = toBase64Url(str);
  console.log("base64ustr", base64ustr);
  return base64ustr;
}

export function serialize(base64ustr) {
  let str = fromBase64Url(base64ustr);
  console.log("str2", str);
  let buffer = str2ab(str);
  console.log("buffer", buffer, buffer.byteLength);
  return new Uint8Array(buffer);
}
