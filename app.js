const axios = require("axios");
const gitLabRouter = require("./route/gitlab");
const healthRouter = require("./route/health");
const { app, receiver } = require("./route/bolt");

receiver.app.use("/gitlab", gitLabRouter);
receiver.app.use("/health", healthRouter);

app.command("/wat", async ({ command, ack, say }) => {
  try {
    await ack();
    const GITLAB_PROJECT_ID = 8920796;
    const { data } = await axios.get(
      "https://gitlab.com/api/v4/projects/" +
        GITLAB_PROJECT_ID +
        "/merge_requests",
      {
        headers: {
          "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
        },
        params: {
          state: "opened",
          order_by: "updated_at",
        },
      }
    );
    console.log("OH YES: got data");
    say(JSON.stringify(data));
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
