export async function createPair() {
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
  // TODO: consider whether it's worth always exporting to jwk
  // and converting jwk to native inside functions.
  // Would ensure a pure JSON API that works well over postMessage.
  return keys;
}
