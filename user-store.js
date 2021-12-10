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

  getGitlabUsername(id) {
    return this.getUserBySlackId(id)?.gitlabUsername;
  }

  getUsersSubscribedRepos(id) {
    return this.getUserBySlackId(id).repos_sub;
  }

  addUser(slackId) {
    const user = {
      slackId,
      gitlabUsername: "",
      repos_sub: new Set(),
    };
    this.users.push(user);
    return user;
  }

  subscribeToRepo(id, repoId) {
    const index = this.users.findIndex((user) => user.slackId === id);
    const found = index !== -1;
    if (found) {
      this.users[index].repos_sub.add(repoId);
    }
    return found;
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
