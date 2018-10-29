export function uint8ArrayToHex(uint8array) {
  return [...uint8array]
    .map(x => x.toString(16))
    .map(x => (x.length === 1 ? "0" + x : x))
    .join("");
}
