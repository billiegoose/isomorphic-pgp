const Subpacket = require("../Subpacket.js");

let fixtures = [
  [
    {
      type: 2,
      subpacket: {
        creation: 1479107004
      }
    },
    {
      length: 5,
      type: 2,
      subpacket: {
        creation: 1479107004
      }
    }
  ],
  [
    {
      type: 16,
      subpacket: {
        issuer: "lgm4pZKLprk"
      }
    },
    {
      length: 9,
      type: 16,
      subpacket: {
        issuer: "lgm4pZKLprk",
        issuer_s: "9609b8a5928ba6b9"
      }
    }
  ],
  [
    {
      type: 64,
      subpacket: {
        data: "AAAAAAAAAAAAAA"
      }
    },
    {
      length: 11,
      type: 64,
      subpacket: {
        data: "AAAAAAAAAAAAAA"
      }
    }
  ]
];

describe("Signature Subpacket", () => {
  it("serialize -> parse", () => {
    for (const [input, output] of fixtures) {
      let _data = Subpacket.serialize(input);
      let a = {
        b: _data,
        i: 0
      };
      let result = Subpacket.parse(a);
      expect(result).toEqual(output);
    }
  });
});
