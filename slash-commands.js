const { app } = require("./config/bolt");
const { repoIds, repoNames } = require("./config/repos");
const { formatOpenMRBlock } = require("./formatter");
const { getMergeRequests } = require("./helpers/gitlab");
const userStore = require("./user-store");
const repoStore = require("./repo-store");

app.command("/open-mrs", async ({ ack, say }) => {
  try {
    await ack();
    const response = await getMergeRequests(repoIds.TEST_REPO);
    response.data.forEach((mr) => say(formatOpenMRBlock(mr)));
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/gitlab-username", async ({ command, ack, say }) => {
  try {
    await ack();
    const userSlackId = command.user_id;
    userStore.updateUserGitlabUsername(userSlackId, command.text);
    const repoOptions = Object.keys(repoNames).join(", ");

    say(`Here are some repositories you can subscribe to: ${repoOptions}`);
    say(
      "Use the /subscribe command with the repo name to subscribe to a specific repository from the list above!"
    );
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.command("/subscribe", async ({ command, ack, say }) => {
  try {
    await ack();
    const userSlackId = command.user_id;
    const repo = command.text;
    const gitlabUsername = userStore.getGitlabUsername(userSlackId);

    if (repoNames[repo]) {
      if (gitlabUsername) {
        repoStore.setRepo(repoNames[repo]);
        if (repoStore.checkMemberPermission(repoNames[repo], username)) {
          userStore.subscribeToRepo(userSlackId, repoNames[repo]);
          say("Congrats on successfully subscribing, bro.");
        } else {
          say(`You are not a member of ${repo}!!!`);
        }
      } else {
        say("What are you doing here?! Put in your gitlab user first!!!");
      }
    } else {
      say("Repository is not found! Please enter a valid name, bro.");
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
