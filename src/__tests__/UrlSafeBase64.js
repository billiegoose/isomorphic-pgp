import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";

// prettier-ignore
let fixtureBase64u = "SGVsbG8gV29ybGQh";

// prettier-ignore
let fixtureBuffer = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]);

describe("UrlSafeBase64", () => {
  test("parse -> serialize", () => {
    let str = UrlSafeBase64.parse(fixtureBuffer);
    expect(str).toEqual(fixtureBase64u);
    let result = UrlSafeBase64.serialize(str);
    expect(result).toEqual(fixtureBuffer);
  });
  test("serialize -> parse", () => {
    let buffer = UrlSafeBase64.serialize(fixtureBase64u);
    expect(buffer).toEqual(fixtureBuffer);
    let result = UrlSafeBase64.parse(buffer);
    expect(result).toEqual(fixtureBase64u);
  });
});
