import defineLazyProp from "define-lazy-prop";

import * as UrlSafeBase64 from "../../UrlSafeBase64.js";

import * as Length from "./Length.js";
import * as CreationTime from "./CreationTime.js";
import * as Issuer from "./Issuer.js";

export function parse(a) {
  let subpacket = {};
  subpacket.length = Length.parse(a);
  subpacket.type = a.b[a.i++];

  let _data = a.b.slice(a.i, (a.i += subpacket.length - 1));
  defineLazyProp(subpacket, "subpacket", () => {
    switch (subpacket.type) {
      case 2: {
        return CreationTime.parse(_data);
      }
      case 16: {
        return Issuer.parse(_data);
      }
      default: {
        return { data: UrlSafeBase64.parse(_data) };
      }
    }
  });
  return subpacket;
}

export function serialize(subpacket) {
  let length = Length.serialize(subpacket.length);
  let content = null;
  switch (subpacket.type) {
    case 2: {
      content = CreationTime.serialize(subpacket.subpacket);
      break;
    }
    case 16: {
      content = Issuer.serialize(subpacket.subpacket);
      break;
    }
    default: {
      content = UrlSafeBase64.serialize(subpacket.subpacket.data);
      break;
    }
  }
  let buffer = new Uint8Array(length.length + subpacket.length);
  buffer.set(length, 0);
  buffer.set(new Uint8Array([subpacket.type]), length.length);
  if (content === null)
    throw new Error(
      `Unable to serialize Signature subpacket type ${subpacket.type}`
    );
  buffer.set(content, length.length + 1);
  return buffer;
}
