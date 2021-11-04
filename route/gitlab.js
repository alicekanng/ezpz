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
    //https://docs.gitlab.com/ee/api/merge_requests.html#list-merge-requests
    return request('get', '/merge_requests', {
          state: 'opened',
          order_by: 'updated_at',
        });
}

async function getDiscussions(iid){
    //https://docs.gitlab.com/ee/api/discussions.html#list-project-issue-discussion-items
    return request('get', '/merge_requests/' + iid + '/discussions', {
        sort:'desc',
        order_by:'updated_at'
    })
}

route.get("/test", async (req, res) => {
  response = await getMergeRequests();
  var output = "";

  //Go through open MRS
  for (const id of response.data.keys()){
    var item = response.data[id]
    output = output + "</br></br></br>" + item.title +"</br>";
    
    //use the issue ID
    if(item.iid){
      console.log("IID " + item.iid + " LETS GO");
      //We use the issue id to pull discussions for that MR
      discussions = await getDiscussions(item.iid);
      console.log(JSON.stringify(discussions));
      for (const discussion of discussions.data){
          output = output + "DISCUSSION:</br>"
          for (const comment of discussion.notes){
          //I don't know if this shows up for /discussions but if you get /notes you'll also get notes from the system that say "Kevin approved" or whatever
          if (comment.system){
            continue;
          }
          output = output + "<br>" + (comment?.author?.name || "someone?") + ": " + comment.body;
        }
        output = output + "END DISCUSSION:</br></br></br>"
      }
    }
  }
  console.log(output);
  return res.send(output);
});


module.exports = route;
