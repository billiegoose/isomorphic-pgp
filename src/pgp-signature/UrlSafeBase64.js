import ab2str from "arraybuffer-to-string";
import str2ab from "string-to-arraybuffer";
import { toBase64Url, fromBase64Url } from "b64u-lite";

export function parse(buffer) {
  let str = ab2str(buffer, "binary");
  let base64ustr = toBase64Url(str);
  return base64ustr;
}

export function serialize(base64ustr) {
  let base64str = base64ustr.replace(/_/g, "/").replace(/-/g, "+");
  let str = atob(base64str);
  let buffer = str2ab(str);
  return new Uint8Array(buffer);
}
