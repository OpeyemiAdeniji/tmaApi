import nats, { Stan } from 'node-nats-streaming';
import colors from 'colors';

class NatsWrapper {

    public client: Stan | any;

    public async connect (clusterId: string, clientId: string | any, url: string) {

        this.client = await nats.connect(clusterId, clientId, { url });

        return new Promise<void> ((resolve, reject) => {

            this.client.on('connect', () => {
                console.log(colors.yellow.inverse('Connected to NATS'));
                resolve()
            })

            this.client.on('error', (err: any) => {
                console.log(err);
                reject(err);
            })

        })

    }

}

export default new NatsWrapper();