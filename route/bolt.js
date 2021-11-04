process.env.NODE_ENV !== "production" && require("dotenv").config();
const { App, ExpressReceiver } = require("@slack/bolt");

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: false, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver,
});

module.exports = { app, receiver };
