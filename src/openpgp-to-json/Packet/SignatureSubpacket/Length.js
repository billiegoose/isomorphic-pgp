export function parse(a, packet) {
  let byte1 = a.b[a.i++];
  if (byte1 < 192) {
    packet.length = byte1;
  } else if (byte1 < 255) {
    let byte2 = a.b[a.i++];
    packet.length = ((byte1 - 192) << 8) + (byte2 + 192);
  } else {
    packet.length =
      (a.b[a.i++] << 24) + (a.b[a.i++] << 16) + (a.b[a.i++] << 8) + a.b[a.i++];
  }
}
