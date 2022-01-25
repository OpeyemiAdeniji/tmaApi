import mongoose from 'mongoose'
import colors from 'colors'
import { config } from 'dotenv'

// env vars ////
config();

import Business from './src/models/Business.model'
import Category from './src/models/Category.model'
import Cloud from './src/models/Cloud.model'
import Education from './src/models/Education.model'
import Framework from './src/models/Framework.model'
import Industry from './src/models/Industry.model'
import Interview from './src/models/Interview.model'
import Language from './src/models/Language.model'
import Preselect from './src/models/Preselect.model'
import Skill from './src/models/Skill.model'
import Talent from './src/models/Talent.model'
import Tool from './src/models/Tool.model'
import User from './src/models/User.model'
import Work from './src/models/Work.model'

const options: object = {

    useNewUrlParser: true,
    // useCreateIndex: true,
    autoIndex: true,
    keepAlive: true,
    maxPoolSize: 10,
    // bufferMaxEntries: 0,
    wtimeoutMS:2500,
    connectTimeoutMS: 25000,
    socketTimeoutMS: 45000,
    family: 4,
    // useFindAndModify: false,
    useUnifiedTopology: true

}

// connect to db
const connectDB = async(): Promise<void> => {

    if(process.env.NODE_ENV === 'test'){
        mongoose.connect(process.env.MONGODB_TEST_URI || '', options);
    }

    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
        mongoose.connect(process.env.MONGODB_URI || '', options);
    }

}

// delete data
const deleteData = async () : Promise<void> => {

    try {

        await connectDB();

        await Business.deleteMany();
        await Category.deleteMany();
        await Cloud.deleteMany();
        await Education.deleteMany();
        await Framework.deleteMany();
        await Industry.deleteMany();
        await Interview.deleteMany();
        await Language.deleteMany();
        await Preselect.deleteMany();
        await Skill.deleteMany();
        await Talent.deleteMany();
        await Tool.deleteMany();
        await User.deleteMany();
        await Work.deleteMany();
        
        console.log(colors.red.inverse('data destroyed successfully...'));
        process.exit();
        
    } catch (err) {
        console.log(err);
    }

}


if(process.argv[2] === '-d'){
    deleteData();
}

