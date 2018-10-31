import * as MPI from "../pgp-signature/MPI.js";

describe("MPI", () => {
  test("serialize -> parse", () => {
    let fixtures = ["wpYJwrjCpcKSwovCpsK5", "AQAB"];
    // prettier-ignore
    for (let fixture of fixtures) {
      let _data = MPI.serialize(fixture);
      let a = {
        b: _data,
        i: 0
      };
      let result = MPI.parse(a);
      expect(result).toEqual(fixture);
    }
  });
});
