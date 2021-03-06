import app from './config/app'
import colors from 'colors'
import { seedData } from './config/seeds/seeder.seed'
import connectDB from './config/db'
import { getMemoryStats, getHeapSize } from './utils/memory.util'


const connect = async (): Promise<void> => {
    // connect to DB
    await connectDB();

    // get heap statistics and log heap size
    const heapSize = getMemoryStats()
    console.log(heapSize);

    // seed data
    await seedData();
}

connect();  // initialize connection and seed data

// define PORT
const PORT = process.env.PORT || 5002;

// create server
const server = app.listen(PORT, () => {
    console.log(colors.yellow.bold(`Tma service running in ${process.env.NODE_ENV} mode on port ${PORT}`))
})

// catch unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
    console.log(colors.red.bold(`err: ${err.message}`));
    server.close(() => process.exit(1));
}) 

