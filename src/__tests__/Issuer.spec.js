import * as Issuer from "../pgp-signature/Packet/SignatureSubpacket/Issuer.js";

let fixture = {
  issuer: new Uint8Array([150, 9, 184, 165, 146, 139, 166, 185]),
  issuer_s: "9609b8a5928ba6b9"
};

describe("Issuer", () => {
  test("parse -> serialize", () => {
    let result = Issuer.parse(Issuer.serialize(fixture));
    expect(result).toEqual(fixture);
  });
});
