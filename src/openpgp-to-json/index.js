import { asciiArmorToUint8Array } from "./asciiArmorToUint8Array.js";
import * as PacketArray from "./PacketArray.js";

export function parse(input) {
  let a = asciiArmorToUint8Array(input);
  let result = {
    packets: []
  };
  PacketArray.parse(a, result.packets);
  return result;
}
