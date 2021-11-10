const { app } = require("./config/bolt");

app.event("app_home_opened", ({ event, say }) => {
  console.log(event);
  say(`Waassup, <@${event.user}>!`);
});
