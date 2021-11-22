const cron = require("node-cron");
const { repoIds } = require("./config/repos");
const { sendReminderToSlack } = require("./helpers/gitlab");

function runCron(cronJob, schedule) {
  cron.schedule(schedule, () => {
    cronJob();
  });
}

runCron(async () => await sendReminderToSlack(repoIds.TEST_REPO), "0 8 * * *"); // morning cron
runCron(async () => await sendReminderToSlack(repoIds.TEST_REPO), "0 14 * * *"); // night cron
