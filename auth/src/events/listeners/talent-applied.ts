import { Stan } from 'node-nats-streaming'
import { Listener, Subjects } from '@btffamily/tmaapp';
import QueueGroupName from '../groupName';

import User from '../../models/User.model';
import Status from '../../models/Status.model';


class TalentAppliedListener extends Listener {

    subject = Subjects.TalentApplied;
    queueGroupName = QueueGroupName.TMA;

    constructor(client: Stan){
        super(client);
    }

    async onMessage(data: any, msg: any){

        const { talent, user, step } = data;

        const _user = await User.findById(user._id);
        const status = await Status.findOne({user: user._id});

        if(_user && status ){

            status.apply.status = true;
            status.apply.step = step;
            await status.save();
            
        }
    
        // acknowledge NATS message
        msg.ack();

    }


}

export default TalentAppliedListener;