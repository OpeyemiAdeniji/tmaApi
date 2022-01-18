import User from '../models/User.model';
import Worker from './worker.job'

export const doJob = async (cron: any | string) => {

    // set a new worker instance
    const cronworker = new Worker();

    // set the cron exoression
    cronworker.expression = cron;
    
    // schedule the job (starts automatically with false as first parameter)
    cronworker.schedule(false, '', async () => {

        console.log('running a task every second')

    })


}
