const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Get the MongoDB URI from the .env file
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/musictracks";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
