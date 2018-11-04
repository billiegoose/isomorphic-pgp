export function parse(data) {
  return {
    primaryUserId: true
  };
}

export function serialize(subpacket) {
  let f = subpacket.flags;
  return new Uint8Array([f & 255]);
}
