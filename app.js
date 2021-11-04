const { App } = require("@slack/bolt");
if (process.env.NODE_ENV === "development") require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN,
});

app.command("/wat", async ({ command, ack, say }) => {
  try {
    await ack();
    say("Yaaay! that command works!");
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

(async () => {
  try {
    const port = process.env.PORT || 3000;
    // Start your app
    await app.start(port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  } catch (e) {
    console.log(e);
  }
})();
