const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  slackId: {
    type: String,
    required: true,
    unique: true,
  },
  gitlabUsername: {
    type: String,
    unique: true,
  },
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repo" }],
});

module.exports = mongoose.model("User", userSchema);
