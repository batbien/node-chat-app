const expect = require("expect");
const { Users } = require("./Users");

var users;



describe("Users test", () => {

  beforeEach("create sample users", () => {
    users = new Users([
      { id: 1, username: "foo", room: "room1" },
      { id: 2, username: "bar", room: "room1" },
      { id: 3, username: "boo", room: "room2" }
    ]);
  });

  it("should add user", () => {
    let user = { id: 4, username: "bor", room: "room2" };
    let res = users.addUser(user.id, user.username, user.room);
    expect(res).toEqual(user);
    expect(users.users).toContainEqual(user);
  });

  it("should not add user", () => {
    let user = { id: 3, username: "rob", room: "room3" };
    let res = users.addUser(user.id, user.username, user.room);
    expect(res).toEqual(null);
    expect(users.users).not.toContainEqual(user);
  });

  it("should remove user", () => {
    let user = users.users[0];
    let res = users.removeUser(user.id);
    expect(res).toEqual(user);
    expect(users.users).not.toContainEqual(user);
  });

  it("should not remove user", () => {
    let res = users.removeUser(4);
    expect(res).toEqual(null);
    expect(users.users.length).toBe(3);
  });

  it("should return the correct user", () => {
    let user = users.users[1];
    let res = users.getUser(user.id);
    expect(res).toEqual(user);
    expect(users.users.length).toBe(3);
  });

  it("should return null because no such user exists", () => {
    let res = users.getUser(4);
    expect(res).toEqual(null);
    expect(users.users.length).toBe(3);
  });

  it("should return the correct user list for the given room", () => {
    let userList = [users.users[0].username, users.users[1].username];
    let res = users.getUserList("room1");
    expect(res).toEqual(userList);
    expect(users.users.length).toBe(3);
  });

  it("should return empty array because no such room exists", () => {
    let res = users.getUserList("room3");
    expect(res).toEqual([]);
    expect(users.users.length).toBe(3);
  });

});
