export function base64ToUint8Array(str) {
  const raw = atob(str);
  let b = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    b[i] = raw.codePointAt(i);
  }
  return { i: 0, b };
}
