// pages/api/scrapeStateBoards.js
import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  try {
    const response = await axios.get('https://www.studiestoday.com/');
    const html = response.data;
    const $ = cheerio.load(html);

    const stateBoards = [];

    // Select the container that holds the state boards information
    const stateContainer = $('.state-container .home-states');

    stateContainer.each((index, element) => {
      const link = $(element).find('a').attr('href'); // Extract the link
      const imageSrc = $(element).find('img').attr('src'); // Extract the image source
      const name = $(element).find('.statename h4').text().trim(); // Extract the name

      // Push the extracted data to the stateBoards array
      stateBoards.push({ name, link, imageSrc });
    });

    res.status(200).json(stateBoards);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
