import nodecron from 'node-cron'

//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *

interface IWorker {
    cron: any | string;
    task: any;
    schedule(callback: any): void;
    stop(): void;
    destroy(): void;
}

class Worker implements IWorker {

    public cron: any | string;  // save cron object here
    public task: any;  // save current task here

    constructor(cron: string){

        if(!cron){
            throw new Error('cron expression is required');
        }

        this.cron = cron;

    }

    get cronExp(){
        return this.cron;
    }

    get activeTask(){
        return this.task;
    }

    schedule = async (cb: any) => {

        this.task = await nodecron.schedule(this.cron, cb);
        this.task.start();

    }

    stop = async () => {
        if(this.task){
            await this.task.stop();
        }
    }

    destroy = async () => {
        if(this.task){
            await this.task.destroy();
        }
    }

}

export default Worker;