const expect = require("expect");
const { createMessage, createLocationMessage } = require("./MessageCreator");

describe("Test utils/MessageCreator createMessage()", () => {
  it("should create a correct message object", () => {
    var sender = "foo";
    var message = "hello";
    var before = new Date().getTime();
    var msg = createMessage(sender, message);
    var after = new Date().getTime();
    expect(msg.sender).toEqual(sender);
    expect(msg.message).toEqual(message);
    expect(typeof msg.sentAt).toBe("number");
    expect(msg.sentAt).toBeGreaterThanOrEqual(before);
    expect(msg.sentAt).toBeLessThanOrEqual(after);
  })
})

describe("Test utils/MessageCreator createLocationMessage()", () => {
  it("should create a correct location message object", () => {
    var sender = "foo";
    var latitude = 1.234;
    var longitude = 4.321;
    var before = new Date().getTime();
    var msg = createLocationMessage(sender, latitude, longitude);
    var after = new Date().getTime();
    expect(msg.sender).toEqual(sender);
    expect(msg.message).toEqual(`https://maps.google.com/maps?z=12&t=k&q=loc:${latitude}+${longitude}`);
    expect(typeof msg.sentAt).toBe("number");
    expect(msg.sentAt).toBeGreaterThanOrEqual(before);
    expect(msg.sentAt).toBeLessThanOrEqual(after);
  })
})
