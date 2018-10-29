import { uint8ArrayToHex } from "./uint8ArrayToHex.js";

export function parse(a, packet) {
  packet.issuer = a.b.slice(a.i, (a.i += 8));
  packet.issuer_s = uint8ArrayToHex(packet.issuer);
}
