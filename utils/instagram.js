// backend/utils/instagram.js

const axios = require("axios");

async function getInstagramEmbed(instagramUrl) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN; // Ensure this token is available in your environment variables
    const apiUrl = `https://graph.instagram.com/oembed?url=${instagramUrl}&access_token=${accessToken}`;

    // Make the request to the Instagram API to get embed details
    const response = await axios.get(apiUrl);

    // Return the embed code from the response
    return response.data.html;
  } catch (err) {
    console.error("Error fetching Instagram embed:", err);
    throw new Error("Failed to retrieve Instagram media details");
  }
}

module.exports = { getInstagramEmbed };
