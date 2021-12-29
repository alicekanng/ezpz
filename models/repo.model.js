const mongoose = require("mongoose");

const repoSchema = mongoose.Schema({
  repoId: {
    type: String,
    required: true,
  },
  repoName: {
    type: String,
    required: true
  },
  members: [
    {
      username: String,
      name: String,
    },
  ],
  subscribedBy: [
    { 
      user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" }
    }]
});

module.exports = mongoose.model("Repo", repoSchema);
