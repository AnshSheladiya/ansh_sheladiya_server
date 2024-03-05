// pages/api/countries.js

import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    // Fetch HTML content from the website
    const response = await axios.get('https://www.worldcoinscatalog.com/');
    const html = response.data;

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract country details from the HTML
    const countries = [];
    $('li.list-group-item').each((index, element) => {
      const countryAnchor = $(element).find('a');
      const countryName = countryAnchor.text().trim();
      const countryUrl = countryAnchor.attr('href').trim(); // Extract URL
      const coinCount = parseInt($(element).find('span.badge').text().trim());
      countries.push({ name: countryName, url: countryUrl, coinCount }); // Include URL in the object
    });

    // Respond with the extracted country details
    res.status(200).json([ ...countries ]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
