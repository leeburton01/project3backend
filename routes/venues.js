// backend/routes/venues.js

const express = require("express");
const router = express.Router();
const Venue = require("../models/Venues.model");
const verifyToken = require("../middlewares/authMiddleware"); // Import the verifyToken middleware

// Create a new venue - Protected route
router.post("/", verifyToken, async (req, res) => {
  try {
    const newVenue = new Venue(req.body);
    const savedVenue = await newVenue.save();
    res.status(201).json(savedVenue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all venues - Public route
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get venue suggestions based on search query
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Received query:", query); // Log the query to check
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Perform a case-insensitive search using regex on the `displayName` field
    const venues = await Venue.find({
      displayName: { $regex: query, $options: "i" }, // Case-insensitive partial match
    }).limit(10); // Limit the results for performance

    console.log("Fetched venues:", venues);
    res.json(venues);
  } catch (err) {
    console.error(`Error fetching venues for query "${query}":`, err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a venue by ID - Public route
router.get("/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a venue by ID - Protected route
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVenue)
      return res.status(404).json({ message: "Venue not found" });
    res.json(updatedVenue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a venue by ID - Protected route
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
    if (!deletedVenue)
      return res.status(404).json({ message: "Venue not found" });
    res.json({ message: "Venue deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
