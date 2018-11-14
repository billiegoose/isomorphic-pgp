console.log("IMPORTED NODE");
module.exports = {
  encode: string => Buffer.from(string, "utf8"),
  decode: buffer => buffer.toString("utf8")
};
