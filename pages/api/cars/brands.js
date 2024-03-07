// pages/api/scrapeCars.js

import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  try {
    const url = 'https://www.carwale.com/new-cars/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const carsList = [];

    // Selecting the elements of interest
    $('.o-fznJzu').each((index, element) => {
      const logoSrc = $(element).find('.o-bfyaNx img').attr('src');
      const pageLink = $(element).find('.o-cKuOoN').attr('href');
      const name = $(element).find('.o-cpNAVm').text();

      if (logoSrc && pageLink && name) { // Check if all required data exists
        carsList.push({
          logoSrc: logoSrc,
          pageLink: `https://www.carwale.com${pageLink}`, // Full page link
          name: name
        });
      }
    });

    res.status(200).json(carsList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
