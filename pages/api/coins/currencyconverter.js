// pages/api/currencyconverter.js

import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { Amount, From, To } = req.query;
    const url = `https://www.xe.com/currencyconverter/convert/?Amount=${Amount}&From=${From}&To=${To}`;

    // Fetch HTML content from the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract current price from the parsed HTML
    const priceText = $('.result__BigRate-sc-1bsijpp-1').text();
    const price = priceText.trim();

    // Return the extracted data in JSON format
    res.status(200).json({ price });
  } catch (error) {
    console.error('Error fetching currency data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
