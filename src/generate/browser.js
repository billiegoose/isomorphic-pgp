const { createPrivateJWK } = require("./browser/createPrivateJWK.js");
const { JWKtoPGP } = require("./browser/JWKtoPGP.js");

module.exports.generate = async function generate({ userid, timestamp }) {
  let jwk = await createPrivateJWK();
  return JWKtoPGP(jwk, userid, timestamp);
}
