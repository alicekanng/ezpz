const axios = require("axios");
const { sendMessageToGroup } = require("./slackHelper");

const GITLAB_PROJECT_ID = 8920796;

function getBaseUrl() {
  return "https://gitlab.com/api/v4/projects/" + GITLAB_PROJECT_ID;
}

function getHeaders() {
  return {
    "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
  };
}

async function request(verb, endpoint, params) {
  try {
    var { data } = await axios({
      method: verb,
      url: getBaseUrl() + endpoint,
      headers: getHeaders(),
      params: params,
    });
    return { data };
  } catch (error) {
    console.log("OH NO " + error);
    if (error?.response?.data?.error) {
      console.log("OH NO " + error.response.data.error);
    }
  }
}

async function getMergeRequests() {
  //https://docs.gitlab.com/ee/api/merge_requests.html#list-merge-requests
  return request("get", "/merge_requests", {
    state: "opened",
    order_by: "updated_at",
  });
}

async function getDiscussions(iid) {
  //https://docs.gitlab.com/ee/api/discussions.html#list-project-issue-discussion-items
  return request("get", "/merge_requests/" + iid + "/discussions", {
    sort: "desc",
    order_by: "updated_at",
  });
}

function getOpenThreads(discussionsResponse) {
  let openThreads = [];
  discussionsResponse.data.forEach((data) => {
    openThreads.push(
      ...data.notes.filter((note) => note.resolvable === true && !note.resolved)
    );
  });
  return openThreads;
}

async function sendReminderToSlack() {
  const response = await getMergeRequests();
  response.data.forEach(async (mr) => {
    const {
      iid = "",
      title = "",
      description = "",
      author: { name = "", username = "", avatar_url = "" },
      web_url = "",
      source_branch = "",
      target_branch = "",
      assignees = [],
      merge_status = "",
      approvals_before_merge = 0,
    } = mr;
    const discussionsResponse = await getDiscussions(iid);
    const openThreads = getOpenThreads(discussionsResponse);
    const message = {
      attachments: [
        {
          fallback: `${name} has a merge request to helpful-stuff`,
          color: "#36a64f",
          pretext: `:envelope_with_arrow: ${name} has a merge request to helpful-stuff`,
          author_name: name,
          author_link: `https://gitlab.com/${username}`,
          author_icon: avatar_url,
          title,
          title_link: web_url,
          text: description,
          fields: [
            {
              title: "Source:",
              value: `<${web_url}/tree/${source_branch}|${source_branch}>`,
              short: true,
            },
            {
              title: "Target:",
              value: `<${web_url}/tree/${target_branch}|${target_branch}>`,
              short: true,
            },
            {
              title: "Assignee:",
              value: assignees[0]
                ? assignees[0].name
                : "No one is assigned to this MR",
              short: false,
            },
            {
              title: "Merge Status:",
              value:
                merge_status === "can_be_merged"
                  ? "This merge request can be merged!"
                  : `Need ${approvals_before_merge} more approvals`,
              short: false,
            },
          ].concat(
            openThreads.map((openThread) => ({
              title: `Unresolved comment opened by ${openThread.author.name}:`,
              value: openThread.body,
              short: false,
            }))
          ),
          actions: [
            {
              name: "sub",
              text: "Subscribe",
              type: "button",
              value: "subscribe",
            },
          ],
          footer: "Gitlab Webhook",
          footer_icon: avatar_url,
          ts: Date.now(),
        },
      ],
    };
    sendMessageToGroup(message);
  });
}

module.exports = { sendReminderToSlack };
