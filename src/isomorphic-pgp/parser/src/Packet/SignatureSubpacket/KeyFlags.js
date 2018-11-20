export function parse(data) {
  return {
    flags: data[0]
  };
}

export function serialize(subpacket) {
  let f = subpacket.flags;
  return new Uint8Array([f & 255]);
}
