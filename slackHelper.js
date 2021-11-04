const axios = require("axios");

module.exports.sendMessageToGroup = async (message) => 
    axios.post(process.env.SLACK_WEBHOOK_URL, 
        { "text": JSON.stringify(message) },
        {headers: { 'Content-Type': 'application/json' }}
    )

