export function parse(buffer) {
  let dec = new TextDecoder();
  return {
    userid: dec.decode(buffer)
  };
}

export function serialize(packet) {
  let enc = new TextEncoder();
  return enc.encode(packet.userid);
}
