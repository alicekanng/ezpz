const { app } = require("./config/bolt");
const { repoIds, repoNames } = require("./config/repos");
const { formatOpenMRBlock } = require("./formatter");
const { getMergeRequests } = require("./helpers/gitlab");
const {
  getRepoByObjectId,
  getRepoById,
  addRepo,
  checkMemberPermission,
  addSubscribedBy,
  removedSubscribedBy,
} = require("./services/repo.service");
const {
  updateGitlabUsername,
  getUserBySlackId,
  subscribeToRepo,
  unsubscribeToRepo,
  getSubscribedRepos
} = require("./services/user.service");

app.command("/open-mrs", async ({ ack, say, command }) => {
  try {
    await ack();
    const repo = command.text;
    const response = await getMergeRequests(repoNames[repo]);
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
    updateGitlabUsername({
      slackId: userSlackId,
      gitlabUsername: command.text,
    });
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
    const user = await getUserBySlackId(userSlackId);

    if (repoNames[repo]) {
      if (user?.gitlabUsername) {
        let existing = await getRepoById(repoNames[repo]);
        if (!existing) {
          existing = addRepo(repoNames[repo], repo);
        }
        if (checkMemberPermission(existing._id, user?.gitlabUsername)) {
          addSubscribedBy(existing._id, user._id);
          subscribeToRepo({ slackId: userSlackId, repoId: existing._id });
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
    console.error(error);
  }
});

app.command('/unsubscribe', async ({ command, ack, say }) => {
  try {
    await ack();
    const userSlackId = command.user_id;
    const repo = command.text;
    const user = await getUserBySlackId(userSlackId);

    if (repoNames[repo]) {
      if (user?.gitlabUsername) {
        let existing = await getRepoById(repoNames[repo]);
        if (!existing) {
          say("Given repo does not exist, bro.");
        } else {
          removedSubscribedBy(repoNames[repo], user._id);
          unsubscribeToRepo({ slackId: userSlackId, repoId: existing._id });
          say("Congrats on successfully unsubscribing, bro.");
        }
      } else {
        say("What are you doing here?! Put in your gitlab user first!!!");
      }
    } else {
      say("Repository is not found! Please enter a valid name, bro.");
    }

  } catch (error) {
    console.error(error);
  }
})

app.command("/show-repos", async ({ ack, say, command }) => {
  try {
    await ack();
    const userSlackId = command.user_id;
    const repos = await getSubscribedRepos(userSlackId);
    for(let repo of repos){
      const rip = await getRepoByObjectId(repo.toString())
      say(rip.repoName)
    }
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
