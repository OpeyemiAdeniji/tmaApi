import { Stan } from 'node-nats-streaming'
import { Listener, Subjects } from '@btffamily/tmat';
import QueueGroupName from '../groupName';

import User from '../../models/User.model';

class UserCreatedListener extends Listener {

    subject = Subjects.UserCreated;
    queueGroupName = QueueGroupName.Auth;

    constructor(client: Stan){
        super(client);
    }

    async onMessage(data: any, msg: any){

        const { user, userType } = data;

        const find = await User.findOne({ userId: user._id });

        if(!find){

            const uc = await User.create({

                _id: user._id,
                id: user._id,
                userId: user._id,
                phoneNumber: user.phoneNumber,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                userType: userType

            })

        }

        // acknowledge NATS message
        msg.ack();

    }


}

export default UserCreatedListener;