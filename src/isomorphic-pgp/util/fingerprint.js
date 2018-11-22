const { sha1 } = require("@wmhilton/crypto-hash");
const PublicKey = require("@isomorphic-pgp/parser/Packet/PublicKey.js");

module.exports.fingerprint = async function fingerprint(packet) {
  let buffer = await PublicKey.serializeForHash(packet);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  return new Uint8Array(hash);
}
