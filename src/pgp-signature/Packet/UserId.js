import concatenate from "concat-buffers";

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

export function serializeForHash(packet) {
  let buffer = serialize(packet);
  let buffers = [
    new Uint8Array([
      0xb4,
      (buffer.length >> 24) & 255,
      (buffer.length >> 16) & 255,
      (buffer.length >> 8) & 255,
      buffer.length & 255
    ]),
    buffer
  ];
  return concatenate(buffers);
}
