module.exports = {
  encode: string => Buffer.from(string, "utf8"),
  decode: buffer => Buffer.from(buffer).toString("utf8")
};
