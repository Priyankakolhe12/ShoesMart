const config = require("../config/config");
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(config.MongoDBURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
