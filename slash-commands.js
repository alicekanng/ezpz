const { app } = require("./config/bolt");
const { TEST_PID } = require("./config/project-ids");
const { formatOpenMRBlock } = require("./formatter");
const { getMergeRequests, getMembers } = require("./helpers/gitlab");

app.command("/open-mrs", async ({ command, ack, say }) => {
  try {
    await ack();
    const response = await getMergeRequests(TEST_PID);
    response.data.forEach((mr) => say(formatOpenMRBlock(mr)));
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/gitlab-username", async ({ command, username, ack, say }) => {
  try {
    await ack();
    let usernameFound = false
    const response = await getMembers(TEST_PID);
    response.data.forEach((member) => {
      if (username == member) {
        usernameFound = true
      }
    })
    usernameFound ? say('We already have your git lab username!') : say('Thank you for your username!')
  } catch (error) {
    console.log("err");
    console.error(error);
  }
})