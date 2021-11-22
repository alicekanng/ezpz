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

app.command("/gitlab-username", async ({ command, username, ack, say, client }) => {
  try {
    await ack();
    console.log(command)
    console.log(client)
    const response = await app.client.users.identity
    console.log(response)
    const userSlackId = response.data.user.id
    updateUserGitlabUsername(userSlackId, username)
    say('Username successfully stored!')
  } catch (error) {
    console.log("err");
    console.error(error);
  }
})