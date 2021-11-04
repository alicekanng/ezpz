const gitLabRouter = require("./route/gitlab");
const healthRouter = require("./route/health")
const { app, receiver } = require("./route/bolt");



receiver.app.use("/gitlab", gitLabRouter);
receiver.app.use("/health", healthRouter);

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
  const PORT = process.env.PORT || 3000;
  await app.start(PORT);
  console.log(`Slack Bot app is running on port ${PORT}`);
})();
