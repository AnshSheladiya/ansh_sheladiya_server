// pages/api/scrapeWeather.js

import axios from 'axios';
import cheerio from 'cheerio';
import { dbConnect } from "@/utils/dbConnect";
import cors from "micro-cors";

const corsMiddleware = cors();

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  dbConnect();

  try {
    const url = 'https://www.meteoprog.com/weather/Gujarat-gujarat%20/month/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Selecting the elements of interest
    const detailsList = [];

    $('.city-month__days .city-month__day').each((index, element) => {
      const date = $(element).find('.city-month__day-date').text().trim();
      const temperature = $(element).find('.city-month__day-temperature b:first-child').text().trim();
      const temperatureRange = $(element).find('.city-month__day-temperature').text().trim().replace(temperature, '');
      const weatherIcon = $(element).find('.city-month__day-icon').attr('title');

      const details = {
        date: date,
        temperature: temperature,
        temperatureRange: temperatureRange,
        weatherIcon: weatherIcon
      };

      detailsList.push(details);
    });

    res.status(200).json(detailsList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
