// pages/api/giveSomeName.js
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";
import cheerio from "cheerio"; // Import cheerio
import axios from "axios"; // Import axios for making HTTP requests

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();
  const src = req.query.src;

  try {
    // Fetch HTML content from the provided URL
    const response = await axios.get(`https://www.hindifiles.com${src}`);
    const html = response.data;

    // Load HTML content into cheerio
    const $ = cheerio.load(html);

    // Scrape required data
    const title = $("header.entry-header h1.entry-title").text().trim();
    const content = $("div[dir='ltr']").text().trim();

    // Send scraped data as JSON response
    res.status(200).json({ title, content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
