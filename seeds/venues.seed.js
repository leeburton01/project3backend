const mongoose = require("mongoose");
const Venue = require("../models/Venues.model");
require("dotenv").config();

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Seed data for Coachella and Movement Festival
    const venues = [
      {
        displayName: "Coachella Valley Music and Arts Festival",
        city: {
          id: 2175,
          uri: "https://www.songkick.com/metro-areas/2175-us-indio",
          displayName: "Indio",
          country: {
            displayName: "USA",
          },
        },
        metroArea: {
          id: 2175,
          uri: "https://www.songkick.com/metro-areas/2175-us-indio",
          displayName: "Indio",
          country: {
            displayName: "USA",
          },
        },
        uri: "https://www.coachella.com/",
        street: "Empire Polo Club, 81800 51st Ave",
        zip: "92201",
        lat: 33.678176,
        lng: -116.237198,
        phone: "760-342-2762",
        website: "https://www.coachella.com/",
        capacity: 125000,
        description:
          "Coachella is one of the largest and most famous music festivals in the world.",
      },
      {
        displayName: "Movement Electronic Music Festival",
        city: {
          id: 2021,
          uri: "https://www.songkick.com/metro-areas/2021-us-detroit",
          displayName: "Detroit",
          country: {
            displayName: "USA",
          },
        },
        metroArea: {
          id: 2021,
          uri: "https://www.songkick.com/metro-areas/2021-us-detroit",
          displayName: "Detroit",
          country: {
            displayName: "USA",
          },
        },
        uri: "https://www.movement.us/",
        street: "Hart Plaza, 1 W Jefferson Ave",
        zip: "48226",
        lat: 42.327389,
        lng: -83.045556,
        phone: "313-965-9800",
        website: "https://www.movement.us/",
        capacity: 35000,
        description:
          "Movement is a world-renowned electronic music festival held annually in Detroit, the birthplace of techno.",
      },

      {
        displayName: "Timewarp NY",
        city: {
          id: 3160,
          uri: "https://www.songkick.com/metro-areas/3160-us-new-york",
          displayName: "New York",
          country: { displayName: "USA" },
        },
        metroArea: {
          id: 3160,
          uri: "https://www.songkick.com/metro-areas/3160-us-new-york",
          displayName: "New York",
          country: { displayName: "USA" },
        },
        uri: "https://www.time-warp.de/us/",
        street: "Brooklyn Navy Yard",
        zip: "11205",
        lat: 40.703277,
        lng: -73.971829,
        phone: "N/A",
        website: "https://www.time-warp.de/us/",
        capacity: 7000,
        description:
          "Timewarp is one of the most iconic electronic music festivals, originally from Mannheim, Germany. Timewarp NY is its American edition.",
      },

      {
        displayName: "Creamfields",
        city: {
          id: 24537,
          uri: "https://www.songkick.com/metro-areas/24537-uk-warrington",
          displayName: "Warrington",
          country: { displayName: "UK" },
        },
        metroArea: {
          id: 24537,
          uri: "https://www.songkick.com/metro-areas/24537-uk-warrington",
          displayName: "Warrington",
          country: { displayName: "UK" },
        },
        uri: "https://www.creamfields.com/",
        street: "Daresbury Estate",
        zip: "WA4 4AG",
        lat: 53.33769,
        lng: -2.63106,
        phone: "N/A",
        website: "https://www.creamfields.com/",
        capacity: 70000,
        description:
          "Creamfields is the UK's biggest dance festival, featuring top electronic artists and DJs from around the world. It's held annually in Daresbury, Cheshire.",
      },

      {
        displayName: "Caprices Festival",
        city: {
          id: 24567,
          uri: "https://www.songkick.com/metro-areas/24567-switzerland-cransmontana",
          displayName: "Crans-Montana",
          country: { displayName: "Switzerland" },
        },
        metroArea: {
          id: 24567,
          uri: "https://www.songkick.com/metro-areas/24567-switzerland-cransmontana",
          displayName: "Crans-Montana",
          country: { displayName: "Switzerland" },
        },
        uri: "https://www.caprices.ch/",
        street: "Rue du Prado 20",
        zip: "3963",
        lat: 46.31189,
        lng: 7.48032,
        phone: "+41 27 480 36 26",
        website: "https://www.caprices.ch/",
        capacity: 15000,
        description:
          "Caprices Festival is an annual electronic music festival set in the Swiss Alps, offering a unique mountain experience with breathtaking views and world-class DJs.",
      },

      {
        displayName: "OFF Week BCN",
        city: {
          id: 15050,
          uri: "https://www.songkick.com/metro-areas/15050-spain-barcelona",
          displayName: "Barcelona",
          country: { displayName: "Spain" },
        },
        metroArea: {
          id: 15050,
          uri: "https://www.songkick.com/metro-areas/15050-spain-barcelona",
          displayName: "Barcelona",
          country: { displayName: "Spain" },
        },
        uri: "https://www.offweekfestival.com/",
        street: "Carrer de la Marina 19-21",
        zip: "08005",
        lat: 41.3874,
        lng: 2.1883,
        phone: "+34 932 210 010",
        website: "https://www.offweekfestival.com/",
        capacity: 5000,
        description:
          "OFF Week BCN is an electronic music festival held in Barcelona, offering an intimate yet high-energy experience with top DJs during the city's vibrant summer.",
      },

      {
        displayName: "Amsterdam Open Air",
        city: {
          id: 8474,
          uri: "https://www.songkick.com/metro-areas/8474-netherlands-amsterdam",
          displayName: "Amsterdam",
          country: { displayName: "Netherlands" },
        },
        metroArea: {
          id: 8474,
          uri: "https://www.songkick.com/metro-areas/8474-netherlands-amsterdam",
          displayName: "Amsterdam",
          country: { displayName: "Netherlands" },
        },
        uri: "https://www.amsterdamopenair.nl/",
        street: "Gaasperpark, Amsterdam-Zuidoost",
        zip: "1108",
        lat: 52.2921,
        lng: 4.9965,
        phone: "+31 20 555 0655",
        website: "https://www.amsterdamopenair.nl/",
        capacity: 15000,
        description:
          "Amsterdam Open Air is a multi-genre music festival held in Gaasperpark, Amsterdam, celebrating electronic music and artistic expression in a vibrant open-air setting.",
      },

      {
        displayName: "Il Muretto",
        city: {
          id: 3172,
          uri: "https://www.songkick.com/metro-areas/3172-italy-venice",
          displayName: "Venice",
          country: { displayName: "Italy" },
        },
        metroArea: {
          id: 3172,
          uri: "https://www.songkick.com/metro-areas/3172-italy-venice",
          displayName: "Venice",
          country: { displayName: "Italy" },
        },
        uri: "https://www.ilmuretto.net/",
        street: "Via Roma Destra, 120, Lido di Jesolo",
        zip: "30016",
        lat: 45.5019,
        lng: 12.6254,
        phone: "+39 0421 370850",
        website: "https://www.ilmuretto.net/",
        capacity: 3000,
        description:
          "Il Muretto is one of the most iconic nightclubs in Italy, located near Venice, known for hosting some of the best electronic music events in the country.",
      },

      {
        displayName: "Thuishaven",
        city: {
          id: 31409,
          uri: "https://www.songkick.com/metro-areas/31409-netherlands-amsterdam",
          displayName: "Amsterdam",
          country: { displayName: "Netherlands" },
        },
        metroArea: {
          id: 31409,
          uri: "https://www.songkick.com/metro-areas/31409-netherlands-amsterdam",
          displayName: "Amsterdam",
          country: { displayName: "Netherlands" },
        },
        uri: "https://www.thuishaven.nl/",
        street: "Contactweg 68",
        zip: "1014 BW",
        lat: 52.384,
        lng: 4.836,
        phone: "+31 20 308 0796",
        website: "https://www.thuishaven.nl/",
        capacity: 5000,
        description:
          "Thuishaven is an open-air festival venue and cultural hub in Amsterdam, known for its year-round electronic music events.",
      },
    ];

    // Insert seed data into the "venues" collection
    return Venue.insertMany(venues);
  })
  .then(() => {
    console.log("Seed data inserted successfully");
    mongoose.connection.close(); // Close the connection after seeding
  })
  .catch((error) => {
    console.error("Error inserting seed data:", error);
    mongoose.connection.close();
  });
