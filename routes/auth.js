// backend/routes/auth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User.model");
const verifyToken = require("../middlewares/authMiddleware");

// Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Incoming signup request:", req.body); // Log the request body
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// current artist's profile - Protected
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const artist = await User.findById(req.user.userId).select("-password");
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update artist profile - Protected
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const {
      realName,
      artistName,
      collectingSociety,
      memberID,
      socialMediaLinks,
      genres,
    } = req.body;

    // Validate input fields (basic validation)
    if (!realName || !artistName) {
      return res
        .status(400)
        .json({ message: "Real name and artist name are required." });
    }

    // Prepare the fields to be updated
    const updatedFields = {
      realName,
      artistName,
      collectingSociety,
      memberID,
      socialMediaLinks,
      genres,
    };

    // Update the user profile
    const updatedArtist = await User.findByIdAndUpdate(
      req.user.userId,
      updatedFields,
      { new: true, select: "-password" } // Return updated document, exclude password
    );

    if (!updatedArtist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Send the updated profile back
    res.json({
      message: "Profile updated successfully",
      artist: updatedArtist,
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.email);

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid credentials"); //
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password matched");

    const profileComplete = user.realName && user.artistName ? true : false;

    const tokenOptions = {
      expiresIn: "4h",
    };

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "test_secret_key",
      tokenOptions
    );

    console.log("JWT token generated:", token);

    res.status(200).json({ token, profileComplete });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
