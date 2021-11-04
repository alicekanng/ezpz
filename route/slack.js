const express = require("express");
const axios = require("axios");
const route = express.Router();

route.get("/", (req, res) => {
    axios.post("https://hooks.slack.com/services/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", {
        "text": "chris is gac"
    });
    res.send("jay");
});

module.exports = route;