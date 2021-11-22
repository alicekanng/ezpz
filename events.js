const { app } = require("./config/bolt");
const store = require("./user-store");

app.event("app_home_opened", ({ event, say }) => {
  const slackId = event.user;
  let user = store.getUserBySlackId(slackId);
  if (!user) {
    user = store.addUser(slackId);
  }
  console.log(store.getUsers());
  if (!user.gitlabUsername) {
    say(
      `Hey, <@${event.user}>! Please use /gitlab-username command. (e.g /gitlab-username akang2)`
    );
  } else {
    say(`Welcome back, <@${event.user}>!`);
  }
});
