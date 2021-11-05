const axios = require("axios");
const express = require("express");
const route = express.Router();
const { formatMessage } = require("../formater");
const { sendReminderToSlack } = require("../gitlabHelper");
const { sendMessageToGroup } = require("../slackHelper");

//TODO different projects and shit
const GITLAB_PROJECT_ID = 8920796;

route.get("/", (req, res) => {
  console.log("here");
  res.send("getting");
});

route.post("/", (req, res) => {
  const type = req.get("X-Gitlab-Event");
  const message = formatMessage(type, req.body);
  console.log(message);
  sendMessageToGroup(message);
});

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
    console.log("OH YES: " + data);
    return { data };
  } catch (error) {
    console.log("OH NO " + error);
    if (error?.response?.data?.error) {
      console.log("OH NO " + error.response.data.error);
    }
  }
}

route.get("/test", async (req, res) => {
  await sendReminderToSlack();
  return res.status(200);
});

module.exports = route;
