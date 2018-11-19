module.exports = {
  encode: string => new TextEncoder().encode(string),
  decode: buffer => new TextDecoder().decode(buffer)
};
