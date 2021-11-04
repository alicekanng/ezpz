const gitLabRouter = require("./route/gitlab");
const { app, receiver } = require("./route/bolt");

receiver.app.use("/gitlab", gitLabRouter);

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
  await bot.start(PORT);
  console.log(`Slack Bot app is running on port ${PORT}`);
})();
