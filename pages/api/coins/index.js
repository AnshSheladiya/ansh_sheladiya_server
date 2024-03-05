// pages/api/coins.js

import axios from 'axios';
import cheerio from 'cheerio';


export default async function handler(req, res) {
  try {
    // Extract the country name from the query parameter
    const { country } = req.query;

    // Fetch HTML content from the website
    const response = await axios.get(`https://www.worldcoinscatalog.com/${country}`);
    const html = response.data;

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract coin details from the HTML
    const coins = [];
    $('.card.mb-4').each(async (index, element) => {
      const nameElement = $(element).find('.card-header h2[atrr="coin-dir"]'); // Corrected attribute name
      const name = nameElement.length > 0 ? nameElement.text().trim() : "Unknown"; // Default to "Unknown" if name is not found
      const imageSrc = $(element).find('.imgcoin').attr('src');
      const image = `https://www.worldcoinscatalog.com/${imageSrc}`;

      // Extract anchor link
      const anchorLinkSrc = $(element).find('.card-footer a').attr('href');
      coins.push({ name, image, anchorLinkSrc });
      // Send response when all coins are processed
      if (index === $('.card.mb-4').length - 1) {
        res.status(200).json([...coins ]);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
