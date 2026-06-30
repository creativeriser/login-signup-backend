const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This connects to the MONGO_URI in your .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Database Connected Successfully! 🎉");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
