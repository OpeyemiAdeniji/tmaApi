import mongoose from 'mongoose'
import colors from 'colors'

import nats from '../events/nats';
import UserCreated from '../events/listeners/user-created';

const cert = `${__dirname.split('config')[0]}_data/ca-certificate.crt`;
const cloudDBString = process.env.MONGODB_CLOUD_URI + `&tls=true&tlsCAFile=${cert}`

mongoose.Promise = global.Promise;

const options: object = {

    useNewUrlParser: true,
    // useCreateIndex: true,
    autoIndex: true,
    keepAlive: true,
    maxPoolSize: 10,
    // bufferMaxEntries: 0,
    wtimeoutMS:60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
    family: 4,
    // useFindAndModify: false,
    useUnifiedTopology: true

}

const connectNats = async (): Promise<void> => {

    if(!process.env.NATS_CLUSTER_ID){
        throw new Error(`NATS_CLUSTER_ID must be defined`)
    }

    if(!process.env.NATS_URI){
        throw new Error(`NATS_URI must be defined`)
    }

    if(!process.env.NATS_CLIENT_ID){
        throw new Error(`NATS_CLIENT_ID must be defined`)
    }

    // connect to NATS
    await nats.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URI);

    process.on('SIGINT', () => { nats.client.close() });  // watch for signal intercept or interruptions
    process.on('SIGTERM', () => { nats.client.close() })  // watch for signal termination

    nats.client.on('close', async() => {
        console.log(colors.red.inverse(`NATS connection closed. Restarting...`));
        await nats.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID, process.env.NATS_URI!);
        // process.exit();
    })

}

const listenNats = async (): Promise<void> => {

    await new UserCreated(nats.client).listen();

}

const connectDB = async (): Promise<void> => {

    // connect to nats
    await connectNats();

    // listen to nats
    await listenNats();

    //connect to mongoose
    const dbConn = await mongoose.connect(process.env.MONGODB_URI || '', options);
    console.log(colors.cyan.bold.underline(`Database connected: ${dbConn.connection.host}`));

}

export default connectDB;

