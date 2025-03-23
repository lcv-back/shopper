const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        .then(console.log("MongoDB connected succcessfully"));
    } catch (error) {
        console.log("Mongo connection error: ", error);
    }
}

module.exports =  connectDB;