import * as Issuer from "../pgp-signature/Packet/SignatureSubpacket/Issuer.js";

let fixture = {
  issuer: "wpYJwrjCpcKSwovCpsK5",
  issuer_s: "9609b8a5928ba6b9"
};

describe("Issuer", () => {
  test("parse -> serialize", () => {
    let result = Issuer.parse(Issuer.serialize(fixture));
    expect(result).toEqual(fixture);
  });
});
