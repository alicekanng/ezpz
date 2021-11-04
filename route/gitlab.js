const express = require("express");
const { TEST_PID } = require("../config/project-ids");
const { formatMREventMessage } = require("../formatter");
const route = express.Router();
const { sendReminderToSlack } = require("../helpers/gitlab");
const { sendMessageToGroup } = require("../helpers/slack");

route.get("/", (req, res) => {
  console.log("here");
  res.send("getting");
});

route.post("/", (req, res) => {
  const type = req.get("X-Gitlab-Event");
  const message = formatMREventMessage(type, req.body);
  console.log(message);
  sendMessageToGroup(message);
});

route.get("/test", async (req, res) => {
  await sendReminderToSlack(TEST_PID);
  return res.status(200);
});

module.exports = route;
