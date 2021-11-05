const cron = require("node-cron");

function runCron(cronJob, schedule) {
  cron.schedule(schedule, () => {
    cronJob();
  });
}

module.exports = { runCron };
