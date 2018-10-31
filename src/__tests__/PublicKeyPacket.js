import * as PublicKeyPacket from "../pgp-signature/Packet/PublicKey.js";

let fixture = {
  version: 4,
  creation: 1479107004,
  alg: 1,
  alg_s: "RSA (Encrypt or Sign)",
  mpi: {
    n:
      "wp8iS8K5OcOvwrfCqk4swovDp8K0ExE3wqpuwo3Ds8K_woPCpi8zw6sWwr_DpMK5wqgDGsKUwqcBf8ONwrQoFiYcJXNnVMOzBMKXw6YNwpPDr8OsFsKkAMORSMOVOgQwOnXDrsOtw4F8DV9rwovDhcKMw53Clm_CiHApw6ECw6DCqcODwq_CkcK5w58MFcOdXDAKwpfDhSnDtiXCgVLCuMOCa0ovw7XDkcK5BcKeP8KMwp1Jw5Z5wpJIw5Zkw6EuRcOPB0LCucKww7jDncK9YMOaeVobw4swdH1QG8OufiFyw6XClEPDoDE4wooJw5ctcwl9w5LCvB_Dqw3Cm2p1wr7CnFcXw7ssPlXCg8OgQgvCq3XDsMOOUsKcJ1vDk30cw5_DujN-aRvDnMKeLMK1woABQ3HCkMOHwppZBMORw4fDlT0_w73CrsKCMsKTwrnDhMOyKAXCkDrDsCPCogsEMDRLwpsywoXDvxXDl8OPwoXCkcKuwqcGfjDDusK0w58pOMK1NcKUGsKqPXlGwohBwrZIw4fCiXM6J1TDtj8aKQvCq0s1dMKVUsKPXRPCpiNuw7USFSzDqsKxw7fDhsKBwqoUw55gw5LCh8K2HMOvw4DDpsKYecOpFQLCvsKXwpfCrMOvw4XDvXDCt8O4fjbDpcKJw4J-ZTzCu8KMwos6HsOKwr7DvMOOMQMVJ8KXw5bDpBbDo8OFwr_DiEFwI2dxEcKfw6k8CWBFB8O5w6PCoyXCjsKaJ8Kew4Ybd8KrUgsfW8OBwqnCtTtdwq91w7d2w5VNw7jDimk3w77CtcKjw4JQUsORXcOZw67DocO3KFMAw67DuMODLcKYXMK5NGPDicOew7E5w5fCoMKdw7jClnFmwqjDvlzCpsKUw4PDplDDpMOKa8OOYD87wozClWpeEMKFXcOtfCDChzosV1fDgcOiaW3CvsOZwpB2IztYEMOgR3HDsk1EwoFCwpoHHRnCi1XCihwEwpTDisKoWnnCkRTDghd2w5cvAiLCm07CpjU",
    e: "AQAB"
  }
};

describe("PublicKey Packet", () => {
  test("serialize -> parse", () => {
    let _data = PublicKeyPacket.serialize(fixture);
    let result = PublicKeyPacket.parse(_data);
    expect(result).toEqual(fixture);
  });
});
