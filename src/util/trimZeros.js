const concatenate = require("concat-buffers");
const { roundPowerOfTwo } = require("./roundPowerOfTwo.js");

module.exports.trimZeros = function trimZeros(uint8array) {
  // compute "proper" length
  let n = roundPowerOfTwo(uint8array.length);
  if (n === uint8array.length) {
    return uint8array;
  } else if (n === uint8array.length - 1 && uint8array[0] === 0) {
    return uint8array.slice(1);
  } else if (uint8array.length < Math.pow(2, n)) {
    const padStart = 2 * n - uint8array.length;
    return concatenate([new Uint8Array(padStart), uint8array]);
  } else {
    throw new Error(`uint8array.length = ${uint8array.length} which is wild`);
  }
}
