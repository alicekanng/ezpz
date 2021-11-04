const express = require("express");

const app = express();

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Index");
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.send("Not found");
});

module.exports = app;
