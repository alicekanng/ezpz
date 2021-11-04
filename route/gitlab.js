const axios = require("axios");
const express = require("express");
const route = express.Router();
const { formatMessage } = require('../formater')
const { sendMessageToGroup } = require('../slackHelper')

//TODO different projects and shit
const GITLAB_PROJECT_ID=8920796

route.get("/", (req, res) => {
  console.log("here");
  res.send("getting");
});

route.post("/", (req, res) => {
  const type = req.get('X-Gitlab-Event')
  const message = formatMessage(type, req.body)
  console.log(message)
  sendMessageToGroup(message)
});


function getBaseUrl(){
    return 'https://gitlab.com/api/v4/projects/' + GITLAB_PROJECT_ID;
}

function getHeaders(){
    return {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
    }
}

async function request(verb, endpoint, params) {
    try {
        var { data } = await (axios({
            method: verb,
            url: getBaseUrl() + endpoint,
            headers: getHeaders(),
            params: params
        }))
        console.log("OH YES: " + data);
        return { data };
    } catch (error) {
        console.log("OH NO " + error);
        if (error?.response?.data?.error) {
            console.log("OH NO " + error.response.data.error);
        }
    }
}

async function getMergeRequests(){
    return request('get', '/merge_requests', {
          state: 'opened',
          order_by: 'updated_at',
        });
}

async function getComments(iid){
    return request('get', '/merge_requests/' + iid + '/notes', {
    	sort:'desc',
    	order_by:'updated_at'
    })
}

route.get("/test", async (req, res) => {
  response = await getMergeRequests();
  var output = "";

  for (const id of response.data.keys()){
    var item = response.data[id]
    output = output + "</br></br></br>" + item.title +"</br>";
    if(item.iid){
      console.log("IID " + item.iid + " LETS GO");
      comments = await getComments(item.iid);
      console.log(comments);
      for (const comment of comments.data){
        if(comment.system){
          continue;
        }
      	var user = (comment?.author?.name || "someone?");
      	output = output + "<br>" + user + ": " + comment.body;
      }
    }
  }
  console.log(output);
  return res.send(output);
});


module.exports = route;
