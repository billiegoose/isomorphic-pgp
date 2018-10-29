export function parse(a, packet) {
  packet.creation =
    (a.b[a.i++] << 24) + (a.b[a.i++] << 16) + (a.b[a.i++] << 8) + a.b[a.i++];
}
