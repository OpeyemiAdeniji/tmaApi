import { Stan } from 'node-nats-streaming'
import { Listener, Subjects } from '@btffamily/tmaapp';
import QueueGroupName from '../groupName';

import User from '../../models/User.model';
import Status from '../../models/Status.model';
import Role from '../../models/Role.model';
import { generate } from '../../utils/random.util';
import { sendGrid } from '../../utils/email.util';


class TalentAddedListener extends Listener {

    subject = Subjects.TalentAdded;
    queueGroupName = QueueGroupName.TMA;

    constructor(client: Stan){
        super(client);
    }

    async onMessage(data: any, msg: any){

        const { user } = data;

        const _user = await User.findById(user._id);
        const role = await Role.findOne({name: 'user'});
        const tRole = await Role.findOne({  name: 'talent' })

        if(!_user && role && tRole){

            const gen = await generate(8, true);
            const password = '#TS' + gen + '/1';

            const u = await User.create({
                _id: user._id,
                id: user._id,
                userId: user._id,
                phoneNumber: user.phoneNumber,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                userType: 'talent',
                password: password,
                savedPassword: password,
                passwordType: 'generated'
            })

            u.roles.push(role._id);
            u.roles.push(tRole._id);
            await u.save();

            // create status
            const status = await Status.create({
                profile: false,
                activated: false,
                apply: {
                    status: false,
                    step: 1
                },
                user: u._id,
                email: u.email
            });

            // send welcome email to talent with login details
            let emailData = {
                template: 'email-verify',
                email: user.email,
                preheaderText: 'MYRIOI',
                emailTitle: 'Welcome to MYRIOI',
                emailSalute: 'Hello ' + user.firstName + ',',
                bodyOne: `MYRIOI has added you as a talent on their talent management platform. Thank you for joining our platform. 
                Please login to your dashboard with the details below. You will be forced to change your password immediately you login`,
                bodyTwo: `Email: ${user.email} \n Password: ${password}`,
                fromName: 'MYRIOI'
            }
        
            await sendGrid(emailData);
          
        }
    
        // acknowledge NATS message
        msg.ack();

    }


}

export default TalentAddedListener;