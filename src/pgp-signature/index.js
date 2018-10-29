import * as AsciiArmor from "./AsciiArmor.js";
import * as PacketArray from "./PacketArray.js";

export function parse(input) {
  let { type, data } = AsciiArmor.parse(input);
  return {
    type,
    packets: PacketArray.parse(data)
  };
}

export function serialize(input) {
  let { type, packets } = input;
  let data = PacketArray.serialize(packets);
  return AsciiArmor.serialize({ type, data });
}
