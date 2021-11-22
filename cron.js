const cron = require("node-cron");
const { TEST_PID } = require("./config/project-ids");
const { sendReminderToSlack } = require("./helpers/gitlab");

function runCron(cronJob, schedule) {
  cron.schedule(schedule, () => {
    cronJob();
  });
}

runCron(async () => await sendReminderToSlack(TEST_PID), "0 8 * * *"); // morning cron
runCron(async () => await sendReminderToSlack(TEST_PID), "0 14 * * *"); // night cron
