const express = require("express");
const gitLabRouter = require('./route/gitlab')

const app = express();

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Index");
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

  app.use('/gitlab', gitLabRouter)

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
})