module.exports.createPrivateJWK = async function createPrivateJWK() {
  let keys = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: "SHA-1" }
    },
    true,
    ["sign", "verify"]
  );
  let jwk = await crypto.subtle.exportKey("jwk", keys.privateKey);
  return jwk;
}
