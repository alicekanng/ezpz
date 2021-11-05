const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.send("await jay");
});

module.exports = route;
