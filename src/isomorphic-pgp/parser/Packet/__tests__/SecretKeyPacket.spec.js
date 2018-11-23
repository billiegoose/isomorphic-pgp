const SecretKeyPacket = require("../SecretKey.js");

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

let jwk = {
  alg: "RS1",
  d: "E8FGbEjiNALI_Spx8aF6ULvejyL3UXOl8oJjmNuIU4eHFDQRYgRZ5FYxVU9jbGsSZpSC9zV5sypxLZfCQYuqp0hsCz__DZi08l7dQQZtYLxWkasRfSAqFXkQu3NBC90QIcginxBa8R5vykQiQiItre8fdGAyHwkgTj8kEXW_WOs",
  e: "AQAB",
  ext: true,
  key_ops: ["sign"],
  kty: "RSA",
  n: "t7vsgtX3NEv3WgYI51Q6t5Up8Xyu6ILpbTPK26gNMKiqmKoVHGHetdXPC5jr_kYu47a99bwPNZLpyRENLkN45Kl2jc3TlCxRt1wi1ac_dk0g_RPLr7Hil8IQ4c5SVMPj4oQEFyzog21ChJmP9Nmk_7OCqpFJN2aO4KQ5EFmMHJk",
  p: "wcJYuJ2ez4P3VwIWx61KIqbuvy_URFkc7iQpFXZ6w_IBgboCKuX5TZ0Xl-YMBlJgi8CRje1wzkJUkFDdZJwG6w",
  q: "8sErw0HaahAIEcjQCF-KZflyfNIN-cN5zh9iITw7JHmT1YjDLNfHq9REHqd72wy38IpeDZE-yLbxySoibuxRiw",
  // NOTE: user must compute and add 'u'
  u: "c8wfOtt-x62FECU0K8nMTV5--tjaWw_I9U-x1d6skZ9b-_oA-3WrsIk-rpG8UArtxcfBikcZBbzxn_ohGa0OFg"
};

describe("SecretKey Packet", () => {
  it("serialize -> parse", () => {
    let _data = SecretKeyPacket.serialize(fixture);
    let result = SecretKeyPacket.parse(_data);
    expect(result).toEqual(fixture);
  });
  it("fromJWK -> serialize -> parse -> toJWK", () => {
    let packet = SecretKeyPacket.fromJWK(jwk, { creation: 1479107004 });
    let _data = SecretKeyPacket.serialize(packet);
    let _packet = SecretKeyPacket.parse(_data);
    expect(packet).toEqual(_packet);
    let _jwk = SecretKeyPacket.toJWK(_packet);
    expect(jwk).toEqual(_jwk);
  });
});
