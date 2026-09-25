// Load the values from the .env file (this must be the FIRST line)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes"); // NEW

// Connect to MongoDB Atlas
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes); // NEW

// Home route
app.get("/", (req, res) => {
    res.send("E-Learning API is running successfully");
});

// Test route: proves the server AND the database are working
app.get("/api/test", (req, res) => {
    res.json({
        message: "API test successful",
        database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    });
});

// Error handling (these must come AFTER all routes)
app.use(notFound);
app.use(errorHandler);

// Use the PORT from .env. If it is missing, use 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});