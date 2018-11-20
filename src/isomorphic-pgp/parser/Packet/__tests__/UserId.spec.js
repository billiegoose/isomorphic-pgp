const UserIdPacket = require("../UserId.js");

let fixture = {
  userid: "hello 你好"
};

describe("UserId Packet", () => {
  test("serialize -> parse", () => {
    let _data = UserIdPacket.serialize(fixture);
    let result = UserIdPacket.parse(_data);
    expect(result).toEqual(fixture);
  });
});
