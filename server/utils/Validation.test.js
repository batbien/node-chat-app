const expect = require("expect");
const { validateStr } = require("./Validation");

describe("Validation validateStr test", () => {

  it("should be valid string", () => {
    let res = validateStr("foo");
    expect(res).toBe(true);
  });

  it("should be valid with leading spaces", () => {
    let res = validateStr("  foo");
    expect(res).toBe(true);
  });

  it("should be valid with trailing spaces", () => {
    let res = validateStr("foo  ");
    expect(res).toBe(true);
  });

  it("should be invalid empty string", () => {
    let res = validateStr("");
    expect(res).toBe(false);
  });

  it("should be invalid type", () => {
    let res = validateStr(23);
    expect(res).toBe(false);
  });
});
