import { createPrivateJWK } from "./browser/createPrivateJWK.js";
import { JWKtoPGP } from "./browser/JWKtoPGP.js";

export async function generate({ userid, timestamp }) {
  let jwk = await createPrivateJWK();
  return JWKtoPGP(jwk, userid, timestamp);
}
