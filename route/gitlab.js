const express = require('express')
const route = express.Router()

route.post('/', (req, res) => {
    console.log(res)
})

module.exports = route