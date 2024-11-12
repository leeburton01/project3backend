const mongoose = require("mongoose");
const Works = require("../models/Works.model");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Seed data (only new tracks)
    const works = [
      {
        title: "SINEWAVES",
        workNumber: "34545400-001",
        iswc: "T3210352044",
        isrc: "",
        publisherWorkCodes: [],
        firstLoad: "2023-09-01",
        lastUpdate: "2024-04-05",
        language: "",
        genre: "ELEKTRONISCHE MUSIK",
        duration: null,
        additionalTitles: [],
        instrumentation: "",
        performers: [
          {
            name: "LEE BURTON",
          },
        ],
        contributors: [
          {
            name: "LEE BURTON",
            ipiNameNumber: "630984436",
            role: "Composer",
            arShare: 100,
            vrShare: 100,
            arAccumulated: 100,
            vrAccumulated: 100,
            arSociety: "GEMA",
            vrSociety: "GEMA",
          },
        ],
        agreements: [],
      },

      {
        title: "TIAI",
        workNumber: "33948455-001",
        iswc: "T3189381151",
        isrc: "",
        publisherWorkCodes: [],
        firstLoad: "2023-07-10",
        lastUpdate: "2024-04-05",
        language: "",
        genre: "ELEKTRONISCHE MUSIK",
        duration: 376,
        additionalTitles: [],
        instrumentation: "",
        performers: [
          {
            name: "LEE BURTON",
          },
        ],
        contributors: [
          {
            name: "KALAMPAKAS, ELEFTHERIOS",
            ipiNameNumber: "1150192002",
            role: "Komponist/-in",
            arShare: 100,
            vrShare: 100,
            arAccumulated: 100,
            vrAccumulated: 100,
            arSociety: "GEMA",
            vrSociety: "GEMA",
          },
        ],
        agreements: [],
      },
      {
        title: "Oxytocin Overdose",
        workNumber: "34545409-001",
        iswc: "T3210352077",
        isrc: "",
        publisherWorkCodes: [],
        firstLoad: "2023-09-01",
        lastUpdate: "2024-04-05",
        language: "",
        genre: "ELEKTRONISCHE MUSIK",
        duration: 0, // Add actual duration if known
        additionalTitles: [],
        instrumentation: "",
        performers: [
          {
            name: "LEE BURTON",
          },
        ],
        contributors: [
          {
            name: "LEE BURTON",
            ipiNameNumber: "630984436",
            role: "Composer",
            arShare: 100,
            vrShare: 100,
            arAccumulated: 100,
            vrAccumulated: 100,
            arSociety: "GEMA",
            vrSociety: "GEMA",
          },
        ],
        agreements: [],
      },

      {
        title: "ITICF",
        workNumber: "34545429-001",
        iswc: "T3210352157",
        isrc: "",
        publisherWorkCodes: [],
        firstLoad: "2023-09-01",
        lastUpdate: "2024-04-05",
        language: "",
        genre: "ELEKTRONISCHE MUSIK",
        duration: 309,
        additionalTitles: [],
        instrumentation: "",
        performers: [
          {
            name: "LEE BURTON",
          },
        ],
        contributors: [
          {
            name: "LEE BURTON",
            ipiNameNumber: "630984436",
            role: "Komponist",
            arShare: 100,
            vrShare: 100,
            arAccumulated: 100,
            vrAccumulated: 100,
            arSociety: "GEMA",
            vrSociety: "GEMA",
          },
        ],
        agreements: [],
      },

      {
        title: "Burning",
        workNumber: "34545439-001",
        iswc: "T3210352180",
        isrc: "",
        publisherWorkCodes: [],
        firstLoad: "2023-09-01",
        lastUpdate: "2024-04-05",
        language: "",
        genre: "ELEKTRONISCHE MUSIK",
        duration: 362,
        additionalTitles: [],
        instrumentation: "",
        performers: [
          {
            name: "LEE BURTON",
          },
        ],
        contributors: [
          {
            name: "KALAMPAKAS, ELEFTHERIOS",
            ipiNameNumber: "1150192002",
            role: "Composer",
            arShare: 100,
            vrShare: 100,
            arAccumulated: 100,
            vrAccumulated: 100,
            arSociety: "GEMA",
            vrSociety: "GEMA",
          },
        ],
        agreements: [],
      },
    ];

    const promises = works.map(async (work) => {
      try {
        await Works.updateOne(
          { workNumber: work.workNumber }, // Check for existing work by workNumber
          { $setOnInsert: work }, // Only insert if it doesn't already exist
          { upsert: true } // Insert if not found
        );
      } catch (error) {
        console.error(`Error inserting workNumber ${work.workNumber}:`, error);
      }
    });

    return Promise.all(promises);
  })
  .then(() => {
    console.log("Seed data inserted successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error inserting seed data:", error);
    mongoose.connection.close();
  });
