export function parse(buffer) {
  let dec = new TextDecoder();
  return {
    userid: dec.decode(buffer)
  };
}
