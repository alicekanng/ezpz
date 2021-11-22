class UserStore {
  constructor() {
    this.users = [];
  }

  getUsers() {
    return this.users;
  }

  getUserBySlackId(id) {
    return this.users.find((user) => user.slackId === id);
  }

  getUsersSubscribedRepos(id) {
    return getUserBySlackId(id).repos_sub
  }

  addUser(slackId) {
    const user = {
      slackId,
      gitlabUsername: "",
      repos_sub: [],
    };
    this.users.push(user);
    return user;
  }

  updateUserGitlabUsername(id, username) {
    const index = this.users.findIndex((user) => user.slackId === id);
    const found = index !== -1;
    if (found) {
      this.users[index].gitlabUsername = username;
    }
    return found;
  }
}

const store = new UserStore();

module.exports = store;
