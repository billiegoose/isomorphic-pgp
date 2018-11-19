import * as SubpacketArray from "../SubpacketArray.js";

let input = [
  {
    type: 2,
    subpacket: {
      creation: 1479107004
    }
  },
  {
    type: 16,
    subpacket: {
      issuer: "lgm4pZKLprk"
    }
  },
  {
    type: 64,
    subpacket: {
      data: "AAAAAAAAAAAAAA"
    }
  }
];

let output = [
  {
    length: 5,
    type: 2,
    subpacket: {
      creation: 1479107004
    }
  },
  {
    length: 9,
    type: 16,
    subpacket: {
      issuer: "lgm4pZKLprk",
      issuer_s: "9609b8a5928ba6b9"
    }
  },
  {
    length: 11,
    type: 64,
    subpacket: {
      data: "AAAAAAAAAAAAAA"
    }
  }
];

describe("Signature SubpacketArray", () => {
  test("serialize -> parse", () => {
    let _data = SubpacketArray.serialize(input);
    let result = SubpacketArray.parse(_data);
    expect(result).toEqual(output);
  });
});
