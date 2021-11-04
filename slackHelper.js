const axios = require("axios");

module.exports.sendMessageToGroup = (message) => {
    axios.post(process.env.SLACK_WEBHOOK_URL, 
        { "text": message },
        {headers: { 'Content-Type': 'application/json' }}
    )
}
