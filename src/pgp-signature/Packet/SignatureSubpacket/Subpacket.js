import concatenate from "concat-buffers";
import { select } from "../../select.js";
import * as UrlSafeBase64 from "../../UrlSafeBase64.js";

import * as Length from "./Length.js";
import * as CreationTime from "./CreationTime.js";
import * as Issuer from "./Issuer.js";
import * as KeyFlags from "./KeyFlags.js";

export function parse(a) {
  let subpacket = {
    length: Length.parse(a),
    type: a.b[a.i++]
  };

  let _data = a.b.slice(a.i, (a.i += subpacket.length - 1));
  subpacket.subpacket = select(subpacket.type, {
    2: () => CreationTime.parse(_data),
    16: () => Issuer.parse(_data),
    27: () => KeyFlags.parse(_data),
    default: () => ({ data: UrlSafeBase64.parse(_data) })
  });
  return subpacket;
}

export function serialize(subpacket) {
  let length = Length.serialize(subpacket.length);
  let content = select(subpacket.type, {
    2: () => CreationTime.serialize(subpacket.subpacket),
    16: () => Issuer.serialize(subpacket.subpacket),
    27: () => KeyFlags.serialize(subpacket.subpacket),
    default: () => UrlSafeBase64.serialize(subpacket.subpacket.data)
  });
  return concatenate([length, new Uint8Array([subpacket.type]), content]);
}
