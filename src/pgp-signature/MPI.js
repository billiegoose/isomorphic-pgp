export function parse(a) {
  let len = (a.b[a.i++] << 8) + a.b[a.i++];
  let value = a.b.slice(a.i, (a.i += Math.ceil(len / 8)));
  return value;
}

export function serialize(value) {
  let lengthInBits = value.byteLength * 8;
  let b = new Uint8Array(2 + value.byteLength);
  b[0] = (lengthInBits >> 8) & 255;
  b[1] = lengthInBits & 255;
  b.set(value, 2);
  return b;
}
