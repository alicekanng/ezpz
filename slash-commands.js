const { app } = require("./config/bolt");
const { TEST_PID } = require("./config/project-ids");
const { formatOpenMRBlock } = require("./formatter");
const { getMergeRequests } = require("./helpers/gitlab");
const store = require("./user-store");

app.command("/open-mrs", async ({ ack, say }) => {
  try {
    await ack();
    const response = await getMergeRequests(TEST_PID);
    response.data.forEach((mr) => say(formatOpenMRBlock(mr)));
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/gitlab-username", async ({ command, ack, say }) => {
  try {
    await ack();
    const userSlackId = command.user_id
    store.updateUserGitlabUsername(userSlackId, command.text)
    say('Username successfully stored!')
  } catch (error) {
    console.log("err");
    console.error(error);
  }
})