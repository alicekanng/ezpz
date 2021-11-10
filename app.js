const express = require("express");
const gitLabRouter = require("./route/gitlab");
const healthRouter = require("./route/health");
const { app, receiver } = require("./config/bolt");
require("./slash-commands");
require("./events");

receiver.app.use(express.json());
receiver.app.use(express.urlencoded({ extended: false }));

receiver.app.use("/gitlab", gitLabRouter);
receiver.app.use("/health", healthRouter);

(async () => {
  const PORT = process.env.PORT || 3000;
  await app.start(PORT);
  console.log(`Slack Bot app is running on port ${PORT}`);
})();

require("./cron");
