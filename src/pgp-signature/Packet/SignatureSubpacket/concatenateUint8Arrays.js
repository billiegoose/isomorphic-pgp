export function concatenateUint8Arrays(buffers) {
  let totalSize = 0;
  for (let b of buffers) totalSize += b.byteLength;
  let buffer = new Uint8Array(totalSize);
  let pos = 0;
  for (let b of buffers) {
    buffer.set(b, pos);
    pos += b.byteLength;
  }
  return buffer;
}
