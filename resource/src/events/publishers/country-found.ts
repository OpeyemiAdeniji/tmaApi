import { Stan  } from 'node-nats-streaming';
import { Publisher, Subjects } from '@btffamily/tmaapp';

class CountryFoundPublisher extends Publisher {

    subject = Subjects.CountryFound;

    constructor(client: Stan){
        super(client)
    }

}

export default CountryFoundPublisher;