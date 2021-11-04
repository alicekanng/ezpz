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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
