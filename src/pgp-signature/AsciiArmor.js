import crc24 from "crc/crc24";
import * as Base64 from "./Base64.js";

// TODO: Make the parser extract the Armor Header Line

export function parse(str) {
  let matches;
  matches = str.match(/-----BEGIN (.*)-----/);
  if (matches === null)
    throw new Error("Unable to find an OpenPGP Armor Header Line");
  let type = matches[1];
  matches = str.match(/\n\n([\S\s]*)\n=/);
  if (matches === null)
    throw new Error("Unable to find main body of OpenPGP ASCII Armor");
  let text = matches[1].replace(/\n/g, "");
  let data = Base64.parse(text);
  return { type, data };
}

export function serialize({ type, data }) {
  console.log(crc24(data.buffer));
  let rawCRC = crc24(data);
  let crcBytes = new Uint8Array([
    (rawCRC >> 16) & 255,
    (rawCRC >> 8) & 255,
    rawCRC & 255
  ]);
  let crcBase64 = Base64.serialize(crcBytes);
  let base64 = Base64.serialize(data);
  // Wrap every 64 characters
  let matches = base64.match(/(.{1,64})/g);
  return `-----BEGIN PGP SIGNATURE-----

${matches.join("\n")}
=${crcBase64}
-----END PGP SIGNATURE-----`;
}
