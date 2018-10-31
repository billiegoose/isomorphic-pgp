import * as UrlSafeBase64 from "../../UrlSafeBase64.js";
import ab2str from "arraybuffer-to-string";

export function parse(data) {
  return {
    issuer: UrlSafeBase64.parse(data),
    issuer_s: ab2str(data, "hex")
  };
}

export function serialize(subpacket) {
  return UrlSafeBase64.serialize(subpacket.issuer);
}
