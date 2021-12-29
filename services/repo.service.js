const { getMembers } = require("../helpers/gitlab");
const Repo = require("../models/repo.model");

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
  return repo;
};

const addSubscribedBy = async (repoId, userId) => {
  const repo = await Repo.findOneAndUpdate(
    {
      repoId,
    },
    { $addToSet: { 'subscribedBy.user' : { userId } } }
  );
  return repo;
};

const removedSubscribedBy = async (repoId, userId) => {
  const repo = await Repo.findOneAndUpdate(
    {
      repoId,
    },
    { $pull: { 'subscribedBy.user' : { userId } } }
  );
  return repo;
};

const checkMemberPermission = async (repoId, username) => {
  const repo = await getRepoById(repoId);
  return repo?.members.find((member) => member.username === username);
};

module.exports = {
  getRepoById,
  addRepo,
  addSubscribedBy,
  removedSubscribedBy,
  checkMemberPermission,
};
