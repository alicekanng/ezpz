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