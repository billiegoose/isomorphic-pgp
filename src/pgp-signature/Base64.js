export function parse(str) {
  const raw = atob(str);
  let b = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    b[i] = raw.codePointAt(i);
  }
  return b;
}

// Kinda tested
export function serialize(b) {
  let raw = [];
  for (let v of b.values()) {
    raw.push(String.fromCodePoint(v));
  }
  raw = raw.join("");
  const str = btoa(raw);
  return str;
}
