// pages/api/scrapeData.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  try {
    const response = await axios.get('http://gujaratboard.in/TextBooks');
    const html = response.data;
    const $ = cheerio.load(html);

    const links = [];

    $('.shop-title').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const href = $(element).find('a').attr('href').replace('/TextBooks/', '');
      const topic = $(element).find('small').text().replace(/Download/g, '').trim();

      links.push({ title, href, topic });
    });

    res.status(200).json(links);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
