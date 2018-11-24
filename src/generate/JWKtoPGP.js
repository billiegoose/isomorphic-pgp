const { BigInteger } = require("jsbn");
const arrayBufferToHex = require("array-buffer-to-hex");

const UrlSafeBase64 = require("@isomorphic-pgp/parser/UrlSafeBase64.js");
const SecretKey = require("@isomorphic-pgp/parser/Packet/SecretKey.js");

const { certify } = require("@isomorphic-pgp/sign-and-verify/certify.js");

module.exports.JWKtoPGP = async function JWKtoPGP(jwk, author, timestamp) {
  if (jwk.kty !== "RSA") throw new Error("Only RSA keys with SHA256 hash alg supported at this time");

  let e = UrlSafeBase64.serialize(jwk.e);
  let n = UrlSafeBase64.serialize(jwk.n);
  let d = UrlSafeBase64.serialize(jwk.d);
  let p = UrlSafeBase64.serialize(jwk.p);
  let q = UrlSafeBase64.serialize(jwk.q);

  let privateKeyPacket = SecretKey.fromJWK(jwk, { creation: timestamp });

  // Compute missing parameter u
  let P = new BigInteger(arrayBufferToHex(p), 16);
  let Q = new BigInteger(arrayBufferToHex(q), 16);
  let U = P.modInverse(Q);
  let _U = new Uint8Array(U.toByteArray());
  let u = UrlSafeBase64.parse(_U);
  privateKeyPacket.mpi.u = u;

  let userIdPacket = { userid: author };

  return certify(privateKeyPacket, userIdPacket, timestamp);
}
