import fs from 'fs';
import colors from 'colors';
import mongoose from 'mongoose'
import { config } from 'dotenv'

// env vars
config();

// models
import Bank from './src/models/Bank.model';
import Country from './src/models/Country.model';
import Location from './src/models/Location.model';
import Language from './src/models/Language.model';

const options = {
	useNewUrlParser: true,
	// useCreateIndex: true,
	autoIndex: true,
	keepAlive: true,
	maxPoolSize: 10,
	// bufferMaxEntries: 0,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 45000,
	family: 4, // Use IPv4, skip trying IPv6
	// useFindAndModify: false,
	useUnifiedTopology: true,
};

// connect to DB
// mongoose.connect(process.env.MONGODB_URI, options);
const connectDB = async() => {

	if (process.env.NODE_ENV === 'test'){
		mongoose.connect(process.env.MONGODB_TEST_URI || '', options)
	}

	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
		mongoose.connect(process.env.MONGODB_URI || '', options)
	}
}

//Delete the data
const deleteData = async () => {

	try {
		await connectDB();

		await Bank.deleteMany();
        await Country.deleteMany();
		await Language.deleteMany();
		await Location.deleteMany();

		console.log(colors.red.inverse('Data destroyed successfully...'));
		process.exit();
		
	} catch (err) {
		console.log(err);
	}

};

if (process.argv[2] === '-d') {
	deleteData();
}