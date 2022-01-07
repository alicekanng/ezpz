const { getMembers } = require("../helpers/gitlab");
const Repo = require("../models/repo.model");

const getRepoByObjectId = (repoId) => {
  return Repo.findOne({ _id: repoId });
};

const getRepoById = (repoId) => {
  return Repo.findOne({ repoId });
};

const addRepo = async (repoId, repoName) => {
  const members = await getMembers(repoId);
  const repo = await Repo.create({
    repoId,
    repoName,
    members,
  });
  console.log('add repo repo', JSON.stringify(repo))
  return repo;
};

const addSubscribedBy = async (repoId, userId) => {
  const repo = await Repo.findOneAndUpdate(
    {
      repoId,
    },
    { $addToSet: { subscribedBy: userId } }
  );
  console.log('repo', JSON.stringify(repo))
  return repo;
};

const removedSubscribedBy = async (repoId, userId) => {
  const repo = await Repo.findOneAndUpdate(
    {
      repoId,
    },
    { $pull: { subscribedBy: userId } }
  );
  return repo;
};

const checkMemberPermission = async (repoId, username) => {
  const repo = await getRepoById(repoId);
  console.log('check permission repo', JSON.stringify(repo))
  return repo?.members.find((member) => member.username === username);
};

module.exports = {
  getRepoByObjectId,
  getRepoById,
  addRepo,
  addSubscribedBy,
  removedSubscribedBy,
  checkMemberPermission,
};
