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
    const url = 'https://www.meteoprog.com/weather/Gujarat-gujarat%20/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Selecting the elements of interest
    const temperature = $('.today-temperature span').text();
    const weatherIcon = $('.today-temperature .icons').attr('title');
    const feelsLike = $('.feels-like b').text();
    const feelsLikeDesc = $('.feels-like .hot').text();
    const precipitationChance = $('.today__atmosphere tbody tr:nth-child(1) td.atmosphere-spec b').text();
    const windSpeed = $('.today__atmosphere tbody tr:nth-child(2) td.atmosphere-spec b').text();
    const pressure = $('.today__atmosphere tbody tr:nth-child(3) td.atmosphere-spec b').text();
    const uvIndex = $('.today__atmosphere tbody tr:nth-child(4) td.atmosphere-spec b').text();
    const humidity = $('.today__atmosphere tbody tr:nth-child(5) td.atmosphere-spec b').text();
    const precipitation = $('.today__atmosphere tbody tr:nth-child(6) td.atmosphere-spec b').text();
    const lastUpdated = $('.today__info').text().trim();

    // Constructing JSON data
    const jsonData = {
      temperature: temperature,
      weatherIcon: weatherIcon,
      feelsLike: feelsLike,
      feelsLikeDesc: feelsLikeDesc,
      precipitationChance: precipitationChance,
      windSpeed: windSpeed,
      pressure: pressure,
      uvIndex: uvIndex,
      humidity: humidity,
      precipitation: precipitation,
      lastUpdated: lastUpdated
    };

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: error.message });
  }
}
