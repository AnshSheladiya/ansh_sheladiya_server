// pages/api/coinDetails.js

import axios from 'axios';
import cheerio from 'cheerio';
async function getCoinDetails(link) {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);

    const details = {};

    // Extract title name of the coin
    const title = $('h1').text().trim();
    details['title'] = title;

    // Extract details from the table
    $('table.table.table-sm.table-bordered tbody tr').each((index, element) => {
      const key = $(element).find('th').text().trim();
      const value = $(element).find('td').text().trim();
      details[key] = value;
    });

    // Extract relative image source path
    const relativeImagePath = $('img.figure-img.img-fluid.rounded').attr('src');

    // Fix the image path
    let absoluteImagePath = relativeImagePath.startsWith('../') ? relativeImagePath.slice(3) : relativeImagePath;

    // Assuming the base URL is known
    const baseURL = 'https://www.worldcoinscatalog.com/';
    absoluteImagePath = new URL(absoluteImagePath, baseURL).href;

    return { ...details, image: absoluteImagePath };
  }

export default async function handler(req, res) {
  try {
    const { linkSrc } = req.query; // Assuming the coinId is provided as a query parameter

    // Get coin details from the page
    const details = await getCoinDetails(`https://www.worldcoinscatalog.com/${linkSrc}`);

    res.status(200).json(details);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
