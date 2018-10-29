export function parse(data) {
  return {
    creation: (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]
  };
}

export function serialize(subpacket) {
  let t = subpacket.creation;
  return new Uint8Array([
    (t >> 24) & 255,
    (t >> 16) & 255,
    (t >> 8) & 255,
    t & 255
  ]);
}
