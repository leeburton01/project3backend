// backend/models/Venues.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the Venue model
const venueSchema = new Schema({
  displayName: { type: String, required: true }, // Venue or festival name
  city: {
    id: { type: Number, required: true },
    uri: { type: String },
    displayName: { type: String, required: true },
    country: {
      displayName: { type: String, required: true },
    },
  },
  metroArea: {
    id: { type: Number },
    uri: { type: String },
    displayName: { type: String },
    country: {
      displayName: { type: String },
    },
  },
  uri: { type: String }, // Venue or festival URL
  street: { type: String },
  zip: { type: String },
  lat: { type: Number }, // Latitude
  lng: { type: Number }, // Longitude
  phone: { type: String },
  website: { type: String },
  capacity: { type: Number },
  description: { type: String },
});

// Add an index to the "displayName" field for faster search performance
venueSchema.index({ displayName: 1 });

// Create the "Venue" model
const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
