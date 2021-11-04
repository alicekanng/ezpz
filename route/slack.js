const express = require("express");
const axios = require("axios");
const {sendMessageToGroup} = require("../slackHelper")
const route = express.Router();

route.get("/", async (req, res) => { 
//   await axios.post(
//     process.env.SLACK_WEBHOOK_URL,
//     {
//       text: "chris is gac",
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

  sendMessageToGroup("chris is very gac");  
  res.send("await jay");
});

module.exports = route;
