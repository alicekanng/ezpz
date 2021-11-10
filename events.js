const { app } = require("./config/bolt");

app.event("app_home_opened", ({ event, say }) => {
  say(`Waassup, <@${event.user}>!`);
});
