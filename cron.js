const cron = require('node-cron');

function startCron(cronJob){
    var schedule = '* */10 * * * *';
    if (process.env.NODE_ENV === "development"){
        //every 5 seconds why not?
        schedule = '*/5 * * * * *';
    }

    const task = cron.schedule(schedule,()=>{
      cronJob()
    });
}

module.exports = { startCron };