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
    const url = 'https://vegetablemarketprice.com/market/gujarat/today';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const detailsList = [];

    // Scraping the details from the HTML
    $('tr.todayVegetableTableRows').each((index, element) => {
      const vegetable = $(element).find('td:nth-child(2)').text().trim();
      const minPrice = $(element).find('td:nth-child(3)').text().trim();
      const maxPrice = $(element).find('td:nth-child(4)').text().trim();
      const averagePrice = $(element).find('td:nth-child(5)').text().trim();
      const unit = $(element).find('td:nth-child(6)').text().trim();
      const imageSrc = $(element).find('.vegetableImageDiv').attr('image-src-file'); // Extract image source

      detailsList.push({ vegetable, minPrice, maxPrice, averagePrice, unit, imageSrc:`https://vegetablemarketprice.com${imageSrc}` });
    });

    // Sending JSON response
    res.status(200).json(detailsList);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}
