const axios = require("axios");
const { sendMessageToGroup } = require("./slack");
const { formatMRReminderMessage } = require("../formatter");

function getBaseUrl() {
  return "https://gitlab.com/api/v4/projects/";
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

async function getMergeRequests(repo_id) {
  //https://docs.gitlab.com/ee/api/merge_requests.html#list-merge-requests
  return request("get", `${repo_id}/merge_requests`, {
    state: "opened",
    order_by: "updated_at",
  });
}

async function getMembers(repo_id) {
  //https://docs.gitlab.com/ee/api/members.html
  const members = request("get", `${repo_id}/members`, {});
  console.log(members);
  const all = request("get", `${repo_id}/members/all`, {});
  console.log(all);
  let returnedMembers = [];
  [...members, ...all].forEach(({ id, username, name }) => {
    if (!username.includes("bot")) {
      members.push({
        id,
        username,
        name,
      });
    }
  });
  return returnedMembers;
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
  if (discussionsResponse) {
    discussionsResponse.data.forEach((data) => {
      openThreads.push(
        ...data.notes.filter(
          (note) => note.resolvable === true && !note.resolved
        )
      );
    });
  }
  return openThreads;
}

async function sendReminderToSlack(repo_id) {
  const response = await getMergeRequests(repo_id);

  for (const mr of response) {
    const discussionsResponse = await getDiscussions(mr.iid);
    const openThreads = getOpenThreads(discussionsResponse);
    const message = formatMRReminderMessage(mr, openThreads);
    sendMessageToGroup(message);
  }
}

module.exports = { sendReminderToSlack, getMergeRequests, getMembers };
