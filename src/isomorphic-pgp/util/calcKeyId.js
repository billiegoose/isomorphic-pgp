import { sha1 } from "crypto-hash";
import * as PublicKey from "@isomorphic-pgp/parser/Packet/PublicKey.js";

export async function calcKeyId(packet) {
  let buffer = await PublicKey.serializeForHash(packet);
  let hash = await sha1(buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  let fingerprint = hash;
  let keyid = hash.slice(12);
  return { fingerprint, keyid };
}
