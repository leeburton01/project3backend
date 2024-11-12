const express = require("express");
const router = express.Router();
const Works = require("../models/Works.model");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const verifyToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { getInstagramEmbed } = require("../utils/instagram");
const { sendMail } = require("../utils/mailer");
const axios = require("axios");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route - new case
router.post(
  "/create-case",
  verifyToken,
  upload.single("audioFile"),
  async (req, res) => {
    try {
      console.log("Received POST /create-case request");
      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);

      const {
        title,
        workNumber,
        iswc,
        instagramEmbedCode,
        artistName,
        venue,
        videoDate,
        djName,
      } = req.body;

      // Log each value separately for deeper inspection
      console.log("title:", title);
      console.log("workNumber:", workNumber);
      console.log("iswc:", iswc);
      console.log("instagramEmbedCode:", instagramEmbedCode);
      console.log("artistName:", artistName);
      console.log("venue:", venue);
      console.log("videoDate:", videoDate);
      console.log("djName:", djName);

      let audioFilePath = req.file ? req.file.path : null; // Get audio file path if provided

      // If an existing track is selected and no new audio file is provided, retrieve the existing audio file path
      if (workNumber && !audioFilePath) {
        const existingTrack = await Works.findOne({ _id: workNumber });

        if (existingTrack) {
          audioFilePath = existingTrack.audioFile; // Use the existing audio file path
          console.log("Using existing audio file path:", audioFilePath);
        }
      }

      // Check for required fields
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!workNumber) missingFields.push("workNumber");
      if (!artistName) missingFields.push("artistName");
      if (!videoDate) missingFields.push("videoDate");
      if (!audioFilePath) missingFields.push("audioFile");

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const caseId = `CASE-${Date.now()}`; // Generate a unique Case ID

      // Create a new work (case) entry in the database
      const newWork = new Works({
        caseId,
        title,
        workNumber,
        iswc,
        audioFile: audioFilePath,
        instagramEmbedCode,
        artistName,
        venue,
        videoDate,
        djName,
        owner: req.user.userId,
        status: "Pending",
      });

      console.log("Saving new work to database:", newWork);

      // Save the new case entry to the database
      await newWork.save();

      res
        .status(201)
        .json({ message: "Case created successfully", work: newWork });
    } catch (err) {
      // Log error details
      console.error("Error creating case:", err);
      res
        .status(500)
        .json({ message: "Failed to create case", error: err.message });
    }
  }
);

// update case status (Admin only)
router.put(
  "/:id/update-status",
  verifyToken,
  adminMiddleware,
  async (req, res) => {
    try {
      console.log("Admin updating status for work ID:", req.params.id);
      const { status, collectingSociety } = req.body;

      const track = await Works.findById(req.params.id).populate(
        "owner",
        "email"
      );
      if (!track) {
        console.log("Track not found");
        return res.status(404).json({ message: "Case not found" });
      }

      // Log the previous status before updating
      const oldStatus = track.status;

      // Update status and progress
      track.status = status;
      if (status === "Approved") {
        track.statusMessage = `Approved! The data has been sent to ${collectingSociety}`;
        track.progress = 100;
      } else if (status === "Rejected") {
        track.statusMessage = "Case has been rejected.";
        track.progress = 100;
      } else if (status === "In Review") {
        track.statusMessage = "Your case is currently under review.";
        track.progress = 50;
      } else {
        track.statusMessage = "Pending review.";
        track.progress = 0;
      }

      // Log the status change in statusHistory
      track.statusHistory.push({
        oldStatus: oldStatus,
        newStatus: status,
        changedBy: req.user.userId,
        timestamp: Date.now(),
      });

      await track.save();
      console.log("Status updated successfully:", track);

      // Send email notification
      const subject = `Status Update: Your work "${track.title}" is now ${status}`;
      const text = `Hello, your work titled "${track.title}" has been updated to the status: ${status}.`;

      await sendMail({
        to: track.owner.email,
        subject: subject,
        text: text,
      });

      res.json({
        message: "Status updated and email notification sent",
        track,
      });
    } catch (err) {
      console.error("Error updating status:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// Instagram video embed link - Protected
router.put("/:id/embed-instagram", verifyToken, async (req, res) => {
  try {
    const { instagramUrl } = req.body;
    const track = await Works.findById(req.params.id);

    if (!track) return res.status(404).json({ message: "Track not found" });

    if (track.owner.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this track" });
    }

    const embedCode = await getInstagramEmbed(instagramUrl);
    track.instagramEmbedCode = embedCode;
    await track.save();

    res.json({ message: "Instagram media embedded successfully", track });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  status and progress of a work by ID - Protected
router.get("/:id/status", verifyToken, async (req, res) => {
  try {
    console.log("Fetching status for work ID:", req.params.id);
    const track = await Works.findById(
      req.params.id,
      "status progress statusMessage statusHistory"
    );
    if (!track) return res.status(404).json({ message: "Work not found" });

    res.json({
      status: track.status,
      progress: track.progress,
      statusMessage: track.statusMessage,
      statusHistory: track.statusHistory,
    });
  } catch (err) {
    console.error("Error fetching status:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// all works for admin - Protected
router.get("/admin", verifyToken, adminMiddleware, async (req, res) => {
  try {
    console.log("Admin fetching all works");
    const works = await Works.find();
    res.json(works);
  } catch (err) {
    console.error("Error fetching all works for admin:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// delete audio file
router.delete("/:id/delete-audio", verifyToken, async (req, res) => {
  try {
    console.log("Request to delete audio file for work:", req.params.id);

    const track = await Works.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: "Work not found" });
    }

    if (track.owner.toString() !== req.user.userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this file" });
    }

    if (!track.audioFile) {
      return res.status(400).json({ message: "No audio file to delete" });
    }

    const filePath = path.join(__dirname, "..", track.audioFile);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting audio file:", err.message);
        return res
          .status(500)
          .json({ message: "Failed to delete audio file", error: err.message });
      }

      track.audioFile = undefined;
      await track.save();

      console.log("Audio file deleted successfully");
      res.json({ message: "Audio file deleted successfully" });
    });
  } catch (err) {
    console.error("Error deleting audio file:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// delete a work by ID - Protected
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    console.log("Request to delete work with ID:", req.params.id);

    const work = await Works.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    if (work.owner.toString() !== req.user.userId && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this work" });
    }

    if (work.audioFile) {
      const filePath = path.join(__dirname, "..", work.audioFile);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting audio file:", err.message);
        } else {
          console.log("Audio file deleted successfully");
        }
      });
    }

    await work.deleteOne();

    res.json({ message: "Work deleted successfully" });
  } catch (err) {
    console.error("Error deleting work:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// status change history - Protected
router.get("/:id/status-history", verifyToken, async (req, res) => {
  try {
    console.log("Fetching status history for work ID:", req.params.id);
    const track = await Works.findById(req.params.id).select("statusHistory");

    if (!track) {
      return res.status(404).json({ message: "Work not found" });
    }

    res.json(track.statusHistory);
  } catch (err) {
    console.error("Error fetching status history:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", verifyToken, async (req, res) => {
  try {
    const {
      title,
      artistName,
      iswc,
      page = 1,
      limit = 10,
      order = "asc",
    } = req.query;

    // Initialize filter based on provided search fields
    const filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (artistName) filter.artistName = { $regex: artistName, $options: "i" };
    if (iswc) filter.iswc = { $regex: iswc, $options: "i" };

    // Determine sort order
    const sortOrder = order === "desc" ? -1 : 1;

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Execute search query with pagination and sorting
    const works = await Works.find(filter)
      .sort({ createdAt: sortOrder }) // Sorting by createdAt, adjust field if needed
      .skip(skip)
      .limit(Number(limit));

    // Transform data to only include relevant fields for the response
    const transformedWorks = works.map((work) => ({
      _id: work._id,
      title: work.title,
      iswc: work.iswc,
      artistName: work.artistName || "Unknown", // Directly use artistName from schema
    }));

    // Get total document count for pagination metadata
    const totalWorks = await Works.countDocuments(filter);

    // Send back paginated and filtered results
    res.json({
      works: transformedWorks,
      totalWorks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalWorks / limit),
    });
  } catch (err) {
    console.error("Error during search:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  console.log("API route hit");
  console.log("User info from token:", req.user);

  try {
    const {
      status,
      sortBy = "createdAt",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    // Admins can see all cases, regular users can only see their own cases
    if (req.user.isAdmin) {
      if (status) {
        filter.status = status;
      }
    } else {
      // Regular users should only see their own cases
      filter.owner = req.user.userId;
      if (status) {
        filter.status = status;
      }
    }

    console.log("Filter being applied:", filter);

    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;

    const works = await Works.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const totalWorks = await Works.countDocuments(filter);

    console.log("Works fetched:", works.length);

    res.json({
      works,
      totalWorks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalWorks / limit),
    });
  } catch (err) {
    console.error("Error fetching cases:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Case Details Route
router.get("/:id", verifyToken, async (req, res) => {
  console.log("Request received at /works route");
  console.log("GET /works route called");
  try {
    console.log("Fetching case details for ID:", req.params.id); // New log
    const work = await Works.findById(req.params.id);
    if (!work) {
      console.log("Case not found for ID:", req.params.id); // New log
      return res.status(404).json({ message: "Case not found" });
    }
    res.json(work);
  } catch (error) {
    console.error("Error fetching case details:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch case details", error: error.message });
  }
});

// Instagram Embed Route
router.post("/instagram-embed", async (req, res) => {
  const { instagramUrl } = req.body;

  if (!instagramUrl) {
    console.log("No Instagram URL provided"); // New log
    return res.status(400).json({ message: "Instagram URL is required" });
  }

  try {
    console.log("Fetching Instagram embed code for URL:", instagramUrl); // New log
    const response = await axios.get(
      "https://graph.facebook.com/v12.0/instagram_oembed",
      {
        params: {
          url: instagramUrl,
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      }
    );

    res.json({ embedHtml: response.data.html });
  } catch (error) {
    console.error("Error fetching Instagram embed code:", error.message);
    res.status(500).json({ message: "Failed to fetch Instagram embed code" });
  }
});

router.put("/:id/edit-case", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCase = await Works.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json({ message: "Case updated successfully", work: updatedCase });
  } catch (err) {
    console.error("Error updating case:", err.message);
    res
      .status(500)
      .json({ message: "Failed to update case", error: err.message });
  }
});

module.exports = router;
