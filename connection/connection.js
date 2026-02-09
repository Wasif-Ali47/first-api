const mongoose = require("mongoose");

async function MongoDBConnect(url) {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports =  MongoDBConnect

