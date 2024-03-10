// pages/api/scrapeVideoEditorDetails.js

import cheerio from 'cheerio';
import axios from 'axios';
import { dbConnect } from '@/utils/dbConnect';
import cors from 'micro-cors';

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  try {
    const searchQuery = req.query.searchQuery;

    if (!searchQuery) {
      return res.status(400).json({ error: true, message: 'Missing query parameter' });
    }

    // Encode the search query and replace spaces with plus signs
    const encodedQuery = encodeURIComponent(searchQuery.replace(/\s/g, '+'));
    const url = `https://play.google.com/store/search?q=${encodedQuery}&c=apps&hl=en_IN&gl=US`;

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const detailsList = [];

    // Extract details from the HTML
    $('span.DdYX5').each((index, element) => {
      const detail = $(element).text();
      detailsList.push(detail);
    });

    res.status(200).json(detailsList);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: error.message });
  }
}
