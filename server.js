const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes //
const venueRoutes = require("./routes/venues");
const worksRoutes = require("./routes/works");
const authRoutes = require("./routes/auth");

const app = express();

// Enhanced Logging Middleware //
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

// Middleware //
app.use(express.json({ limit: "150mb" })); // Set JSON limit to 150MB
app.use(express.urlencoded({ limit: "150mb", extended: true })); // Set URL-encoded limit to 150MB
app.use(cors());

// MongoDB //
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Routes //
app.use("/venues", venueRoutes);
app.use("/works", worksRoutes);
app.use("/auth", authRoutes);

// Basic route //
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Start Server //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
