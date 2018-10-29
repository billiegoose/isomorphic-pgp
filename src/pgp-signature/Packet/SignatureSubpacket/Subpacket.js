import defineLazyProp from "define-lazy-prop";
import * as Length from "./Length.js";
import * as CreationTime from "./CreationTime.js";
import * as Issuer from "./Issuer.js";

export function parse(a, packet) {
  packet.length = Length.parse(a);
  packet.type = a.b[a.i++];

  let _data = a.b.slice(a.i, (a.i += packet.length - 1));
  defineLazyProp(packet, "subpacket", () => {
    switch (packet.type) {
      case 2: {
        return CreationTime.parse(_data);
      }
      case 16: {
        return Issuer.parse(_data);
      }
    }
  });
}
