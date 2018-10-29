import * as Subpacket from "./Subpacket.js";

export function parse(_data) {
  let failsafe = 10;
  let subpackets = [];
  let a = {
    b: _data,
    i: 0
  };
  while (failsafe-- > 0 && a.i < _data.length) {
    let subpacket = {};
    try {
      Subpacket.parse(a, subpacket);
    } catch (err) {
      console.log(err);
      break;
    }
    subpackets.push(subpacket);
  }
  return subpackets;
}
