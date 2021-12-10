const { getMembers } = require("./helpers/gitlab");

class RepoStore {
  constructor() {
    this.repos = [];
  }

  getRepo(repo_id) {
    return this.repos.find((repo) => repo.id === repo_id);
  }

  setRepo(repo_id) {
    const index = this.repos.findIndex((repo) => repo.id === repo_id);
    if (index === -1) {
      const members = getMembers(repo_id);
      this.repos.push({ id: repo_id, members });
    }
  }

  checkMemberPermission(repo_id, username) {
    const repo = this.repos.find((repo) => repo.id === repo_id);
    return repo?.members.find((member) => member.username === username);
  }
}

const store = new RepoStore();

module.exports = store;
