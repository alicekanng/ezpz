const { app } = require("./config/bolt");
const { getUserBySlackId, addUser } = require("./services/user.service");

app.event("app_home_opened", async ({ event, say }) => {
  const slackId = event.user;
  let user = await getUserBySlackId(slackId);
  if (!user) {
    user = await addUser(slackId);
  }
  if (!user.gitlabUsername) {
    say(
      `Hey, <@${event.user}>! Please use /gitlab-username command. (e.g /gitlab-username akang2)`
    );
  } else {
    say(`Welcome back, <@${event.user}>!`);
  }
});
