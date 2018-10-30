import * as MPI from "../pgp-signature/MPI.js";

describe("MPI", () => {
  test("serialize -> parse", () => {
    // prettier-ignore
    for (let value of [new Uint8Array([1, 0, 1]), new Uint8Array([191, 255, 254, 0, 1])]) {
        let _data = MPI.serialize(value);
        let a = {
            b: _data,
            i: 0
        };
        let result = MPI.parse(a);
        expect(result).toEqual(value);
    }
  });
});
