import * as Length from "./Length.js";
import * as CreationTime from "./CreationTime.js";
import * as Issuer from "./Issuer.js";

export function parse(a, packet) {
  Length.parse(a, packet);
  console.log("packet", packet);
  packet.type = a.b[a.i++];
  switch (packet.type) {
    case 2: {
      CreationTime.parse(a, packet);
      break;
    }
    case 16: {
      Issuer.parse(a, packet);
      break;
    }
    default: {
      packet.data = a.b.slice(a.i, (a.i += packet.length - 1));
    }
  }
}
