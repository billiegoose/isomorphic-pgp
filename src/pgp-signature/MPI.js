export function parse(a) {
  let len = (a.b[a.i++] << 8) + a.b[a.i++];
  let value = a.b.slice(a.i, (a.i += Math.ceil(len / 8)));
  return value;
}
