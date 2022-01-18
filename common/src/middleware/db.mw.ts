import mongoose, { Model, Schema } from 'mongoose';
import colors from 'colors'


let dbConn: any = null; //use global var

const options: object = {

    useNewUrlParser: true,
    // useCreateIndex: true,
    autoIndex: true,
    keepAlive: true,
    maxPoolSize: 10,
    // bufferMaxEntries: 0,
    wtimeoutMS:2500,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    // useFindAndModify: false,
    useUnifiedTopology: true

}

const cert = `${__dirname.split('middleware')[0]}src/ca-certificate.crt`;
// console.log(__dirname);

export const connectDB = async (authType: string, authDB: string): Promise<void> => {

    if(authType === 'development' || authType === 'production'){

        dbConn = await mongoose.createConnection(authDB, options);
        console.log('Auth (dev) database connected');

    }else if(authType === 'cloud'){

        const cloudDBString = authDB + `&tls=true&tlsCAFile=${cert}`;
        dbConn = mongoose.createConnection(cloudDBString, options);
        // console.log('Auth (prod) database connected');

    }else {
        console.log('Authentication type is required');
    }

}

export const getRoleModel = async (authType: string, authDB: string): Model<Schema> => {

    await connectDB(authType, authDB);
    
    const model = await dbConn.collection('roles');
    return model;

}