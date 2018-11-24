const CreationTime = require("../CreationTime.js");

// prettier-ignore
let time = {creation: Math.floor(Date.now() / 1000)}

describe("CreationTime", () => {
  it("parse -> serialize", () => {
    let result = CreationTime.parse(CreationTime.serialize(time));
    expect(result).toEqual(time);
  });
});
