const { createPrivateJWK } = require("./createPrivateJWK.js");
const { JWKtoPGP } = require("./JWKtoPGP.js");

module.exports.generate = async function generate({ userid, timestamp }) {
  let jwk = await createPrivateJWK();
  return JWKtoPGP(jwk, userid, timestamp);
}
