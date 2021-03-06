import { Stan  } from 'node-nats-streaming';
import { Publisher, Subjects } from '@btffamily/tmaapp';

class LocationSavedPublisher extends Publisher {

    subject = Subjects.LocationSaved;

    constructor(client: Stan){
        super(client)
    }

}

export default LocationSavedPublisher;