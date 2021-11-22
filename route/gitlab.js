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

<<<<<<< HEAD
route.post("/", async (req, res) => {
  const type = req.get('X-Gitlab-Event')
  const message = formatMessage(type, req.body)
  console.log(message)
  try{
    await sendMessageToGroup(message)
    return res.status(200)
  } catch(err){
    console.log(err);
    return res.status(400)
  }
  
=======
route.post("/", (req, res) => {
  const type = req.get("X-Gitlab-Event");
  const message = formatMREventMessage(type, req.body);
  console.log(message);
  sendMessageToGroup(message);
>>>>>>> 87fd94a087c0bcc68be5acde626148986e7f3423
});

route.get("/test", async (req, res) => {
  await sendReminderToSlack(TEST_PID);
  return res.status(200);
});

module.exports = route;
