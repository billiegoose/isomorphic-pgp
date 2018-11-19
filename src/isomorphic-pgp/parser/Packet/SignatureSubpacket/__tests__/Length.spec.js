import * as Length from "../Length.js";

let fixture = 100;

describe("Length", () => {
  test("parse -> serialize", () => {
    // prettier-ignore
    for (let fixture of [new Uint8Array([0]), new Uint8Array([191]), new Uint8Array([192, 0])]) {
      let a = {
        b: fixture,
        i: 0
      };
      let result = Length.parse(a);
      let _data = Length.serialize(result);
      expect(_data).toEqual(fixture);
    }
  });
  test("serialize -> parse", () => {
    // prettier-ignore
    for (let fixture of [0, 1, 2, 50, 100, 191, 192, 193, 16319, 16320, 16321]) {
      let _data = Length.serialize(fixture);
      let a = {
        b: _data,
        i: 0
      };
      let result = Length.parse(a);
      expect(result).toEqual(fixture);
    }
  });
});
