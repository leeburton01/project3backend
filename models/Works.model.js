const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the status history log
const statusHistorySchema = new Schema({
  oldStatus: { type: String, required: true }, // Previous status
  newStatus: { type: String, required: true }, // Updated status
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who made the change
  timestamp: { type: Date, default: Date.now }, // When the change was made
});

// Define the updated schema for the Works (Cases) model
const worksSchema = new Schema({
  caseId: { type: String, required: true, unique: true }, // Unique Case ID
  title: { type: String, required: true },
  workNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Pending", "In Review", "Approved", "Rejected", "Closed"],
    default: "Pending",
  },
  progress: { type: Number, default: 0 },
  iswc: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  audioFile: { type: String },
  instagramEmbedCode: { type: String },
  artistName: { type: String, required: true },
  venue: { type: String },
  videoDate: { type: Date }, // Ensure this field is defined here
  djName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  statusHistory: [statusHistorySchema],
});
// Pre-save middleware to automatically update the `updatedAt` field before saving
worksSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the "Works" model
const Works = mongoose.model("Works", worksSchema);

module.exports = Works;
