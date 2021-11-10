const axios = require("axios");

module.exports.sendMessageToGroup = (message) => {
    axios({
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        url: process.env.SLACK_WEBHOOK_URL,
        data: message
    })
}
