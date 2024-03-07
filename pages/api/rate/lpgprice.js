// pages/api/giveSomeName.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from '@/utils/dbConnect';
import cors from 'micro-cors';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  try {
    const url = 'https://dailyfuelprice.com/india/gujarat/surat/lpg';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extracting updated date
    const updatedDate = $('div.card-header.row div.col-auto.text-start').text().trim();

    const detailsList = [];

    // Scraping the details from the HTML
    $('p.card-text.display-4').each((index, element) => {
      const priceText = $(element).text().trim();
      const priceArr = priceText.split('/'); // Split price and quantity
      const price = priceArr[0].trim();
      const quantity = priceArr[1].trim();

      detailsList.push({ price, quantity });
    });

    // Sending JSON response with both price, quantity, and updated date
    res.status(200).json({ updatedDate, detailsList });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}
