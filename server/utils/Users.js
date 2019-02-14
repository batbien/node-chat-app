const _ = require("lodash");

class Users {

  constructor(users) {
    if (users)
      this.users = users;
    else this.users = [];
  }

  addUser(id, username, room) {
    if (this.users.filter(u => u.id === id).length >= 1)
      return null;
    this.users.push({ id, username, room });
    return { id, username, room };
  }

  removeUser(id) {
    let usr = this.getUser(id);
    if (usr)
      return _.remove(this.users, usr)[0];
    return null;
  }

  getUser(id) {
    let usr = this.users.find(u => u.id === id);
    if (usr)
      return usr;
    return null;
  }

  getUserList(room) {
    return this.users.filter(u => u.room === room).map(u => u.username);
  }
}

module.exports = {Users};
