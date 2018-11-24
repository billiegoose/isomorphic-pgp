const { certify } = require("../certify.js");
const { verifySelfSignature } = require("../verifySelfSignature.js");

let fixture = {
  version: 4,
  creation: 1479107004,
  alg: 1,
  alg_s: "RSA (Encrypt or Sign)",
  mpi: {
    n: "t7vsgtX3NEv3WgYI51Q6t5Up8Xyu6ILpbTPK26gNMKiqmKoVHGHetdXPC5jr_kYu47a99bwPNZLpyRENLkN45Kl2jc3TlCxRt1wi1ac_dk0g_RPLr7Hil8IQ4c5SVMPj4oQEFyzog21ChJmP9Nmk_7OCqpFJN2aO4KQ5EFmMHJk",
    e: "AQAB",
    d: "E8FGbEjiNALI_Spx8aF6ULvejyL3UXOl8oJjmNuIU4eHFDQRYgRZ5FYxVU9jbGsSZpSC9zV5sypxLZfCQYuqp0hsCz__DZi08l7dQQZtYLxWkasRfSAqFXkQu3NBC90QIcginxBa8R5vykQiQiItre8fdGAyHwkgTj8kEXW_WOs",
    p: "wcJYuJ2ez4P3VwIWx61KIqbuvy_URFkc7iQpFXZ6w_IBgboCKuX5TZ0Xl-YMBlJgi8CRje1wzkJUkFDdZJwG6w",
    q: "8sErw0HaahAIEcjQCF-KZflyfNIN-cN5zh9iITw7JHmT1YjDLNfHq9REHqd72wy38IpeDZE-yLbxySoibuxRiw",
    u: "c8wfOtt-x62FECU0K8nMTV5--tjaWw_I9U-x1d6skZ9b-_oA-3WrsIk-rpG8UArtxcfBikcZBbzxn_ohGa0OFg"
  }
};

describe("certify", () => {
  it("certify git commit", async () => {
    let timestamp = 1542938295
    let certified = await certify(fixture, {userid: 'Example <test@example.com'}, timestamp);
    expect(certified).toBe(`-----BEGIN PGP PRIVATE KEY BLOCK-----

lQHYBFgpYbwBBAC3u+yC1fc0S/daBgjnVDq3lSnxfK7ogultM8rbqA0wqKqYqhUc
Yd611c8LmOv+Ri7jtr31vA81kunJEQ0uQ3jkqXaNzdOULFG3XCLVpz92TSD9E8uv
seKXwhDhzlJUw+PihAQXLOiDbUKEmY/02aT/s4KqkUk3Zo7gpDkQWYwcmQARAQAB
AAP9E8FGbEjiNALI/Spx8aF6ULvejyL3UXOl8oJjmNuIU4eHFDQRYgRZ5FYxVU9j
bGsSZpSC9zV5sypxLZfCQYuqp0hsCz//DZi08l7dQQZtYLxWkasRfSAqFXkQu3NB
C90QIcginxBa8R5vykQiQiItre8fdGAyHwkgTj8kEXW/WOsCAMHCWLidns+D91cC
FsetSiKm7r8v1ERZHO4kKRV2esPyAYG6Airl+U2dF5fmDAZSYIvAkY3tcM5CVJBQ
3WScBusCAPLBK8NB2moQCBHI0AhfimX5cnzSDfnDec4fYiE8OyR5k9WIwyzXx6vU
RB6ne9sMt/CKXg2RPsi28ckqIm7sUYsB/3PMHzrbfsethRAlNCvJzE1efvrY2lsP
yPVPsdXerJGfW/v6APt1q7CJPq6RvFAK7cXHwYpHGQW88Z/6IRmtDhaawLQZRXhh
bXBsZSA8dGVzdEBleGFtcGxlLmNvbYifBBMBCAAJBQJb9163AhsDAAoJEDaNgVlJ
k3/OFf0D/0XeNTuzfXiA3M5IElucnjHyy+v0zb45t8rLNOY07dl56+zRpZ77EEU7
/svesGUvWdUdxULVVRaMtYyPVDJjy3Qsl5hi43wqwDA77iG6h6gf9/bTEzEdYMjO
FtX261mq/TxvVsxon6hnz3rLtgzGI+sXZm1jJc2/bVy0OdazyrGm
=1I6S
-----END PGP PRIVATE KEY BLOCK-----`);

    let verified = await verifySelfSignature(certified)
    expect(verified).toBeTruthy()
  });
});