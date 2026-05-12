const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  MongoDBURI:
    process.env.MongoDBURI || "mongodb://localhost:27017/your_db_name",
};

if (!process.env.JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not set. Using default secret. Please set JWT_SECRET in your environment variables for better security.",
  );
}

if (!process.env.MongoDBURI) {
  console.warn(
    "Warning: MongoDBURI is not set. Using default MongoDB URI. Please set MongoDBURI in your environment variables.",
  );
}

module.exports = config;
