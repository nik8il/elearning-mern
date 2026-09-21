// Use Google DNS to find the Atlas cluster (fixes querySrv ECONNREFUSED)
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// Import mongoose (the tool that talks to MongoDB)
const mongoose = require("mongoose");

// This function connects our backend to MongoDB Atlas
const connectDB = async () => {
  try {
    // process.env.MONGO_URI reads the MONGO_URI value from our .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    // If the connection fails, show the reason and stop the server
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Export the function so server.js can use it
module.exports = connectDB;