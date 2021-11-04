const axios = require("axios");
const express = require("express");
const route = express.Router();

//TODO different projects and shit
const GITLAB_PROJECT_ID=8920796


route.get("/", (req, res) => {
  console.log("here");
  res.send("getting");
});
route.post("/", (req, res) => {
  console.log(Object.keys(req));
  console.log(req, "lklk")
});



route.get("/test", async (req, res) => {
  
  console.log("Making a test request");
  try{

    const {data} = await axios.get('https://gitlab.com/api/v4/projects/' + GITLAB_PROJECT_ID + '/merge_requests',
    {
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
      },
      params: {
        state: 'opened',
        order_by: 'updated_at',
      }
    })
  
    console.log("OH YES: got data");

    return res.send({data});

  } catch(error) {
    console.log("OH NO " + error);
    console.log(Object.keys(error));
    console.log("OH NO " + error.response.data.error);
  };

});


module.exports = route;
