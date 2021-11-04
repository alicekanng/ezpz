const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  console.log("here");
  res.send("getting");
});
route.post("/", (req, res) => {
  console.log(res);
});

module.exports = route;
