// backend/models/User.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: { type: String, unique: true, sparse: true }, // Remove required: true
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // This will be hashed
    isAdmin: { type: Boolean, default: false },
    realName: { type: String }, // Remove required: true
    artistName: { type: String }, // Remove required: true
    profilePicture: { type: String }, // Optional
    collectingSociety: { type: String }, // Optional
    memberID: { type: String }, // Optional
    socialMediaLinks: { type: [String] }, // Optional
    genres: { type: [String] }, // Optional
    bookingInfo: {
      email: { type: String }, // Optional
      phone: { type: String }, // Optional
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
