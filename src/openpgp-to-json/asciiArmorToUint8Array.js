import { base64ToUint8Array } from "./base64ToUint8Array.js";

export function asciiArmorToUint8Array(str) {
  let matches = str.match(/\n\n([\S\s]*)\n=/);
  if (matches === null)
    throw new Error("Unable to find main body of OpenPGP ASCII Armor");
  let text = matches[1].replace(/\n/g, "");
  return base64ToUint8Array(text);
}
