const express = require("express");
const axios = require("axios");
const route = express.Router();

route.get("/", async (req, res) => {
    await axios.post("https://hooks.slack.com/services/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", {
        "text": "chris is gac"
    }, {
        headers: {
            'Content-type': 'application/json',
        }
    });

    res.send("await jay");
});

module.exports = route;