import mongoose from 'mongoose';
import config from '../config/config.js';

export default async () => {
    
    mongoose.set("useNewUrlParser", true)
    mongoose.set("useCreateIndex", true)
    mongoose.set("useUnifiedTopology", true)
    
    const connection = await mongoose.connect(config.databaseURL)
        .catch((err) => { console.log(err) });

    return connection.connection.db;
};