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
  return repo;
};

const addSubscribedBy = async (repoId, userId) => {
  const repo = await Repo.findOneAndUpdate(
    {
      repoId,
    },
    { $addToSet: { subscribedBy: userId } }
  );
  console.log('should have subscribedBy')
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
