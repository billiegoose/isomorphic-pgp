export async function SigningKey() {
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
  console.log(keys);
  // prettier-ignore
  let text2sign = new Uint8Array([72,101,108,108,111,32,87,111,114,108,100,33]);
  console.log("text2sign");
  console.log(text2sign);
  let sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keys.privateKey,
    text2sign
  );
  sig = new Uint8Array(sig);
  console.log(sig);
  console.log(sig.length);
  let valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    keys.publicKey,
    sig,
    text2sign
  );
  console.log("valid", valid);
}
