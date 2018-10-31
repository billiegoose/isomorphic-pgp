export async function createPair() {
  let keys = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-1",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1])
    },
    true,
    ["sign", "verify"]
  );
  return keys;
}
