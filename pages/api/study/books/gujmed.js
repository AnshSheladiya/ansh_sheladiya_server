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
    const response = await axios.get('https://www.studiestoday.com/basic-page-gujarat-board-books-297830.html#class1');
    const html = response.data;
    const $ = cheerio.load(html);

    const data = [];

    $('h3').each((index, element) => {
      const headingText = $(element).text().trim(); // Get the text of the heading
      const stdMatch = headingText.match(/Class (\d+)/); // Match for "Class" followed by a number
      const std = stdMatch ? stdMatch[1] : null; // Extract the class number
      const books = [];

      // Extract book details for each standard
      $(element).nextUntil('h3', 'p').each((i, bookElement) => {
        const title = $(bookElement).text().trim();
        const link = $(bookElement).find('a').attr('href');
        if (title && link) {
          books.push({ title, link });
        }
      });

      data.push({ std, books });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
