const express = require("express");
const gitLabRouter = require("./route/gitlab");
const healthRouter = require("./route/health");
const { runCron } = require("./cron");
const { sendReminderToSlack } = require("./helpers/gitlab");
const { app, receiver } = require("./config/bolt");
require("./slash-commands");

receiver.app.use(express.json());
receiver.app.use(express.urlencoded({ extended: false }));

receiver.app.use("/gitlab", gitLabRouter);
receiver.app.use("/health", healthRouter);

runCron(async () => await sendReminderToSlack(), "0 8 * * *"); // morning cron
runCron(async () => await sendReminderToSlack(), "0 14 * * *"); // night cron

(async () => {
  const PORT = process.env.PORT || 3000;
  await app.start(PORT);
  console.log(`Slack Bot app is running on port ${PORT}`);
})();
