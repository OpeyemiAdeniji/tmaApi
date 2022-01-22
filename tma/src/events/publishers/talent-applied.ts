import { Stan } from 'node-nats-streaming'
import { Publisher, Subjects } from '@btffamily/tmaapp'

class TalentAppliedPublisher extends Publisher {

    subject = Subjects.TalentApplied;

    constructor(client: Stan){
        super(client);
    }

}

export default TalentAppliedPublisher;