/* global BigInt */
export function toBigInt(buffer) {
  let n = BigInt(0);
  let eight = BigInt(8);
  for (let byte of buffer) {
    n = (n << eight) + BigInt(byte);
  }
  return n;
}

export function toBuffer(bigint) {
  let bytes = [];
  let byte = BigInt(255);
  let eight = BigInt(8);
  while (bigint) {
    bytes.push(Number(bigint & byte));
    bigint = bigint >> eight;
  }
  bytes.reverse();
  return new Uint8Array(bytes);
}
