const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const venueRoutes = require("./routes/venues");
const worksRoutes = require("./routes/works");
const authRoutes = require("./routes/auth");

const app = express();

// Enhanced Logging Middleware
app.use((req, res, next) => {
  console.log(
    `Incoming request: ${req.method} ${req.url} - Headers:`,
    req.headers,
    "- Body:",
    req.body
  );
  next();
});

// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));

// CORS Configuration
const corsOptions = {
  origin: [
    "https://project303.netlify.app", // Deployed frontend URL
    "http://localhost:5173", // Local development URL
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials (e.g., cookies, tokens)
};
app.use(cors(corsOptions));

// Handle CORS Preflight Requests
app.options("*", cors(corsOptions));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Routes
app.use("/venues", venueRoutes);
app.use("/works", worksRoutes);
app.use("/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
