const express = require("express");
const route = express.Router();
const { sendReminderToSlack } = require("../helpers/gitlab");

route.get("/", (req, res) => {
  console.log("here");
  res.send("getting");
});

route.get("/test", async (req, res) => {
  await sendReminderToSlack();
  return res.status(200);
});

module.exports = route;
