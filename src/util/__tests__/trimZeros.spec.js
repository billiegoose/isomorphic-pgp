const { trimZeros } = require("../trimZeros");

describe.only("trimZeros", () => {
  test(`Given an array with a length that is a power of two 
        It should return the array unchanged`, () => {
    const array = new Uint8Array(128);

    const actual = trimZeros(array);
    const expected = array;

    expect(actual).toBe(expected);
  });

  test(`Given an array with a length that is one less than a power of two
        It should return a new array with a length that is a power of two padded with zeros`, () => {
    const array = new Uint8Array(127).fill(1);

    const actual = trimZeros(array);
    const expected = new Uint8Array([0, ...array]);

    expect(actual).toEqual(expected);
  });

  test(`Given an array with a length that is two less than a power of two
        It should throw an exception`, () => {
    const array = new Uint8Array(126).fill(1);

    expect(() => trimZeros(array)).toThrow("uint8array.length = 126 which is wild");
  });

  // Interesting edge cases
  test.todo("Given an empty array it should ____");
  test.todo("Given an array with one element that is zero it should ____");
});
